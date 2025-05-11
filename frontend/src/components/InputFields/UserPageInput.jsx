import React from 'react';

const UserPageInput = ({ placeholder, value, onChange, label, width, name }) => {
  return (
    <div className='flex flex-col gap-1 font-outfit'>
      <label className='text-heading-1 font-medium pl-1 text-sm lg:text-base select-none'>{label}</label>
      <input 
        type="text"
        className={`${width} bg-[rgb(0,0,0,0.07)] px-3 py-2 rounded-xl text-heading-1 placeholder:font-outfit placeholder:select-none font-outfit text-sm outline-none`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name} 
      />
    </div>
  );
};

export default UserPageInput;
