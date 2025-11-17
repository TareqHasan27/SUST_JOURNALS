import React from "react";

const Bio = ({ bio }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-gray-700">   
        <h2 className="text-lg font-semibold mb-2">Bio</h2>
        <p className="text-sm leading-relaxed">{bio}</p>
    </div>
  );
};

export default Bio;