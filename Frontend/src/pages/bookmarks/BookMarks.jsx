import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkX, Calendar, Eye, Download, FileText, Search, Trash2, ExternalLink, Sparkle } from 'lucide-react';

// Mock data - Replace with actual API call
const mockBookmarkedPapers = [
  {
    paper_id: 1,
    title: "Machine Learning Applications in Climate Change Prediction",
    abstract: "This paper explores the use of advanced machine learning algorithms to predict climate patterns and environmental changes. We present a comprehensive analysis of various ML models and their effectiveness in forecasting long-term climate trends.",
    authors: "Dr. Sarah Ahmed, Prof. Mohammad Rahman",
    primary_department: "Computer Science",
    publication_date: "2024-10-15",
    view_count: 1245,
    download_count: 432,
    citation_count: 28,
    bookmarked_at: "2024-11-10",
    pdf_url: "/papers/ml-climate-prediction.pdf"
  },
  {
    paper_id: 2,
    title: "Quantum Computing: A New Paradigm for Cryptography",
    abstract: "An in-depth study of quantum computing principles and their implications for modern cryptographic systems. This research examines post-quantum cryptography methods and their implementation strategies.",
    authors: "Prof. Kamal Hossain, Dr. Fatima Khan",
    primary_department: "Physics",
    publication_date: "2024-09-22",
    view_count: 892,
    download_count: 301,
    citation_count: 15,
    bookmarked_at: "2024-11-05",
    pdf_url: "/papers/quantum-crypto.pdf"
  },
  {
    paper_id: 3,
    title: "Sustainable Urban Development Through Green Infrastructure",
    abstract: "This study investigates the role of green infrastructure in promoting sustainable urban development. We analyze case studies from multiple cities and propose a framework for implementing eco-friendly urban planning strategies.",
    authors: "Nusrat Jahan, Ayesha Siddiqua",
    primary_department: "Environmental Science",
    publication_date: "2024-11-01",
    view_count: 567,
    download_count: 189,
    citation_count: 8,
    bookmarked_at: "2024-11-12",
    pdf_url: "/papers/sustainable-urban.pdf"
  },
  {
    paper_id: 4,
    title: "Neural Network Optimization Techniques for Real-Time Applications",
    abstract: "A comprehensive review of optimization techniques for neural networks in real-time systems. We present novel approaches to reduce computational complexity while maintaining accuracy.",
    authors: "Dr. Sarah Ahmed, Dr. Rahman",
    primary_department: "Computer Science",
    publication_date: "2024-08-30",
    view_count: 2103,
    download_count: 789,
    citation_count: 42,
    bookmarked_at: "2024-10-28",
    pdf_url: "/papers/neural-optimization.pdf"
  }
];


// Search Component
const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="mb-6">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search bookmarked papers by title, author, or department..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
  </div>
);

// Paper Card Component
const PaperCard = ({ paper, onRemoveBookmark, onViewPaper }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e) => {
    e.stopPropagation();
    setIsRemoving(true);
    await onRemoveBookmark(paper.paper_id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 border-green-200 ${isRemoving ? 'opacity-50' : ''}`}>
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
            <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-green-700 cursor-pointer line-clamp-2"
                onClick={() => onViewPaper(paper.paper_id)}>
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
            onClick={() => navigate(`/ai-chat/${paper.paper_id}`)}
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
            <Button
              onClick={handleRemove}
              variant="outline"
              className="border-red-300 text-red-500 hover:bg-red-50 flex-1 md:flex-none"
              disabled={isRemoving}
            >
              <BookmarkX className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Empty State Component
const EmptyState = () => (
  <Card className="border-green-200">
    <CardContent className="py-16 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Bookmark className="w-12 h-12 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookmarks yet</h3>
      <p className="text-gray-600 mb-4">Start exploring papers and bookmark the ones you want to read later</p>
      <Button 
        onClick={() => window.location.href = '/papers'}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        Browse Papers
      </Button>
    </CardContent>
  </Card>
);

// No Results Component
const NoResults = ({ searchQuery }) => (
  <Card className="border-green-200">
    <CardContent className="py-12 text-center">
      <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No papers found</h3>
      <p className="text-gray-600">
        No bookmarked papers match "<span className="font-semibold">{searchQuery}</span>"
      </p>
    </CardContent>
  </Card>
);

// Main Component
const BookmarkSection = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch bookmarks on mount
  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Filter bookmarks when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBookmarks(bookmarks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = bookmarks.filter(paper =>
        paper.title.toLowerCase().includes(query) ||
        paper.authors.toLowerCase().includes(query) ||
        paper.primary_department.toLowerCase().includes(query) ||
        paper.abstract.toLowerCase().includes(query)
      );
      setFilteredBookmarks(filtered);
    }
  }, [searchQuery, bookmarks]);

  const fetchBookmarks = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch('/api/bookmarks');
      // const data = await response.json();
      
      // Simulating API call
      setTimeout(() => {
        setBookmarks(mockBookmarkedPapers);
        setFilteredBookmarks(mockBookmarkedPapers);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (paperId) => {
    try {
      // Replace with actual API call
      // await fetch(`/api/bookmarks/${paperId}`, { method: 'DELETE' });
      
      // Simulating API call
      setTimeout(() => {
        setBookmarks(prev => prev.filter(p => p.paper_id !== paperId));
      }, 300);
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const handleViewPaper = (paperId) => {
    // Navigate to paper detail page
    console.log('Navigating to paper:', paperId);
    // In real app: window.location.href = `/papers/${paperId}` or use Next.js router
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your bookmarks...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-5xl mx-auto">

        {bookmarks.length > 0 && (
          <>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            
            {/* Results count */}
            {searchQuery && (
              <div className="mb-4">
                <p className="text-gray-700">
                  Found <span className="font-bold text-green-700">{filteredBookmarks.length}</span> result{filteredBookmarks.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </>
        )}

        {/* Paper List */}
        {bookmarks.length === 0 ? (
          <EmptyState />
        ) : filteredBookmarks.length === 0 ? (
          <NoResults searchQuery={searchQuery} />
        ) : (
          <div className="space-y-4">
            {filteredBookmarks.map((paper) => (
              <PaperCard
                key={paper.paper_id}
                paper={paper}
                onRemoveBookmark={handleRemoveBookmark}
                onViewPaper={handleViewPaper}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkSection;