import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa';
const ConferenceItem = ({ conference }) => {

  return (
    <div className='flex justify-between font-outfit p-1 h-full'>
      <div className='w-[70%]'>
        <h1 className='font-bold text-heading-1 pb-3 line-clamp-2'>{conference.title}</h1>
        <p className='text-gray-600 '>
          {conference.location}
        </p>
      </div>

      <div className='w-[30%]  h-full flex flex-col justify-end items-end'>
        <div className='text-sm text-heading-1 font-semibold'>

          {conference.dates
            ? conference.dates
            : conference.date}
        </div>

        <button className='flex gap-2 select-none items-center justify-center mt-3 text-sm w-28 bg-green-500 text-white px-1 py-1 rounded-md hover:bg-green-600 transition-colors'
          onClick={() => {
            if (conference.link) {
              window.open(conference.link, "_blank");
            } else if (conference.url) {
              window.open(conference.url, "_blank");
            } else {
              console.warn("No link available for this conference");
            }

          }}>
          Apply

          <FaExternalLinkAlt />

        </button>
      </div>
    </div>
  )
}

export default ConferenceItem