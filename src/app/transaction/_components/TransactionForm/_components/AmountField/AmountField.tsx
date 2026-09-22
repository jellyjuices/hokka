"use client";

import { useEffect, useRef } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { caretOffset, setCaretOffset } from "./AmountField.caret";
import { Affix, Amount, Editable } from "./AmountField.styles";
import type { AmountFieldProps } from "./AmountField.types";

function toAmount(text: string) {
  const [whole = "", ...rest] = text.replace(/[^0-9.]/g, "").split(".");
  return rest.length === 0 ? whole : `${whole}.${rest.join("").slice(0, 2)}`;
}

export function AmountField({
  value,
  label,
  prefix,
  placeholder = "",
  onChange,
}: AmountFieldProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (node !== null && node.textContent !== value) node.textContent = value;
  }, [value]);

  function readField() {
    const node = ref.current;
    if (node === null) return;

    const raw = node.textContent ?? "";
    const next = toAmount(raw);
    if (next !== raw) {
      const offset = caretOffset(node);
      node.textContent = next;
      setCaretOffset(node, offset === null ? next.length : offset - (raw.length - next.length));
    }
    onChange(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    event.currentTarget.blur();
  }

  function handlePaste(event: ClipboardEvent<HTMLSpanElement>) {
    event.preventDefault();
    document.execCommand("insertText", false, toAmount(event.clipboardData.getData("text/plain")));
  }

  return (
    <Amount>
      {prefix === undefined ? null : <Affix aria-hidden="true">{prefix}</Affix>}
      <Editable
        ref={ref}
        role="textbox"
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
        inputMode="decimal"
        enterKeyHint="done"
        aria-label={label}
        data-placeholder={placeholder}
        onInput={readField}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
    </Amount>
  );
}
