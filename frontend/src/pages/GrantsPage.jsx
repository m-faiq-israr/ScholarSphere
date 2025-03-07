import React, { useEffect, useState } from 'react';
import GrantItem from '../components/ListItems/GrantItem';
import axios from 'axios';
import { Pagination, Spin } from 'antd';
import '../components/css/Pagination.css';
import SearchInput from '../components/InputFields/SearchInput';
const GrantsPage = () => {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalGrants, setTotalGrants] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/grants?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`
        );

        setGrants(response.data.grants || []);
        setTotalGrants(response.data.total || 0);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGrants();
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
        {/* Search and Total Grants Header */}
        <div className="flex justify-between items-center mb-6">
          {/* Reusable SearchInput Component */}
          <SearchInput
            placeholder="Search by title"
            value={searchQuery}
            onChange={handleSearch}
          />

          {/* Total Grants Count */}
          <div className="font-semibold text-heading-1 font-outfit">
            Total Grants: {totalGrants}
          </div>
        </div>

        {/* Display Grants */}
        {grants.length > 0 ? (
          grants.map((grant, index) => (
            <div key={index} className="bg-white rounded-xl pl-4 pr-8 py-2 mb-6">
              <GrantItem grant={grant} />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No grants found.</div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6 custom-pagination font-outfit">
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            total={totalGrants}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default GrantsPage;