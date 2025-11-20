import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  ExternalLink,
  Download,
  Search as SearchIcon,
  User,
  Tag,
  Sparkle,
  Eye,
} from "lucide-react";
import LeftSection from "./LeftSection";
import { useNavigate } from "react-router-dom";

const departments = [
  { id: 1, name: "Computer Science & Engineering", short_code: "CSE" },
  { id: 2, name: "Physics", short_code: "PHY" },
  { id: 3, name: "Chemistry", short_code: "CHE" },
  { id: 4, name: "Mathematics", short_code: "MAT" },
  { id: 5, name: "Electrical & Electronic Engineering", short_code: "EEE" },
  { id: 6, name: "Biology", short_code: "BIO" },
];
const MOCK_PAPERS = [
  {
    paper_id: "p1",
    title: "Predictive Modeling for Climate Change Mitigation",
    authors: ["Dr. John Doe", "Dr. Jane Smith"],
    publicationDate: "2024-10-10",
    pdfUrl: "/papers/climate-ml.pdf",
    keywords: ["Predictive Modeling", "Environmental Science", "Deep Learning"],
    abstract:
      "Climate change represents one of the most pressing challenges of our time, requiring accurate prediction models to inform policy decisions and mitigation strategies. This comprehensive review examines the application of machine learning approaches in climate change prediction, analyzing their effectiveness, limitations, and future potential.",
    primary_department: "Environmental Science",
    view_count: 1245,
    download_count: 432,
    citation_count: 28,
  },

  {
    paper_id: "p2",
    title: "Quantum Computing: A New Paradigm for Cryptography",
    authors: ["Prof. Kamal Hossain", "Dr. Fatima Khan"],
    publicationDate: "2024-09-22",
    pdfUrl: "/papers/quantum-crypto.pdf",
    keywords: ["Quantum Computing", "Cryptography"],
    primary_department: "Physics",
    abstract:
      "An in-depth study of quantum computing principles and their implications for modern cryptographic systems.",
    view_count: 892,
    download_count: 301,
    citation_count: 15,
  },

  {
    paper_id: "p3",
    title: "Neural Network Optimization Techniques for Real-Time Applications",
    authors: ["Dr. Sarah Ahmed", "Dr. Rahman"],
    publicationDate: "2024-08-30",
    pdfUrl: "/papers/neural-optimization.pdf",
    keywords: ["Neural Networks", "Optimization"],
    primary_department: "Computer Science",
    abstract:
      "A comprehensive review of optimization techniques for neural networks in real-time systems.",
    view_count: 2103,
    download_count: 789,
    citation_count: 42,
  },
];

const SearchBar = ({ value, onChange }) => (
  <div className="mb-6">
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="search"
        placeholder="Search papers by title, author, keyword, or department..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
  </div>
);

/* ---------------------
   PaperCard: single paper item
   --------------------- */
const PaperCard = ({ paper, onViewPaper }) => {
  const formatDate = (dateString) => {
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
    <Card className="hover:shadow-lg transition-all duration-300 border-green-200 ">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left side - Paper icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Middle - Paper details */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-bold text-gray-900 mb-2 hover:text-green-700 cursor-pointer line-clamp-2"
              onClick={() => onViewPaper(paper.paper_id)}
            >
              {paper.title}
            </h3>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {paper.abstract}
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
              <span className="font-medium">👤 {paper.authors}</span>
              <span className="text-gray-400">•</span>
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                {paper.primary_department}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Published: {formatDate(paper.publication_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{paper.view_count} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>{paper.download_count} downloads</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>{paper.citation_count} citations</span>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-400">
              Bookmarked on {formatDate(paper.bookmarked_at)}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex md:flex-col gap-2 flex-shrink-0">
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
              onClick={() => onViewPaper(paper.paper_id)}
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
        Add papers or connect to your backend.
      </div>
    </CardContent>
  </Card>
);

const NoResults = ({ q }) => (
  <Card className="border">
    <CardContent className="py-12 text-center">
      <div className="text-gray-700 mb-2">No papers found</div>
      <div className="text-gray-500">
        Try different filters or search for "{q}"
      </div>
    </CardContent>
  </Card>
);

export default function HomeSection() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Load mock data (replace with API)
  useEffect(() => {
    const t = setTimeout(() => {
      setPapers(MOCK_PAPERS);
      setLoading(false);
    }, 300);

    return () => clearTimeout(t);
  }, []);

  const availableKeywords = useMemo(() => {
    const s = new Set();
    papers.forEach((p) => p.keywords?.forEach((k) => s.add(k)));
    return Array.from(s);
  }, [papers]);

  console.log(departments);

  const availableAuthors = useMemo(() => {
    const s = new Set();
    papers.forEach((p) => p.authors?.forEach((a) => s.add(a)));
    return Array.from(s);
  }, [papers]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, query: searchInput }));
  }, [searchInput]);

  // Filtering + sorting (memoized)
  const filteredPapers = useMemo(() => {
    const q = (filters.query || "").trim().toLowerCase();
    let list = papers.slice();

    if (filters.author) {
      list = list.filter((p) => p.authors?.some((a) => a === filters.author));
    }

    if (filters.department) {
      list = list.filter((p) =>
        (p.primary_department || "")
          .toLowerCase()
          .includes(filters.department.toLowerCase())
      );
    }

    if (filters.keywords?.length) {
      list = list.filter((p) =>
        filters.keywords.every((kw) => p.keywords?.includes(kw))
      );
    }

    if (filters.publishedAfter) {
      const cutoff = new Date(filters.publishedAfter);
      list = list.filter((p) => new Date(p.publicationDate) >= cutoff);
    }

    if (q) {
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.abstract || "").toLowerCase().includes(q) ||
          (p.authors || []).join(", ").toLowerCase().includes(q) ||
          (p.keywords || []).some((k) => k.toLowerCase().includes(q))
      );
    }

    if (filters.sort === "newest") {
      list.sort(
        (a, b) => new Date(b.publicationDate) - new Date(a.publicationDate)
      );
    } else if (filters.sort === "popular") {
      list.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    }

    return list;
  }, [papers, filters]);

  // UI callbacks
  const clearFilters = () =>
    setFilters({
      query: "",
      author: "",
      department: "",
      keywords: [],
      publishedAfter: "",
      sort: "newest",
    });

  const handleViewPaper = (paper) => {
    // Replace with router navigation if you use router
    // e.g. router.push(`/papers/${paper.paper_id}`)
    // For now show simple details (or open a modal)
    // eslint-disable-next-line no-alert
    navigate(`/article/${paper}`);
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
          />
        </div>

        {/* Right content */}
        <div className="md:col-span-9">
          <div className="mb-4 flex items-center">
            <div className="w-full ">
              <SearchBar value={searchInput} onChange={setSearchInput} />
            </div>
          </div>

          {/* List */}
          <div className="space-y-4">
            {papers.length === 0 && <EmptyState />}

            {papers.length > 0 && filteredPapers.length === 0 && (
              <NoResults q={filters.query} />
            )}

            {filteredPapers.map((paper) => (
              <PaperCard
                key={paper.paper_id}
                paper={paper}
                onViewPaper={handleViewPaper}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
