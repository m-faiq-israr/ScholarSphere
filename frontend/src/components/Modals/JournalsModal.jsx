import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "../css/Modal.css";
import ModalButton from "../Buttons/ModalButton";

const JournalsModal = ({ open, onClose, journal }) => {
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
        <div className="font-outfit font-bold text-heading-1 text-2xl">
          {journal.title || "Journal Details"}
        </div>
      }
      footer={
        <div className="flex items-center gap-4 justify-end">
          <ModalButton title={"Homepage"} onClick={GoToHomepage} />
          <ModalButton title={"Publish Guide"} onClick={GoToPublishGuide} />
          <ModalButton title={"Contact"} onClick={GoToContactEmail} />
        </div>
      }
      open={true}
      onCancel={onClose}
      width={800}
      className={`custom-modal${closing ? " closing" : ""}`}
      destroyOnClose={false}
    >
      <div className="font-outfit">
      <div>
          <div className="bg-gray-200 rounded-xl p-4 inline-block mb-2 mt-5 ">
            <h1 className="font-semibold text-lg text-heading-1">Subject Areas</h1>
            <p className="text-heading-1 text-base">
              {Array.isArray(journal.subject_areas)
                ? journal.subject_areas.join(", ")
                : journal.subject_areas}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="bg-gray-200 rounded-xl p-4 inline-block mt-5">
            <h1 className="font-semibold text-lg text-heading-1">Publisher</h1>
            <p className="text-heading-1 text-base">{journal.publisher}</p>
          </div>

          <div className="bg-gray-200 rounded-xl p-4 inline-block mt-5">
            <h1 className="font-semibold text-lg text-heading-1">Coverage</h1>
            <p className="text-heading-1 text-base">{journal.coverage}</p>
          </div>

          <div className="bg-gray-200 rounded-xl p-4 inline-block mt-5">
            <h1 className="font-semibold text-lg text-heading-1">Country</h1>
            <p className="text-heading-1 text-base">{journal.country_flag}</p>
          </div>

          {journal.contact_email && (
            <div className="bg-gray-200 rounded-xl p-4 inline-block mt-5">
              <h1 className="font-semibold text-lg text-heading-1">Contact Email</h1>
              <p className="text-heading-1 text-base">{journal.contact_email}</p>
            </div>
          )}
        </div>

        
      </div>
    </Modal>
  );
};

export default JournalsModal;
