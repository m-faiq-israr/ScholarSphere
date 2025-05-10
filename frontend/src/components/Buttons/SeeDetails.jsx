import React from 'react'
import { MdKeyboardArrowRight } from "react-icons/md";

const SeeDetails = ({onclick, text}) => {
  return (
    <div onClick={onclick} className="bg-emerald-500 hover:bg-emerald-600 select-none  cursor-pointer text-xs md:text-sm py-1 md:pr-3 pl-2 md:pl-4 font-outfit text-white rounded-lg inline-flex items-center">
          {text}
          <MdKeyboardArrowRight size={22}/>
        </div>
  )
}

export default SeeDetails