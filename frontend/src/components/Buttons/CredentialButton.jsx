import React from 'react';

const CredentialButton = ({ name, color, textColor, onclick }) => {
  return (
    <button onClick={onclick} className={`text-sm px-6 py-2 font-outfit rounded-2xl ${color} ${textColor}`}>
      {name}
    </button>
  );
};

export default CredentialButton;
