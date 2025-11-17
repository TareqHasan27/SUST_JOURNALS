import React, { useState, useEffect } from "react";
import ProfileHeader from "./profileComponents/ProfileHeader";
import ProfileStats from "./profileComponents/ProfileStats";
import PublicationsList from "./profileComponents/PublicationsList";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "./profileComponents/StatCard";


// ✅ Mock data (replace with backend later)
const mockProfile = {
  id: 1,
  name: "Dr. Anshita",
  title: "Research Scholar",
  email: "anshita@sust.edu",
  department: "Inhalation Toxicology",
  researchAreas: ["Inhalation Toxicology", "Particle Dosimetry"],
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
    },
    {
      id: 2,
      title:
        "Incense smoke (IS) inhalation exposure system: Physicochemical characterization",
      authors: "V Kumar, H Hashmi, NG Ansari, J Singh",
      journal: "Particology 87, 271–285",
      year: 2024,
      citedBy: 6,
    },
  ],
};

const UserProfile = () => {
  const [profile] = useState(mockProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate backend fetch
    setTimeout(() => setLoading(false), 500);
  }, []);

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
    <div className="min-h-screen bg-blue-50 px-6 py-10">
      <div className="flex w-full  space-y-8 ">
        <div className="mx-auto space-y-6">
          <ProfileHeader profile={profile} />
          <ProfileStats stats={profile.stats} />
          <PublicationsList publications={profile.publications} />
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 ml-8 space-y-6">
           <h2 className="text-lg font-bold mb-15 text-gray-700">Citations per Year</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={citationsPerYear}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="citations" fill="#808080" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
