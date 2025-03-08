import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchInput = ({ placeholder, value, onChange }) => {
  return (
    <div className="relative w-72">
      <input
        type="text"
        className="w-full bg-white rounded-xl px-2 py-2 text-heading-1 placeholder:font-outfit placeholder:select-none font-outfit text-sm outline-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {/* Search Icon */}
      <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
    </div>
  );
};

export default SearchInput;