"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaCheck, FaFilter, FaSearch, FaTimes } from "react-icons/fa";

export default function BlogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Filter data from API
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([
    "Medium",
    "Dev.to",
    "Hashnode",
    "Personal Blog",
    "Other",
  ]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search states for dropdowns
  const [platformSearch, setPlatformSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    searchParams.getAll("platform")
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.getAll("tag")
  );
  const [sort, setSort] = useState<"asc" | "desc">(
    (searchParams.get("sort") as "asc" | "desc") || "desc"
  );
  const [limit, setLimit] = useState<number>(
    parseInt(searchParams.get("limit") || "10")
  );

  // Fetch available platforms and tags from API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/blogs/filters");
        const result = await response.json();

        if (result.data) {
          setAvailableTags(result.data.tags || []);
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  function applyFilters() {
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

    // Add sort parameter (only if not default)
    if (sort !== "desc") {
      params.set("sort", sort);
    }

    // Add limit parameter (only if not default)
    if (limit !== 10) {
      params.set("limit", limit.toString());
    }

    const queryString = params.toString();
    router.push(queryString ? `/blogs?${queryString}` : "/blogs");

    // Close the sidebar after applying filters
    setIsOpen(false);
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
    setSort("desc");
    setLimit(10);
    setPlatformSearch("");
    setTagSearch("");
    router.push("/blogs");
    setIsOpen(false);
  }

  function selectAllPlatforms() {
    setSelectedPlatforms([...availablePlatforms]);
  }

  function clearAllPlatforms() {
    setSelectedPlatforms([]);
  }

  function selectAllTags() {
    setSelectedTags([...availableTags]);
  }

  function clearAllTags() {
    setSelectedTags([]);
  }

  const hasActiveFilters =
    search ||
    selectedPlatforms.length > 0 ||
    selectedTags.length > 0 ||
    sort !== "desc" ||
    limit !== 10;

  const activeFilterCount =
    (search ? 1 : 0) +
    selectedPlatforms.length +
    selectedTags.length +
    (sort !== "desc" ? 1 : 0) +
    (limit !== 10 ? 1 : 0);

  // Filter platforms based on search
  const filteredPlatforms = availablePlatforms.filter((platform) =>
    platform.toLowerCase().includes(platformSearch.toLowerCase())
  );

  // Filter tags based on search
  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="neo-btn bg-neo-white hover:bg-neo-yellow px-6 py-3 flex items-center gap-2 relative"
      >
        <span className="text-xl">
          <FaFilter />
        </span>
        <span className="font-black">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-neo-yellow border-2 border-neo-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Filter Sidebar */}
          <div
            className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-neo-white border-l-3 border-neo-black z-50"
            style={{ maxHeight: "100vh" }}
          >
            <div
              className="h-full overflow-y-scroll overscroll-contain p-6 space-y-6"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="neo-btn bg-neo-gray hover:bg-red-100 px-4 py-2 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Active Filters Count */}
              {hasActiveFilters && (
                <div className="bg-neo-yellow border-3 border-neo-black p-3">
                  <p className="font-black text-sm">
                    {activeFilterCount} Active Filter
                    {activeFilterCount > 1 ? "s" : ""}
                  </p>
                </div>
              )}

              {/* Search Bar */}
              <div>
                <label
                  htmlFor="search"
                  className="block font-black text-sm mb-2"
                >
                  <div className="flex items-center gap-2">
                    <FaSearch className="w-4 h-4" />
                    <span className="text-sm">Search by title</span>
                  </div>
                </label>
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title..."
                  className="neo-input w-full"
                />
              </div>

              {/* Platform Filters */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-black text-sm">
                    Platform ({selectedPlatforms.length} selected)
                  </label>
                  <div className="flex gap-1">
                    <button
                      onClick={selectAllPlatforms}
                      className="text-xs font-bold text-neo-gray-dark hover:text-neo-black"
                    >
                      All
                    </button>
                    <span className="text-xs">|</span>
                    <button
                      onClick={clearAllPlatforms}
                      className="text-xs font-bold text-neo-gray-dark hover:text-neo-black"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Platform Search */}
                <input
                  type="text"
                  value={platformSearch}
                  onChange={(e) => setPlatformSearch(e.target.value)}
                  placeholder="Search platforms"
                  className="neo-input w-full mb-2 text-sm"
                />

                {/* Platform List */}
                <div className="border-3 border-neo-black bg-neo-white max-h-40 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-3 text-center text-sm font-bold text-neo-gray-dark">
                      Loading...
                    </div>
                  ) : filteredPlatforms.length > 0 ? (
                    filteredPlatforms.map((platform) => (
                      <label
                        key={platform}
                        className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-neo-gray transition-colors border-b-2 border-neo-black last:border-b-0 ${
                          selectedPlatforms.includes(platform)
                            ? "bg-neo-yellow"
                            : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPlatforms.includes(platform)}
                          onChange={() => togglePlatform(platform)}
                          className="w-4 h-4 border-2 border-neo-black"
                        />
                        <span className="text-sm font-bold">{platform}</span>
                      </label>
                    ))
                  ) : (
                    <div className="p-3 text-center text-sm font-bold text-neo-gray-dark">
                      No platforms found
                    </div>
                  )}
                </div>

                {/* Selected Platforms */}
                {selectedPlatforms.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedPlatforms.map((platform) => (
                      <span
                        key={platform}
                        className="bg-neo-yellow border-2 border-neo-black px-2 py-1 text-xs font-bold flex items-center gap-1"
                      >
                        {platform}
                        <button
                          onClick={() => togglePlatform(platform)}
                          className="hover:text-red-600"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tag Filters */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-black text-sm">
                    Tags ({selectedTags.length} selected)
                  </label>
                  <div className="flex gap-1">
                    <button
                      onClick={selectAllTags}
                      className="text-xs font-bold text-neo-gray-dark hover:text-neo-black"
                    >
                      All
                    </button>
                    <span className="text-xs">|</span>
                    <button
                      onClick={clearAllTags}
                      className="text-xs font-bold text-neo-gray-dark hover:text-neo-black"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Tag Search */}
                <input
                  type="text"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder="Search tags"
                  className="neo-input w-full mb-2 text-sm"
                />

                {/* Tag List */}
                <div className="border-4 border-neo-black bg-neo-white max-h-40 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-3 text-center text-sm font-bold text-neo-gray-dark">
                      Loading...
                    </div>
                  ) : filteredTags.length > 0 ? (
                    filteredTags.map((tag) => (
                      <label
                        key={tag}
                        className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-neo-gray transition-colors border-b-2 border-neo-black last:border-b-0 ${
                          selectedTags.includes(tag) ? "bg-neo-yellow" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag)}
                          onChange={() => toggleTag(tag)}
                          className="w-4 h-4 border-2 border-neo-black"
                        />
                        <span className="text-sm font-bold">{tag}</span>
                      </label>
                    ))
                  ) : (
                    <div className="p-3 text-center text-sm font-bold text-neo-gray-dark">
                      No tags found
                    </div>
                  )}
                </div>

                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-neo-yellow border-2 border-neo-black px-2 py-1 text-xs font-bold flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => toggleTag(tag)}
                          className="hover:text-red-600"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort & Limit in Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Sort Order */}
                <div>
                  <label
                    htmlFor="sort"
                    className="block font-black text-sm mb-2"
                  >
                    Sort
                  </label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as "asc" | "desc")}
                    className="neo-input w-full text-sm"
                  >
                    <option value="desc">Newest</option>
                    <option value="asc">Oldest</option>
                  </select>
                </div>

                {/* Results Per Page */}
                <div>
                  <label
                    htmlFor="limit"
                    className="block font-black text-sm mb-2"
                  >
                    Show
                  </label>
                  <select
                    id="limit"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                    className="neo-input w-full text-sm"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t-4 border-neo-black">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="neo-btn bg-red-100 hover:bg-red-200 w-full py-3 font-black"
                  >
                    <div className="flex items-center gap-2">
                      <FaTimes />
                      <span className="text-sm">Clear All Filters</span>
                    </div>
                  </button>
                )}
                <button
                  onClick={applyFilters}
                  className="neo-btn bg-neo-yellow hover:bg-neo-white w-full py-3 font-black"
                >
                  <div className="flex items-center gap-2">
                    {" "}
                    <FaCheck />
                    <span className="text-sm">Apply Filters</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
