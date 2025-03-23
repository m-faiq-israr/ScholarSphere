import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pagination, Spin, Button, Skeleton } from "antd";
import ConferenceItem from "../components/ListItems/ConferenceItem";
import SearchInput from "../components/InputFields/SearchInput";
import ConferenceFilterDropdown from "../components/Filters/ConferenceFilterDropdown";
import Nav from "../components/Navs/UserPageNav";

const ConferencesPage = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalConferences, setTotalConferences] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");

  const fetchConferences = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/conferences?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&startDate=${startDate || ""}&endDate=${endDate || ""}&location=${location || ""}`
      );

      setConferences(response.data.conferences || []);
      setTotalConferences(response.data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchConferences();
  }, [currentPage, searchQuery, startDate, endDate, location]);
  
  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
    setCurrentPage(1);

  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const applyFilters = (start, end, loc) => {
    setStartDate(start);
    setEndDate(end);
    setLocation(loc);
    setCurrentPage(1); 
  };
  
  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setLocation("");
    setCurrentPage(1);
  };
  

  if (loading) {
    return (
      <div className="m-6 sm:m-24 p-4 sm:p-6">
      <Skeleton active paragraph={{ rows: 15, width: ['60%', '80%', '100%', '60%', '80%', '100%', '60%', '80%', '100%', '60%', '80%', '100%', '100%', '60%', '80%', '100%', '60%', '80%', '100%'] }} />
    </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mt-16 md:mt-20 p-4 md:p-6 rounded-xl bg-gray-200">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full">
          <div className="flex-grow">
            <SearchInput
              placeholder="Search by title"
              value={tempSearchQuery}
              onChange={(e) => setTempSearchQuery(e.target.value)}
              onSearch={handleSearch}
              className="w-full sm:w-72 relative z-10" 
            />
            </div>
            <ConferenceFilterDropdown onApply={applyFilters} onClear={clearFilters} />
          </div>

          <div className="font-semibold text-heading-1 font-outfit select-none text-sm md:text-base">
            Total Conferences: {totalConferences}
          </div>
        </div>

        {conferences.length > 0 ? (
          conferences.map((conference, index) => (
            <div key={index} className="bg-white rounded-xl px-4 py-3 mb-6 shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="w-full min-h-[50px] overflow-hidden text-ellipsis whitespace-normal">
              <ConferenceItem conference={conference} />
              </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No conferences found.</div>
        )}

        <div className="flex justify-center mt-6 custom-pagination font-outfit">
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            total={totalConferences}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  );
};

export default ConferencesPage;
