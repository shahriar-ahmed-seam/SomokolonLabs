// Server-only Unsplash helper. Key stays on the server; never sent to the client.

export type UnsplashPhoto = {
  url: string;
  alt: string;
  credit: { name: string; profileUrl: string };
};

const FALLBACK: UnsplashPhoto = {
  url: "",
  alt: "",
  credit: { name: "", profileUrl: "" },
};

export async function getUnsplashPhoto(query: string): Promise<UnsplashPhoto> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return FALLBACK;

  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
        query
      )}&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${key}` },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return FALLBACK;

    const data = await res.json();
    return {
      url: data?.urls?.regular ?? "",
      alt: data?.alt_description ?? query,
      credit: {
        name: data?.user?.name ?? "Unsplash",
        profileUrl: data?.user?.links?.html ?? "https://unsplash.com",
      },
    };
  } catch {
    return FALLBACK;
  }
}
