import React from 'react'
import { FiSearch } from "react-icons/fi"; 

export const NavSearchField = () => {
  return (
    <div className="relative w-72 ">
    <input
      type="text"
      className="w-full bg-gray-200 rounded-2xl px-2 py-2 text-heading-1 text-sm outline-none"
      placeholder="Search..."
    />
    {/* Search Icon */}
    <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
  </div>
  )
}
