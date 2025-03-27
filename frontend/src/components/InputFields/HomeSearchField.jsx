import React from "react";
import { FiSearch } from "react-icons/fi"; 

const HomeSearchField = () => {
  return (
    <div className="flex justify-center w-full"> 
    <div className="relative w-full sm:w-80 md:w-96 lg:w-[28rem] ">
      <input
        type="text"
        className="w-full bg-heading-1 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder:select-none placeholder:text-white placeholder:text-sm sm:placeholder:text-base placeholder:font-semibold text-sm sm:text-base outline-none"
        placeholder="Grants, conferences, journals"
      />
      {/* Search Icon */}
      <FiSearch className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-white w-4 sm:w-5 h-4 sm:h-5" />
    </div>
    </div>
  );
};

export default HomeSearchField;
