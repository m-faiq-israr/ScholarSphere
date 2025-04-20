import React, { useState } from 'react'
import JournalsModal from '../Modals/JournalsModal';

const JournalItem = ({ journal }) => {
        const [open, setOpen] = useState(false);
    
    return (
        <div className='flex justify-between font-outfit p-1 h-full'>
            <div className='w-[70%]'>
                <h1 className='font-semibold text-heading-1 pb-1 line-clamp-1 text-lg'>{journal.title}</h1>
                <p className='text-gray-600 line-clamp-2 '>
                    <span className='font-semibold'>Subject Areas:</span> {Array.isArray(journal.subject_areas) ? journal.subject_areas.join(', ') : journal.subject_areas}
                </p>
                <p className='text-gray-600 line-clamp-2 '>
                    <span className='font-semibold'>
                        Publisher:
                    </span>
                     {journal.publisher}
                </p>
                <button onClick={() => setOpen(true)} className='flex items-center justify-center select-none mt-3 text-sm w-28 bg-green-500 text-white px-1 py-1 rounded-md hover:bg-green-600 transition-colors'>
                    See details
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 ml-1'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 5l7 7-7 7'
                        />
                    </svg>
                </button>
            </div>

            <div className='w-[30%]  h-full flex flex-col justify-end items-end'>
                <div className='text-sm text-gray-600 font-semibol'>
                    Country: {journal.country_flag}
                </div>


            </div>
            <JournalsModal open={open} onClose={() => setOpen(false)} journal={journal}/>
        </div>
    )
}

export default JournalItem