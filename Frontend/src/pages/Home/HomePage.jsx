import React, { useEffect, useState } from "react";
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
  Bookmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getData } from "@/components/userContext";

const SearchBar = ({ searchData, setSearchData, onSearch, searching }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Search Papers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Title Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paper Title
          </label>
          <input
            type="text"
            placeholder="Enter paper title..."
            value={searchData.title}
            onChange={(e) =>
              setSearchData({ ...searchData, title: e.target.value })
            }
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Author Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author Name
          </label>
          <input
            type="text"
            placeholder="Enter author name..."
            value={searchData.author}
            onChange={(e) =>
              setSearchData({ ...searchData, author: e.target.value })
            }
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Department Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <input
            type="text"
            placeholder="Enter department..."
            value={searchData.department}
            onChange={(e) =>
              setSearchData({ ...searchData, department: e.target.value })
            }
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-end">
        <Button
          onClick={onSearch}
          disabled={searching}
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          <Search className="w-4 h-4 mr-2" />
          {searching ? "Searching..." : "Search"}
        </Button>
      </div>
    </div>
  );
};

const PaperCard = ({ paper, onViewPaper, onBookmark }) => {
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
    navigate(`/overview/${paper.paper_id}`);
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
            <Button
              onClick={() => onBookmark(paper.id || paper.paper_id)}
              disabled={paper.isBookmarked}
              className={`
                flex-1 md:flex-none text-white 
                ${
                  paper.isBookmarked
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }
              `}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              {paper.isBookmarked ? "Bookmarked" : "Add Bookmark"}
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

const NoResults = () => (
  <Card className="border">
    <CardContent className="py-12 text-center">
      <div className="text-gray-700 mb-2">No papers found</div>
      <div className="text-gray-500">
        Try different search criteria or check your filters.
      </div>
    </CardContent>
  </Card>
);

export default function HomeSection() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const { user } = getData();

  const [searchData, setSearchData] = useState({
    title: "",
    author: "",
    department: "",
  });

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
        setPapers(res.data.data);
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
  const handleSearch = async () => {
    try {
      setSearching(true);
      setHasSearched(true);
      const token = localStorage.getItem("accessToken");

      // Build search payload - only include non-empty fields
      const searchPayload = {};

      if (searchData.title.trim()) {
        searchPayload.title = searchData.title.trim();
      }

      if (searchData.author.trim()) {
        searchPayload.author = searchData.author.trim();
      }

      if (searchData.department.trim()) {
        searchPayload.department = searchData.department.trim();
      }

      // If no search criteria, don't search
      if (Object.keys(searchPayload).length === 0) {
        setSearching(false);
        return;
      }

      console.log("Search Payload:", searchPayload);

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

  const handleViewPaper = (paperId) => {
    navigate(`/paper/${paperId}`);
  };

  const handleBookmark = async (paperId) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/service/addbookmark`,
        {
          reg_no: user.reg_no,
          paper_id: paperId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Bookmark added successfully", res);
    } catch (error) {
      console.log("Bookmark not added", error);
    }
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
      <div className="max-w-7xl  mx-auto">
        {/* Search Section */}
        <SearchBar
          searchData={searchData}
          setSearchData={setSearchData}
          onSearch={handleSearch}
          searching={searching}
        />

        {/* Results count */}
        {hasSearched && (
          <div className="mb-4 text-sm text-gray-600">
            Found {papers.length} paper{papers.length !== 1 ? "s" : ""}
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

        {/* Papers List */}
        {!searching && (
          <div className="space-y-4">
            {!hasSearched && papers.length === 0 && <EmptyState />}

            {hasSearched && papers.length === 0 && <NoResults />}

            {papers.map((paper) => (
              <PaperCard
                key={paper.id || paper.paper_id}
                paper={paper}
                onViewPaper={handleViewPaper}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
