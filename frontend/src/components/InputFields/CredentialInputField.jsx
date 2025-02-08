import React from 'react'

const CredentialInputField = ({name, type, placeholder, width, onChange}) => {
  return (
    <input
    name={name}
    type={type}
    placeholder={placeholder}
    onChange={onChange}
    className={`${width} bg-textfield-1 rounded-[50px] px-3 py-2 outline-none text-sm font-outfit`}
    />
  )
}

export default CredentialInputField