import React from "react";
import { Mail, MapPin, BookOpen, Users, Edit3 } from "lucide-react";

const ProfileHeader = ({ profile , onEditClick }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex justify-between items-start">
      <div className="flex gap-6">
        <div className="w-24 h-24 bg-blue-100  text-3xl font-bold rounded-lg flex items-center justify-center">
          <img src={ profile.photo || "https://images.unsplash.com/photo-1761839257870-06874bda71b5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169"} alt="Profile" className="w-24 h-24 rounded-lg hover:scale-125 object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>

          <div className="mt-2 space-y-1 text-gray-600 text-sm">
            <p className="flex items-center gap-2">
              <Mail size={16} className="text-green-600" /> {profile.email}
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={16} className="text-green-600" /> {profile.university}
            </p>
            <p className="flex items-center gap-2">
              <BookOpen size={16} className="text-green-600" /> {profile.department}
            </p>  
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {profile.researchInterests.map((area, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-green-50 text-green-700 text-sm font-bold rounded-full"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onEditClick}
          className="px-3 py-2 border border-green-300 rounded-lg hover:bg-green-500 hover:text-white flex items-center gap-2 text-sm">
          <Edit3 size={16} /> Edit
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
