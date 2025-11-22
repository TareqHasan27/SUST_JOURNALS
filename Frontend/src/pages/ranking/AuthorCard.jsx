import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  Filter,
  X,
} from "lucide-react";
import { set } from "y";

const mockAuthors = [
  {
    reg_no: "2021831040",
    full_name: "Dr. Sarah Ahmed",
    university: "SUST",
    department: "Computer Science",
    profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    total_publications: 45,
    total_citations: 892,
    h_index: 18,
    i10_index: 25,
    research_interests: "Machine Learning, AI, Data Science",
  },
  {
    reg_no: "2020831025",
    full_name: "Prof. Mohammad Rahman",
    university: "SUST",
    department: "Physics",
    profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammad",
    total_publications: 67,
    total_citations: 1543,
    h_index: 28,
    i10_index: 45,
    research_interests: "Quantum Physics, Condensed Matter",
  },
  {
    reg_no: "2019831012",
    full_name: "Dr. Fatima Khan",
    university: "SUST",
    department: "Chemistry",
    profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    total_publications: 38,
    total_citations: 756,
    h_index: 16,
    i10_index: 22,
    research_interests: "Organic Chemistry, Drug Design",
  },
  {
    reg_no: "2021831055",
    full_name: "Ayesha Siddiqua",
    university: "SUST",
    department: "Mathematics",
    profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha",
    total_publications: 28,
    total_citations: 432,
    h_index: 12,
    i10_index: 15,
    research_interests: "Applied Mathematics, Statistics",
  },
  {
    reg_no: "2020831088",
    full_name: "Dr. Kamal Hossain",
    university: "SUST",
    department: "Electrical Engineering",
    profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kamal",
    total_publications: 52,
    total_citations: 1024,
    h_index: 22,
    i10_index: 34,
    research_interests: "Power Systems, Renewable Energy",
  },
  {
    reg_no: "2019831067",
    full_name: "Nusrat Jahan",
    university: "SUST",
    department: "Biology",
    profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nusrat",
    total_publications: 31,
    total_citations: 589,
    h_index: 14,
    i10_index: 18,
    research_interests: "Molecular Biology, Genetics",
  },
];

// Stats Cards Component
const StatsCards = ({ authors }) => {
  const stats = useMemo(
    () => ({
      totalAuthors: authors.length,
      totalPublications: authors.reduce(
        (sum, a) => sum + a.total_publications,
        0
      ),
      totalCitations: authors.reduce((sum, a) => sum + a.total_citations, 0),
      avgHIndex: (
        authors.reduce((sum, a) => sum + a.h_index, 0) / authors.length
      ).toFixed(1),
    }),
    [authors]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <Card className="border-green-200 hover:shadow-lg transition-shadow">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Authors</p>
              <p className="text-3xl font-bold text-green-700">
                {stats.totalAuthors}
              </p>
            </div>
            <Users className="w-10 h-10 text-green-600 opacity-70" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Total Publications
              </p>
              <p className="text-3xl font-bold text-green-700">
                {stats.totalPublications}
              </p>
            </div>
            <BookOpen className="w-10 h-10 text-green-600 opacity-70" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Total Citations
              </p>
              <p className="text-3xl font-bold text-green-700">
                {stats.totalCitations}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600 opacity-70" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Avg H-Index</p>
              <p className="text-3xl font-bold text-green-700">
                {stats.avgHIndex}
              </p>
            </div>
            <Award className="w-10 h-10 text-green-600 opacity-70" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Filter Component
const FilterSection = ({
  searchQuery,
  setSearchQuery,
  selectedDept,
  setSelectedDept,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  departments,
}) => (
  <Card className="mb-6 border-green-200">
    <CardContent className="pt-6">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, registration number, or research interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="h_index">H-Index (Highest)</option>
                <option value="citations">Citations (Most)</option>
                <option value="publications">Publications (Most)</option>
                <option value="i10_index">i10-Index (Highest)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Author Card Component
const AuthorCard = ({ author, rank, onViewProfile }) => {
  const rankColors = {
    1: "bg-yellow-100 border-yellow-400 text-yellow-800",
    2: "bg-gray-100 border-gray-400 text-gray-800",
    3: "bg-orange-100 border-orange-400 text-orange-800",
  };

  const getRankBadge = (rank) => {
    if (rank <= 3) {
      return (
        <div
          className={`absolute -top-3 -left-3 w-12 h-12 rounded-full border-4 ${rankColors[rank]} flex items-center justify-center font-bold text-xl shadow-lg`}
        >
          {rank}
        </div>
      );
    }
    return (
      <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full border-4 bg-green-100 border-green-400 text-green-800 flex items-center justify-center font-bold text-xl shadow-lg">
        {rank}
      </div>
    );
  };

  return (
    <Card
      className="relative hover:shadow-xl transition-all duration-300 border-green-200 cursor-pointer group"
      onClick={() => onViewProfile(author.reg_no)}
    >
      {getRankBadge(rank)}

      <CardContent className="pt-2">
        <div className="flex items-start gap-3">
          {/* Profile Image */}
          <img
            src={author.profile_url}
            alt={author.full_name}
            className="w-20 h-20 rounded-full border-4 border-green-100 group-hover:border-green-300 transition-colors"
          />

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors truncate">
              {author.full_name}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{author.department}</p>
            <p className="text-xs text-gray-500 mb-2">Reg: {author.reg_no}</p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {author.research_interests}
            </p>
          </div>
          <Button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onViewProfile(author.reg_no)}
          >
            View Profile
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-3 mt-4 pt-2 border-t border-green-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">
              {author.total_publications}
            </p>
            <p className="text-xs text-gray-600">Publications</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">
              {author.total_citations}
            </p>
            <p className="text-xs text-gray-600">Citations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">
              {author.h_index}
            </p>
            <p className="text-xs text-gray-600">H-Index</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">
              {author.i10_index}
            </p>
            <p className="text-xs text-gray-600">i10-Index</p>
          </div>
        </div>

        {/* View Profile Button */}
      </CardContent>
    </Card>
  );
};

// Main Component
const AuthorRankingSystem = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [sortBy, setSortBy] = useState("h_index");
  const [showFilters, setShowFilters] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchAllAuthors = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/service/rank");
        setAuthors(res.data);
        setDepartments([...new Set(res.data.map((a) => a.department_name))]);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      }
    };
    fetchAllAuthors();
  }, []);

  const filteredAndSortedAuthors = useMemo(() => {
    let filtered = authors;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (author) =>
          author.full_name.toLowerCase().includes(query) ||
          author.reg_no.toLowerCase().includes(query) ||
          author.research_interests.toLowerCase().includes(query) ||
          author.department.toLowerCase().includes(query)
      );
    }

    // Filter by department
    if (selectedDept !== "All Departments") {
      filtered = filtered.filter(
        (author) => author.department === selectedDept
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "citations":
          return b.total_citations - a.total_citations;
        case "publications":
          return b.total_publications - a.total_publications;
        case "i10_index":
          return b.i10_index - a.i10_index;
        case "h_index":
        default:
          return b.h_index - a.h_index;
      }
    });

    return filtered;
  }, [searchQuery, selectedDept, sortBy]);

  const handleViewProfile = (reg_no) => {};

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <StatsCards authors={authors} />
        <FilterSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          departments={departments}
        />
        <div className="mb-4 w-full  mx-auto">
          <p className="text-gray-700 font-medium">
            Showing{" "}
            <span className="text-green-700 font-bold">
              {filteredAndSortedAuthors.length}
            </span>{" "}
            authors
          </p>
        </div>

        {/* Author Cards Grid */}
        {filteredAndSortedAuthors.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 w-full  mx-auto">
            {filteredAndSortedAuthors.map((author, index) => (
              <AuthorCard
                key={author.reg_no}
                author={author}
                rank={index + 1}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        ) : (
          <Card className="border-green-200">
            <CardContent className="py-16 text-center">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No authors found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuthorRankingSystem;
