import React, { useState } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import JournalItem from "../../components/ListItems/JournalItem";
import { BsStars } from "react-icons/bs";
import recomJournals from '../../assets/images/recomJournals.png'
const RecommendedJournalsByAbstract = () => {
  const [abstract, setAbstract] = useState("");
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false); // <-- key to control display

  const fetchRecommendations = async () => {
    if (!abstract.trim()) {
      setError("Please enter a research abstract.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSubmitted(true);

      const response = await axios.post('http://localhost:4000/api/journals/recommend-by-abstract', {
        abstract
      });



      setJournals(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Could not fetch journal recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-24 p-6 rounded-xl bg-[rgb(0,0,0,0.07)] font-outfit">
      <div className="text-heading-1 font-bold mb-4 text-3xl flex items-center gap-2">
        Find the best Journals for your Research Paper
        {/* <BsStars /> */}
        <img src={recomJournals} className="size-14"/>
      </div>

      {/* Text Area Input */}
      <textarea
        className="w-full h-32 p-3 rounded-xl resize-none  text-sm focus:outline-none text-heading-1"
        placeholder="Paste your research abstract here..."
        value={abstract}
        onChange={(e) => setAbstract(e.target.value)}
      />

      <button
        onClick={fetchRecommendations}
        className="mt-4 mb-6 px-6 py-2 bg-teal-500 hover:bg-opacity-90 text-white font-medium rounded-lg flex items-center gap-1"
      >
        Get Recommendations
        <BsStars />
      </button>

      {/* Loading & Error */}
      {loading && <Skeleton active paragraph={{ rows: 10 }} />}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Show results only after button is clicked */}
      {submitted && !loading && journals.length > 0 && (
        <div className="mt-6">
          {journals.map((j, index) => (
            <div key={index} className="bg-white rounded-xl pl-4 pr-8 py-2 mb-6">
              <JournalItem journal={j.journal} />
              <div className="mt-1 text-sm text-heading-1 font-outfit">
                <strong>Score:</strong> {j.score.toFixed(2)}
              </div>
            </div>
          ))}
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
