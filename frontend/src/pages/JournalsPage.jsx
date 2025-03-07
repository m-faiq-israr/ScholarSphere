import React, { useEffect, useState } from 'react';
import JournalItem from '../components/ListItems/JournalItem'; // Assuming you have a JournalItem component
import axios from 'axios';
import { Pagination, Spin, Input } from 'antd';
import '../components/css/Pagination.css';
import SearchInput from '../components/InputFields/SearchInput';

const JournalsPage = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalJournals, setTotalJournals] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/journals?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`
        );

        setJournals(response.data.journals || []);
        setTotalJournals(response.data.total || 0);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJournals();
  }, [currentPage, itemsPerPage, searchQuery]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        {/* Search and Total Journals Header */}
        <div className="flex justify-between items-center mb-6">
          {/* Reusable SearchInput Component */}
          <SearchInput
            placeholder="Search by title or subject area"
            value={searchQuery}
            onChange={handleSearch}
          />

          {/* Total Grants Count */}
          <div className="font-semibold text-heading-1 font-outfit">
            Total Journals: {totalJournals}
          </div>
        </div>

        {/* Display Journals */}
        {journals.length > 0 ? (
          journals.map((journal, index) => (
            <div key={index} className="bg-white rounded-xl pl-4 pr-8 py-2 mb-6">
              <JournalItem journal={journal} />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No journals found.</div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6 custom-pagination font-outfit">
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            total={totalJournals}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default JournalsPage;