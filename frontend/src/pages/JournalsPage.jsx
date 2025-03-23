import React, { useEffect, useState } from 'react';
import JournalItem from '../components/ListItems/JournalItem';
import axios from 'axios';
import { Pagination, Spin, Button, Skeleton } from 'antd';
import '../components/css/Pagination.css';
import JournalsFilterDropdown from '../components/Filters/JournalsFilterDropdown';
import SearchInput from '../components/InputFields/SearchInput';
import Nav from '../components/Navs/UserPageNav';

const JournalsPage = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalJournals, setTotalJournals] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/journals?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&country_flag=${filters.country || ''}&publisher=${filters.publisher || ''}&subject_area=${filters.subjectArea || ''}`
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
  }, [currentPage, itemsPerPage, searchQuery, filters]);

  const handleSearchChange = (e) => {
    setTempSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  if (loading) {
    return (
      // <div className="flex justify-center items-center h-screen">
      //   <Spin className="custom-spin" size="large" />
      // </div>
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
              onChange={handleSearchChange}
              onSearch={handleSearch}
              className="w-full sm:w-72 relative z-10"
            />
            </div>
            <JournalsFilterDropdown
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="font-semibold text-heading-1 font-outfit select-none text-sm md:text-base">
            Total Journals: {totalJournals}
          </div>
        </div>

        {/* Display Journals */}
        {journals.length > 0 ? (
          journals.map((journal, index) => (
            <div key={index} className="bg-white rounded-xl px-4 py-3 mb-6 shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="w-full min-h-[50px] overflow-hidden text-ellipsis whitespace-normal">
                    <JournalItem journal={journal} />
                  </div>
                  </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No journals found.</div>
        )}

        <div className="flex justify-center mt-6 custom-pagination font-outfit">
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            total={totalJournals}
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

export default JournalsPage;
