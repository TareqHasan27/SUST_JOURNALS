import React, { useState, useEffect } from "react";
import {
  FileText,
  Hash,
  BookOpen,
  FileDown,
  AlertCircle,
  Loader2,
} from "lucide-react";
import AdminPDFViewer from "../Common/AdminPDFViewer.jsx";
import axios from "axios";
import { useParams } from "react-router-dom";

const ResearchPaperDisplay = () => {
  const [activeSection, setActiveSection] = useState("abstract");
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { paperId } = useParams();

  console.log("paper id", paperId);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `http://localhost:4000/api/service/paper/${paperId}`
        );
        setPaper(res.data.paper);
      } catch (error) {
        console.log("error occurred", error);
        setError(
          error.response?.data?.error ||
            "Failed to load paper. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [paperId]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["abstract", "keywords", "pdf-document", "references"];
      const scrollPosition = window.scrollY + 150;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading paper...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-8 h-8" />
            <h2 className="text-xl font-bold">Error Loading Paper</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No paper found
  if (!paper) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Paper not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-white border-b border-green-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Journal Article Viewer
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar Navigation */}
          <aside className="w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => scrollToSection("abstract")}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    activeSection === "abstract"
                      ? "bg-green-50 text-green-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Abstract
                </button>

                <button
                  onClick={() => scrollToSection("keywords")}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    activeSection === "keywords"
                      ? "bg-green-50 text-green-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  Keywords
                </button>

                <button
                  onClick={() => scrollToSection("pdf-document")}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    activeSection === "pdf-document"
                      ? "bg-green-50 text-green-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  PDF Document
                </button>

                {paper.references && paper.references.length > 0 && (
                  <button
                    onClick={() => scrollToSection("references")}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                      activeSection === "references"
                        ? "bg-green-50 text-green-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    References
                  </button>
                )}
              </nav>

              {/* Download Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <FileDown className="w-4 h-4" />
                  Download PDF
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
            {/* Paper Title and Metadata */}
            <article>
              <header className="mb-8 pb-6 border-b border-gray-200">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {paper.title}
                </h1>

                <div className="space-y-2 text-gray-600">
                  {paper.authors && paper.authors.length > 0 && (
                    <p className="text-lg">{paper.authors.join(", ")}</p>
                  )}
                  {paper.department && (
                    <p className="text-sm">
                      {paper.department}
                      {paper.departmentCode && ` (${paper.departmentCode})`}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm pt-2">
                    {paper.publicationDate && (
                      <span className="flex items-center gap-1">
                        <strong>Published:</strong> {paper.publicationDate}
                      </span>
                    )}
                    {paper.status && (
                      <span className="flex items-center gap-1">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            paper.status === "published"
                              ? "bg-green-100 text-green-800"
                              : paper.status === "draft"
                              ? "bg-gray-100 text-gray-800"
                              : paper.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {paper.status.charAt(0).toUpperCase() +
                            paper.status.slice(1)}
                        </span>
                      </span>
                    )}
                  </div>
                  {paper.metrics && (
                    <div className="flex flex-wrap gap-4 text-sm pt-2">
                      <span className="flex items-center gap-1">
                        <strong>Citations:</strong>{" "}
                        {paper.metrics.citationCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <strong>Downloads:</strong>{" "}
                        {paper.metrics.downloadCount}
                      </span>
                    </div>
                  )}
                </div>
              </header>

              {/* Abstract Section */}
              <section id="abstract" className="mb-10 scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Abstract
                </h2>
                <div className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg border border-gray-200">
                  {paper.abstract || "No abstract available."}
                </div>
              </section>

              {/* Keywords Section */}
              {paper.keywords && paper.keywords.length > 0 && (
                <section id="keywords" className="mb-10 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Keywords
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {paper.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* PDF Document Section */}
              {paper.pdfUrl && <AdminPDFViewer pdfUrl={paper.pdfUrl} />}

              {/* References Section */}
              {paper.references && paper.references.length > 0 && (
                <section id="references" className="mb-10 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    References
                  </h2>
                  <div className="space-y-4">
                    {paper.references.map((reference, index) => (
                      <div
                        key={reference.id}
                        className="text-gray-700 leading-relaxed pl-6 relative bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <span className="absolute left-2 top-4 text-gray-500 font-medium">
                          [{index + 1}]
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">
                            {reference.authorName}
                          </p>
                          <p className="text-gray-700 mt-1">
                            {reference.title}
                          </p>
                          {reference.pdfUrl && (
                            <a
                              href={reference.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 text-sm mt-2 inline-flex items-center gap-1"
                            >
                              <FileDown className="w-3 h-3" />
                              View PDF
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResearchPaperDisplay;
