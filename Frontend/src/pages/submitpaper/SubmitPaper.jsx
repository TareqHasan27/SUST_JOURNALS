import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, X, CheckCircle, AlertCircle, Plus, Trash2, Users } from 'lucide-react';

// Mock departments - Replace with API call
const departments = [
  { id: 1, name: "Computer Science & Engineering", short_code: "CSE" },
  { id: 2, name: "Physics", short_code: "PHY" },
  { id: 3, name: "Chemistry", short_code: "CHE" },
  { id: 4, name: "Mathematics", short_code: "MAT" },
  { id: 5, name: "Electrical & Electronic Engineering", short_code: "EEE" },
  { id: 6, name: "Biology", short_code: "BIO" }
];

// Mock tags
const availableTags = [
  "Machine Learning", "AI", "Quantum Physics", "Organic Chemistry",
  "Applied Mathematics", "Power Systems", "Molecular Biology", "Data Science",
  "Climate Change", "Renewable Energy", "Cryptography", "Statistics"
];


// PDF Upload Component
const PDFUpload = ({ file, setFile, uploadProgress, uploading }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Research Paper PDF <span className="text-red-500">*</span>
      </label>
      
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('pdf-upload').click()}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-700 font-medium mb-1">
            Drop your PDF here or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Maximum file size: 50MB
          </p>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <FileText className="w-10 h-10 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                
                {uploading && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Uploading...</span>
                      <span className="text-green-600 font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {!uploading && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Authors Component
const AuthorsSection = ({ authors, setAuthors }) => {
  const addAuthor = () => {
    setAuthors([...authors, { reg_no: '', author_name: '', is_corresponding: false }]);
  };

  const removeAuthor = (index) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const updateAuthor = (index, field, value) => {
    const updated = [...authors];
    updated[index][field] = value;
    setAuthors(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Co-Authors (Optional)
      </label>
      <div className="space-y-3">
        {authors.map((author, index) => (
          <div key={index} className="flex gap-2 items-start">
            <input
              type="text"
              placeholder="Reg No (optional)"
              value={author.reg_no}
              onChange={(e) => updateAuthor(index, 'reg_no', e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Author Name *"
              value={author.author_name}
              onChange={(e) => updateAuthor(index, 'author_name', e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-300">
              <input
                type="checkbox"
                checked={author.is_corresponding}
                onChange={(e) => updateAuthor(index, 'is_corresponding', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Corresponding</span>
            </label>
            <button
              onClick={() => removeAuthor(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <Button
        onClick={addAuthor}
        variant="outline"
        className="mt-3 border-green-600 text-green-600 hover:bg-green-50"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Co-Author
      </Button>
    </div>
  );
};

// Tags Component
const TagsSection = ({ selectedTags, setSelectedTags }) => {
  const [customTag, setCustomTag] = useState('');

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags / Keywords
      </label>
      
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
            >
              {tag}
              <button
                onClick={() => toggleTag(tag)}
                className="hover:text-green-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {availableTags.filter(tag => !selectedTags.includes(tag)).map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-green-100 hover:text-green-700 transition-colors"
          >
            + {tag}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add custom tag..."
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <Button
          onClick={addCustomTag}
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// Success Modal
const SuccessModal = ({ show, onClose, paperId }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Paper Submitted Successfully!</h3>
          <p className="text-gray-600 mb-6">
            Your research paper has been submitted for review. You will be notified once it's published.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => window.location.href = `/papers/${paperId}`}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              View Paper
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Submit Another
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Component
const PaperSubmissionForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    primary_department_id: '',
    publication_date: new Date().toISOString().split('T')[0]
  });
  
  const [pdfFile, setPdfFile] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedPaperId, setSubmittedPaperId] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary preset
    formData.append('resource_type', 'raw');

    try {
      setUploading(true);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200); 

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/your_cloud_name/raw/upload', // Replace with your cloud name
        {
          method: 'POST',
          body: formData
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setUploading(false);
      console.log('Cloudinary upload response:', data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      setUploading(false);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (!formData.title.trim()) {
      setError('Please enter a paper title');
      return;
    }
    if (!formData.abstract.trim()) {
      setError('Please enter an abstract');
      return;
    }
    if (!formData.primary_department_id) {
      setError('Please select a department');
      return;
    }
    if (!pdfFile) {
      setError('Please upload a PDF file');
      return;
    }

    try {
      setSubmitting(true);

      const pdfUrl = await uploadToCloudinary(pdfFile);

      const paperData = {
        ...formData,
        pdf_url: pdfUrl,
        authors: authors.filter(a => a.author_name.trim()),
        tags: selectedTags
      };

      const response = await fetch('/api/papers/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paperData)
      });

      if (!response.ok) throw new Error('Submission failed');

      const result = await response.json();
      setSubmittedPaperId(result.paperId);
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error submitting paper:', error);
      setError('Failed to submit paper. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      abstract: '',
      primary_department_id: '',
      publication_date: new Date().toISOString().split('T')[0]
    });
    setPdfFile(null);
    setAuthors([]);
    setSelectedTags([]);
    setUploadProgress(0);
    setShowSuccess(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto">

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <Card className="border-green-200">
          <CardHeader className="bg-white border-b border-green-100">
            <CardTitle className="text-green-800">Paper Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paper Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter your research paper title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abstract <span className="text-red-500">*</span>
              </label>
              <textarea
                name="abstract"
                value={formData.abstract}
                onChange={handleInputChange}
                placeholder="Provide a brief summary of your research (200-500 words)"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.abstract.length} characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Department <span className="text-red-500">*</span>
              </label>
              <select
                name="primary_department_id"
                value={formData.primary_department_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select a department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.short_code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication Date
              </label>
              <input
                type="date"
                name="publication_date"
                value={formData.publication_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <PDFUpload
              file={pdfFile}
              setFile={setPdfFile}
              uploadProgress={uploadProgress}
              uploading={uploading}
            />

            <AuthorsSection authors={authors} setAuthors={setAuthors} />

            <TagsSection selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={submitting || uploading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Submit Paper
                  </>
                )}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="px-8"
                disabled={submitting}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <SuccessModal
          show={showSuccess}
          onClose={resetForm}
          paperId={submittedPaperId}
        />
      </div>
    </div>
  );
};

export default PaperSubmissionForm;