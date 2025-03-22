import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pagination, Skeleton } from "antd";
import GrantItem from "../components/ListItems/GrantItem";
import GrantFilterDropdown from "../components/Filters/GrantsFilterDropdown";
import SearchInput from "../components/InputFields/SearchInput";

const GrantsPage = () => {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalGrants, setTotalGrants] = useState(0);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [isSearched, setIsSearched] = useState(false);

  // **Fetch All Grants**
  const fetchAllGrants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/grants?page=${currentPage}&limit=${itemsPerPage}`
      );
      setGrants(response.data.grants || []);
      setTotalGrants(response.data.total || 0); // Ensure total is set
      setIsFiltered(false);
      setIsSearched(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // **Fetch Filtered Grants**
  const fetchFilteredGrants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/grants/filter?page=${currentPage}&limit=${itemsPerPage}&minAmount=${minAmount || ""}&maxAmount=${maxAmount || ""}&descriptionFilter=${descriptionFilter || ""}`
      );
      setGrants(response.data.grants || []);
      setTotalGrants(response.data.total || response.data.grants.length || 0); // Ensure total is set
      setIsFiltered(true);
      setIsSearched(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // **Fetch Searched Grants**
  const fetchSearchedGrants = async () => {
    try {
      if (!appliedSearchTerm) return fetchAllGrants();
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/grants/search?search=${appliedSearchTerm}&page=${currentPage}&limit=${itemsPerPage}`
      );
      setGrants(response.data.grants || []);
      setTotalGrants(response.data.total || response.data.grants.length || 0); // Ensure total is set
      setIsSearched(true);
      setIsFiltered(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // **Handle API Calls on Dependency Change**
  useEffect(() => {
    if (isSearched) {
      fetchSearchedGrants();
    } else if (isFiltered) {
      fetchFilteredGrants();
    } else {
      fetchAllGrants();
    }
  }, [currentPage, appliedSearchTerm, minAmount, maxAmount, descriptionFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const applyFilters = (min, max, description) => {
    setMinAmount(min);
    setMaxAmount(max);
    setDescriptionFilter(description);
    setAppliedSearchTerm("");
    setCurrentPage(1);
    setIsFiltered(true);
  };

  const clearFilters = () => {
    setMinAmount("");
    setMaxAmount("");
    setDescriptionFilter("");
    setCurrentPage(1);
    setIsFiltered(false);
    fetchAllGrants();
  };

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setMinAmount("");
    setMaxAmount("");
    setDescriptionFilter("");
    setCurrentPage(1);
    setIsSearched(true);
  };

  if (loading) {
    return (
      <div className="m-24 p-6">
        <Skeleton active paragraph={{ rows: 15, width: ["60%", "80%", "100%"] }} />
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
            {/* Search Input */}
            <SearchInput
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={handleSearch}
            />
            {/* Filters Dropdown */}
            <GrantFilterDropdown onApply={applyFilters} onClear={clearFilters} />
          </div>
          <div className="font-semibold text-heading-1 font-outfit select-none">
            Total Grants: {totalGrants}
          </div>
        </div>

        {grants.length > 0 ? (
          grants.map((grant, index) => (
            <div key={index} className="bg-white rounded-xl pl-4 pr-8 py-2 mb-6">
              <GrantItem grant={grant} />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No grants found.</div>
        )}

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
