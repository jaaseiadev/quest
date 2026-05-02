"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button, Input, Label } from "@/components/ui";
import type { QuestFiltersState, QuestRank } from "@/components/questboard/types";

export type QuestFiltersProps = {
  filters: QuestFiltersState;
  ranks: QuestRank[];
  categories: string[];
  onChange: (filters: QuestFiltersState) => void;
};

const DATE_POSTED_OPTIONS = ["All Time", "Recent", "Last Week", "Last Month"];

export function QuestFilters({
  filters,
  ranks,
  categories,
  onChange,
}: QuestFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.difficulty || filters.category || filters.datePosted;

  function updateFilter(key: keyof QuestFiltersState, value: string) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  function clearFilters() {
    onChange({
      search: "",
      difficulty: "",
      category: "",
      datePosted: "",
    });
  }

  return (
    <section className="border border-border bg-surface-container-low p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <SlidersHorizontal className="h-5 w-5 text-primary" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-label-caps text-primary">Filter Bar</p>
            <h2 className="break-words font-display text-lg font-semibold text-foreground">
              Sort Available Operations
            </h2>
          </div>
        </div>
        {hasActiveFilters ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4" aria-hidden="true" />
            Reset
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
        <div className="space-y-2">
          <Label htmlFor="quest-search">Search</Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="quest-search"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Quest, company, location"
              className="pl-10"
            />
          </div>
        </div>

        <FilterSelect
          id="quest-difficulty"
          label="Difficulty"
          value={filters.difficulty}
          placeholder="All ranks"
          options={ranks.map((rank) => rank.name)}
          onChange={(value) => updateFilter("difficulty", value)}
        />

        <FilterSelect
          id="quest-category"
          label="Category"
          value={filters.category}
          placeholder="All categories"
          options={categories}
          onChange={(value) => updateFilter("category", value)}
        />

        <FilterSelect
          id="quest-date-posted"
          label="Date Posted"
          value={filters.datePosted}
          placeholder="Any time"
          options={DATE_POSTED_OPTIONS}
          onChange={(value) => updateFilter("datePosted", value)}
        />
      </div>
    </section>
  );
}

function FilterSelect({
  id,
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full min-w-0 border border-border bg-input px-4 text-foreground transition-colors duration-100 focus:border-primary focus:outline-none focus:ring-0"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

