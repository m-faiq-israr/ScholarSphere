import React from 'react'
import gradHat from '../../assets/images/gradHat.png'
const LandingPageButton = ({text, onClick, logo}) => {
  return (
    <button onClick={onClick} className='bg-teal-500 hover:bg-teal-600 select-none py-2 px-3 text-lg  rounded-lg font-medium text-white flex items-center gap-1'>{text}
    <img src={logo} className='size-10'/>
    </button>
    

    

  )
}

export default LandingPageButton