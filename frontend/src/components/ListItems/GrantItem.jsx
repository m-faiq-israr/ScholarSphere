import React, { useState, useEffect } from "react";
import GrantsModal from "../Modals/GrantsModal";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { auth } from "../../firebase/firebase";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const GrantItem = ({ grant, onUnsaveSuccess }) => {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!userId || !grant?._id) return;

      try {
        const userDocRef = doc(db, "user_profile", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const savedGrants = userData.savedGrants || [];

          if (savedGrants.includes(grant._id)) {
            setSaved(true);
          }
        }
      } catch (error) {
        console.error("Error checking saved grants:", error);
      }
    };

    checkIfSaved();
  }, [grant, userId]);

  const handleSave = async () => {
    if (!userId || !grant?._id) return;  
    setSaved(true);
  
    try {
      const userDocRef = doc(db, "user_profile", userId);
      await updateDoc(userDocRef, {
        savedGrants: arrayUnion(grant._id)
      });
    } catch (error) {
      console.error("Error saving grant:", error);
      setSaved(false);
    }
  };
  
  const handleUnsave = async () => {
    if (!userId || !grant?._id) return;
  
    setSaved(false);
  
    try {
      const userDocRef = doc(db, "user_profile", userId);
      await updateDoc(userDocRef, {
        savedGrants: arrayRemove(grant._id)
      });
  
      if (onUnsaveSuccess) {
        onUnsaveSuccess(grant._id);
      }
  
    } catch (error) {
      console.error("Error unsaving grant:", error);
      setSaved(true);
    }
  };
  
  

  return (
    <div className="flex justify-between font-outfit p-1 h-full bg-white rounded-md">
      
      <div className="w-[70%]">
        <h1 className="font-semibold text-heading-1 pb-1 text-lg">{grant.title}</h1>
        <p className="text-gray-600 line-clamp-2">{grant.description}</p>
      </div>

      <div className="w-[30%] h-full flex flex-col items-end justify-between">
        
        {/* Save/Unsave Icon */}
        <div
          className="text-xl text-gray-600 hover:text-heading-1 cursor-pointer"
          onClick={saved ? handleUnsave : handleSave}
        >
          {saved ? <FaBookmark className="text-heading-1" /> : <FaRegBookmark />}
        </div>

        {/* Open Modal */}
        <button
          className="flex select-none items-center justify-center mt-7 text-sm w-28 bg-green-500 text-white px-1 py-1 rounded-md hover:bg-green-600 transition-colors"
          onClick={() => setOpen(true)}
        >
          See details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

      </div>

      {/* Modal Component */}
      <GrantsModal open={open} onClose={() => setOpen(false)} grant={grant} />
    </div>
  );
};

export default GrantItem;
