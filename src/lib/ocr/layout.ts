import type { OcrLine } from "./ocr.types";

export type OcrWord = {
  text: string;
  confidence: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const ROW_TOLERANCE = 0.6;
const SPACE_SHARE = 0.2;

function centerOf(word: OcrWord) {
  return (word.top + word.bottom) / 2;
}

function heightOf(word: OcrWord) {
  return Math.max(1, word.bottom - word.top);
}

function average(values: number[]) {
  return values.reduce((running, value) => running + value, 0) / Math.max(1, values.length);
}

function belongsToRow(word: OcrWord, row: OcrWord[]) {
  const anchor = average(row.map(centerOf));
  const tolerance = average(row.map(heightOf)) * ROW_TOLERANCE;
  return Math.abs(centerOf(word) - anchor) <= tolerance;
}

function joinWords(ordered: OcrWord[]) {
  return ordered.reduce((running, word, index) => {
    const previous = ordered[index - 1];
    if (previous === undefined) return word.text;
    const gap = word.left - previous.right;
    return gap > heightOf(word) * SPACE_SHARE ? `${running} ${word.text}` : running + word.text;
  }, "");
}

function toLine(row: OcrWord[]): OcrLine {
  const ordered = [...row].sort((left, right) => left.left - right.left);
  return {
    text: joinWords(ordered),
    confidence: average(ordered.map((word) => word.confidence)),
  };
}

export function linesFromWords(words: OcrWord[]): OcrLine[] {
  const readable = words.filter((word) => word.text.trim() !== "");
  const sorted = [...readable].sort((left, right) => centerOf(left) - centerOf(right));
  const rows: OcrWord[][] = [];

  for (const word of sorted) {
    const row = rows[rows.length - 1];
    if (row === undefined || !belongsToRow(word, row)) {
      rows.push([word]);
      continue;
    }
    row.push(word);
  }

  return rows.map(toLine);
}
