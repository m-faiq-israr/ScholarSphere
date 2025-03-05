import React from 'react'

const JournalItem = ({ journal }) => {
    return (
        <div className='flex justify-between font-outfit p-1 h-full'>
            <div className='w-[70%]'>
                <h1 className='font-bold text-heading-1 pb-3 line-clamp-1'>{journal.title}</h1>
                <p className='text-gray-600 line-clamp-2 '>
                    <span className='font-semibold'>Subject Areas:</span> {journal.subject_areas.join(', ')}
                </p>
                <p className='text-gray-600 line-clamp-2 '>
                    <span className='font-semibold'>
                        Publisher:
                    </span>
                     {journal.publisher}
                </p>
                <button className='flex items-center justify-center mt-3 text-sm w-28 bg-green-500 text-white px-1 py-1 rounded-md hover:bg-green-600 transition-colors'>
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
        </div>
    )
}

export default JournalItem