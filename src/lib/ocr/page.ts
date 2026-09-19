import type { OcrLine, OcrPage } from "./ocr.types";

function collapseSpaces(line: string) {
  return line
    .replace(/[\t ]+/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
}

export function toOcrPage(lines: OcrLine[], confidence: number): OcrPage {
  const cleaned = lines
    .map((line) => ({ text: collapseSpaces(line.text), confidence: line.confidence }))
    .filter((line) => line.text !== "");
  return {
    lines: cleaned,
    text: cleaned.map((line) => line.text).join("\n"),
    confidence,
  };
}

export function pageFromText(text: string, confidence: number): OcrPage {
  const lines = text.split(/\r?\n/).map((line) => ({ text: line, confidence }));
  return toOcrPage(lines, confidence);
}
