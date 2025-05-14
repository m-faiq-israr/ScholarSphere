import { useState, useEffect, useRef } from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";

const GrantFilterDropdown = ({ onApply, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState(""); 
  const dropdownRef = useRef(null);

  const handleApplyFilters = () => {
    onApply(minAmount, maxAmount, descriptionFilter); 
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setMinAmount("");
    setMaxAmount("");
    setDescriptionFilter(""); 
    onClear();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left font-outfit " ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex select-none items-center gap-1 md:gap-2 rounded-xl bg-heading-1 py-2 px-3  text-sm font-medium text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-700"
      >
        Filters
        <FunnelIcon className="size-3 md:size-4 fill-white" />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 md:right-0 mt-2 w-[90vw] md:w-56 origin-top-right rounded-xl border border-gray bg-white p-3 text-sm text-heading-1 transition duration-100 ease-out focus:outline-none shadow-lg z-50"
          style={{ zIndex: 1000 }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-heading-1">Min Amount</label>
              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="Enter min amount"
                className="w-full rounded-md border border-gray-300 p-1 focus:outline-blue-500 text-heading-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading-1">Max Amount</label>
              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="Enter max amount"
                className="w-full rounded-md border border-gray-300 focus:outline-blue-500 p-1 text-heading-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading-1">Keywords</label>
              <input
                type="text"
                value={descriptionFilter}
                onChange={(e) => setDescriptionFilter(e.target.value)}
                placeholder="Search through keywords"
                className="w-full rounded-md border border-gray-300 p-1 focus:outline-blue-500 text-heading-1"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={handleClearFilters}
                className="px-5 rounded-md text-sm bg-red-500 py-1 text-white hover:bg-red-600"
              >
                Clear
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-5 rounded-md text-sm bg-blue-500 py-1 text-white hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrantFilterDropdown;