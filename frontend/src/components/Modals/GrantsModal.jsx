import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import '../css/Modal.css'
import { FaExternalLinkAlt } from "react-icons/fa";
import ModalButton from "../Buttons/ModalButton";

const GrantsModal = ({ open, onClose, grant }) => {

  const GrantApply = () =>{
    if (grant?.link) {
      window.open(grant.link, "_blank");
  } else {
      console.warn("No link available for this conference");
  }
  }

    return (
        <Modal
            title={<div className="font-outfit font-bold text-heading-1 text-2xl">{grant?.title || "Grant Details"}</div>}
            footer={
                <ModalButton title={'Apply'} onClick={GrantApply} />
              }
              
            open={open}
            onCancel={onClose}
            width={800}
            className="custom-modal"    >

            <div className="font-outfit ">
                {/* description box */}
                <div className="bg-gray-200 p-4 rounded-xl mt-5 ">
                    <h1 className="font-semibold text-lg text-heading-1">Description</h1>
                    <p className="text-heading-1 text-base">
                        {grant?.description || "No description available"}
                    </p>
                </div>

                <div className="flex items-center gap-5">
                    {/* amount box */}
                    <div className="bg-gray-200 rounded-xl p-4 inline-block mt-5">
                        <h1 className="font-semibold text-lg text-heading-1">Grant Amount</h1>
                        <p className="text-heading-1 text-base">
                            {grant?.total_fund ? `${grant.total_fund}` : "N/A"}
                        </p>
                    </div>

                    <div className="bg-gray-200 rounded-xl p-4 inline-block mt-5">
                        <h1 className="font-semibold text-lg text-heading-1">Opening Date</h1>
                        <p className="text-heading-1 text-base">{grant?.posted_date ? `${grant.posted_date}` : `${grant.opening_date}`}</p>
                    </div>

                    <div className="bg-gray-200 rounded-xl p-4 inline-block mt-5">
                        <h1 className="font-semibold text-lg text-heading-1">Closing Date</h1>
                        <p className="text-heading-1 text-base">{grant?.due_date ? `${grant.due_date}` : `${grant.closing_date}`}</p>
                    </div>
                </div>
<div>
{grant.funders && grant.funders.length > 0 && (
                <div className="mt-2">
                  <strong>Funders:</strong>
                  <ul>
                    {grant.funders.map((funder, idx) => (
                      <li key={idx}>{funder}</li>
                    ))}
                  </ul>
                </div>
              )}
</div>


            </div>

        </Modal>
    );
};

export default GrantsModal;
