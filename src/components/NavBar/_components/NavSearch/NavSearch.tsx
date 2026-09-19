"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Icon } from "@/src/components/Icon";
import {
  SearchButton,
  SearchClearButton,
  SearchForm,
  SearchGlyph,
  SearchInput,
} from "./NavSearch.styles";
import type { NavSearchProps } from "./NavSearch.types";

export function NavSearch({ isCollapsed, inputRef, onActivate }: NavSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleClear() {
    setQuery("");
    inputRef.current?.focus();
  }

  if (isCollapsed) {
    return (
      <SearchButton type="button" onClick={onActivate} aria-label="Search">
        <Icon name="search" size={24} />
      </SearchButton>
    );
  }

  return (
    <SearchForm role="search" onSubmit={handleSubmit}>
      <SearchGlyph>
        <Icon name="search" size={24} />
      </SearchGlyph>
      <SearchInput
        ref={inputRef}
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Search"
        aria-label="Search transactions"
      />
      {query !== "" && (
        <SearchClearButton type="button" onClick={handleClear} aria-label="Clear search">
          <Icon name="close" size={18} />
        </SearchClearButton>
      )}
    </SearchForm>
  );
}
