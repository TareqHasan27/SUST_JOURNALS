import React, { useState } from "react";
import { ZoomIn, ZoomOut, FileText } from "lucide-react";

const AdminPDFViewer = ({ pdfUrl }) => {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  return (
    <section id="pdf-document" className="mb-10 scroll-mt-24">
      
      {/* Header with Zoom Buttons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Full Document</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>

          <span className="text-sm text-gray-600 font-medium min-w-[50px] text-center">
            {zoom}%
          </span>

          <button
            onClick={handleZoomIn}
            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
        <div className="w-full" style={{ height: "800px", overflow: "auto" }}>
          <iframe
            src={`${pdfUrl}#view=FitH&zoom=${zoom}`}
            className="w-full h-full"
            title="Research Paper PDF"
            style={{ border: "none", minHeight: "800px" }}
          />
        </div>

        {/* If PDF fails to load */}
        {/* <div className="bg-blue-50 border-t border-blue-200 p-4 text-sm text-blue-800">
          <p className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            If the PDF doesn't display,{' '}
            <a
              href={pdfUrl}
              target="_blank"
              className="font-medium underline hover:text-blue-900"
            >
              open it in a new tab
            </a>.
          </p>
        </div> */}
      </div>
    </section>
  );
};

export default AdminPDFViewer;
