import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt =
  "Somokolon Labs — AI & software development studio, Dhaka, Bangladesh";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "AI & Software Studio",
    title: "Intelligent software, engineered for production.",
    subtitle: "LLM systems, applied ML, and cloud infrastructure. Dhaka, Bangladesh.",
  });
}
