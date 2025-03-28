import React from 'react';

const UserPageInput = ({ placeholder, value, onChange, label, width, name }) => {
  return (
    <div className='flex flex-col gap-1 font-outfit w-full sm:w-80 md:w-96 lg:w-[28rem] mb-3 sm:mb-4'>
      <label className='text-heading-1 font-semibold pl-1 select-none text-sm sm:text-base'>{label}</label>
      <input 
        type="text"
        className={` w-full bg-gray-200 px-3 py-2 sm:py-3 rounded-xl text-heading-1 text-sm sm:text-base outline-none 
        placeholder:font-outfit placeholder:select-none`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name} 
      />
    </div>
  );
};

export default UserPageInput;
