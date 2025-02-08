import React from 'react';
import homecard1 from '../../assets/images/homecard1.png';

const HomePageCard = ({image, text}) => {
  return (
    <div className='bg-gradient-to-b from-[#000235] to-[#824B95] rounded-[35px] shadow-lg w-48 overflow-hidden'>
      <div className='h-36'>
        <img src={image} alt="Home Card Image" className='w-full h-full object-cover'/>
      </div>
      <div className='px-3 py-10'>
        <p className='text-base font-semibold text-white font-outfit'>
          {text}
        </p>
      </div>
    </div>
  );
};

export default HomePageCard;
