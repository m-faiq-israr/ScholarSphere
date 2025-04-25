import React, { useContext, useEffect, useState } from 'react';
import JournalItem from '../components/ListItems/JournalItem';
import axios from 'axios';
import {  Spin, Button, Skeleton } from 'antd';
import '../components/css/Pagination.css';
import JournalsFilterDropdown from '../components/Filters/JournalsFilterDropdown';
import SearchInput from '../components/InputFields/SearchInput';
import Nav from '../components/Navs/UserPageNav';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import RecommendationButton from '../components/Buttons/RecommendationButton';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "../components/ui/pagination"


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
  const { interests } = useContext(AppContext);
  const navigate = useNavigate();

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
      <div className="m-24 p-6">
        <Skeleton active paragraph={{ rows: 15, width: ['60%', '80%', '100%', '60%', '80%', '100%', '60%', '80%', '100%', '60%', '80%', '100%', '100%', '60%', '80%', '100%', '60%', '80%', '100%'] }} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const recommendedJournalsPage = () => {
    if (!interests || interests.length === 0) {
      toast.error('Enter fields of interests in user profile to get recommendations')
    }
    else {
      navigate('/journals/recommended-journals');
    }
  }

  const recommendedJournalsByAbstract = () => {
    navigate('/journals/recommend-by-abstract')
  }

  return (
    <div>
      <div className="m-24 p-6 rounded-xl bg-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <SearchInput
              placeholder="Search by title"
              value={tempSearchQuery}
              onChange={handleSearchChange}
              onSearch={handleSearch}
            />

            <JournalsFilterDropdown
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
            <RecommendationButton onClick={recommendedJournalsPage} />

            <button className="inline-flex font-outfit select-none items-center gap-2 rounded-xl bg-heading-1 py-2 px-3 text-sm font-medium text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-700"
              onClick={recommendedJournalsByAbstract}>Search through abstract</button>

          </div>

          <div className="font-semibold text-heading-1 font-outfit select-none">
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

<div className="flex justify-center mt-6 font-outfit">
  <Pagination>
    <PaginationContent className="flex items-center gap-2">
      <PaginationItem>
        <PaginationPrevious
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={currentPage === 1 ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
        />
      </PaginationItem>

      {(() => {
        const totalPages = Math.ceil(totalJournals / itemsPerPage);
        const visiblePages = [];

        if (totalPages <= 7) {
          for (let i = 1; i <= totalPages; i++) {
            visiblePages.push(i);
          }
        } else {
          visiblePages.push(1);

          if (currentPage > 4) {
            visiblePages.push("dots-1");
          }

          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < totalPages) {
              visiblePages.push(i);
            }
          }

          if (currentPage < totalPages - 3) {
            visiblePages.push("dots-2");
          }

          visiblePages.push(totalPages);
        }

        return visiblePages.map((page, index) => (
          <PaginationItem key={index}>
            {typeof page === "number" ? (
              <button
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md text-sm font-semibold 
                  ${currentPage === page
                    ? "bg-heading-1 text-white"
                    : "bg-gray-200 text-heading-1 hover:bg-gray-300"}
                `}
              >
                {page}
              </button>
            ) : (
              <span className="px-3 py-1 text-sm text-gray-500 select-none">...</span>
            )}
          </PaginationItem>
        ));
      })()}

      <PaginationItem>
        <PaginationNext
          onClick={() =>
            setCurrentPage((prev) =>
              prev * itemsPerPage < totalJournals ? prev + 1 : prev
            )
          }
          className={currentPage * itemsPerPage >= totalJournals ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</div>

      </div>
      <Toaster />
    </div>
  );
};

export default JournalsPage;
