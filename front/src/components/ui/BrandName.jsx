import React from "react";

const BrandName = ({ className }) => {
  return (
    <span className={`font-avenir-bold text-md ${className}`}>
      <span className="me-1">🎮</span>
      <span className="text-red-500">X</span>
      <span className="text-gray-900">O</span>
      <span className="text-gray-400">Player</span>
    </span>
  );
};

export default BrandName;
