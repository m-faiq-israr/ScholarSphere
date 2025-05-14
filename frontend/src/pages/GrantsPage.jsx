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
import PaginationControls from "@/components/PaginationControls";
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
        `${import.meta.env.VITE_BACKEND_URL}/api/grants?page=${currentPage}&limit=${itemsPerPage}`
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
        `${import.meta.env.VITE_BACKEND_URL}/api/grants/filter?page=${currentPage}&limit=${itemsPerPage}&minAmount=${minAmount || ""}&maxAmount=${maxAmount || ""}&descriptionFilter=${descriptionFilter || ""}`
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
        `${import.meta.env.VITE_BACKEND_URL}/api/grants/search?search=${appliedSearchTerm}&page=${currentPage}&limit=${itemsPerPage}`
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/grants/by-opportunity-status?status=${status}&page=${currentPage}&limit=${itemsPerPage}`);
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/grants/opportunity-status-counts`);
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
      <div className="mt-16 md:m-24 p-6">
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
        title: "❌ Complete your profile to get recommendations.",
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

          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/grants/by-ids`, {
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



 const handleExportCSV = async () => {
  let exportData = [];

  if (showingSaved) {
    exportData = savedGrants;
  } else {
    try {
      const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/grants`;
      let endpoint = "";
      const limitParam = `limit=${totalGrants}&page=1`;

      if (isSearched && appliedSearchTerm) {
        endpoint = `${baseUrl}/search?search=${encodeURIComponent(appliedSearchTerm)}&${limitParam}`;
      } else if (isFiltered) {
        endpoint = `${baseUrl}/filter?minAmount=${minAmount || ""}&maxAmount=${maxAmount || ""}&descriptionFilter=${encodeURIComponent(descriptionFilter || "")}&${limitParam}`;
      } else if (opportunityStatus !== "all") {
        endpoint = `${baseUrl}/by-opportunity-status?status=${opportunityStatus}&${limitParam}`;
      } else {
        endpoint = `${baseUrl}?${limitParam}`;
      }

      const response = await axios.get(endpoint);
      exportData = response.data.grants || [];
    } catch (err) {
      console.error("Error fetching grants for export:", err);
      toast({
        title: "❌ Failed to export grants.",
        description: err.message,
        variant: "default",
        duration: 4000,
      });
      return;
    }
  }

  const csvContent = convertToCSV(
    exportData.map(({title, description, total_fund, opening_date, closing_date, who_can_apply, link}) => ({
      title,
      description,
      total_fund,
      opening_date,
      closing_date,
      who_can_apply,
      link,
    }))
  );

  downloadCSV(csvContent, showingSaved ? "saved_grants.csv" : "all_grants.csv");
};



  return (
    <div className="xs:mt-16">
      <div className=" xl:m-24 p-4 xl:p-6 rounded-xl xl:bg-[rgb(0,0,0,0.07)]">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6">
          <div className="xl:flex flex-wrap items-start sm:items-center gap-2 w-full xl:w-auto">
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
                <div className="flex flex-wrap gap-2 mt-3 xl:mt-0">
                  <GrantFilterDropdown onApply={applyFilters} onClear={clearFilters} />
                  <OpportunityStatusSelect
                    onChange={handleOpportunityStatusChange}
                    value={opportunityStatus}
                    counts={opportunityStatusCounts}
                  />

                  <RecommendationButton onClick={recommendedGrantsPage} />
                </div>
              </>
            ) : (
              <div className="text-2xl font-outfit text-heading-1 font-semibold flex items-center gap-2"><FaBookmark />Saved Grants</div>
            )}

          </div>

          <div className="xl:flex  items-center w-full xl:w-auto justify-between mt-3 xl:mt-0 xl:gap-3">
            <div className="flex items-center gap-3">
              <button
                className="flex  items-center whitespace-nowrap gap-2 px-3 py-2 rounded-xl bg-heading-1 text-sm text-white font-medium font-outfit hover:bg-gray-800"
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
                    Saved Grants
                  </>
                )}
              </button>
              <ExportCsv onClick={handleExportCSV} />
            </div>
            <div className="font-semibold text-heading-1 font-outfit select-none flex justify-end xl:block mt-3 xl:mt-0 ">
              Total Grants: {totalGrants}
            </div>
          </div>
        </div>

        {(showingSaved ? savedGrants : grants).length > 0 ? (
          (showingSaved ? savedGrants : grants).map((grant, index) => (

            <div key={index} className="bg-white rounded-xl  pt-3 pb-4  mb-6 border xl:border-none">
              <GrantItem grant={grant} onUnsaveSuccess={(grantId) => {
                setSavedGrants(prev => prev.filter(g => g._id !== grantId));
                setTotalGrants(prev => prev - 1);
              }} reason={'nothing'} />


            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No grants found.</div>
        )}

        {/* Pagination */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={Math.ceil(totalGrants / itemsPerPage)}
          setCurrentPage={setCurrentPage}
        />



      </div>
    </div>
  );
};

export default GrantsPage;
