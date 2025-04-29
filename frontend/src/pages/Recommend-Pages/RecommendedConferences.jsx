import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import { auth } from "../../firebase/firebase";
import ConferenceItem from "../../components/ListItems/ConferenceItem";
import { BsStars } from "react-icons/bs";
import { FaFileExport } from "react-icons/fa6";
import ExportCsv from "@/components/Buttons/ExportCsv";


const RecommendedConferencesPage = () => {
  const [conferences, setConferences] = useState([]);
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

      setConferences(response.data || []);
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

  // Utility to convert JSON to CSV
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";

    const header = Object.keys(data[0]).join(",");
    const rows = data.map((item) =>
      Object.values(item)
        .map((value) =>
          typeof value === "string"
            ? `"${value.replace(/"/g, '""')}"`
            : `"${JSON.stringify(value)}"`
        )
        .join(",")
    );

    return [header, ...rows].join("\n");
  };

  // Function to trigger download
  const downloadCSV = (csvContent, filename = "conferences.csv") => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleExportCSV = () => {
    const csvData = conferences.map((item) => ({
      ...item.conference,
    }));

    const csvContent = convertToCSV(csvData);
    downloadCSV(csvContent, "recommended_conferences.csv");
  };


  return (
    <div className="m-24 p-6 rounded-xl bg-gray-200">
      <div className="flex items-center justify-between mb-6">
      <div className="text-heading-1 font-outfit font-semibold text-2xl flex items-center gap-2">
        <BsStars />
        Recommended Conferences
      </div>
      {conferences.length > 0 && (
        <ExportCsv onClick={handleExportCSV}/>
      )}
      </div>

      {conferences.length > 0 ? (
        conferences.map((item, index) => (
          <div key={index} className="bg-white rounded-xl pl-4 pr-8 py-2 mb-6">
            <ConferenceItem conference={item.conference} />

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
        <div className="text-center text-gray-500">No recommended conferences found.</div>
      )}
    </div>
  );
};

export default RecommendedConferencesPage;
