import { useState, useEffect, useRef } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline'; 

const JournalsFilterDropdown = ({ onApplyFilters, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState('');
  const [publisher, setPublisher] = useState('');
  const [subjectArea, setSubjectArea] = useState('');
  const dropdownRef = useRef(null); 

  const handleApplyFilters = () => {
    onApplyFilters({
      country,
      publisher,
      subjectArea,
    });
    setIsOpen(false); 
  };

  const handleClearFilters = () => {
    setCountry('');
    setPublisher('');
    setSubjectArea('');
    onClearFilters();
    setIsOpen(false); 
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false); 
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left font-outfit" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex select-none items-center gap-2 rounded-xl bg-heading-1 py-1.5 px-3 text-xs sm:text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-700"
      >
        <FunnelIcon className="size-4 fill-white" /> 
        Filters
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 right-auto sm:right-0 sm:left-auto mt-2 min-w-[200px] sm:min-w-[250px] origin-top-right rounded-xl border border-gray bg-white p-2 text-xs sm:text-sm text-heading-1 transition duration-100 ease-out focus:outline-none transform-none sm:translate-x-0"
          style={{ zIndex: 1000 }} 
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-heading-1">Country</label>
              <input
                type="text"
                placeholder="Enter country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-1 sm:p-2 focus:outline-blue-500 text-heading-1"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-heading-1">Publisher</label>
              <input
                type="text"
                placeholder="Enter publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-1 sm:p-2 focus:outline-blue-500 text-heading-1"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-heading-1">Subject Area</label>
              <input
                type="text"
                placeholder="Enter subject area"
                value={subjectArea}
                onChange={(e) => setSubjectArea(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-1 sm:p-2 focus:outline-blue-500 text-heading-1"
              />
            </div>
            <div className='flex items-center justify-between'>
            <button
              onClick={handleClearFilters}
              className="px-3 sm:px-5 rounded-md text-xs sm:text-sm bg-red-500 py-1 sm:py-2 text-white hover:bg-red-600"
              >
              Clear 
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-3 sm:px-5 rounded-md text-xs sm:text-sm bg-blue-500 py-1 sm:py-2 text-white hover:bg-blue-600"
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

export default JournalsFilterDropdown;