import React, { useEffect, useState } from 'react';
import JournalItem from '../components/ListItems/JournalItem'; 
import axios from 'axios';
import { Pagination, Spin } from 'antd';
import '../components/css/Pagination.css'; 

const JournalsPage = () => {
  const [journals, setJournals] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 
  const [totalJournals, setTotalJournals] = useState(0); 

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/journals?page=${currentPage}&limit=${itemsPerPage}`
        );

        setJournals(response.data.journals || []);
        setTotalJournals(response.data.total || 0);
        setLoading(false);
      } catch (err) {
        setError(err.message); 
        setLoading(false);
      }
    };

    fetchJournals();
  }, [currentPage, itemsPerPage]); 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin className="custom-spin" size="large" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="m-24 p-6 rounded-xl bg-gray-200">
        {/* Display journals if available */}
        {journals.length > 0 ? (
          journals.map((journal, index) => (
            <div key={index} className="bg-white rounded-xl pl-4 pr-8 py-2 mb-6">
              <JournalItem journal={journal} />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No journals found.</div>
        )}

        <div className="flex justify-center mt-6 custom-pagination font-outfit">
          <Pagination
            defaultCurrent={1} 
            current={currentPage} 
            total={totalJournals} 
            pageSize={itemsPerPage} 
            onChange={handlePageChange} 
            showSizeChanger={false} 
          />
        </div>
      </div>
    </div>
  );
};

export default JournalsPage;