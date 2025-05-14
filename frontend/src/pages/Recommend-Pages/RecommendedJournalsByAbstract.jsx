import React, { useState } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import JournalItem from "../../components/ListItems/JournalItem";
import { BsStars } from "react-icons/bs";
import recomJournals from '../../assets/images/recomJournals.png'
import PaginationControls from "@/components/PaginationControls";
import landing1 from '../../assets/images/landing1.png'

const RecommendedJournalsByAbstract = () => {
  const [abstract, setAbstract] = useState("");
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);


  const fetchRecommendations = async () => {
    if (!abstract.trim()) {
      setError("Please enter a research abstract.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSubmitted(true);

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/journals/recommend-by-abstract`, {
        abstract
      });



      setJournals(response.data || []);
      setCurrentPage(1);

    } catch (err) {
      console.error(err);
      setError("Could not fetch journal recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const totalJournals = journals.length;
  const totalPages = Math.ceil(totalJournals / itemsPerPage);
  const paginatedJournals = journals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  return (
    <div className="mt-24 m-4 md:m-24 p-3 md:p-6 rounded-xl bg-[rgb(0,0,0,0.07)] font-outfit">
      <div className="text-heading-1 font-bold mb-4 text-lg md:text-3xl flex items-center gap-2">
        Find the best Journals for your Research Paper
        {/* <BsStars /> */}
        <img src={recomJournals} className="size-8 md:size-14" />

      </div>

      {/* Text Area Input */}
      <textarea
        className="w-full h-32 p-2 md:p-3 rounded-xl resize-none text-xs md:text-sm focus:outline-none text-heading-1"
        placeholder="Paste your research abstract here..."
        value={abstract}
        onChange={(e) => setAbstract(e.target.value)}
      />

      <button
        onClick={fetchRecommendations}
        className="mt-4 mb-6 px-3 md:px-5 py-2 text-sm md:text-base bg-teal-500 hover:bg-opacity-90 text-white font-medium rounded-lg flex items-center gap-1"
      >
        Get Recommendations
        <BsStars />
      </button>
      {totalJournals !== 0 && (
        <div className="font-semibold text-heading-1 text-sm md:text-base font-outfit select-none flex justify-end">
          Recommended Journals: {totalJournals}
        </div>
      )}

      {/* Loading & Error */}
      {loading && <div className=" p-6 flex flex-col items-center justify-center text-center space-y-6">
        <img
          src={landing1}
          alt="Loading illustration"
          className="w-full max-w-md"
        />
        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-2xl font-semibold text-heading-1 font-outfit">
        "Hold on! We’re scanning for the most relevant journals."
          </h2>
          <div className=" w-8 h-8 border-[8px] border-heading-1 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Show results only after button is clicked */}
      {submitted && !loading && journals.length > 0 && (
        <div className="mt-6">
          {paginatedJournals.map((j, index) => (
            <div key={index} className="bg-white rounded-xl px-3 md:px-4 py-2 mb-6">
              <JournalItem journal={j.journal} />

            </div>
          ))}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {/* No results */}
      {submitted && !loading && journals.length === 0 && (
        <div className="text-gray-600 text-center mt-6">
          No journal recommendations found for this abstract.
        </div>
      )}
    </div>
  );
};

export default RecommendedJournalsByAbstract;
