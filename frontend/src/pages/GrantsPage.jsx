import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import GrantItem from "../components/ListItems/GrantItem";
import GrantFilterDropdown from "../components/Filters/GrantsFilterDropdown";
import SearchInput from "../components/InputFields/SearchInput";
import RecommendationButton from "../components/Buttons/RecommendationButton";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { toast } from "../hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "../components/ui/pagination"
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FaArrowLeft, FaBookmark } from "react-icons/fa";
import OpportunityStatusSelect from "@/components/InputFields/OpportunityStatusSelect";
import { convertToCSV, downloadCSV } from "@/utils/exportCsv";
import ExportCsv from "@/components/Buttons/ExportCsv";


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
  const { interests } = useContext(AppContext);
  const navigate = useNavigate();
  const [showingSaved, setShowingSaved] = useState(false);
  const [savedGrants, setSavedGrants] = useState([]);
  const [opportunityStatus, setOpportunityStatus] = useState("all");
  const [opportunityStatusCounts, setOpportunityStatusCounts] = useState({});


  // **Fetch All Grants**
  const fetchAllGrants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/grants?page=${currentPage}&limit=${itemsPerPage}`
      );
      setGrants(response.data.grants || []);
      setTotalGrants(response.data.total || 0);
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


  const handleOpportunityStatusChange = (status) => {
    setOpportunityStatus(status);
    setCurrentPage(1);
    if (status === "all") {
      fetchAllGrants();
    } else {
      fetchGrantsByOpportunityStatus(status);
    }
  };

  const fetchGrantsByOpportunityStatus = async (status) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/grants/by-opportunity-status?status=${status}&page=${currentPage}&limit=${itemsPerPage}`);
      setGrants(response.data.grants || []);
      setTotalGrants(response.data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpportunityStatusCounts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/grants/opportunity-status-counts");
      setOpportunityStatusCounts(response.data || {});
    } catch (err) {
      console.error("Error fetching opportunity status counts:", err);
    }
  };

  useEffect(() => {
    fetchOpportunityStatusCounts();
  }, []);


  useEffect(() => {
    if (isSearched) {
      fetchSearchedGrants();
    } else if (isFiltered) {
      fetchFilteredGrants();
    } else if (opportunityStatus !== "all") {
      fetchGrantsByOpportunityStatus(opportunityStatus);
    } else {
      fetchAllGrants();
    }
  }, [currentPage, appliedSearchTerm, minAmount, maxAmount, descriptionFilter, opportunityStatus]);


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

  const recommendedGrantsPage = () => {
    if (!interests || interests.length === 0) {
      toast({
        title: "❌ Enter fields of interests in user profile to get recommendations",
        description: error,
        variant: "default",
        duration: 4000,
      });
    }
    else {
      navigate('/grants/recommended-grants');
    }
  }

  const toggleSavedGrantsView = async () => {
    if (showingSaved) {
      setShowingSaved(false);
      fetchAllGrants();
    } else {
      try {
        setLoading(true);
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          toast({
            title: "❌ You must be logged in to view saved grants.",
            description: error,
            variant: "default",
            duration: 4000,
          });
          return;
        }

        const db = getFirestore();
        const userRef = doc(db, "user_profile", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const savedIds = userSnap.data().savedGrants || [];
          if (savedIds.length === 0) {
            toast({
              title: "❌ No saved grants found.",
              description: error,
              variant: "default",
              duration: 4000,
            });
            return;
          }

          const response = await axios.post("http://localhost:4000/api/grants/by-ids", {
            ids: savedIds,
          });

          setSavedGrants(response.data.grants || []);
          setShowingSaved(true);
          setTotalGrants(response.data.grants.length || 0);
        } else {
          toast({
            title: "❌ No saved grants found.",
            description: error,
            variant: "default",
            duration: 4000,
          });
        }
      } catch (error) {
        console.error("Error fetching saved grants:", error);
        toast({
          title: "❌ Failed to fetch saved grants.",
          description: error,
          variant: "default",
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    }
  };



  const handleExportCSV = () => {
    const exportData = (showingSaved ? savedGrants : grants).map(({ _id, title, description, scope, total_fund, opening_date, closing_date, who_can_apply, link, contact_email }) => ({
      _id,
      title,
      description,
      scope,
      total_fund,
      opening_date,
      closing_date,
      who_can_apply,
      link,
      contact_email
    }));

    const csvContent = convertToCSV(exportData);
    downloadCSV(csvContent, showingSaved ? "saved_grants.csv" : "all_grants.csv");
  };


  return (
    <div>
      <div className="m-24 p-6 rounded-xl bg-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {!showingSaved ? (
              <>

                {/* Search Input */}
                <SearchInput
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onSearch={handleSearch}
                />
                {/* Filters Dropdown */}
                <GrantFilterDropdown onApply={applyFilters} onClear={clearFilters} />
                <OpportunityStatusSelect
                  onChange={handleOpportunityStatusChange}
                  value={opportunityStatus}
                  counts={opportunityStatusCounts}
                />

                <RecommendationButton onClick={recommendedGrantsPage} />
              </>
            ) : (
              <div className="text-2xl font-outfit text-heading-1 font-semibold">Saved Grants</div>
            )}

          </div>

          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-heading-1 text-sm text-white font-medium font-outfit hover:bg-gray-800"
              onClick={toggleSavedGrantsView}
            >
              {showingSaved ? (
                <>
                  <FaArrowLeft />
                  Back to All Grants
                </>
              ) : (
                <>
                  <FaBookmark />
                  View Saved Grants
                </>
              )}
            </button>
            <ExportCsv onClick={handleExportCSV} />
            <div className="font-semibold text-heading-1 font-outfit select-none">
              Total Grants: {totalGrants}
            </div>
          </div>
        </div>

        {(showingSaved ? savedGrants : grants).length > 0 ? (
          (showingSaved ? savedGrants : grants).map((grant, index) => (

            <div key={index} className="bg-white rounded-xl pl-4 pr-8 py-2 mb-6">
              <GrantItem grant={grant} onUnsaveSuccess={(grantId) => {
                setSavedGrants(prev => prev.filter(g => g._id !== grantId));
                setTotalGrants(prev => prev - 1);
              }} />

            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No grants found.</div>
        )}

        {/* Pagination */}
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
                const totalPages = Math.ceil(totalGrants / itemsPerPage);
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
                      <span className="px-3 py-1 text-sm text-gray-500 select-none ">...</span>
                    )}
                  </PaginationItem>
                ));
              })()}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev * itemsPerPage < totalGrants ? prev + 1 : prev
                    )
                  }
                  className={currentPage * itemsPerPage >= totalGrants ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>


      </div>
    </div>
  );
};

export default GrantsPage;
