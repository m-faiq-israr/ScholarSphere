import React, { useState } from "react";
import GrantsModal from "../Modals/GrantsModal";
const GrantItem = ({ grant }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between font-outfit p-1 h-full">
      <div className="w-[70%]">
        <h1 className="font-bold text-heading-1 pb-1 text-lg">{grant.title}</h1>
        <p className="text-gray-600 line-clamp-2">{grant.description}</p>
      </div>

      <div className="w-[30%] h-full flex flex-col items-end justify-between">
        <div className="text-sm text-heading-1 font-semibold">
          Amount: {grant.total_fund ? `${grant.total_fund}` : "N/A"}
        </div>

        {/* Open modal on button click */}
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
