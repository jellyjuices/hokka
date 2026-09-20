"use client";

import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Icon } from "@/src/components/Icon";
import { SearchButton, SearchClearButton, SearchField, SearchForm } from "./NavSearch.styles";
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
        <Icon name={MagnifyingGlassIcon} size={24} />
      </SearchButton>
    );
  }

  return (
    <SearchForm role="search" onSubmit={handleSubmit}>
      <SearchField
        ref={inputRef}
        variant="plain"
        icon={MagnifyingGlassIcon}
        iconSide="leading"
        iconSize={24}
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Search"
        aria-label="Search transactions"
      >
        {query !== "" && (
          <SearchClearButton type="button" onClick={handleClear} aria-label="Clear search">
            <Icon name={XIcon} size={18} />
          </SearchClearButton>
        )}
      </SearchField>
    </SearchForm>
  );
}
