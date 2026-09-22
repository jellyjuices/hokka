export function caretOffset(node: HTMLElement) {
  const selection = window.getSelection();
  if (selection === null || selection.rangeCount === 0) return null;
  const caret = selection.getRangeAt(0);
  if (!node.contains(caret.endContainer)) return null;

  const measured = document.createRange();
  measured.selectNodeContents(node);
  measured.setEnd(caret.endContainer, caret.endOffset);
  return measured.toString().length;
}

export function setCaretOffset(node: HTMLElement, offset: number) {
  const selection = window.getSelection();
  if (selection === null) return;

  const text = node.firstChild;
  const range = document.createRange();
  if (text === null) range.selectNodeContents(node);
  else range.setStart(text, Math.max(0, Math.min(offset, text.textContent?.length ?? 0)));
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}
