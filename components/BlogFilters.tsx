"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const SEARCH_DEBOUNCE_MS = 400;

const PLATFORMS = ["Medium", "Dev.to", "Hashnode", "Personal Blog", "Other"];

function MultiSelectDropdown({
  label,
  options,
  selected,
  onToggle,
  placeholder,
  isLoading,
  dropdownRef,
  isOpen,
  onOpenChange,
  triggerId,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  placeholder: string;
  isLoading?: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  triggerId: string;
}) {
  const triggerLabel =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0]
        : `${selected.length} selected`;

  return (
    <div ref={dropdownRef} className="relative">
      <label id={triggerId} className="sr-only">
        {label}
      </label>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={triggerId}
        onClick={() => onOpenChange(!isOpen)}
        className="neo-input flex min-w-[160px] cursor-pointer items-center justify-between gap-2 text-left"
      >
        <span className="truncate font-bold">
          {isLoading ? "Loading…" : triggerLabel}
        </span>
        <span
          className={`flex-shrink-0 text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-1 flex min-h-0 min-w-full max-h-[16rem] flex-col overflow-hidden border-3 border-neo-black bg-neo-white shadow-[4px_4px_0_0_var(--neo-black)]"
          role="listbox"
          aria-multiselectable
        >
          <div
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-1"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {options.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm font-bold text-neo-gray-dark">
                No options
              </div>
            ) : (
              options.map((option) => {
                const checked = selected.includes(option);
                return (
                  <label
                    key={option}
                    role="option"
                    aria-selected={checked}
                    className={`flex cursor-pointer items-center gap-3 border-b-2 border-neo-black px-3 py-2.5 last:border-b-0 hover:bg-neo-yellow focus-within:bg-neo-yellow ${checked ? "bg-neo-yellow" : "bg-neo-white"}`}
                  >
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 border-neo-black ${checked ? "bg-neo-black text-neo-yellow" : "bg-neo-white"}`}
                    >
                      {checked && (
                        <span className="text-sm font-black leading-none">
                          ✓
                        </span>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(option)}
                      className="sr-only"
                    />
                    <span className="font-bold">{option}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(() =>
    searchParams.getAll("platform"),
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(() =>
    searchParams.getAll("tag"),
  );
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);
  const isFirstSearchRun = useRef(true);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        platformDropdownRef.current &&
        !platformDropdownRef.current.contains(target)
      ) {
        setPlatformDropdownOpen(false);
      }
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(target)) {
        setTagDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Sync state from URL when searchParams change (e.g. browser back)
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setSelectedPlatforms(searchParams.getAll("platform"));
    setSelectedTags(searchParams.getAll("tag"));
  }, [searchParams]);

  // Fetch available tags from API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch("/api/blogs/filters");
        const result = await response.json();
        if (result.data?.tags) {
          setAvailableTags(result.data.tags);
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilters();
  }, []);

  function applyFilters(updates?: {
    search?: string;
    selectedPlatforms?: string[];
    selectedTags?: string[];
  }) {
    const params = new URLSearchParams();
    const s = updates?.search !== undefined ? updates.search : search;
    const p =
      updates?.selectedPlatforms !== undefined
        ? updates.selectedPlatforms
        : selectedPlatforms;
    const t =
      updates?.selectedTags !== undefined ? updates.selectedTags : selectedTags;
    if (s.trim()) params.set("search", s.trim());
    p.forEach((v) => params.append("platform", v));
    t.forEach((v) => params.append("tag", v));
    router.push(params.toString() ? `/blogs?${params.toString()}` : "/blogs");
  }

  const applyFiltersRef = useRef(applyFilters);
  applyFiltersRef.current = applyFilters;

  // Debounced auto-search when search input changes
  useEffect(() => {
    if (isFirstSearchRun.current) {
      isFirstSearchRun.current = false;
      return;
    }
    const timer = setTimeout(() => {
      applyFiltersRef.current();
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  function togglePlatform(platform: string) {
    const next = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((x) => x !== platform)
      : [...selectedPlatforms, platform];
    setSelectedPlatforms(next);
    applyFilters({ selectedPlatforms: next });
  }

  function toggleTag(tag: string) {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((x) => x !== tag)
      : [...selectedTags, tag];
    setSelectedTags(next);
    applyFilters({ selectedTags: next });
  }

  function clearFilters() {
    setSearch("");
    setSelectedPlatforms([]);
    setSelectedTags([]);
    setPlatformDropdownOpen(false);
    setTagDropdownOpen(false);
    router.push("/blogs");
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedPlatforms.length > 0 ||
    selectedTags.length > 0;

  return (
    <div className="flex flex-1 min-w-0 max-w-3xl flex-wrap items-center gap-3 z-10">
      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFiltersRef.current();
        }}
        className="min-w-[180px] flex-1"
      >
        <label htmlFor="search" className="sr-only">
          Search by title
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          className="neo-input w-full"
        />
      </form>

      {/* Platform multi-select dropdown */}
      <MultiSelectDropdown
        label="Filter by platform"
        options={PLATFORMS}
        selected={selectedPlatforms}
        onToggle={togglePlatform}
        placeholder="All platforms"
        dropdownRef={platformDropdownRef}
        isOpen={platformDropdownOpen}
        onOpenChange={setPlatformDropdownOpen}
        triggerId="platform-filter-label"
      />

      {/* Tags multi-select dropdown */}
      <MultiSelectDropdown
        label="Filter by tag"
        options={availableTags}
        selected={selectedTags}
        onToggle={toggleTag}
        placeholder="All tags"
        isLoading={availableTags.length === 0}
        dropdownRef={tagDropdownRef}
        isOpen={tagDropdownOpen}
        onOpenChange={setTagDropdownOpen}
        triggerId="tag-filter-label"
      />

      {/* Clear filters - only show when something is selected */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="neo-btn border-2 border-neo-black bg-neo-white px-4 py-2 text-sm font-black hover:bg-red-100"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
