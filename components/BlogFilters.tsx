"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface BlogFiltersProps {
  availablePlatforms: string[];
  availableTags: string[];
}

export default function BlogFilters({
  availablePlatforms,
  availableTags,
}: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    searchParams.getAll("platform")
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.getAll("tag")
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Update URL when filters change
  useEffect(() => {
    updateURL();
  }, [selectedPlatforms, selectedTags]);

  function updateURL() {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    selectedPlatforms.forEach((platform) => {
      params.append("platform", platform);
    });

    selectedTags.forEach((tag) => {
      params.append("tag", tag);
    });

    const queryString = params.toString();
    router.push(queryString ? `/blogs?${queryString}` : "/blogs");
  }

  function togglePlatform(platform: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function clearFilters() {
    setSearch("");
    setSelectedPlatforms([]);
    setSelectedTags([]);
    router.push("/blogs");
  }

  const hasActiveFilters =
    search || selectedPlatforms.length > 0 || selectedTags.length > 0;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div>
        <label htmlFor="search" className="block font-black text-lg mb-2">
          Search Blogs
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          className="neo-input"
        />
      </div>

      {/* Platform Filters */}
      {availablePlatforms.length > 0 && (
        <div>
          <label className="block font-black text-lg mb-3">Platform</label>
          <div className="flex flex-wrap gap-3">
            {availablePlatforms.map((platform) => (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`neo-btn text-sm px-4 py-2 ${
                  selectedPlatforms.includes(platform)
                    ? "bg-neo-yellow"
                    : "bg-neo-white"
                }`}
              >
                {selectedPlatforms.includes(platform) && "✓ "}
                {platform}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tag Filters */}
      {availableTags.length > 0 && (
        <div>
          <label className="block font-black text-lg mb-3">Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`border-4 border-neo-black px-3 py-1 text-sm font-bold transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-neo-yellow"
                    : "bg-neo-white hover:bg-neo-gray"
                }`}
              >
                {selectedTags.includes(tag) && "✓ "}
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div>
          <button
            onClick={clearFilters}
            className="neo-btn bg-red-100 hover:bg-red-200 text-sm px-4 py-2"
          >
            ✕ Clear All Filters
          </button>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="border-4 border-neo-black bg-neo-gray p-4">
          <p className="font-black text-sm mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2 text-sm font-bold">
            {search && (
              <span className="bg-neo-white border-2 border-neo-black px-2 py-1">
                Search: "{search}"
              </span>
            )}
            {selectedPlatforms.map((platform) => (
              <span
                key={platform}
                className="bg-neo-white border-2 border-neo-black px-2 py-1"
              >
                Platform: {platform}
              </span>
            ))}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="bg-neo-white border-2 border-neo-black px-2 py-1"
              >
                Tag: {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
