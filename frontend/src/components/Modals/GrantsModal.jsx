import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "./modal.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ModalButton from "../Buttons/ModalButton";


const GrantsModal = ({ open, onClose, grant }) => {
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const [isWhoCanApplyOpen, setIsWhoCanApplyOpen] = useState(false);
  const [showFullScope, setShowFullScope] = useState(false);
  const [showFullWhoCanApply, setShowFullWhoCanApply] = useState(false);

  const GrantApply = () => {
    if (grant?.link) {
      window.open(grant.link, "_blank");
    } else {
      console.warn("No link available for this grant");
    }
  };

  
const truncateText = (text, wordLimit = 100) => {
  const words = text.split(" ");
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
};


  return (
    <Modal
      title={
        <div className="font-outfit font-bold text-heading-1 text-2xl">
          {grant?.title || "Grant Details"}
        </div>
      }
      footer={<ModalButton title={"Apply"} onClick={GrantApply} />}
      open={open}
      onCancel={onClose}
      width={800}
      className="custom-modal"
    >
      {/* Scrollable Content */}
      <div className="modal-content font-outfit">
        {/* Description Box */}
        <div className="bg-gray-200 p-4 rounded-xl mt-5">
          <h1 className="font-semibold text-lg text-heading-1">Description</h1>
          <p className="text-heading-1 text-base">
            {grant?.description || "No description available"}
          </p>
        </div>

        <div className="flex items-center gap-5">
          {/* Amount Box */}
          <div className="bg-gray-200 rounded-xl p-4 inline-block mt-5">
            <h1 className="font-semibold text-lg text-heading-1">Grant Amount</h1>
            <p className="text-heading-1 text-base">
              {grant?.total_fund ? `${grant.total_fund}` : "N/A"}
            </p>
          </div>

          {/* Opening Date */}
          <div className="bg-gray-200 rounded-xl p-4 inline-block mt-5">
            <h1 className="font-semibold text-lg text-heading-1">Opening Date</h1>
            <p className="text-heading-1 text-base">
              {grant?.posted_date ? `${grant.posted_date}` : `${grant.opening_date}`}
            </p>
          </div>

          {/* Closing Date */}
          <div className="bg-gray-200 rounded-xl p-4 inline-block mt-5">
            <h1 className="font-semibold text-lg text-heading-1">Closing Date</h1>
            <p className="text-heading-1 text-base">
              {grant?.due_date ? `${grant.due_date}` : `${grant.closing_date}`}
            </p>
          </div>
        </div>

  {/* Scope Section */}
  {grant?.scope && (
          <div className="mt-5 bg-gray-200 p-4 rounded-xl">
            <button
              onClick={() => setIsScopeOpen(!isScopeOpen)}
              className="flex justify-between items-center w-full py-2 text-left text-lg font-semibold text-heading-1"
            >
              Scope {isScopeOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isScopeOpen && (
              <>
                <p className="text-base">
                  {showFullScope ? grant.scope : truncateText(grant.scope)}
                </p>
                {grant.scope.split(" ").length > 20 && (
                  <button
                    onClick={() => setShowFullScope(!showFullScope)}
                    className="text-blue-600 underline mt-2"
                  >
                    {showFullScope ? "Show Less" : "Show More"}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Who Can Apply Section */}
        {grant?.who_can_apply && (
          <div className="mt-5 bg-gray-200 p-4 rounded-xl">
            <button
              onClick={() => setIsWhoCanApplyOpen(!isWhoCanApplyOpen)}
              className="flex justify-between items-center w-full py-2 text-left text-lg font-semibold text-heading-1"
            >
              Who Can Apply {isWhoCanApplyOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isWhoCanApplyOpen && (
              <>
                <p className="text-base">
                  {showFullWhoCanApply ? grant.who_can_apply : truncateText(grant.who_can_apply)}
                </p>
                {grant.who_can_apply.split(" ").length > 20 && (
                  <button
                    onClick={() => setShowFullWhoCanApply(!showFullWhoCanApply)}
                    className="text-blue-600 underline mt-2"
                  >
                    {showFullWhoCanApply ? "Show Less" : "Show More"}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GrantsModal;
