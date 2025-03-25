import React from 'react';

const CredentialButton = ({ name, color, textColor, onclick }) => {
  return (
    <button onClick={onclick} className={`text-xs sm:text-sm px-4 py-1 sm:px-6 sm:py-2 font-outfit rounded-2xl ${color} ${textColor}  w-auto max-w-[120px] sm:max-w-none`}>
      {name}
    </button>
  );
};

export default CredentialButton;
