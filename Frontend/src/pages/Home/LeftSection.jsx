import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Tag, X } from "lucide-react";

export default function LeftSection({
  filters,
  setFilters,
  availableKeywords = [],
  availableAuthors = [],
  availableDepartments = [],
  clearFilters,
}) {
  const toggleKeyword = (kw) => {
    setFilters((prev) => {
      const set = new Set(prev.keywords || []);
      if (set.has(kw)) set.delete(kw);
      else set.add(kw);
      return { ...prev, keywords: Array.from(set) };
    });
  };

  console.log("Available Departments:", availableDepartments);

  return (
    <aside className="w-full md:w-72 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          onClick={clearFilters}
          type="button"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600">
          Title / Keyword
        </label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            value={filters.query || ""}
            onChange={(e) =>
              setFilters((p) => ({ ...p, query: e.target.value }))
            }
            className="w-full pl-10 pr-3 py-2 border rounded-md"
            placeholder="Search title or abstract"
            type="search"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600">Author</label>
        <select
          value={filters.author || ""}
          onChange={(e) =>
            setFilters((p) => ({ ...p, author: e.target.value }))
          }
          className="w-full mt-2 py-2 border rounded-md"
        >
          <option value="">Any</option>
          {availableAuthors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600">Department</label>
        <select
          value={filters.depertment || ""}
          onChange={(e) =>
            setFilters((p) => ({ ...p, depertment: e.target.value }))
          }
          className="w-full mt-2 py-2 border rounded-md"
        >
          <option value="">Any</option>
          {availableDepartments.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600">Keywords</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {availableKeywords.map((kw) => {
            const active = (filters.keywords || []).includes(kw);
            return (
              <button
                key={kw}
                onClick={() => toggleKeyword(kw)}
                type="button"
                className={`px-2 py-1 text-sm rounded-md border ${
                  active ? "bg-green-600 text-white" : "bg-gray-50"
                }`}
              >
                <Tag className="w-3 h-3 inline-block mr-1" />
                {kw}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600">
          Published after
        </label>
        <input
          type="date"
          value={filters.publishedAfter || ""}
          onChange={(e) =>
            setFilters((p) => ({ ...p, publishedAfter: e.target.value }))
          }
          className="w-full mt-2 py-2 border rounded-md"
        />
      </div>

      <div className="flex gap-2">
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setFilters((p) => ({ ...(p || {}), sort: "newest" }))}
        >
          Newest
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setFilters((p) => ({ ...(p || {}), sort: "popular" }))}
        >
          Popular
        </Button>
      </div>
    </aside>
  );
}
