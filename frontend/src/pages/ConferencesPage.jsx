import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import ConferenceItem from "../components/ListItems/ConferenceItem";
import SearchInput from "../components/InputFields/SearchInput";
import ConferenceFilterDropdown from "../components/Filters/ConferenceFilterDropdown";
import RecommendationButton from "../components/Buttons/RecommendationButton";
import { AppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "../hooks/use-toast";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FaBookmark, FaArrowLeft } from "react-icons/fa";
import PaginationControls from "@/components/PaginationControls";
import { convertToCSV, downloadCSV } from "@/utils/exportCsv";
import ExportCsv from "@/components/Buttons/ExportCsv";


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
  const { interests } = useContext(AppContext);
  const navigate = useNavigate();
  const [showingSaved, setShowingSaved] = useState(false);
  const [savedConferences, setSavedConferences] = useState([]);

  const fetchConferences = async () => {
    try {
      setLoading(true);

      let endpoint = "";
      const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/conferences`;


      if (searchQuery) {
        endpoint = `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=${itemsPerPage}`;
      } else if (startDate || endDate || location) {
        endpoint = `${baseUrl}/filter?startDate=${startDate || ""}&endDate=${endDate || ""}&location=${location || ""}&page=${currentPage}&limit=${itemsPerPage}`;
      } else {
        endpoint = `${baseUrl}?page=${currentPage}&limit=${itemsPerPage}`;
      }

      const response = await axios.get(endpoint);

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
  }, [currentPage, searchQuery, startDate, endDate, location]);

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
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setLocation("");
    setCurrentPage(1);
  };


  if (loading) {
    return (
      <div className="mt-16 md:m-24 p-6">
        <Skeleton active paragraph={{ rows: 15, width: ['60%', '80%', '100%', '60%', '80%', '100%', '60%', '80%', '100%', '60%', '80%', '100%', '100%', '60%', '80%', '100%', '60%', '80%', '100%'] }} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const recommendedConferencesPage = () => {
    if (!interests || interests.length === 0) {
      toast({
        title: "❌ Enter fields of interests in user profile to get recommendations",
        description: error,
        variant: "default",
        duration: 4000,
      });
    }
    else {
      navigate('/conferences/recommended-conferences');
    }
  }

  const toggleSavedConferencesView = async () => {
    if (showingSaved) {
      setShowingSaved(false);
      fetchConferences();
    } else {
      try {
        setLoading(true);
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          toast({
            title: "❌ You must be logged in to view saved conferences",
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
          const savedIds = userSnap.data().savedConferences || [];
          if (savedIds.length === 0) {
            toast({
              title: "❌ No saved conferences found.",
              description: error,
              variant: "default",
              duration: 4000,
            });
            return;
          }

          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/conferences/by-ids`, {
            ids: savedIds,
          });

          setSavedConferences(response.data.conferences || []);
          setShowingSaved(true);
          setTotalConferences(response.data.conferences.length || 0);
        }
      } catch (error) {
        console.error("Error fetching saved conferences:", error);
        toast({
          title: "❌ Failed to fetch saved conferences.",
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
      exportData = savedConferences;
    } else {
      try {
        const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/conferences`;
        let endpoint = "";

        if (searchQuery) {
          endpoint = `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}&page=1&limit=${totalConferences}`;
        } else if (startDate || endDate || location) {
          endpoint = `${baseUrl}/filter?startDate=${startDate || ""}&endDate=${endDate || ""}&location=${location || ""}&page=1&limit=${totalConferences}`;
        } else {
          endpoint = `${baseUrl}?page=1&limit=${totalConferences}`;
        }

        const response = await axios.get(endpoint);
        exportData = response.data.conferences || [];
      } catch (err) {
        console.error("Error fetching all conferences for export:", err);
        toast({
          title: "❌ Failed to fetch all conferences for export.",
          description: err.message,
          variant: "default",
          duration: 4000,
        });
        return;
      }
    }

    const csvContent = convertToCSV(
      exportData.map(({ _id, title, description, location, start_date, end_date, link }) => ({
        _id,
        title,
        description,
        location,
        start_date,
        end_date,
        link,
      }))
    );

    downloadCSV(csvContent, showingSaved ? "saved_conferences.csv" : "all_conferences.csv");
  };


  return (
    <div>
      <div className="mt-16 md:m-24 p-4 md:p-6 rounded-xl xl:bg-[rgb(0,0,0,0.07)]">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6">
          <div className="xl:flex items-start sm:items-center gap-2 w-full xl:w-auto">
            {!showingSaved ? (
              <>

                <SearchInput
                  placeholder="Search by title"
                  value={tempSearchQuery}
                  onChange={(e) => setTempSearchQuery(e.target.value)}
                  onSearch={handleSearch}
                />
                <div className="mt-3 xl:mt-0 flex flex-wrap gap-3 ">
                  <ConferenceFilterDropdown onApply={applyFilters} onClear={clearFilters} />
                  <RecommendationButton onClick={recommendedConferencesPage} />
                  <button
                    className="xl:hidden whitespace-nowrap flex items-center gap-2  px-3 py-2 rounded-xl bg-heading-1 text-sm text-white font-medium font-outfit hover:bg-gray-800"
                    onClick={toggleSavedConferencesView}
                  >
                    {showingSaved ? (
                      <>
                        <FaArrowLeft />
                        Back
                      </>
                    ) : (
                      <>
                        <FaBookmark />
                        Saved Conferences
                      </>
                    )}
                  </button>
                  <div className='xl:hidden'>
                    <ExportCsv onClick={handleExportCSV} />

                  </div>

                </div>
              </>
            ) : (
              <div className="text-2xl font-outfit font-semibold text-heading-1 flex items-center gap-2"><FaBookmark />Saved Conferences</div>
            )}
          </div>
          {showingSaved && (
            <div className='flex items-center mt-3 gap-3'>
            <button
              className="xl:hidden mt-2 whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-xl bg-heading-1 text-sm text-white font-medium font-outfit hover:bg-gray-800"
              onClick={toggleSavedConferencesView}
            >
              <FaArrowLeft />
              Back to All Conferences

            </button>
            <ExportCsv onClick={handleExportCSV} />
              </div>
          )}
          <div className="xl:flex  items-center w-full xl:w-auto justify-between mt-3 xl:mt-0 xl:gap-3">
            <div className="flex items-center gap-3">
            <button
              className="hidden whitespace-nowrap xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-heading-1 text-sm text-white font-medium font-outfit hover:bg-gray-800"
              onClick={toggleSavedConferencesView}
            >
              {showingSaved ? (
                <>
                  <FaArrowLeft />
                  Back to All Conferences
                </>
              ) : (
                <>
                  <FaBookmark />
                  Saved Conferences
                </>
              )}

            </button>
             <div className='hidden xl:block'>

                <ExportCsv onClick={handleExportCSV} />
              </div>
            </div>
            <div className="font-semibold text-heading-1 font-outfit select-none flex justify-end xl:block w-full xl:w-auto mt-3 md:mt-0">
              Total Conferences: {totalConferences}
            </div>
          </div>
        </div>

        {(showingSaved ? savedConferences : conferences).length > 0 ? (
          (showingSaved ? savedConferences : conferences).map((conference, index) => (

            <div key={index} className="bg-white rounded-xl px-1 pt-3 pb-4  mb-6 border xl:border-none">
              <ConferenceItem
                conference={conference}
                onUnsaveSuccess={(id) => {
                  setSavedConferences(prev => prev.filter(c => c._id !== id));
                  setTotalConferences(prev => prev - 1);
                }}
                reason={'nothing'}
              />

            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No conferences found.</div>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={Math.ceil(totalConferences / itemsPerPage)}
          setCurrentPage={setCurrentPage}
        />

      </div>
    </div>
  );
};

export default ConferencesPage;
