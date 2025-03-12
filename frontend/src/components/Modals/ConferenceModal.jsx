import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import '../css/Modal.css'
import { FaExternalLinkAlt } from "react-icons/fa";

const ConferenceModal = ({ open, onClose, conference }) => {

    return (
        <Modal
            title={<div className="font-outfit font-bold text-heading-1 text-2xl">{conference.title || "Conference Details"}</div>}
            footer={
                <button
                className="inline-flex select-none items-center gap-2 rounded-xl bg-heading-1 font-outfit py-2 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-700"
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
                  <FaExternalLinkAlt/>
                </button>
              }
              
            open={open}
            onCancel={onClose}
            width={800}
            className="custom-modal"    >

            <div className="font-outfit ">
               

                <div className="flex items-center gap-5">
                    <div className="bg-gray-200 rounded-xl p-4 inline-block mt-5">
                        <h1 className="font-semibold text-lg text-heading-1">Conference Dates</h1>
                        <p className="text-heading-1 text-base">
                            {conference.dates ? `${conference.dates}` : `${conference.date}`}
                        </p>
                    </div>

                    <div className="bg-gray-200 rounded-xl p-4 inline-block mt-5">
                        <h1 className="font-semibold text-lg text-heading-1">Location</h1>
                        <p className="text-heading-1 text-base">{conference.location}</p>
                    </div>
                    {conference.topics && (

                    <div className="bg-gray-200 rounded-xl p-4 inline-block mt-5">
                        <h1 className="font-semibold text-lg text-heading-1">Conference Topics</h1>
                        <p className="text-heading-1 text-base">{conference.topics}</p>
                    </div>
                    )}
                </div>
<div>

</div>


            </div>

        </Modal>
    );
};

export default ConferenceModal;
