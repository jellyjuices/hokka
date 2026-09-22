const MODEL_ID = "minilm";
const MODEL_PATH = "/models/";
const RUNTIME_PATH = "/models/ort/";
const IDLE_TIMEOUT = 60_000;
// The library is served from public/models beside the weights it loads, so half
// a megabyte of runtime never lands in a route chunk. The specifier is held in a
// variable so the bundler cannot follow it.
const LIBRARY_SRC = "/models/transformers.web.min.js";

type Extractor = (
  texts: string[],
  options: { pooling: "mean"; normalize: boolean },
) => Promise<{ tolist: () => number[][] }>;

let extractorPromise: Promise<Extractor> | null = null;
let idleTimer: ReturnType<typeof setTimeout> | null = null;

async function startExtractor() {
  const { env, pipeline } = (await import(
    /* turbopackIgnore: true */ LIBRARY_SRC
  )) as typeof import("@huggingface/transformers");
  env.allowRemoteModels = false;
  env.localModelPath = MODEL_PATH;
  const wasm = env.backends.onnx.wasm;
  if (wasm !== undefined) {
    wasm.wasmPaths = RUNTIME_PATH;
    // Threaded WASM needs cross-origin isolation, which this app does not set.
    wasm.numThreads = 1;
  }
  const extractor = await pipeline("feature-extraction", MODEL_ID, {
    dtype: "uint8",
    device: "wasm",
  });
  return extractor as unknown as Extractor;
}

function getExtractor() {
  if (extractorPromise === null) {
    extractorPromise = startExtractor().catch((cause) => {
      extractorPromise = null;
      throw cause;
    });
  }
  return extractorPromise;
}

function scheduleRelease() {
  if (idleTimer !== null) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    idleTimer = null;
    extractorPromise = null;
  }, IDLE_TIMEOUT);
}

export async function embed(texts: string[]): Promise<number[][] | null> {
  if (texts.length === 0) return [];
  try {
    const extractor = await getExtractor();
    if (idleTimer !== null) clearTimeout(idleTimer);
    try {
      const output = await extractor(texts, { pooling: "mean", normalize: true });
      return output.tolist();
    } finally {
      scheduleRelease();
    }
  } catch {
    return null;
  }
}

export async function embedOne(text: string): Promise<number[] | null> {
  const vectors = await embed([text]);
  return vectors === null || vectors.length === 0 ? null : vectors[0];
}
