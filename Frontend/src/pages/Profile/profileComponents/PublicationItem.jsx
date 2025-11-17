import React from "react";

const PublicationItem = ({ pub }) => {
  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-none last:pb-0 last:mb-0">
      <h3 className="text-blue-700 font-semibold hover:underline cursor-pointer">
        {pub.title}
      </h3>
      <p className="text-gray-600 text-sm">{pub.authors}</p>
      <p className="text-gray-500 text-sm italic">{pub.journal}</p>
      <div className="text-sm text-gray-500 mt-1 flex justify-between">
        <span>Cited by {pub.citedBy}</span>
        <span>{pub.year}</span>
      </div>
    </div>
  );
};

export default PublicationItem;
