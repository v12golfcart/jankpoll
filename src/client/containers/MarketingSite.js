import React, { useState, useEffect } from "react";
import { apiURL } from "../../config/environment";

const MarketingSite = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <a
        type="button"
        href={`${apiURL}/api/auth/discord`}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {"Add Jank Poll to your Discord Server!"}
      </a>
    </div>
  );
};

export default MarketingSite;
