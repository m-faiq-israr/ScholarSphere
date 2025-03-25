import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa';

const ModalButton = ({title, onClick}) => {
    return (
        <button
            className="inline-flex select-none items-center gap-2 rounded-xl bg-heading-1 font-outfit py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-700 w-full sm:w-auto"
            onClick={onClick}
        >

            {title}
            <FaExternalLinkAlt className="text-xs sm:text-sm"/>
        </button>
    )
}

export default ModalButton; 