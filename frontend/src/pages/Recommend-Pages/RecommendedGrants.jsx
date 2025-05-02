import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import GrantItem from "../../components/ListItems/GrantItem";
import { auth } from "../../firebase/firebase";
import { BsStars } from "react-icons/bs";
import ExportCsv from "@/components/Buttons/ExportCsv";
import { convertToCSV, downloadCSV } from "@/utils/exportCsv";

const RecommendedGrantsPage = () => {
  const [grants, setGrants] = useState({
    recommended_by_interest: [],
    recommended_by_publications: [],
    recommended_by_qualification: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendedGrants = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        setError("User not logged in.");
        return;
      }

      const token = await user.getIdToken();

      const response = await axios.post(
        "http://localhost:4000/api/grants/recommended-grants",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGrants(response.data || {});
    } catch (err) {
      console.error("Error fetching recommendations:", err.message);
      setError("Could not load recommended grants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedGrants();
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

  const flattenGrants = () => {
    return [
      ...grants.recommended_by_interest,
      ...grants.recommended_by_publications,
      ...grants.recommended_by_qualification,
    ];
  };

 

  const handleExportCSV = () => {
    const allGrants = flattenGrants().map((item) => ({
      ...item.grant,
      reason: item.reason,
      score: item.score
    }));
  
    const csvContent = convertToCSV(allGrants);
    downloadCSV(csvContent, "recommended_grants.csv");
  };

  const allGrants = flattenGrants()
    .map((item) => ({ ...item })) // shallow copy
    .sort((a, b) => b.score - a.score); // optional: sort by score

    return (
      <div className="m-24 p-6 rounded-xl bg-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="text-heading-1 font-outfit font-semibold text-2xl flex items-center gap-2">
            <BsStars />
            Recommended Grants
          </div>
          {allGrants.length > 0 && <ExportCsv onClick={handleExportCSV} />}
        </div>
  
        {allGrants.length > 0 ? (
          allGrants.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl pl-4 pr-8 py-2 mb-6">
              <GrantItem grant={item.grant} />
              <div className="mt-2 text-sm text-heading-1 font-outfit">
                <strong>{item.reason}</strong> (Score: {item.score.toFixed(2)})
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No recommended grants found.</div>
        )}
      </div>
    );
  
};

export default RecommendedGrantsPage;
