import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pagination, Spin, Button, Skeleton } from "antd";
import ConferenceItem from "../components/ListItems/ConferenceItem";
import SearchInput from "../components/InputFields/SearchInput";
import ConferenceFilterDropdown from "../components/Filters/ConferenceFilterDropdown";

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
  }, [currentPage, itemsPerPage, searchQuery, startDate, endDate, location]);

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
    fetchConferences(); 
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setLocation("");
    setCurrentPage(1);
    fetchConferences(); 
  };

  if (loading) {
    return (
      <div className="m-24 p-6">
      <Skeleton active paragraph={{ rows: 15, width: ['60%', '80%', '100%', '60%', '80%', '100%', '60%', '80%', '100%', '60%', '80%', '100%', '100%', '60%', '80%', '100%', '60%', '80%', '100%'] }} />
    </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="m-24 p-6 rounded-xl bg-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <SearchInput
              placeholder="Search by title or location"
              value={tempSearchQuery}
              onChange={(e) => setTempSearchQuery(e.target.value)}
              onSearch={handleSearch}
            />
            <ConferenceFilterDropdown onApply={applyFilters} onClear={clearFilters} />
          </div>

          <div className="font-semibold text-heading-1 font-outfit select-none">
            Total Conferences: {totalConferences}
          </div>
        </div>

        {conferences.length > 0 ? (
          conferences.map((conference, index) => (
            <div key={index} className="bg-white rounded-xl pl-4 pr-8 py-2 mb-6">
              <ConferenceItem conference={conference} />
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
          />
        </div>
      </div>
    </div>
  );
};

export default ConferencesPage;
