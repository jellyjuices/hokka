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
ONNX that turns a receipt into 384 numbers. Each category owns a few receipt-shaped sentences in
[prototypes.registry.ts](../src/lib/classify/prototypes.registry.ts), one per kind of document it
receives, plus the description a person reads in Settings. A category scores as its nearest
sentence, so a gas bill and a property tax bill both land in Home office without one sentence having
to describe both. An unknown vendor is no longer a blank form, and adding a category means writing
sentences, not retraining anything. A category with no sentences is never guessed: a bad debt, a
prepaid plan or a box of supplies cannot be told from the receipt alone.

Every sentence is embedded on its own, the way a receipt is. The uint8 model quantises its
activations per batch, so a sentence padded beside a longer one came out at 0.995 cosine to itself,
which is enough to swap two close categories.

The design follows [Laya](https://huggingface.co/convaiinnovations/laya), which does the same job
with a 421M-parameter ModernBERT and a decision head: score every option in one encoder pass,
softmax over the options, never generate text. Laya's weights are 1.7 GB and need a Node process
with 2 GB of RAM, which is not a phone. What survives the shrink is the shape — one pass, an answer
space set at call time, and nothing to hallucinate. What does not survive is Laya's calibration,
which comes from training against a strictly proper scoring rule. A temperature-scaled softmax is a
weaker substitute, and the temperature in [guess.ts](../src/lib/classify/guess.ts) is a value to
tune against real receipts rather than a derived constant.

## The three voters

| Source                                             | What it knows                                                   | Weight |
| -------------------------------------------------- | --------------------------------------------------------------- | ------ |
| [keywords.ts](../src/lib/classify/keywords.ts)     | Named vendors and terms, whole-word matched                     | 1.0    |
| [prototypes.ts](../src/lib/classify/prototypes.ts) | How close the receipt reads to each category's nearest sentence | 0.8    |
| [memory.ts](../src/lib/classify/memory.ts)         | Categories chosen by hand on receipts that read like this       | 1.4    |

Each voter also reports a strength, and its weight is multiplied by it, so a source with nothing to
say contributes nothing rather than diluting the others. `blend` in
[guess.ts](../src/lib/classify/guess.ts) sums the weighted votes and divides by the weight actually
used, which leaves a distribution over categories. Below `0.45` the guess is dropped and the form
stays blank, because a wrong category silently applies a wrong claimable percentage.

## Keywords vote one way

The registry holds only signals that point at one category. A name that also prints on other
receipts stays out: `Powered by Square` sits at the foot of café receipts, Stripe signs SaaS
receipts, and an insurer that sells car cover would file every auto policy as business insurance. A
store that sells pens and monitors alike stays out for the same reason. Phrases are matched longest
first and cut out of the text once counted, so `uber eats` is a meal before `uber` can call it a
ride, a coworking `hot desk` is never a desk, and a `windshield repair` is a car cost rather than a
repair to work gear.

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

A Node harness scored the classifier with the same uint8 model on 137 synthetic receipts, written in
OCR shape with totals, tax lines and card stubs. 94 were split before tuning, half to tune the
sentences on and half held back. 43 more came from vendors in no keyword list, nine of them traps
such as `Powered by Square`, a PayPal purchase and car insurance from an insurer. On those 43:

| Setup                                  | Model alone right | Guessed | Right of guessed | Wrong |
| -------------------------------------- | ----------------- | ------- | ---------------- | ----- |
| Before: seven categories, one sentence | 35%               | 60%     | 38%              | 16    |
| One sentence per T2125 category        | 65%               | 77%     | 82%              | 6     |
| Several sentences plus the description | 91%               | 84%     | 94%              | 2     |

The two wrong guesses were a monitor bought at Staples and a windshield repair. After mixed stores
left the registry and the longer vehicle phrase went in, none of the 137 is guessed wrong and 86% of
the unseen ones get a guess; the rest stay blank, which is the intended failure. On the held-back
half the model alone went from 62% to 90% right when one sentence per category became several.

Three things did not help. The Settings description alone reads like advice, not a receipt, and
scored below the old one-liners; as one sentence among the examples it helps a little. Averaging a
category's sentences into one vector scored below taking the nearest. A lower temperature, or a
floor on the total vote weight, bought no precision on unseen vendors. The receipts and the sentences
have the same author, so these numbers flatter the app; real receipts are the next check. One warm
encode takes about 1 ms on Apple silicon; the first call pays for loading the model.

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
