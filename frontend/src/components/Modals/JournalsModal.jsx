import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "../css/Modal.css";
import ModalButton from "../Buttons/ModalButton";

const JournalsModal = ({ open, onClose, journal }) => {
  const [visible, setVisible] = useState(open);
  const [closing, setClosing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);


  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      setClosing(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 250); 
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible) return null;

  const GoToHomepage = () => {
    if (journal.homepage) {
      window.open(journal.homepage, "_blank");
    } else {
      console.warn("No link available for this journal");
    }
  };

  const GoToPublishGuide = () => {
    if (journal.publish_guide) {
      window.open(journal.publish_guide, "_blank");
    } else {
      console.warn("No link available for this journal");
    }
  };

  const GoToContactEmail = () => {
    if (journal.contact_email) {
      window.location.href = `mailto:${journal.contact_email}`;
    } else {
      console.warn("No email available for this journal");
    }
  };

  return (
    <Modal
      title={
        <div className="font-outfit font-bold text-heading-1 text-lg md:text-2xl pl-2">
          {journal.title || "Journal Details"}
        </div>
      }
      footer={
        <div className="flex items-center gap-2 md:gap-4 justify-end">
          {journal?.homepage && (<ModalButton title={"Homepage"} onClick={GoToHomepage} />)}
          {journal?.publish_guide && (<ModalButton title={"Publish Guide"} onClick={GoToPublishGuide} />)}
          {journal?.contact_email && (<ModalButton title={"Contact"} onClick={GoToContactEmail} />)}



        </div>
      }
      open={true}
      onCancel={onClose}
      width={800}
      className={`custom-modal${closing ? " closing" : ""}`}
      destroyOnClose={false}
    >
      <div className="font-outfit pl-2">
        <div>
          {journal.scope && (
            <div className="bg-[rgb(0,0,0,0.07)] rounded-xl p-4 inline-block mb-2 mt-5 transition duration-700 ease-in-out transform">
            <h1 className="font-semibold text-base md:text-lg text-heading-1">Description:</h1>
            <p className={`text-heading-1 text-sm md:text-base   ${!isExpanded ? "line-clamp-2" : ""}`}>
              {journal.scope}
            </p>
            {journal.scope && journal.scope.length > 100 && (
              <button
                className="mt text-blue-500 hover:underline text-xs md:text-sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
          )}

          <div className="bg-[rgb(0,0,0,0.07)] rounded-xl p-4 inline-block w-full mb-2 mt-1 ">
            <h1 className="font-semibold text-base md:text-lg text-heading-1">Subject Areas:</h1>
            <p className="text-heading-1 text-sm md:text-base ">
              {Array.isArray(journal.subject_areas)
                ? journal.subject_areas.join(", ")
                : journal.subject_areas}
            </p>
          </div>
        </div>

        {journal.publisher && (
          <div className="bg-[rgb(0,0,0,0.07)] rounded-xl p-4 inline-block mt-1 w-full">
            <h1 className="font-semibold text-base md:text-lg text-heading-1">Publisher:</h1>
            <p className="text-heading-1 text-sm md:text-base ">{journal.publisher}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-3">
          {journal.coverage && (
            <div className="bg-[rgb(0,0,0,0.07)] rounded-xl p-4 inline-block ">
              <h1 className="font-semibold text-base md:text-lg text-heading-1">Coverage:</h1>
              <p className="text-heading-1 text-xs md:text-base ">{journal.coverage}</p>
            </div>
          )}

          {journal.country && (
            <div className="bg-[rgb(0,0,0,0.07)] rounded-xl p-4 inline-block ">
              <h1 className="font-semibold text-base md:text-lg text-heading-1">Country:</h1>
              <p className="text-heading-1 text-xs md:text-base ">{journal.country}</p>
            </div>
          )}

          {journal.contact_email && (
            <div className="bg-[rgb(0,0,0,0.07)] rounded-xl p-4 inline-block ">
              <h1 className="font-semibold text-base md:text-lg text-heading-1">Contact Email:</h1>
              <p className="text-heading-1 text-xs md:text-base ">{journal.contact_email}</p>
            </div>
          )}
        </div>


      </div>
    </Modal>
  );
};

export default JournalsModal;
