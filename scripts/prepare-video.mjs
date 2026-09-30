/**
 * Turns a raw Google Flow download into web-ready background footage and
 * registers it with the site, so the matching Scene starts playing it.
 *
 * Usage:
 *   npm run video -- <scene> <input> [--portrait] [--loop] [--fade=1]
 *
 *   scene        flow | process | discover | plan | build | run
 *   input        the downloaded clip (any size; it is scaled and cropped)
 *   --portrait   the input is the 9:16 phone cut; writes <scene>-portrait.*
 *                (register the landscape cut first)
 *   --loop       make a clip that doesn't loop on its own loop smoothly.
 *                Skip it for clips generated with the same first and last
 *                frame, which already loop.
 *   --fade=1     crossfade length in seconds when --loop is set
 *   --cut=4.2    where the loop restarts, in seconds (default: the calmest
 *                moment in the clip, found automatically)
 *   --darken=0.5 deepen shadows and midtones so a bright clip sits with the
 *                rest of the set (0 = off, 1 = strong). Highlights such as the
 *                red light stay bright; it's a gamma curve, not a dimmer.
 *
 * How --loop works: the clip is rotated so it starts and ends at the cut
 * point, where two neighbouring source frames meet, so the restart is just
 * an ordinary frame step. The original end-to-start jump moves into the
 * middle of the clip and is hidden by a crossfade. Picking the calmest frame
 * for the cut keeps the restart invisible even on busy footage.
 *
 * Output (audio is always stripped):
 *   public/video/<scene>.webm   VP9, 1920×1080, 24 fps   (Chrome, Firefox, Edge)
 *   public/video/<scene>.mp4    H.264, 1920×1080, 24 fps (Safari, fallback)
 *   public/video/<scene>.jpg    poster frame, shown before playback and
 *                               under reduced motion (portrait cuts get
 *                               <scene>-portrait.jpg)
 * and adds the scene to src/components/site/scene-videos.json.
 *
 * Requires ffmpeg and ffprobe on PATH.
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const SCENES = ["flow", "process", "discover", "plan", "build", "run"];
const OUT_DIR = path.join(process.cwd(), "public", "video");
const MANIFEST = path.join(process.cwd(), "src", "components", "site", "scene-videos.json");
const WARN_BYTES = 4 * 1024 * 1024;

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const [scene, input] = args.filter((a) => !a.startsWith("--"));

function die(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

if (!SCENES.includes(scene)) die(`Scene must be one of: ${SCENES.join(", ")}. Got "${scene ?? ""}".`);
if (!input || !existsSync(input) || !statSync(input).isFile()) die(`Input file not found: ${input ?? "(none)"}`);

const portrait = flag("portrait");
const loop = flag("loop");
const fade = Number(option("fade", "1"));
if (!(fade > 0 && fade <= 3)) die("--fade must be between 0 and 3 seconds.");

const darken = Number(option("darken", "0"));
if (!(darken >= 0 && darken <= 1)) die("--darken must be between 0 and 1.");

const [W, H] = portrait ? [1080, 1920] : [1920, 1080];
const base = path.join(OUT_DIR, portrait ? `${scene}-portrait` : scene);

// Array arguments, no shell: file names can't be interpreted as commands.
function run(cmd, cmdArgs) {
  const res = spawnSync(cmd, cmdArgs, { encoding: "utf8" });
  if (res.error) die(`${cmd} is not available: ${res.error.message}`);
  if (res.status !== 0) die(`${cmd} failed:\n${res.stderr.trim().split("\n").slice(-6).join("\n")}`);
  return res.stdout.trim();
}

const probe = (file, entries) =>
  run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", entries, "-of", "csv=p=0:s=x", file]);

const FPS = 24; // Veo's frame rate
const duration = Number(
  run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", input])
);
const frames = Math.round(duration * FPS);
const fadeFrames = Math.round(fade * FPS);
if (loop && frames < 2 * fadeFrames + 2 * FPS) {
  die(`Clip is ${duration.toFixed(1)}s; too short for a ${fade}s loop fade.`);
}

// Scale to cover the target frame, then centre-crop. --darken adds a gamma
// curve per RGB channel: out = in^(1 + darken), so black and white are
// fixed, and midtones and shadows go down.
const gamma = (1 + darken).toFixed(3);
const grade = darken > 0
  ? `,lutrgb=r='255*pow(val/255\\,${gamma})':g='255*pow(val/255\\,${gamma})':b='255*pow(val/255\\,${gamma})'`
  : "";
const fit = `fps=${FPS},scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H},setsar=1${grade}`;

/**
 * Change between each pair of neighbouring frames (mean absolute luma
 * difference, 0–255), measured on a small copy for speed. motion[i] is the
 * step from frame i to frame i + 1.
 */
function motionSeries() {
  const dir = mkdtempSync(path.join(os.tmpdir(), "prepare-video-"));
  const file = path.join(dir, "motion.txt");
  try {
    run("ffmpeg", [
      "-v", "error", "-i", input,
      "-vf", `fps=${FPS},scale=480:-2,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=${file}`,
      "-f", "null", "-",
    ]);
    return readFileSync(file, "utf8")
      .split("\n")
      .filter((l) => l.includes("YAVG="))
      .map((l) => Number(l.split("=")[1]));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Frame index to restart the loop at: the calmest step, away from the ends. */
function pickCut() {
  const manual = option("cut", null);
  const lo = fadeFrames + FPS; // leave room for the crossfade at both ends
  const hi = frames - fadeFrames - FPS;
  if (manual !== null) {
    const f = Math.round(Number(manual) * FPS);
    if (!(f >= lo && f <= hi)) die(`--cut must be between ${(lo / FPS).toFixed(1)}s and ${(hi / FPS).toFixed(1)}s.`);
    return { frame: f, how: "set with --cut" };
  }
  const motion = motionSeries();
  // Score each candidate by the step into it plus its neighbours, so a
  // single still frame inside a busy moment doesn't win.
  let best = lo;
  let bestScore = Infinity;
  for (let f = lo; f <= hi; f++) {
    const score = (motion[f - 2] ?? 0) + 2 * (motion[f - 1] ?? 0) + (motion[f] ?? 0);
    if (score < bestScore) {
      bestScore = score;
      best = f;
    }
  }
  const typical = motion.reduce((a, b) => a + b, 0) / Math.max(motion.length, 1);
  return {
    frame: best,
    how: `calmest moment (change ${(motion[best - 1] ?? 0).toFixed(2)} vs ${typical.toFixed(2)} on average)`,
  };
}

// Loop: out = source[cut → end] then source[start → cut], with the end→start
// jump crossfaded. The output starts at `cut` and ends one frame before it.
let graph = `[0:v]${fit},format=yuv420p[v]`;
let cutNote = "";
if (loop) {
  const cut = pickCut();
  const offset = (frames - cut.frame - fadeFrames) / FPS;
  graph =
    `[0:v]${fit},split[a][b];` +
    `[a]trim=start_frame=${cut.frame},setpts=PTS-STARTPTS[tail];` +
    `[b]trim=end_frame=${cut.frame},setpts=PTS-STARTPTS[head];` +
    `[tail][head]xfade=transition=fade:duration=${fade}:offset=${offset.toFixed(4)},format=yuv420p[v]`;
  cutNote = `, restart at ${(cut.frame / FPS).toFixed(2)}s (${cut.how})`;
}

mkdirSync(OUT_DIR, { recursive: true });
const common = ["-y", "-v", "error", "-i", input, "-filter_complex", graph, "-map", "[v]", "-an"];

console.log(
  `Encoding ${scene}${portrait ? " (portrait)" : ""} from ${input}, ${duration.toFixed(1)}s` +
    `${loop ? `, loop fade ${fade}s${cutNote}` : ""}${darken > 0 ? `, darken ${darken}` : ""}…`
);

// Quality is set a little above "good enough": these clips are dark and
// finely textured, where heavy compression shows as banding and smeared
// grain, and a lower-quality first frame "pops" each time the loop restarts.
run("ffmpeg", [
  ...common,
  "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", portrait ? "33" : "31",
  "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
  `${base}.webm`,
]);

run("ffmpeg", [
  ...common,
  "-c:v", "libx264", "-preset", "slow", "-crf", portrait ? "23" : "22", "-tune", "grain",
  "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
  `${base}.mp4`,
]);

// Poster: the first frame, shown until playback starts and under reduced
// motion. Portrait cuts get their own so phones never flash the wide frame.
run("ffmpeg", ["-y", "-v", "error", "-i", `${base}.mp4`, "-frames:v", "1", "-q:v", "3", `${base}.jpg`]);
const outputs = [`${base}.webm`, `${base}.mp4`, `${base}.jpg`];

// ------------------------------------------------------------ Register
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
const v = Date.now().toString(36);
let note = "";
if (portrait) {
  if (manifest[scene]) manifest[scene] = { ...manifest[scene], portrait: true, v };
  else note = `Portrait files written, but "${scene}" has no landscape clip yet, so it isn't registered. Run the landscape cut, then this again.`;
} else {
  manifest[scene] = { ...manifest[scene], v };
}
writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

// ------------------------------------------------------------ Report
console.log("");
for (const file of outputs) {
  const bytes = statSync(file).size;
  const info = file.endsWith(".jpg") ? probe(file, "stream=width,height") : `${probe(file, "stream=width,height")} ${Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file])).toFixed(2)}s`;
  const warn = bytes > WARN_BYTES && !file.endsWith(".jpg") ? "  ⚠ over 4 MB: consider a calmer clip or shorter fade" : "";
  console.log(`  ${path.relative(process.cwd(), file).padEnd(34)} ${(bytes / 1024 / 1024).toFixed(2).padStart(5)} MB  ${info}${warn}`);
}
console.log(note ? `\n${note}` : `\nRegistered "${scene}" in ${path.relative(process.cwd(), MANIFEST)}. Reload the page to see it.`);
