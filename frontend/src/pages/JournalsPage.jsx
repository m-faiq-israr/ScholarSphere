import React, { useContext, useEffect, useState } from 'react';
import JournalItem from '../components/ListItems/JournalItem';
import axios from 'axios';
import { Skeleton } from 'antd';
import '../components/css/Pagination.css';
import JournalsFilterDropdown from '../components/Filters/JournalsFilterDropdown';
import SearchInput from '../components/InputFields/SearchInput';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { FaArrowLeft, FaBookmark } from 'react-icons/fa';
import { BsStars } from "react-icons/bs";
import PaginationControls from '@/components/PaginationControls';
import { convertToCSV, downloadCSV } from "@/utils/exportCsv";
import ExportCsv from "@/components/Buttons/ExportCsv";



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
  const [showingSaved, setShowingSaved] = useState(false);
  const [savedJournals, setSavedJournals] = useState([]);


  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);

        let url = "";
        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("limit", itemsPerPage);

        const hasSearch = searchQuery.trim() !== "";
        const hasFilters = filters.country || filters.publisher || filters.subjectArea;

        if (hasSearch) {
          url = `${import.meta.env.VITE_BACKEND_URL}/api/journals/search`;
          params.append("search", searchQuery);
        } else if (hasFilters) {
          url = `${import.meta.env.VITE_BACKEND_URL}/api/journals/filter`;
          if (filters.country) params.append("country", filters.country);
          if (filters.publisher) params.append("publisher", filters.publisher);
          if (filters.subjectArea) params.append("subject_area", filters.subjectArea);
        } else {
          url = `${import.meta.env.VITE_BACKEND_URL}/api/journals`;
        }

        const response = await axios.get(`${url}?${params.toString()}`);
        setJournals(response.data.journals || []);
        setTotalJournals(response.data.total || 0);
      } catch (err) {
        setError(err.message);
      } finally {
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
      <div className="mt-16 md:m-24 p-6">
        <Skeleton active paragraph={{ rows: 15, width: ['60%', '80%', '100%', '60%', '80%', '100%', '60%', '80%', '100%', '60%', '80%', '100%', '100%', '60%', '80%', '100%', '60%', '80%', '100%'] }} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const recommendedJournalsByAbstract = () => {
    navigate('/journals/recommend-by-abstract')
  }

  const toggleSavedJournalsView = async () => {
    if (showingSaved) {
      setShowingSaved(false);
      setCurrentPage(1);
      setSearchQuery("");
      setFilters({});
    } else {
      try {
        setLoading(true);
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          toast.error("You must be logged in to view saved journals.");
          return;
        }

        const db = getFirestore();
        const userRef = doc(db, "user_profile", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const savedIds = userSnap.data().savedJournals || [];
          if (savedIds.length === 0) {
            toast.error("No saved journals found.");
            return;
          }

          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/journals/by-ids`, {
            ids: savedIds,
          });

          setSavedJournals(response.data.journals || []);
          setShowingSaved(true);
          setTotalJournals(response.data.journals.length || 0);
        }
      } catch (error) {
        console.error("Error fetching saved journals:", error);
        toast.error("Failed to fetch saved journals.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExportCSV = async () => {
  let exportData = [];

  if (showingSaved) {
    exportData = savedJournals;
  } else {
    try {
      const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/journals`;
      const params = new URLSearchParams();
      params.append("page", 1);
      params.append("limit", totalJournals);

      if (searchQuery) {
        params.append("search", searchQuery);
        const response = await axios.get(`${baseUrl}/search?${params.toString()}`);
        exportData = response.data.journals || [];
      } else if (filters.country || filters.publisher || filters.subjectArea) {
        if (filters.country) params.append("country", filters.country);
        if (filters.publisher) params.append("publisher", filters.publisher);
        if (filters.subjectArea) params.append("subject_area", filters.subjectArea);
        const response = await axios.get(`${baseUrl}/filter?${params.toString()}`);
        exportData = response.data.journals || [];
      } else {
        const response = await axios.get(`${baseUrl}?${params.toString()}`);
        exportData = response.data.journals || [];
      }
    } catch (err) {
      console.error("Error fetching journals for export:", err);
      toast.error("Failed to export journals.");
      return;
    }
  }

  const csvContent = convertToCSV(
    exportData.map(({title, publisher, country, scope}) => ({
      title,
      publisher,
      country,
      scope
    }))
  );

  downloadCSV(csvContent, showingSaved ? "saved_journals.csv" : "all_journals.csv");
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
                  onChange={handleSearchChange}
                  onSearch={handleSearch}
                />
                <div className="mt-3 xl:mt-0 flex flex-wrap gap-3  ">

                  <JournalsFilterDropdown
                    onApplyFilters={handleApplyFilters}
                    onClearFilters={handleClearFilters}
                  />
                  <button className="inline-flex whitespace-nowrap font-outfit select-none items-center gap-2 rounded-xl bg-heading-1 py-2 px-3 text-sm font-medium text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-700"
                    onClick={recommendedJournalsByAbstract}>Search through abstract <BsStars /></button>
                  <button
                    className="xl:hidden whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-xl bg-heading-1 
                    text-sm text-white font-medium font-outfit hover:bg-gray-800"
                    onClick={toggleSavedJournalsView}
                  >
                    {showingSaved ? (
                      <>
                        <FaArrowLeft />
                        Back to All Journals
                      </>
                    ) : (
                      <>
                        <FaBookmark />
                        Saved Journals
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className='font-outfit text-heading-1 text-2xl font-semibold flex items-center gap-2'><FaBookmark />  Saved Journals</div>
            )}
              {showingSaved && (
            <button
              className="xl:hidden mt-3 whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-xl bg-heading-1 text-sm text-white font-medium font-outfit hover:bg-gray-800"
              onClick={toggleSavedJournalsView}
            >
                  <FaArrowLeft />
                  Back to All Journals
            </button>
              )}
          </div>

          <div className="flex items-center gap-4 w-full xl:w-auto mt-3 md:mt-0">
            <button
              className="hidden whitespace-nowrap xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-heading-1 text-sm text-white font-medium font-outfit hover:bg-gray-800"
              onClick={toggleSavedJournalsView}
            >
              {showingSaved ? (
                <>
                  <FaArrowLeft />
                  Back to All Journals
                </>
              ) : (
                <>
                  <FaBookmark />
                  Saved Journals
                </>
              )}
            </button>
            <ExportCsv onClick={handleExportCSV} />
            <div className="font-semibold text-heading-1 font-outfit select-none flex justify-end w-full xl:block xl:w-auto">
              Total Journals: {totalJournals}
            </div>

          </div>
        </div>

        {/* Display Journals */}
        {(showingSaved ? savedJournals : journals).length > 0 ? (
          (showingSaved ? savedJournals : journals).map((journal, index) => (

            <div key={index} className="bg-white rounded-xl px-3 md:px-4 border xl:border-none py-2 mb-6">
              <JournalItem
                journal={journal}
                onUnsaveSuccess={(id) => {
                  setSavedJournals(prev => prev.filter(j => j._id !== id));
                  setTotalJournals(prev => prev - 1);
                }}
              />

            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No journals found.</div>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={Math.ceil(totalJournals / itemsPerPage)}
          setCurrentPage={setCurrentPage}
        />

      </div>
      <Toaster />
    </div>
  );
};

export default JournalsPage;
