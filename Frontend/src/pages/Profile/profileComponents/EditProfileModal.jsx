import React, { useState, useEffect } from "react";
import { X, Upload, Plus } from "lucide-react";

const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    researchInterests: [],
    photo: "",
  });
  const [file, setFile] = useState(null);
  const [newInterest, setNewInterest] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        researchInterests: profile.researchInterests || [],
        photo: profile.photo || "",
      });
    }
  }, [profile]);

  const handlePhotoUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploading(true);
    setError("");

    const formDataUpload = new FormData();
    formDataUpload.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:4000/api/pdf/upload-pdf", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        setUploading(false);
        return;
      }
      console.log("profile url", data);
      setFormData((prev) => ({ ...prev, photo: data.url }));
      setUploading(false);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload error. Try again.");
      setUploading(false);
    }
  };

  const addResearchInterest = () => {
    const trimmed = newInterest.trim();
    if (!trimmed || formData.researchInterests.includes(trimmed)) return;
    setFormData((prev) => ({
      ...prev,
      researchInterests: [...prev.researchInterests, trimmed],
    }));
    setNewInterest("");
  };

  const removeResearchInterest = (index) => {
    setFormData((prev) => ({
      ...prev,
      researchInterests: prev.researchInterests.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-green-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-green-50 rounded-lg overflow-hidden flex items-center justify-center">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload size={32} className="text-green-600" />
                )}
              </div>
              <label className="cursor-pointer px-4 py-2 bg-green-50 text-green-700 border border-green-300 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2">
                <Upload size={16} />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            {uploading && (
              <p className="text-sm text-gray-500 mt-1">Uploading...</p>
            )}
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Research Interests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Research Interests
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), addResearchInterest())
                }
                placeholder="Add research interest"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
              <button
                onClick={addResearchInterest}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.researchInterests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full flex items-center gap-2 text-sm"
                >
                  {interest}
                  <button
                    onClick={() => removeResearchInterest(index)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
