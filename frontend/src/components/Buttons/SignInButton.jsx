import React from 'react';

const SignInButton = ({ name, loading }) => {
    return (
        <button 
            className="text-base px-7 py-2 rounded-full bg-heading-1 text-white flex items-center justify-center"
            disabled={loading}
        >
            {loading ? (
                <svg className="animate-spin h-5 w-5  text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
            ) : name}
        </button>
    );
};

export default SignInButton;
