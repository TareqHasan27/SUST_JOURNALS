import React, { useState, useEffect } from "react";
import ProfileHeader from "./profileComponents/ProfileHeader";
import ProfileStats from "./profileComponents/ProfileStats";
import PublicationsList from "./profileComponents/PublicationsList";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Bio from "./profileComponents/Bio";
import EditProfileModal from "./profileComponents/EditProfileModal";


const UserProfile = () => {
  const [profile, setProfile] = useState({
    id: 1,
    name: "Dr. Anshita",
    email: "anshita@sust.edu",
    department: "Inhalation Toxicology",
    researchInterests: ["Inhalation Toxicology", "Particle Dosimetry"],
    university: "Shahjalal University of Science and Technology",
    stats: { citations: 954, hIndex: 2, i10Index: 1 },
    publications: [
      {
        id: 1,
        title: "MCP-1: Function, regulation, and involvement in disease",
        authors: "S Singh, D Anshita, V Ravichandiran",
        journal: "International Immunopharmacology 101, 107598",
        year: 2021,
        citedBy: 948,
        abstract: "This comprehensive review examines the multifaceted role of MCP-1 (Monocyte Chemoattractant Protein-1) in various disease pathologies, including its regulation mechanisms and therapeutic implications.",
        department: "Inhalation Toxicology",
        publicationDate: "2021-05-15",
        viewCount: 15420,
        downloadCount: 3280,
        bookmarkedAt: "2023-08-20"
      },
      {
        id: 2,
        title: "Incense smoke (IS) inhalation exposure system: Physicochemical characterization",
        authors: "V Kumar, H Hashmi, NG Ansari, J Singh",
        journal: "Particology 87, 271–285",
        year: 2024,
        citedBy: 6,
        abstract: "Novel inhalation exposure system designed for studying the health effects of incense smoke, with detailed physicochemical characterization of particle properties and deposition patterns.",
        department: "Particle Dosimetry",
        publicationDate: "2024-03-10",
        viewCount: 892,
        downloadCount: 156,
        bookmarkedAt: "2024-04-05"
      },
      {
        id: 3,
        title: "MCP-1: Function, regulation, and involvement in disease",
        authors: "S Singh, D Anshita, V Ravichandiran",
        journal: "International Immunopharmacology 101, 107598",
        year: 2021,
        citedBy: 948,
        abstract: "This comprehensive review examines the multifaceted role of MCP-1 (Monocyte Chemoattractant Protein-1) in various disease pathologies, including its regulation mechanisms and therapeutic implications.",
        department: "Inhalation Toxicology",
        publicationDate: "2021-05-15",
        viewCount: 15420,
        downloadCount: 3280,
        bookmarkedAt: "2023-08-20"
      },
    ],
    bio: "Dr. Anshita is a dedicated research scholar specializing in inhalation toxicology and particle dosimetry. Her work focuses on understanding the health impacts of airborne particles and advancing safe exposure systems.",
    photo: "https://images.unsplash.com/photo-1761839257870-06874bda71b5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169"
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleSaveProfile = (updatedData) => {
    setProfile({
      ...profile,
      ...updatedData
    });
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading profile...
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
    <div className="min-h-screen  bg-green-50 px-4 py-10 pl-20 pr-20">
      <div className="flex  space-y-1 justify-center space-x-1 items-start sm:flex-row flex-col">
        <div className="mx-auto w-2/3 space-y-6 mt-1.5">
          <ProfileHeader profile={profile} onEditClick={() => setIsEditModalOpen(true)} />
          <Bio bio={profile.bio} />
          <PublicationsList publications={profile.publications} />
        </div>
        <div className="w-1/3 ml-8 space-y-6">
           <h2 className="text-lg font-bold mb-15 text-gray-700">Citations per Year</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={citationsPerYear} >
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
        profile={profile}
        onSave={handleSaveProfile}
      />

    </div>
  );
};

export default UserProfile;
