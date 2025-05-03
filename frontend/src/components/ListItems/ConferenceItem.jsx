import React, { useState, useEffect } from "react";
import { FaExternalLinkAlt, FaRegBookmark, FaBookmark } from "react-icons/fa";
import axios from "axios";
import { auth } from '../../firebase/firebase';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase/firebase';

const ConferenceItem = ({ conference, onUnsaveSuccess }) => {

  const [saved, setSaved] = useState(false);
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

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

    axios.post("http://localhost:4000/api/items/save-item", {
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

    axios.post("http://localhost:4000/api/items/unsave-item", {
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
    <div className="relative bg-white rounded-xl p-1 text-heading-1">

      {/* Save Icon Top Right */}
      <div
        className="absolute top-3 right-3 cursor-pointer text-xl text-gray-600 hover:text-heading-1"
        onClick={saved ? handleUnsave : handleSave}
      >
        {saved ? <FaBookmark className="text-heading-1" /> : <FaRegBookmark />}
      </div>

      <h2 className="text-lg font-semibold font-outfit mb-1">{conference.title}</h2>

      <p className="mb-1 font-outfit text-gray-600">
        <span className="font-semibold">Date: </span>
        {conference.start_date}
        {conference.end_date && ` - ${conference.end_date}`}
      </p>

      <p className="mb-1 font-outfit text-gray-600">
        <span className="font-semibold">Location: </span>
        {conference.location || "N/A"}
      </p>

      <button
        className="flex gap-2 select-none items-center justify-center mt-3 text-sm w-28 bg-green-500 text-white px-1 py-1 rounded-md hover:bg-green-600 transition-colors"
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
        <FaExternalLinkAlt />
      </button>
    </div>
  );
};

export default ConferenceItem;
