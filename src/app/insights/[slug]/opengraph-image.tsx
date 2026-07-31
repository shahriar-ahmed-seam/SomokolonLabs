import { notFound } from "next/navigation";
import { getPost, posts } from "@/lib/insights";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Somokolon Labs engineering note";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return renderOgImage({
    eyebrow: "Engineering note",
    title: post.title,
    subtitle: post.topics.join("  ·  "),
  });
}
