import React, { useState, useEffect } from 'react';
import JournalsModal from '../Modals/JournalsModal';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import axios from 'axios';
import { auth } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const JournalItem = ({ journal, onUnsaveSuccess }) => {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!userId || !journal?._id) return;

      try {
        const userDocRef = doc(db, "user_profile", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const savedJournals = userData.savedJournals || [];

          if (savedJournals.includes(journal._id)) {
            setSaved(true);
          }
        }
      } catch (error) {
        console.error("Error checking saved journals:", error);
      }
    };

    checkIfSaved();
  }, [journal, userId]);

  const handleSave = () => {
    setSaved(true);

    axios.post("http://localhost:4000/api/items/save-item", {
      userId,
      itemId: journal._id,
      itemType: "journal",
    }).catch(error => {
      console.error("Error saving journal:", error);
      setSaved(false);
    });
  };

  const handleUnsave = () => {
    setSaved(false);
  
    axios.post("http://localhost:4000/api/items/unsave-item", {
      userId,
      itemId: journal._id,
      itemType: "journal",
    }).then(() => {
      if (onUnsaveSuccess) {
        onUnsaveSuccess(journal._id);
      }
    }).catch(error => {
      console.error("Error unsaving journal:", error);
      setSaved(true);
    });
  };
  

  return (
    <div className='flex justify-between font-outfit p-1 h-full bg-white rounded-md '>
      
      {/* Left side */}
      <div className='w-[70%]'>
        <h1 className='font-semibold text-heading-1 pb-1 line-clamp-1 text-lg'>{journal.title}</h1>
        
        <p className='text-gray-600 line-clamp-2 '>
          <span className='font-semibold'>Description:&nbsp;</span>
          {journal.scope}
        </p>

        <p className='text-gray-600 line-clamp-2 '>
          <span className='font-semibold'>Publisher:&nbsp;</span>
          {journal.publisher}
        </p>

        <button 
          onClick={() => setOpen(true)} 
          className='flex items-center justify-center select-none mt-3 text-sm w-28 bg-green-500 text-white px-1 py-1 rounded-md hover:bg-green-600 transition-colors'
        >
          See details
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4 ml-1'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
        </button>
      </div>

      {/* Right side */}
      <div className='w-[30%] h-full flex flex-col justify-end items-end'>
        
        {/* Save Icon at bottom right */}
        <div 
          className='text-xl text-gray-600 hover:text-heading-1 cursor-pointer'
          onClick={saved ? handleUnsave : handleSave}
        >
          {saved ? <FaBookmark className="text-heading-1" /> : <FaRegBookmark />}
        </div>

      </div>

      {/* Modal */}
      <JournalsModal open={open} onClose={() => setOpen(false)} journal={journal} />
    </div>
  );
};

export default JournalItem;
