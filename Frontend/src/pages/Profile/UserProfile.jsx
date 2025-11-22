import React, { useState, useEffect } from "react";
import ProfileHeader from "./profileComponents/ProfileHeader";
import ProfileStats from "./profileComponents/ProfileStats";
import PublicationsList from "./profileComponents/PublicationsList";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Bio from "./profileComponents/Bio";
import EditProfileModal from "./profileComponents/EditProfileModal";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false); // saving spinner
  const [error, setError] = useState(null);
  const { reg_no } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:4000/api/profile/${reg_no}`
        );

        if (response.data && response.data.profile) {
          setProfile(response.data.profile);
        } else {
          setProfile(null);
          setError("Profile data not found");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (reg_no) fetchProfile();
  }, [reg_no]);

  const handleSaveProfile = async (updatedData) => {
    // updatedData from modal: { name, bio, researchInterests, photo }
    if (!profile && !reg_no) {
      setError("No profile loaded");
      return;
    }

    const payload = {
      reg_no: profile?.reg_no || reg_no,
      full_name: updatedData.name ?? profile?.full_name ?? "",
      university: profile?.university ?? null,
      department_id: profile?.department_id ?? null,
      profile_url: updatedData.photo ?? profile?.profile_url ?? null,
      bio: updatedData.bio ?? profile?.bio ?? null,
      research_interests:
        Array.isArray(updatedData.researchInterests) &&
        updatedData.researchInterests.length > 0
          ? updatedData.researchInterests
          : profile?.research_interests || profile?.researchInterests || [],
    };

    setUpdateLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/profile/update",
        payload
      );
      if (res.status === 200 && res.data && res.data.status === "success") {
        // Merge the latest changes into local profile state so UI shows immediately
        setProfile((prev) => ({
          ...(prev || {}),
          full_name: payload.full_name,
          university: payload.university ?? prev?.university,
          department_id: payload.department_id ?? prev?.department_id,
          profile_url: payload.profile_url,
          bio: payload.bio,
          researchInterests: payload.research_interests,
          research_interests: payload.research_interests,
        }));
        setIsEditModalOpen(false);
      } else {
        const msg = res.data?.message || "Update failed";
        setError(msg);
        console.error("Update failed:", res.data);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-600">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        No profile data available
      </div>
    );
  }

  const citationsPerYear = [
    { year: 2021, citations: 0 },
    { year: 2022, citations: 0 },
    { year: 2023, citations: 150 },
    { year: 2024, citations: 320 },
    { year: 2025, citations: 300 },
  ];

  return (
    <div className="min-h-screen bg-green-50 px-4 py-10 pl-20 pr-20 relative">
      {/* Saving overlay */}
      {updateLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-md p-6 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-t-transparent border-green-600 rounded-full animate-spin" />
            <div className="text-gray-700 font-medium">Saving...</div>
          </div>
        </div>
      )}

      <div className="flex space-y-1 justify-center space-x-1 items-start sm:flex-row flex-col">
        <div className="mx-auto w-2/3 space-y-6 mt-1.5">
          <ProfileHeader
            profile={profile}
            onEditClick={() => setIsEditModalOpen(true)}
          />
          <Bio bio={profile.bio} />
          <PublicationsList publications={profile.publications} />
        </div>

        <div className="w-1/3 ml-8 space-y-6">
          <h2 className="text-lg font-bold mb-15 text-gray-700">
            Citations per Year
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={citationsPerYear}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="citations" fill="#228B22" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <ProfileStats stats={profile.stats} />
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={{
          name: profile.full_name ?? profile.name,
          bio: profile.bio,
          researchInterests:
            profile.research_interests ?? profile.researchInterests ?? [],
          photo: profile.profile_url ?? profile.photo ?? profile.profileUrl,
        }}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default UserProfile;
