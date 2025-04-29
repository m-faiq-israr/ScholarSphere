import React from 'react'
import { FaFileExport } from 'react-icons/fa'

const ExportCsv = ({onClick}) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 font-outfit text-sm text-white bg-heading-1 font-medium rounded-xl px-3 py-2"
        >
            <FaFileExport />
            Export results
        </button>
    )
}

export default ExportCsv