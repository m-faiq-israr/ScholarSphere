import React from 'react'
import { BsStars } from "react-icons/bs";


const RecommendationButton = ({onClick}) => {
  return (
    <button
        className="inline-flex font-outfit select-none items-center gap-2 rounded-xl bg-heading-1 py-2 px-3 text-sm font-medium text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-700"
      onClick={onClick}>
        Recommendations
        <BsStars className='size-4' />
      </button>
  )
}

export default RecommendationButton