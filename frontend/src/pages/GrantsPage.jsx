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

  const fetchGrants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/grants?page=${currentPage}&limit=${itemsPerPage}&minAmount=${minAmount || ""}&maxAmount=${maxAmount || ""}&search=${appliedSearchTerm || ""}&descriptionFilter=${descriptionFilter || ""}`
      );

      setGrants(response.data.grants || []);
      setTotalGrants(response.data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrants();
  }, [currentPage, itemsPerPage, minAmount, maxAmount, appliedSearchTerm, descriptionFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const applyFilters = (min, max, descriptionFilter) => {
    setMinAmount(min);
    setMaxAmount(max);
    setDescriptionFilter(descriptionFilter);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setMinAmount("");
    setMaxAmount("");
    setDescriptionFilter("");
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm); 
    setCurrentPage(1);
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
            {/* Search Input Field */}
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
