import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import { auth } from "../../firebase/firebase";
import { BsStars } from "react-icons/bs";
import ExportCsv from "@/components/Buttons/ExportCsv";
import { convertToCSV, downloadCSV } from "@/utils/exportCsv";
import GrantItem from "../../components/ListItems/GrantItem";
import recomGrants from '../../assets/images/recomGrants.png'
import PaginationControls from "@/components/PaginationControls";



const RecommendedGrantsPage = () => {
  const [grants, setGrants] = useState({
    recommended_by_interest: [],
    recommended_by_publications: [],
    recommended_by_qualification: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);


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
      console.error("Error fetching grant recommendations:", err.message);
      setError("Could not load recommended grants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedGrants();
  }, []);

  const flattenGrants = () => {
    return [
      ...grants.recommended_by_interest,
      ...grants.recommended_by_publications,
      ...grants.recommended_by_qualification
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

  const allGrants = flattenGrants()
    .map((item) => ({ ...item }))
    .sort((a, b) => b.score - a.score);

  const totalPages = Math.ceil(allGrants.length / itemsPerPage);
  const paginatedGrants = allGrants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalGrants = allGrants.length;



  return (
    <div className="mt-20 md:m-24 p-4 md:p-6 rounded-xl md:bg-[rgb(0,0,0,0.07)]">
      <div className="md:flex items-center justify-between mb-4">
        <div className="text-heading-1 font-outfit font-bold text-xl md:text-3xl flex items-center ">
          {/* <BsStars /> */}
          Recommended Grants
          <img src={recomGrants} className="size-8 md:size-14" />
        </div>
        <div className="flex items-center justify-between md:justify-normal gap-2 mt-3 md:mt-0">
          {allGrants.length > 0 && <ExportCsv onClick={handleExportCSV} />}
          <div className="font-semibold text-heading-1 font-outfit select-none text-sm md:text-base">
            Recommended Grants: {totalGrants}
          </div>
        </div>
      </div>

      {paginatedGrants.length > 0 ? (
        paginatedGrants.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl px-3 md:px-4 border md:border-none py-2 mb-6">
            <GrantItem grant={{ ...item.grant }} />

            <div className="mt-2 text-sm text-heading-1 font-outfit">
              <strong>{item.reason}</strong> (Score: {item.score.toFixed(2)})
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No recommended grants found.</div>
      )}

      {/* Pagination */}
      <PaginationControls
  currentPage={currentPage}
  totalPages={totalPages}
  setCurrentPage={setCurrentPage}
/>
    </div>

  );
};

export default RecommendedGrantsPage;

