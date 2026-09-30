"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import styles from "./site.module.css";
import { usePrefersReducedMotion } from "./motion";
import { sceneVideo, type VideoSource } from "./sceneVideos";

/**
 * Full-bleed background "footage".
 *
 * Each scene plays its clip from /public/video once one is registered in
 * scene-videos.json (see sceneVideos.ts); until then it's a gradient plus a
 * light SVG motif, animated in CSS.
 *
 * Clips are muted and looping, and only play while on screen and `active`
 * (the pinned process section stacks four scenes and shows one at a time).
 * Under reduced motion the poster frame stands in.
 *
 * All geometry below is plain arithmetic (no Math.sin / Math.random), so the
 * server and client produce identical SVG and hydration never mismatches.
 */

export type SceneName = "flow" | "process" | "discover" | "plan" | "build" | "run";
export type { VideoSource };

const SCENE_CLASS: Record<SceneName, string> = {
  flow: styles.sceneFlow,
  process: styles.sceneProcess,
  discover: styles.sceneDiscover,
  plan: styles.scenePlan,
  build: styles.sceneBuild,
  run: styles.sceneRun,
};

const ACCENT = "#f04438";

export default function Scene({
  name,
  video = sceneVideo(name),
  active = true,
  priority = false,
  className = "",
}: {
  name: SceneName;
  /** Defaults to the registered clip for this scene, if any. */
  video?: VideoSource;
  /** False while the scene is stacked out of sight; its clip stays paused. */
  active?: boolean;
  /**
   * True for scenes in the first screen (page heroes). Their poster is the
   * largest thing painted, so it loads eagerly at high priority instead of
   * lazily; this is what the page's LCP waits on.
   */
  priority?: boolean;
  className?: string;
}) {
  const hasVideo = Boolean(video && (video.mp4 || video.webm));

  return (
    <div aria-hidden="true" className={`${styles.scene} ${SCENE_CLASS[name]} ${className}`}>
      {hasVideo && video ? (
        <SceneVideo video={video} active={active} priority={priority} />
      ) : (
        <div className={styles.drift}>
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full"
          >
            {name === "flow" && <Flow />}
            {name === "process" && <Path />}
            {name === "discover" && <Discover />}
            {name === "plan" && <Plan />}
            {name === "build" && <Build />}
            {name === "run" && <Run />}
          </svg>
        </div>
      )}
      <div className={`${styles.grain} absolute inset-0`} />
    </div>
  );
}

// Screens at or narrower than 3:4 get the 9:16 cut when one exists.
const PORTRAIT_MEDIA = "(max-aspect-ratio: 3/4)";

function SceneVideo({
  video,
  active,
  priority,
}: {
  video: VideoSource;
  active: boolean;
  priority: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref, { margin: "120px 0px" });
  const shouldPlay = active && inView && !reduce;

  // No autoPlay attribute: playback starts only after hydration, once we know
  // the scene is visible and motion is allowed. play() also triggers the
  // download, so off-screen and stacked scenes never fetch their clip.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shouldPlay) el.play().catch(() => {});
    else el.pause();
  }, [shouldPlay]);

  // Portrait screens crop around the subject (see focusX); the CSS applies
  // it only under the same media query as the portrait sources.
  const media = `${styles.sceneMedia} absolute inset-0 h-full w-full object-cover`;
  const focus = video.focusX === undefined ? undefined : ({ "--focus-x": `${video.focusX}%` } as CSSProperties);

  return (
    <>
      {/* Poster as a <picture> under the video rather than the poster
          attribute, which can't switch by screen shape. Phones get the tall
          frame from the first paint, before any script runs. The video is
          transparent until its first frame, then covers it. */}
      {video.poster && (
        <picture>
          {video.portrait?.poster && <source media={PORTRAIT_MEDIA} srcSet={video.portrait.poster} />}
          {/* Hero posters load eagerly at high priority; the rest (e.g. the
              five stacked scenes in the pinned process section) lazily. */}
          <img
            src={video.poster}
            alt=""
            decoding="async"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className={media}
            style={focus}
          />
        </picture>
      )}
      <video
        ref={ref}
        className={media}
        style={focus}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
      >
        {video.portrait?.webm && <source src={video.portrait.webm} type="video/webm" media={PORTRAIT_MEDIA} />}
        {video.portrait?.mp4 && <source src={video.portrait.mp4} type="video/mp4" media={PORTRAIT_MEDIA} />}
        {video.webm && <source src={video.webm} type="video/webm" />}
        {video.mp4 && <source src={video.mp4} type="video/mp4" />}
      </video>
    </>
  );
}

const r1 = (n: number) => Math.round(n * 10) / 10;
// --park is where a travelling pulse rests under reduced motion; varying it
// keeps the still frame from lining every pulse up in one column.
const vars = (dur: number, delay: number, park = 500) =>
  ({ "--dur": `${r1(dur)}s`, "--delay": `${r1(delay)}s`, "--park": park }) as CSSProperties;

/** Park–Miller LCG. Products stay below 2^53, so it's exact everywhere. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ------------------------------------------------------------------ flow
// A bundle of fibres that pinches toward a waist right of centre, then fans
// out again, with light running along some of them.

const FLOW = Array.from({ length: 18 }, (_, i) => {
  const t = i / 17;
  const y0 = 20 + t * 860;
  const waist = 420 + (t - 0.5) * 120;
  const y3 = 80 + t * 760;
  return {
    d: `M-120 ${r1(y0)} C 360 ${r1(y0 + (waist - y0) * 0.3)}, 820 ${r1(waist)}, 1560 ${r1(y3)}`,
    pulse: i % 2 === 0,
    accent: i % 4 === 0,
    dur: 6 + (i % 5) * 1.4,
    delay: -i * 0.85,
  };
});

function Flow() {
  return (
    <g fill="none" strokeLinecap="round">
      {FLOW.map((line, i) => (
        <path key={`b${i}`} d={line.d} stroke="rgba(160,190,255,0.16)" strokeWidth="1" />
      ))}
      {FLOW.filter((l) => l.pulse).map((line, i) => (
        <path
          key={`p${i}`}
          d={line.d}
          pathLength={1000}
          className={styles.pulseLine}
          style={vars(line.dur, line.delay, 250 + ((i * 137) % 600))}
          stroke={line.accent ? ACCENT : "rgba(255,255,255,0.7)"}
          strokeWidth={line.accent ? 2 : 1.2}
        />
      ))}
    </g>
  );
}

// --------------------------------------------------------------- process
// One thread through four stations: the four steps, in order. A pulse runs
// the length of it; the stations light up in sequence and the last is red.

const PATH_D = "M470 800 C 620 720, 760 640, 880 580 S 1020 470, 1090 420 S 1210 300, 1260 262 S 1400 150, 1520 110";
const STATIONS: [number, number][] = [
  [686, 688],
  [880, 580],
  [1090, 420],
  [1260, 262],
];

function Path() {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={PATH_D} stroke="rgba(170,195,255,0.22)" strokeWidth="1.4" />
      {[0, -3.2].map((delay, i) => (
        <path
          key={i}
          d={PATH_D}
          pathLength={1000}
          stroke={i === 0 ? "rgba(255,255,255,0.8)" : ACCENT}
          strokeWidth="2"
          className={styles.pulseLine}
          style={vars(6.4, delay, 300 + i * 350)}
        />
      ))}
      {STATIONS.map(([x, y], i) => {
        const last = i === STATIONS.length - 1;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={last ? 30 : 22} fill={last ? ACCENT : "#b8c9f0"} opacity={last ? 0.16 : 0.08} />
            <circle
              cx={x}
              cy={y}
              r={last ? 11 : 8}
              fill="none"
              stroke={last ? ACCENT : "rgba(220,230,255,0.85)"}
              strokeWidth="1.6"
              className={styles.twinkle}
              style={vars(6.4, -6.4 + i * 1.3)}
            />
            <circle cx={x} cy={y} r={last ? 4 : 3} fill={last ? ACCENT : "#ffffff"} />
          </g>
        );
      })}
    </g>
  );
}

// -------------------------------------------------------------- discover
// Scattered points of light: the problem before it has a shape.

const DOTS = (() => {
  const rand = seeded(7);
  return Array.from({ length: 90 }, (_, i) => ({
    x: r1(rand() * 1440),
    y: r1(rand() * 900),
    r: r1(1 + rand() * 1.8 + (i % 11 === 0 ? 2 : 0)),
    accent: i % 11 === 0,
    dur: 2.5 + rand() * 4,
    delay: -rand() * 6,
  }));
})();

function Discover() {
  return (
    <g>
      {DOTS.map((dot, i) => (
        <circle
          key={i}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill={dot.accent ? ACCENT : "#dbe6ff"}
          className={styles.twinkle}
          style={vars(dot.dur, dot.delay)}
        />
      ))}
    </g>
  );
}

// ------------------------------------------------------------------ plan
// A wireframe drawing itself on a blueprint grid.

const PLAN_PATHS = [
  "M384 192 H1056 V708 H384 Z", // frame
  "M384 264 H1056", // header rule
  "M432 318 H720 V492 H432 Z", // primary block
  "M768 318 H1008 V396 H768 Z",
  "M768 420 H1008 V492 H768 Z",
  "M432 540 H592 V660 H432 Z",
  "M640 540 H800 V660 H640 Z",
  "M848 540 H1008 V660 H848 Z",
];

function Plan() {
  // Nudged right so the drawing sits beside the copy, not under it.
  return (
    <g fill="none" strokeLinejoin="round" transform="translate(220 0)">
      {PLAN_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1000}
          stroke={i === 2 ? ACCENT : "rgba(190,210,255,0.55)"}
          strokeWidth={i === 0 ? 1.6 : 1.2}
          className={styles.drawLine}
          style={vars(7, i * 0.35)}
        />
      ))}
      {[
        [384, 192],
        [1056, 192],
        [384, 708],
        [1056, 708],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill={ACCENT} className={styles.twinkle} style={vars(3, -i)} />
      ))}
    </g>
  );
}

// ----------------------------------------------------------------- build
// Columns rising from the floor.

const BARS = [220, 340, 280, 470, 390, 580, 430, 310, 520, 270, 370, 450, 240];

function Build() {
  const width = 64;
  const gap = 30;
  const total = BARS.length * width + (BARS.length - 1) * gap;
  const left = (1440 - total) / 2;
  return (
    <g>
      <defs>
        <linearGradient id="scene-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ACCENT} stopOpacity="0.95" />
          <stop offset="0.06" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {BARS.map((h, i) => (
        <rect
          key={i}
          x={left + i * (width + gap)}
          y={900 - 60 - h}
          width={width}
          height={h}
          rx={6}
          fill="url(#scene-bar)"
          className={styles.rise}
          style={vars(6, i * 0.18)}
        />
      ))}
      <path d="M0 840 H1440" stroke="rgba(255,255,255,0.12)" />
    </g>
  );
}

// ------------------------------------------------------------------- run
// A live network: a hub, two rings, and traffic moving between them.
// Unit vectors for 30° steps, written out so no trig runs at render.

const UNIT: [number, number][] = [
  [1, 0], [0.866, 0.5], [0.5, 0.866], [0, 1], [-0.5, 0.866], [-0.866, 0.5],
  [-1, 0], [-0.866, -0.5], [-0.5, -0.866], [0, -1], [0.5, -0.866], [0.866, -0.5],
];
const HUB: [number, number] = [720, 450];
const at = (k: number, radius: number): [number, number] => [
  r1(HUB[0] + UNIT[k][0] * radius * 1.35),
  r1(HUB[1] + UNIT[k][1] * radius),
];
const INNER = [0, 2, 4, 6, 8, 10].map((k) => at(k, 190));
const OUTER = UNIT.map((_, k) => at(k, 360));

function Run() {
  const edges: { a: [number, number]; b: [number, number] }[] = [
    ...INNER.map((p) => ({ a: HUB, b: p })),
    ...OUTER.map((p, k) => ({ a: INNER[Math.floor(k / 2) % 6], b: p })),
    ...OUTER.map((p, k) => ({ a: p, b: OUTER[(k + 1) % 12] })),
  ];
  return (
    <g fill="none" strokeLinecap="round">
      {edges.map((e, i) => (
        <line
          key={`e${i}`}
          x1={e.a[0]}
          y1={e.a[1]}
          x2={e.b[0]}
          y2={e.b[1]}
          stroke="rgba(170,195,255,0.14)"
        />
      ))}
      {edges.slice(0, 18).map((e, i) => (
        <line
          key={`p${i}`}
          x1={e.a[0]}
          y1={e.a[1]}
          x2={e.b[0]}
          y2={e.b[1]}
          pathLength={1000}
          stroke={i % 3 === 0 ? ACCENT : "rgba(255,255,255,0.75)"}
          strokeWidth={1.6}
          className={styles.pulseLine}
          style={vars(2.4 + (i % 4) * 0.6, -i * 0.4, 200 + ((i * 173) % 700))}
        />
      ))}
      {[...INNER, ...OUTER].map(([x, y], i) => (
        <circle
          key={`n${i}`}
          cx={x}
          cy={y}
          r={i < 6 ? 5 : 3.5}
          fill={i < 6 ? "#ffffff" : "#b8c9f0"}
          className={styles.twinkle}
          style={vars(3 + (i % 3), -i * 0.5)}
        />
      ))}
      <circle cx={HUB[0]} cy={HUB[1]} r={34} fill={ACCENT} opacity={0.18} />
      <circle cx={HUB[0]} cy={HUB[1]} r={11} fill={ACCENT} />
    </g>
  );
}
