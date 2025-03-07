import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pagination, Spin } from "antd";
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/conferences?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&startDate=${startDate || ""}&endDate=${endDate || ""}`
        );

        setConferences(response.data.conferences || []);
        setTotalConferences(response.data.total || 0);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchConferences();
  }, [currentPage, itemsPerPage, searchQuery, startDate, endDate]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const applyFilters = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin className="custom-spin" size="large" />
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
            value={searchQuery}
            onChange={handleSearch}
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
