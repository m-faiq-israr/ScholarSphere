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
import RecommendationButton from '../components/Buttons/RecommendationButton';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "../components/ui/pagination"
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { FaArrowLeft, FaBookmark } from 'react-icons/fa';
import { BsStars } from "react-icons/bs";
import PaginationControls from '@/components/PaginationControls';


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
          url = `http://localhost:4000/api/journals/search`;
          params.append("search", searchQuery);
        } else if (hasFilters) {
          url = `http://localhost:4000/api/journals/filter`;
          if (filters.country) params.append("country", filters.country);
          if (filters.publisher) params.append("publisher", filters.publisher);
          if (filters.subjectArea) params.append("subject_area", filters.subjectArea);
        } else {
          url = `http://localhost:4000/api/journals`;
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
      toast.error('Complete user profile to get recommendations')
    }
    else {
      navigate('/journals/recommended-journals');
    }
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

          const response = await axios.post("http://localhost:4000/api/journals/by-ids", {
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

  return (
    <div>
      <div className="m-24 p-6 rounded-xl bg-[rgb(0,0,0,0.07)]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {!showingSaved ? (
              <>
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
                <button className="inline-flex font-outfit select-none items-center gap-2 rounded-xl bg-heading-1 py-2 px-3 text-sm font-medium text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-700"
                  onClick={recommendedJournalsByAbstract}>Search through abstract <BsStars /></button>

              </>
            ) : (
              <div className='font-outfit text-heading-1 text-2xl font-semibold flex items-center gap-2'><FaBookmark />  Saved Journals</div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-heading-1 text-sm text-white font-medium font-outfit hover:bg-gray-800"
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
                  View Saved Journals
                </>
              )}
            </button>
            <div className="font-semibold text-heading-1 font-outfit select-none">
              Total Journals: {totalJournals}
            </div>
          </div>
        </div>

        {/* Display Journals */}
        {(showingSaved ? savedJournals : journals).length > 0 ? (
          (showingSaved ? savedJournals : journals).map((journal, index) => (

            <div key={index} className="bg-white rounded-xl pl-4 pr-8 py-2 mb-6">
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
