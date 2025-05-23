import React from 'react'
import { FaFileCsv } from "react-icons/fa6";
import { PiFileCsvBold } from "react-icons/pi";
const ExportCsv = ({onClick}) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 font-outfit text-sm text-white bg-heading-1 font-medium rounded-xl px-3 py-2 hover:bg-gray-800"
        >
            <FaFileCsv />
            Export results
        </button>
    )
}

export default ExportCsv