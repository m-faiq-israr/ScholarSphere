import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchInput = ({ placeholder, value, onChange, onSearch }) => {
  return (
    <div className="relative flex items-center bg-white rounded-xl overflow-hidden">
      <input
        type="text"
        className="w-full bg-[rgb(0,0,0,0.07)] xl:bg-white px-3 py-2 text-heading-1 placeholder:font-outfit placeholder:select-none font-outfit text-sm outline-none "
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button
        className="bg-heading-1 px-3 py-2 flex items-center justify-center text-white hover:bg-opacity-90 transition-all"
        onClick={onSearch}
      >
        <FiSearch className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchInput;
