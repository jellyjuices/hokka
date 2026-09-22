# Choosing a category

A read receipt arrives with a category already chosen and a number saying how sure the app is.
The guess is made on the device, from three sources that vote, and the vote is a probability rather
than a tally. Nothing crosses the network to make it.

## Why a sentence encoder and not a keyword list

The keyword registry in [keywords.registry.ts](../src/lib/classify/keywords.registry.ts) only knows
the vendors someone thought to type into it. A receipt from `Pho Hung Vietnamese` or `Keychron
Technology` scored zero and the form stayed blank. It also returned a tally — a `7` — which cannot
be thresholded, because nobody knows what a 7 means.

[all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2), quantised to uint8, is 22 MB of
ONNX that turns a receipt into 384 numbers. Each category owns a sentence describing what belongs in
it; the category whose sentence sits closest to the receipt wins. An unknown vendor is no longer a
blank form, and adding a category means writing a sentence, not retraining anything.

The design follows [Laya](https://huggingface.co/convaiinnovations/laya), which does the same job
with a 421M-parameter ModernBERT and a decision head: score every option in one encoder pass,
softmax over the options, never generate text. Laya's weights are 1.7 GB and need a Node process
with 2 GB of RAM, which is not a phone. What survives the shrink is the shape — one pass, an answer
space set at call time, and nothing to hallucinate. What does not survive is Laya's calibration,
which comes from training against a strictly proper scoring rule. A temperature-scaled softmax is a
weaker substitute, and the temperature in [guess.ts](../src/lib/classify/guess.ts) is a value to
tune against real receipts rather than a derived constant.

## The three voters

| Source                                             | What it knows                                              | Weight |
| -------------------------------------------------- | ---------------------------------------------------------- | ------ |
| [keywords.ts](../src/lib/classify/keywords.ts)     | Named vendors and terms, whole-word matched                | 1.0    |
| [prototypes.ts](../src/lib/classify/prototypes.ts) | How close the receipt reads to each category's description | 0.8    |
| [memory.ts](../src/lib/classify/memory.ts)         | Categories chosen by hand on receipts that read like this  | 1.4    |

Each voter also reports a strength, and its weight is multiplied by it, so a source with nothing to
say contributes nothing rather than diluting the others. `blend` in
[guess.ts](../src/lib/classify/guess.ts) sums the weighted votes and divides by the weight actually
used, which leaves a distribution over categories. Below `0.45` the guess is dropped and the form
stays blank, because a wrong category silently applies a wrong claimable percentage.

Memory outweighs the other two on purpose. This is a single-user ledger, so the categories chosen by
hand are ground truth about this business, and no general model knows more about which suppliers are
meals than the person who ate there.

## Learning from a correction

Saving a transaction that came from a receipt stores the receipt's vector against the chosen
category, in `classify.memory.v1` through the same keyval store as everything else. The store holds
the last 150, rounded to three decimals so the `localStorage` fallback can carry it. `recallReading`
takes the five nearest by cosine and weights them; its strength is how far the nearest one sits above
0.55, since two unrelated receipts still score around there.

Correcting a category once is what teaches the app that `Railway Corp` is a cloud bill and not a
train. That loop lives in
[useTransactionSave.ts](../src/app/transaction/_components/TransactionForm/useTransactionSave.ts) and
never fails a save.

## Measured

Eleven receipts whose vendors appear nowhere in the keyword registry, scored on the description
vote alone with no keyword or memory help:

- 9 of 11 correct.
- Both misses scored 0.44 and 0.47, at or under the 0.45 floor, so the form says nothing rather than
  the wrong thing.
- One warm encode takes about 1 ms on Apple silicon; the first call pays for loading the model.

Two earlier misses were the descriptions' fault, not the model's: `home_office` said "workspace" and
caught a SaaS "Workspace plan", and `software` never mentioned compute. Rewording fixed both without
touching a weight, which is the property worth having.

## Engine assets

`public/models/` is gitignored and filled by
[scripts/sync-model-assets.js](../scripts/sync-model-assets.js) on `postinstall` or
`npm run model:assets`. It downloads the model, tokenizer and config from Hugging Face once, and
copies the ONNX Runtime WASM out of `node_modules`. 37 MB in total: 22 MB of model and 14 MB of
runtime. The WebGPU runtime is deliberately not synced — it costs another 27 MB to shave
milliseconds off a job that already takes one.

The service worker precaches `/models/` alongside `/ocr/`, so the second read works on a subway
platform. `env.allowRemoteModels` is false, so a missing file is a failure rather than a quiet
fetch from a CDN. Threads are pinned to one because threaded WASM needs cross-origin isolation this
app does not set.

Every failure path returns the keyword vote, or no guess at all. The reader never blocks a save.
