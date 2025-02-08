import React from "react";
import { FiSearch } from "react-icons/fi"; 

const HomeSearchField = () => {
  return (
    <div className="relative w-72 ">
      <input
        type="text"
        className="w-full bg-heading-1 rounded-xl px-4 py-3 text-white placeholder:text-white placeholder:text-base placeholder:font-semibold text-sm outline-none"
        placeholder="Grants, conferences, journals"
      />
      {/* Search Icon */}
      <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-white w-5 h-5" />
    </div>
  );
};

export default HomeSearchField;
