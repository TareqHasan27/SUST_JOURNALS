import React, { useState, useEffect } from 'react';
import { FileText, Hash, BookOpen, FileDown, ZoomIn, ZoomOut } from 'lucide-react';
import mockPaperData from './PaperData.js';
import AdminPDFViewer from '../Common/AdminPDFViewer.jsx';

const ResearchPaperDisplay = () => {
  const [activeSection, setActiveSection] = useState('abstract');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['abstract', 'keywords', 'pdf-document', 'references'];
      const scrollPosition = window.scrollY + 150;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="bg-white border-b border-green-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-900">Journal Article Viewer</h1>
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
                  onClick={() => scrollToSection('abstract')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${activeSection === 'abstract'
                      ? 'bg-blue-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <FileText className="w-4 h-4" />
                  Abstract
                </button>

                <button
                  onClick={() => scrollToSection('keywords')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${activeSection === 'keywords'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Hash className="w-4 h-4" />
                  Keywords
                </button>

                <button
                  onClick={() => scrollToSection('pdf-document')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${activeSection === 'pdf-document'
                      ? 'bg-blue-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <FileText className="w-4 h-4" />
                  PDF Document
                </button>

                <button
                  onClick={() => scrollToSection('references')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${activeSection === 'references'
                      ? 'bg-blue-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <BookOpen className="w-4 h-4" />
                  References
                </button>
              </nav>

              {/* Download Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href={mockPaperData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium"
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
                  {mockPaperData.title}
                </h1>

                <div className="space-y-2 text-gray-600">
                  <p className="text-lg">
                    {mockPaperData.authors.join(', ')}
                  </p>
                  <p className="text-sm">{mockPaperData.affiliation}</p>
                  <div className="flex flex-wrap gap-4 text-sm pt-2">
                    <span>Published: {mockPaperData.publicationDate}</span>
                    <span>DOI: {mockPaperData.doi}</span>
                  </div>
                </div>
              </header>

              {/* Abstract Section */}
              <section id="abstract" className="mb-10 scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Abstract</h2>
                <div className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg border border-gray-200">
                  {mockPaperData.abstract}
                </div>
              </section>

              {/* Keywords Section */}
              <section id="keywords" className="mb-10 scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {mockPaperData.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </section>

              {/* PDF Document Section */}
              <AdminPDFViewer pdfUrl={mockPaperData.pdfUrl} />

              {/* References Section */}
              <section id="references" className="mb-10 scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">References</h2>
                <div className="space-y-3">
                  {mockPaperData.references.map((reference, index) => (
                    <div
                      key={index}
                      className="text-gray-700 leading-relaxed pl-6 relative"
                    >
                      <span className="absolute left-0 text-gray-500 font-medium">
                        [{index + 1}]
                      </span>
                      {reference}
                    </div>
                  ))}
                </div>
              </section>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResearchPaperDisplay;