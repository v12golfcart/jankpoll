import React, { useState, useEffect } from "react";
import { apiURL } from "../../config/environment";

const MarketingSite = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <a
        className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm rounded-md bg-indigo-600 hover:bg-indigo-700 text-base text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        href={`${apiURL}/api/auth/discord`}
      >
        Add Jank Poll to your Discord Server!
      </a>
    </div>
  );
};

export default MarketingSite;
