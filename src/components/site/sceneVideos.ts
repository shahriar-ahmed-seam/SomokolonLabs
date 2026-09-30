import manifest from "./scene-videos.json";
import type { SceneName } from "./Scene";

/**
 * Background footage for each Scene.
 *
 * scene-videos.json lists the scenes whose clips are in /public/video. It is
 * written by scripts/prepare-video.mjs, so adding a clip is one command:
 *
 *   npm run video -- flow video-src/flow.mp4 --loop
 *
 * A scene with no entry keeps its gradient stand-in. `v` is a cache-buster
 * that changes on every re-encode; `portrait` means a 9:16 cut exists for
 * phones.
 */

export type VideoSource = {
  mp4?: string;
  webm?: string;
  poster?: string;
  /** 9:16 cut, served to portrait screens. */
  portrait?: { mp4?: string; webm?: string; poster?: string };
  /**
   * Where the subject sits across the wide frame, in percent. Portrait
   * screens without their own cut crop the wide clip around this point
   * instead of the centre, so the red focal point stays in view on phones.
   */
  focusX?: number;
};

type Entry = { v: string; portrait?: boolean };

const READY = manifest as Partial<Record<SceneName, Entry>>;

/**
 * Horizontal position of each clip's subject, measured from the current
 * footage. Update it if a clip is replaced with a differently framed one;
 * a scene with no entry crops around the centre.
 */
const FOCUS_X: Partial<Record<SceneName, number>> = {
  process: 100, // the red ring, above the headline; the other rings would sit behind it
  discover: 74, // the red node and the lines leading into it
  plan: 74,
  build: 70,
  run: 74, // status lights and the red pulse on the cables
};

export function sceneVideo(name: SceneName): VideoSource | undefined {
  const entry = READY[name];
  if (!entry) return undefined;
  const url = (file: string) => `/video/${file}?v=${entry.v}`;
  return {
    webm: url(`${name}.webm`),
    mp4: url(`${name}.mp4`),
    poster: url(`${name}.jpg`),
    portrait: entry.portrait
      ? {
          webm: url(`${name}-portrait.webm`),
          mp4: url(`${name}-portrait.mp4`),
          poster: url(`${name}-portrait.jpg`),
        }
      : undefined,
    // A real portrait cut is framed for phones already; keep it centred.
    focusX: entry.portrait ? undefined : FOCUS_X[name],
  };
}
