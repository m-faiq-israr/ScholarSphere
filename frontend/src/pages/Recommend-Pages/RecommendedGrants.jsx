import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import { auth } from "../../firebase/firebase";
import ConferenceItem from "../../components/ListItems/ConferenceItem";
import { BsStars } from "react-icons/bs";
import ExportCsv from "@/components/Buttons/ExportCsv";
import { convertToCSV, downloadCSV } from "@/utils/exportCsv";

const RecommendedConferencesPage = () => {
  const [conferences, setConferences] = useState({
    recommended_by_interest: [],
    recommended_by_publications: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendedConferences = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setError("User not logged in.");
        return;
      }

      const token = await user.getIdToken();

      const response = await axios.post(
        "http://localhost:4000/api/conferences/recommended-conferences",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConferences(response.data || {});
    } catch (err) {
      console.error("Error fetching conference recommendations:", err.message);
      setError("Could not load recommended conferences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedConferences();
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

  const flattenConferences = () => {
    return [
      ...conferences.recommended_by_interest,
      ...conferences.recommended_by_publications
    ];
  };

  const handleExportCSV = () => {
    const allConfs = flattenConferences().map((item) => ({
      ...item.conference,
      reason: item.reason,
      score: item.score
    }));

    const csvContent = convertToCSV(allConfs);
    downloadCSV(csvContent, "recommended_conferences.csv");
  };

  const allConfs = flattenConferences()
    .map((item) => ({ ...item }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="m-24 p-6 rounded-xl bg-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="text-heading-1 font-outfit font-semibold text-2xl flex items-center gap-2">
          <BsStars />
          Recommended Conferences
        </div>
        {allConfs.length > 0 && <ExportCsv onClick={handleExportCSV} />}
      </div>

      {allConfs.length > 0 ? (
        allConfs.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl pl-4 pr-8 py-2 mb-6">
            <ConferenceItem conference={item.conference} />
            <div className="mt-2 text-sm text-heading-1 font-outfit">
              <strong>{item.reason}</strong> (Score: {item.score.toFixed(2)})
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No recommended conferences found.</div>
      )}
    </div>
  );
};

export default RecommendedConferencesPage;
