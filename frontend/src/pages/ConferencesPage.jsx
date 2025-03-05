import React, { useEffect, useState } from 'react';
import ConferenceItem from '../components/ListItems/ConferenceItem'; // Assuming you have a ConferenceItem component
import axios from 'axios';
import { Pagination, Spin } from 'antd';
import '../components/css/Pagination.css'; // Import your custom CSS for pagination

const ConferencesPage = () => {
  const [conferences, setConferences] = useState([]); // State to store conferences
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage] = useState(10); // Items per page
  const [totalConferences, setTotalConferences] = useState(0); // Total number of conferences

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        // Fetch conferences from the API
        const response = await axios.get(
          `http://localhost:4000/api/conferences?page=${currentPage}&limit=${itemsPerPage}`
        );

        // Set the combined conferences array and total count
        setConferences(response.data.conferences || []);
        setTotalConferences(response.data.total || 0);
        setLoading(false);
      } catch (err) {
        setError(err.message); // Set error message if something goes wrong
        setLoading(false);
      }
    };

    fetchConferences();
  }, [currentPage, itemsPerPage]); // Re-fetch data when currentPage changes

  // Display a loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin className="custom-spin" size="large" />
      </div>
    );
  }

  // Display an error message if there's an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle page change for pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="m-24 p-6 rounded-xl bg-gray-200">
        {/* Display conferences if available */}
        {conferences.length > 0 ? (
          conferences.map((conference, index) => (
            <div key={index} className="bg-white rounded-xl pl-4 pr-8 py-2 mb-6">
              <ConferenceItem conference={conference} />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No conferences found.</div>
        )}

        <div className="flex justify-center mt-6 custom-pagination font-outfit">
          <Pagination
            defaultCurrent={1}
            current={currentPage} 
            total={totalConferences} 
            pageSize={itemsPerPage} 
            onChange={handlePageChange} 
            showSizeChanger={false} 
          />
        </div>
      </div>
    </div>
  );
};

export default ConferencesPage;