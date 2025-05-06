import React, { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import "./modal.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ModalButton from "../Buttons/ModalButton";

const GrantsModal = ({ open, onClose, grant }) => {
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const [isWhoCanApplyOpen, setIsWhoCanApplyOpen] = useState(false);
  const [showFullScope, setShowFullScope] = useState(false);
  const [showFullWhoCanApply, setShowFullWhoCanApply] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const words = grant.description?.split(/\s+/) || [];
  const isLong = words.length > 75;
  const preview = words.slice(0, 75).join(' ') + (isLong ? '...' : '');
  const toggleExpanded = () => setExpanded(!expanded);

  // Animation state
  const [visible, setVisible] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 250); // match fadeScaleOut duration
      return () => clearTimeout(timer);
    }
  }, [open]);


  if (!visible) return null;

  const GrantApply = () => {
    if (grant?.link) {
      window.open(grant.link, "_blank");
    } else {
      console.warn("No link available for this grant");
    }
  };

  const GoToContactEmail = () => {
    if (grant?.contact_email) {
      window.location.href = `mailto:${grant.contact_email}`;
    } else {
      console.warn("No email available for this journal");
    }
  };

  const truncateText = (text, wordLimit = 100) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <Modal
      title={
        <div className="font-outfit font-bold text-heading-1 text-2xl">
          {grant?.title || "Grant Details"}
        </div>
      }
      footer={
        <div className="flex items-center gap-4 justify-end">
          {grant?.contact_email != null && (<ModalButton title={"Contact"} onClick={GoToContactEmail} />)}
          {grant?.link != null && (<ModalButton title={"Apply"} onClick={GrantApply} />)}
        </div>
      }
      open={true}
      onCancel={onClose}
      width={800}
      className={`custom-modal${closing ? " closing" : ""}`}
      maskClosable
      // Remove destroyOnClose if you want content to stay mounted
      destroyOnClose={false}
    >
      {/* Scrollable Content */}
      <div className="modal-content font-outfit">
        {/* Description Box */}
        {grant?.description !== null && grant?.description !== '' && (
           <div className="bg-[rgb(0,0,0,0.07)] p-4 rounded-xl mt-5">
           <h1 className="font-semibold text-lg text-heading-1">Description:</h1>
           <p className="text-heading-1 text-base whitespace-pre-wrap">
             {expanded || !isLong ? grant.description : preview}
           </p>
           {isLong && (
             <button
               onClick={toggleExpanded}
               className="text-blue-600 mt-2 underline text-sm"
             >
               {expanded ? 'Show Less' : 'Show More'}
             </button>
           )}
         </div>
        )}

        <div className="flex items-center gap-5">
          {/* Amount Box */}
          {grant?.total_fund !== null && grant?.total_fund !== '' && (
            <div className="bg-[rgb(0,0,0,0.07)] rounded-xl p-4 inline-block mt-5">
              <h1 className="font-semibold text-lg text-heading-1">Grant Amount:</h1>
              <p className="text-heading-1 text-base">
                {grant.total_fund}
              </p>
            </div>
          )}


          {/* Opening Date */}
          {(grant?.posted_date || grant?.opening_date) && (
            <div className="bg-[rgb(0,0,0,0.07)] rounded-xl p-4 inline-block mt-5">
              <h1 className="font-semibold text-lg text-heading-1">Opening Date:</h1>
              <p className="text-heading-1 text-base">
                {grant?.posted_date ? `${grant.posted_date}` : `${grant.opening_date}`}
              </p>
            </div>
          )}

          {/* Closing Date */}
          {(grant?.due_date || grant?.closing_date) && (
            <div className="bg-[rgb(0,0,0,0.07)] rounded-xl p-4 inline-block mt-5">
              <h1 className="font-semibold text-lg text-heading-1">Closing Date:</h1>
              <p className="text-heading-1 text-base">
                {grant?.due_date ? `${grant.due_date}` : `${grant.closing_date}`}
              </p>
            </div>
          )}
        </div>
        {/* Scope Section */}
        {grant?.scope && (
          <div className="mt-5 bg-[rgb(0,0,0,0.07)] p-4 rounded-xl">
            <button
              onClick={() => setIsScopeOpen(!isScopeOpen)}
              className="flex justify-between items-center w-full py-2 text-left text-lg font-semibold text-heading-1"
            >
              Scope: {isScopeOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <div
              className={`transition-all duration-300 ease-in-out transform origin-top ${isScopeOpen ? "scale-100 opacity-100 mt-2" : "scale-95 opacity-0 h-0 overflow-hidden"
                }`}
            >
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
            </div>
          </div>
        )}

        {/* Who Can Apply Section */}
        {grant?.who_can_apply && (
          <div className="mt-5 bg-[rgb(0,0,0,0.07)] p-4 rounded-xl">
            <button
              onClick={() => setIsWhoCanApplyOpen(!isWhoCanApplyOpen)}
              className="flex justify-between items-center w-full py-2 text-left text-lg font-semibold text-heading-1"
            >
              Who Can Apply: {isWhoCanApplyOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <div
              className={`transition-all duration-300 ease-in-out transform origin-top ${isWhoCanApplyOpen ? "scale-100 opacity-100 mt-2" : "scale-95 opacity-0 h-0 overflow-hidden"
                }`}
            >
              <p className="text-base">
                {showFullWhoCanApply
                  ? grant.who_can_apply
                  : truncateText(grant.who_can_apply)}
              </p>
              {grant.who_can_apply.split(" ").length > 20 && (
                <button
                  onClick={() => setShowFullWhoCanApply(!showFullWhoCanApply)}
                  className="text-blue-600 underline mt-2"
                >
                  {showFullWhoCanApply ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GrantsModal;
