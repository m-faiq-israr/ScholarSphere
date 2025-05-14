import React, { useState, useEffect } from "react";
import { FaExternalLinkAlt, FaRegBookmark, FaBookmark } from "react-icons/fa";
import axios from "axios";
import { auth } from '../../firebase/firebase';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import { FaLink } from "react-icons/fa";
import { BsStars } from "react-icons/bs";


const ConferenceItem = ({ conference, onUnsaveSuccess, reason }) => {

  const [saved, setSaved] = useState(false);
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;
   const bgColor = reason === 'Matches your Topics of Interests'
            ? 'bg-teal-500'
            : 'bg-teal-500';

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!userId || !conference?._id) return;

      try {
        const userDocRef = doc(db, "user_profile", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const savedConferences = userData.savedConferences || [];

          if (savedConferences.includes(conference._id)) {
            setSaved(true);
          }
        }
      } catch (error) {
        console.error("Error checking saved conferences:", error);
      }
    };

    checkIfSaved();
  }, [conference, userId]);

  const handleSave = () => {
    setSaved(true);

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/items/save-item`, {
      userId,
      itemId: conference._id,
      itemType: "conference",
    }).catch(error => {
      console.error("Error saving conference:", error);
      setSaved(false);
    });
  };

  const handleUnsave = () => {
    setSaved(false);

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/items/unsave-item`, {
      userId,
      itemId: conference._id,
      itemType: "conference",
    }).then(() => {
      if (onUnsaveSuccess) {
        onUnsaveSuccess(conference._id);
      }
    }).catch(error => {
      console.error("Error unsaving conference:", error);
      setSaved(true);
    });
  };


  return (
    <div className="relative bg-white rounded-xl  text-heading-1">

      {/* Save Icon Top Right */}
      <div
        className="absolute hidden md:block top-3 right-3 cursor-pointer mx-4 text-xl text-gray-600 hover:text-heading-1"
        onClick={saved ? handleUnsave : handleSave}
      >
        {saved ? <FaBookmark className="text-heading-1" /> : <FaRegBookmark />}
      </div>

      <h2 className="text-base md:text-lg font-semibold font-outfit mb-1 mx-4">{conference.title}</h2>

      <p className=" font-outfit text-gray-600 text-sm md:text-base mx-4">
        <span className="font-semibold">Date: </span>
        {conference.start_date}
        {conference.end_date && ` - ${conference.end_date}`}
      </p>

      <p className="mb-1 font-outfit text-gray-600 text-sm md:text-base mx-4">
        <span className="font-semibold">Location: </span>
        {conference.location || "N/A"}
      </p>

      <div className="flex items-center justify-between mx-4">
        <button
          className="flex gap-2 select-none items-center justify-center mt-3 text-xs md:text-sm  bg-emerald-500 text-white px-4 md:px-5 py-1  rounded-md hover:bg-emerald-600 font-outfit transition-colors"
          onClick={() => {
            if (conference.link) {
              window.open(conference.link, "_blank");
            } else if (conference.url) {
              window.open(conference.url, "_blank");
            } else {
              console.warn("No link available for this conference");
            }
          }}
        >
          Apply
          <FaLink />
        </button>
        <div
          className=" md:hidden  cursor-pointer text-gray-600 hover:text-heading-1"
          onClick={saved ? handleUnsave : handleSave}
        >
          {saved ? <FaBookmark className="text-heading-1" /> : <FaRegBookmark />}
        </div>
      </div>
      {reason !== 'nothing' && (
        <p className={`${bgColor} text-sm font-outfit  text-white rounded-bl-xl mt-4 rounded-tr-xl py-1 pl-4 pr-2 inline-flex items-center gap-1`}>{reason} <BsStars  /></p>
      )}

    </div>
  );
};

export default ConferenceItem;
