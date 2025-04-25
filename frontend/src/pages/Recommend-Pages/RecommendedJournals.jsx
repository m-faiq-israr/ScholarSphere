import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import { auth } from "../../firebase/firebase";
import JournalItem from "../../components/ListItems/JournalItem";
import { BsStars } from "react-icons/bs";

const RecommendedJournalsPage = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendedJournals = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        setError("User not logged in.");
        return;
      }

      const token = await user.getIdToken();

      const response = await axios.post(
        "http://localhost:4000/api/journals/recommended-journals",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJournals(response.data || []);
    } catch (err) {
      console.error("Error fetching recommended journals:", err.message);
      setError("Could not load recommended journals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedJournals();
  }, []);

  if (loading) {
    return (
      <div className="m-24 p-6">
        <Skeleton active paragraph={{ rows: 15, width: ["60%", "80%", "100%"] }} />
      </div>
    );
  }

  if (error) {
    return <div className="m-24 text-red-500">{error}</div>;
  }

  return (
    <div className="m-24 p-6 rounded-xl bg-gray-200">
      <div className="text-heading-1 font-outfit font-semibold mb-6 text-2xl flex items-center gap-2">
        <BsStars />
        Recommended Journals
      </div>

      {journals.length > 0 ? (
        journals.map((item, index) => (
          <div key={index} className="bg-white rounded-xl pl-4 pr-8 py-2 mb-6">
            <JournalItem journal={item.journal} />
            {item.matched_keywords && item.matched_keywords.length > 0 ? (
              <div className="mt-2 text-sm text-heading-1 font-outfit">
                <strong>Matched Interests:</strong>{" "}
                {item.matched_keywords.join(", ")}
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-500 font-outfit">
                No direct interest keywords matched
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No recommended journals found.</div>
      )}
    </div>
  );
};

export default RecommendedJournalsPage;
