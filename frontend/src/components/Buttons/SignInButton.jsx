import React from 'react'

const SignInButton = ({name}) => {
    return (
        <button className="text-base px-7 py-2 rounded-full bg-heading-1 text-white">
            {name}
        </button>
    )
}

export default SignInButton