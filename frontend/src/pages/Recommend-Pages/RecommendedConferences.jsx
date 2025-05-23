import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import { auth } from "../../firebase/firebase";
import ConferenceItem from "../../components/ListItems/ConferenceItem";
import { BsStars } from "react-icons/bs";
import ExportCsv from "@/components/Buttons/ExportCsv";
import { convertToCSV, downloadCSV } from "@/utils/exportCsv";
import recomConferences from '../../assets/images/recomConferences.png'
import PaginationControls from "@/components/PaginationControls";
import { MdBatteryCharging20 } from "react-icons/md";
import loadingConf from '../../assets/images/loadingConf.png'



const RecommendedConferencesPage = () => {
  const [conferences, setConferences] = useState({
    recommended_by_interest: [],
    recommended_by_publications: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);


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
        `${import.meta.env.VITE_BACKEND_URL}/api/conferences/recommended-conferences`,
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
      <div className="mt-16 md:mt-24 p-6 flex flex-col items-center justify-center text-center space-y-6">
        <img
          src={loadingConf}
          alt="Loading illustration"
          className="w-full max-w-md"
        />
        <div className="flex items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-heading-1 font-outfit">
         "Hold on — your personalized conference recommendations are on the way!"
        </h2>
        <div className="w-8 h-8 border-[8px] border-heading-1 border-t-transparent rounded-full animate-spin"></div>
        </div>
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

  const allConfs = flattenConferences()
    .map((item) => ({ ...item }))
    .sort((a, b) => b.score - a.score);

  const handleExportCSV = () => {
    const csvData = allConfs.map((item) => ({
      ...item.conference,
      reason: item.reason,
      score: item.score
    }));
    const csvContent = convertToCSV(csvData);
    downloadCSV(csvContent, "recommended_conferences.csv");
  };

  const totalConfs = allConfs.length;
  const totalPages = Math.ceil(totalConfs / itemsPerPage);
  const paginatedConfs = allConfs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="mt-20 md:m-24 p-4 md:p-6 rounded-xl md:bg-[rgb(0,0,0,0.07)]">
      <div className="md:flex items-center justify-between mb-4">
        <div className="text-heading-1 font-outfit font-bold text-2xl md:text-3xl flex items-center gap-2">
          {/* <BsStars /> */}
          Recommended Conferences
          <img src={recomConferences} className="size-8 md:size-14" />
        </div>
        <div className="flex items-center justify-between md:justify-normal gap-2 mt-3 md:mt-0">
          {allConfs.length > 0 && <ExportCsv onClick={handleExportCSV} />}
          <div className="font-semibold text-heading-1 font-outfit select-none text-sm md:text-base">
            Recommended Conferences: {totalConfs}
          </div>
        </div>
      </div>

      {paginatedConfs.length > 0 ? (
        paginatedConfs.map((item, idx) => {
          return (
            <div key={idx} className="bg-white rounded-xl  border md:border-none pt-3 mb-6">
              <ConferenceItem conference={item.conference} reason={item.reason} />
              {/* <div className="mt text-sm text-heading-1 font-outfit">
                <p className={`${bgColor} font-outfit font-medium text-white rounded py-1 px-2 inline-flex items-center gap-1`}>{item.reason} <BsStars /></p>
              </div> */}
            </div>
          );

        })

      ) : (
        <div className="text-center text-gray-500">No recommended conferences found.</div>
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

export default RecommendedConferencesPage;
