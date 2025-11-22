import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  ExternalLink,
  Download,
  Search,
  Eye,
  Sparkle,
  X,
} from "lucide-react";
import LeftSection from "./LeftSection";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const departments = [
  { id: 1, name: "Computer Science & Engineering", short_code: "CSE" },
  { id: 2, name: "Physics", short_code: "PHY" },
  { id: 3, name: "Chemistry", short_code: "CHE" },
  { id: 4, name: "Mathematics", short_code: "MAT" },
  { id: 5, name: "Electrical & Electronic Engineering", short_code: "EEE" },
  { id: 6, name: "Biology", short_code: "BIO" },
];

const SearchBar = ({ value, onChange, onSearch, onClear }) => (
  <div className="mb-6">
    <div className="relative flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="search"
          placeholder="Search papers by title, author, or keyword..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSearch()}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <Button
        onClick={onSearch}
        className="bg-green-600 hover:bg-green-700 text-white px-6"
      >
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  </div>
);

const PaperCard = ({ paper, onViewPaper }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const navigate = useNavigate();

  const handleAiOverview = () => {
    navigate(`/overview/${paper.id || paper.paper_id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left side - Paper icon */}
          <div className="shrink-0">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Middle - Paper details */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-bold text-gray-900 mb-2 hover:text-green-700 cursor-pointer line-clamp-2"
              onClick={() => onViewPaper(paper.id || paper.paper_id)}
            >
              {paper.title}
            </h3>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {paper.abstract}
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
              <span className="font-medium">
                👤{" "}
                {Array.isArray(paper.authors)
                  ? paper.authors.join(", ")
                  : paper.authors}
              </span>
              <span className="text-gray-400">•</span>
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                {paper.department_name || paper.primary_department}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Published: {formatDate(paper.publication_date)}</span>
              </div>
              {paper.view_count !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{paper.view_count} views</span>
                </div>
              )}
              {paper.download_count !== undefined && (
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>{paper.download_count} downloads</span>
                </div>
              )}
              {paper.citation_count !== undefined && (
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>{paper.citation_count} citations</span>
                </div>
              )}
            </div>

            {paper.bookmarked_at && (
              <div className="mt-2 text-xs text-gray-400">
                Bookmarked on {formatDate(paper.bookmarked_at)}
              </div>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex md:flex-col gap-2 shrink-0">
            <Button
              onClick={handleAiOverview}
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <Sparkle className="w-4 h-4 mr-1" />
              AI Overview
            </Button>
            <Button
              onClick={() => onViewPaper(paper.id || paper.paper_id)}
              className="bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-none"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Paper
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState = () => (
  <Card className="border">
    <CardContent className="py-12 text-center">
      <div className="text-gray-600 mb-4">No papers available yet.</div>
      <div className="text-sm text-gray-500">
        Use the search bar to find papers.
      </div>
    </CardContent>
  </Card>
);

const NoResults = ({ q }) => (
  <Card className="border">
    <CardContent className="py-12 text-center">
      <div className="text-gray-700 mb-2">No papers found</div>
      <div className="text-gray-500">
        {q
          ? `No results for "${q}". Try different keywords.`
          : "Try searching for papers."}
      </div>
    </CardContent>
  </Card>
);

export default function HomeSection() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    query: "",
    author: "",
    department: "",
    keywords: [],
    publishedAfter: "",
    sort: "newest",
  });
  const [searchInput, setSearchInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Initial load of recommended papers
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          "http://localhost:4000/api/service/recommendedPapers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setPapers(res.data);
        console.log("papers info", papers);
      } catch (error) {
        console.error("Error fetching recommended papers:", error);
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // Search papers from backend
  const searchPapers = async () => {
    try {
      setSearching(true);
      setHasSearched(true);
      const token = localStorage.getItem("accessToken");

      // Build search payload
      const searchPayload = {};

      if (searchInput.trim()) {
        // Use searchInput as title/keyword search
        searchPayload.title = searchInput.trim();
      }

      if (filters.author) {
        searchPayload.author = filters.author;
      }

      // If no search criteria, don't search
      if (!searchPayload.title && !searchPayload.author) {
        setSearching(false);
        return;
      }

      const res = await axios.post(
        "http://localhost:4000/api/service/searchpublishedpaper",
        searchPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPapers(res.data.papers || []);
    } catch (error) {
      console.error("Error searching papers:", error);
      setPapers([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = () => {
    searchPapers();
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setHasSearched(false);
    // Reload recommended papers
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        const res = await axios.get(
          "http://localhost:4000/api/service/recomandedpapers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setPapers(res.data);
      } catch (error) {
        console.error("Error fetching recommended papers:", error);
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  };

  const availableKeywords = useMemo(() => {
    const s = new Set();
    papers.forEach((p) => p.keywords?.forEach((k) => s.add(k)));
    return Array.from(s);
  }, [papers]);

  const availableAuthors = useMemo(() => {
    const s = new Set();
    papers.forEach((p) => {
      if (Array.isArray(p.authors)) {
        p.authors.forEach((a) => s.add(a));
      }
    });
    return Array.from(s);
  }, [papers]);

  // Frontend filtering for department, keywords, publishedAfter, and sort
  const filteredPapers = useMemo(() => {
    let list = papers.slice();

    // Filter by department
    if (filters.department) {
      list = list.filter((p) =>
        (p.department_name || p.primary_department || "")
          .toLowerCase()
          .includes(filters.department.toLowerCase())
      );
    }

    // Filter by keywords (frontend only, as backend doesn't support yet)
    if (filters.keywords?.length) {
      list = list.filter((p) =>
        filters.keywords.every((kw) => p.keywords?.includes(kw))
      );
    }

    // Filter by publishedAfter
    if (filters.publishedAfter) {
      const cutoff = new Date(filters.publishedAfter);
      list = list.filter((p) => {
        if (!p.publication_date) return false;
        return new Date(p.publication_date) >= cutoff;
      });
    }

    // Sort
    if (filters.sort === "newest") {
      list.sort((a, b) => {
        const dateA = new Date(a.publication_date || 0);
        const dateB = new Date(b.publication_date || 0);
        return dateB - dateA;
      });
    } else if (filters.sort === "popular") {
      list.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    }

    return list;
  }, [papers, filters]);

  const clearFilters = () => {
    setFilters({
      query: "",
      author: "",
      department: "",
      keywords: [],
      publishedAfter: "",
      sort: "newest",
    });
    setSearchInput("");
    handleClearSearch();
  };

  const handleViewPaper = (paperId) => {
    navigate(`/article/${paperId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading papers...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left filters */}
        <div className="md:col-span-3">
          <LeftSection
            filters={filters}
            setFilters={setFilters}
            availableKeywords={availableKeywords}
            availableAuthors={availableAuthors}
            availableDepartments={departments}
            clearFilters={clearFilters}
            onSearch={searchPapers}
          />
        </div>

        {/* Right content */}
        <div className="md:col-span-9">
          <div className="mb-4">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSearch={handleSearch}
              onClear={handleClearSearch}
            />
          </div>

          {/* Results count */}
          {hasSearched && (
            <div className="mb-4 text-sm text-gray-600">
              Found {filteredPapers.length} paper
              {filteredPapers.length !== 1 ? "s" : ""}
            </div>
          )}

          {/* Loading state */}
          {searching && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-600">Searching...</p>
              </div>
            </div>
          )}

          {/* List */}
          {!searching && (
            <div className="space-y-4">
              {!hasSearched && papers.length === 0 && <EmptyState />}

              {hasSearched && filteredPapers.length === 0 && (
                <NoResults q={searchInput} />
              )}

              {filteredPapers.map((paper) => (
                <PaperCard
                  key={paper.id || paper.paper_id}
                  paper={paper}
                  onViewPaper={handleViewPaper}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
