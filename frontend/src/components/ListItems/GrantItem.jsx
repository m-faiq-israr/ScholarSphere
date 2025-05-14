import React, { useState, useEffect } from "react";
import GrantsModal from "../Modals/GrantsModal";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { auth } from "../../firebase/firebase";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import SeeDetails from "../Buttons/SeeDetails";
import axios from "axios";
import { BsStars } from "react-icons/bs";

const GrantItem = ({ grant, onUnsaveSuccess, reason }) => {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;
  const normalizedStatus = grant.opportunity_status?.toLowerCase?.() || "";
   const bgColor =
    reason === 'Matches your Topics of Interests'
      ? 'bg-cyan-500'
      : reason === 'Matches your Qualifications'
      ? 'bg-cyan-500'
      : 'bg-cyan-500';

  const isOpenStatus = [
    "open",
    "posted",
    "cleared",
    "waiting for new publication",
    "",
  ].includes(normalizedStatus);

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

  const handleSave = () => {
    setSaved(true);

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/items/save-item`, {
      userId,
      itemId: grant._id,
      itemType: "grant",
    }).catch(error => {
      console.error("Error saving grant:", error);
      setSaved(false);
    });
  };

  const handleUnsave = () => {
    setSaved(false);

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/items/unsave-item`, {
      userId,
      itemId: grant._id,
      itemType: "grant",
    }).then(() => {
      if (onUnsaveSuccess) {
        onUnsaveSuccess(grant._id);
      }
    }).catch(error => {
      console.error("Error unsaving grant:", error);
      setSaved(true);
    });
  };

  return (
    <div>
    <div className="flex justify-between font-outfit px-4  h-full bg-white rounded-md">

      <div className="w-[70%]">
        {normalizedStatus === "forecasted" && (
          <div className="bg-cyan-500 rounded-sm font-medium text-white text-xs md:text-sm px-2 py-1 inline-block">Forecasted</div>
        )}
        {normalizedStatus === "upcoming" && (
          <div className="bg-orange-500 rounded-sm font-medium text-white text-xs md:text-sm px-2 py-1 inline-block">Upcoming</div>
        )}
        {isOpenStatus && (
          <div className="bg-teal-500 rounded-sm font-medium text-white text-xs md:text-sm px-2 py-1 inline-block">Applications Open</div>
        )}

        <h1 className="font-semibold text-heading-1 pb-1 text-base md:text-lg">{grant.title}</h1>
        {grant?.description !== null && grant?.description !== '' ? (
          <p className="text-gray-600 line-clamp-2 text-sm md:text-base">{grant?.description}</p>
        ) : (
          <p className='text-gray-600 line-clamp-2 text-sm md:text-base '>
            <span className='font-semibold'>Description:</span>
            N/A
          </p>
        )}
      </div>

      <div className="w-[30%] flex flex-col justify-between items-end">
        <div
          className="md:text-xl text-gray-600 hover:text-heading-1 cursor-pointer"
          onClick={saved ? handleUnsave : handleSave}
        >
          {saved ? <FaBookmark className="text-heading-1" /> : <FaRegBookmark />}
        </div>

        <SeeDetails onclick={() => setOpen(true)} text={"See details"} />
      </div>
      </div>
 {reason !== 'nothing' && (
        <p className={`${bgColor} text-sm font-outfit  text-white rounded-bl-xl mt-4 rounded-tr-xl py-1 px-2 inline-flex items-center gap-1`}>{reason} <BsStars/></p>
      )}
      <GrantsModal open={open} onClose={() => setOpen(false)} grant={grant} />
    </div>
  );
};

export default GrantItem;

