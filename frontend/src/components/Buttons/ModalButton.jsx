import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa';

const ModalButton = ({title, onClick}) => {
    return (
        <button
            className="inline-flex select-none items-center gap-2 rounded-xl bg-heading-1 font-outfit py-2 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-700"
            onClick={onClick}
        >

            {title}
            <FaExternalLinkAlt />
        </button>
    )
}

export default ModalButton