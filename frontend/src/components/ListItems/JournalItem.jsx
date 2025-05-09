import React, { useState, useEffect } from 'react';
import JournalsModal from '../Modals/JournalsModal';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import axios from 'axios';
import { auth } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import SeeDetails from '../Buttons/SeeDetails';

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
          {journal.scope ? journal.scope : 'N/A'}
        </p>

        <p className='text-gray-600 line-clamp-2 mb-3 '>
          <span className='font-semibold'>Publisher:&nbsp;</span>
          {journal.publisher ? journal.publisher : 'N/A'}
        </p>

       <SeeDetails text={"See details"} onclick={()=>setOpen(true)}/>
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
