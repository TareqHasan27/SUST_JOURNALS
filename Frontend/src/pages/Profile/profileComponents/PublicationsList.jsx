import React from "react";
import PublicationItem from "./PublicationItem";

const PublicationsList = ({ publications }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Publications ({publications.length})
      </h2>

      {publications.map((pub) => (
        <PublicationItem key={pub.id} pub={pub} />
      ))}

      <button className="mt-4 w-full border-2 bg-green-50 border-gray-300 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:border-green-400 transition">
        Load More
      </button>
    </div>
  );
};

export default PublicationsList;
