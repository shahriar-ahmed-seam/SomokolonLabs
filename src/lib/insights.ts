/**
 * Engineering notes. Plain data, no CMS — add an entry and the index, detail
 * page, and sitemap all pick it up.
 *
 * `body` is an array of blocks so posts stay typed and renderable without a
 * markdown pipeline. Keep posts technical and first-hand; this section exists to
 * show how the studio thinks, so a thin post is worse than no post.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  summary: string;
  /** ISO date. Used for sorting and for <time> / article metadata. */
  date: string;
  readingMinutes: number;
  topics: string[];
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "shipping-on-device-inference-in-70mb",
    title: "Cutting a 600 MB model app down to 70 MB",
    summary:
      "ResoNet needed to run respiratory screening entirely on-device, in places with no reliable network. The model was never the problem — the runtime was.",
    date: "2026-05-18",
    readingMinutes: 6,
    topics: ["Edge AI", "ONNX", "Mobile"],
    body: [
      {
        type: "p",
        text: "ResoNet classifies respiratory conditions from a cough recording. The requirement that shaped every decision was that it had to work with the network off — both for privacy and because the target users are in areas where connectivity is not a given.",
      },
      {
        type: "p",
        text: "The first working build was over 600 MB. Almost none of that was the model. It was the dependency tree we had dragged along to do audio preprocessing: a Python-shaped pipeline lifted onto the device, bundling numerical libraries to compute what amounts to a mel spectrogram.",
      },
      { type: "h2", text: "The actual problem" },
      {
        type: "p",
        text: "Training-time and inference-time preprocessing had been written once, in the training environment, and then shipped. That is convenient during research and expensive in production. The classifier itself, exported to ONNX and quantized, was a few tens of megabytes.",
      },
      { type: "h2", text: "What we changed" },
      {
        type: "list",
        items: [
          "Reimplemented the audio front end — resampling, framing, windowing, mel filterbank, log compression — in pure Dart, with no numerical dependency.",
          "Exported the ResNet classifier to ONNX and ran it through ONNX Runtime's mobile build instead of a full framework runtime.",
          "Wrote a parity test that runs the same WAV files through the original pipeline and the Dart one and asserts the feature matrices match within tolerance.",
        ],
      },
      {
        type: "p",
        text: "That parity test is the part worth copying. Rewriting preprocessing is where accuracy quietly disappears: the model is unchanged, the features shift slightly, and the metrics drop for reasons nobody can locate three weeks later. Pinning the two implementations against each other turns a risky rewrite into a mechanical one.",
      },
      { type: "h2", text: "Result" },
      {
        type: "p",
        text: "Roughly 70 MB installed, down from 600 MB+, with no measured accuracy loss and inference running locally on the handset. No audio leaves the device.",
      },
      {
        type: "quote",
        text: "On-device budgets are usually spent on the runtime, not the weights. Measure before optimizing the model.",
      },
    ],
  },
  {
    slug: "what-event-driven-ml-inference-buys-you",
    title: "Why we split ML inference into three services",
    summary:
      "Ingest, inference, and delivery fail differently and scale differently. Putting them in one process means the slowest one sets the rules.",
    date: "2026-06-09",
    readingMinutes: 7,
    topics: ["System design", "Kubernetes", "Kafka"],
    body: [
      {
        type: "p",
        text: "The obvious way to serve a model is one service: accept a request, run the model, return the prediction. It works until any of three things happens — traffic arrives in bursts, the model gets slower than the request timeout, or a downstream consumer goes down and you start dropping work you have already paid to compute.",
      },
      { type: "h2", text: "The split" },
      {
        type: "list",
        items: [
          "Ingest accepts work, validates it, and writes it to a topic. It is cheap, fast, and stateless, so it can absorb spikes without touching GPU capacity.",
          "Inference consumes the topic at whatever rate it can sustain. It scales on queue depth rather than on request rate, which is the number that actually correlates with cost.",
          "Delivery takes results out and gets them where they need to go, with its own retry semantics.",
        ],
      },
      {
        type: "p",
        text: "The queue between ingest and inference is doing the real work here. It decouples arrival rate from processing rate, which means a burst becomes latency instead of errors, and a slow model becomes a growing backlog you can see on a dashboard instead of a wave of timeouts.",
      },
      { type: "h2", text: "Testing that it actually recovers" },
      {
        type: "p",
        text: "A design that claims fault tolerance and has never been tested is a claim, not a property. The only way to know is to break it on purpose: kill inference pods mid-batch, partition the broker, and assert afterwards that every accepted message was eventually processed exactly once.",
      },
      {
        type: "code",
        lang: "bash",
        code: "# delete a random inference pod while a load test runs\nkubectl delete pod -l app=inference \\\n  --field-selector=status.phase=Running \\\n  -o name | head -1 | xargs kubectl delete",
      },
      {
        type: "p",
        text: "Two things make the recovery real rather than incidental: consumers commit offsets only after a result is durably written, and handlers are idempotent, keyed on the message id. Without both, a restart either loses work or duplicates it.",
      },
      { type: "h2", text: "When not to do this" },
      {
        type: "p",
        text: "This costs you a broker, a schema contract, and three deployables instead of one. If your model responds in tens of milliseconds and traffic is flat, a single service behind an autoscaler is the correct answer and the queue is decoration. The split earns its complexity when arrival is bursty or inference is slow.",
      },
    ],
  },
  {
    slug: "rag-systems-fail-at-retrieval",
    title: "Most RAG systems fail at retrieval, not generation",
    summary:
      "When a retrieval-augmented system gives a bad answer, the instinct is to change the prompt or the model. Usually the right passage was never in the context.",
    date: "2026-07-14",
    readingMinutes: 6,
    topics: ["RAG", "LLM systems", "Evaluation"],
    body: [
      {
        type: "p",
        text: "A retrieval-augmented pipeline has two places to fail. Either the right information never reached the model, or it did and the model handled it badly. These need completely different fixes, and they are easy to confuse because both surface as a wrong answer.",
      },
      { type: "h2", text: "Separate the two before touching anything" },
      {
        type: "p",
        text: "Build a small set of questions with the passage that should answer each one labelled by hand. Fifty is enough to be useful. Then measure one thing: how often the labelled passage appears in the retrieved context at all. That single number tells you which half of the system to work on, and it is usually the disappointing half.",
      },
      {
        type: "list",
        items: [
          "Low retrieval hit rate — chunking, embeddings, and query handling are the problem. Prompt work will not help.",
          "High hit rate, bad answers — now generation is worth attention: prompt structure, citation enforcement, model choice.",
        ],
      },
      { type: "h2", text: "What usually fixes retrieval" },
      {
        type: "list",
        items: [
          "Chunk on document structure — headings, sections, function boundaries — rather than a fixed character count that splits sentences and separates a claim from its qualifier.",
          "Run hybrid search. Dense embeddings miss exact identifiers, error codes, and product names; BM25 catches them. Fuse the two result sets.",
          "Add a cross-encoder reranker over a wider candidate set. Retrieve 50, rerank, keep 5. This is often the single largest improvement available.",
          "Keep enough metadata on each chunk to cite it precisely. An answer you cannot trace back to a source is not verifiable, and users learn quickly not to trust it.",
        ],
      },
      { type: "h2", text: "Then keep measuring it" },
      {
        type: "p",
        text: "Retrieval quality drifts as the corpus grows — a chunking strategy tuned on 200 documents behaves differently at 20,000. Put the eval in CI so a regression shows up in a pull request rather than in a support conversation.",
      },
    ],
  },
];

export function sortedPosts(): Post[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
