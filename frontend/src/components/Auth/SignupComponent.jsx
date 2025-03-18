import React, { useState } from 'react';
import CredentialInputField from '../InputFields/CredentialInputField';
import SignInButton from '../Buttons/SignInButton';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth';
import { useAuth } from '../../contexts/authContext';

const SignupComponent = () => {
    const [credentials, setCredentials] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
        const [loading, setLoading] = useState(false);
    

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true); 
        if (credentials.password !== credentials.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            await doCreateUserWithEmailAndPassword(credentials.email, credentials.password);
            navigate('/grants');
        setLoading(false); 

        } catch (err) {
            setError(err.message);
        setLoading(false); 

        }
    };

    const { user } = useAuth();

  if (user) return <Navigate to="/grants" />;

    return (
        <div className="h-screen flex flex-col items-center justify-center font-outfit">
            <div className="text-heading-1 text-center font-outfit mb-6">
                <h1 className="font-semibold text-2xl">Welcome!</h1>
                <h1 className="font-semibold text-lg">Please enter credentials to continue</h1>
            </div>
            <div className="w-full max-w-md mx-auto bg-gradient-to-b from-[#000235] to-[#F2BDFA] px-7 py-4 rounded-[50px]">
                <form onSubmit={handleSignup}>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-6">
                            <div className="flex flex-col gap-2 w-[47%]">
                                <label className="font-outfit text-sm font-semibold text-white">First Name:</label>
                                <CredentialInputField name="firstName" type="text" placeholder="Enter your first name" onChange={onChange} />
                            </div>
                            <div className="flex flex-col gap-2 w-[47%]">
                                <label className="font-outfit text-sm font-semibold text-white">Last Name:</label>
                                <CredentialInputField name="lastName" type="text" placeholder="Enter your last name" onChange={onChange} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-outfit text-sm font-semibold text-white">Email:</label>
                            <CredentialInputField name="email" type="email" placeholder="Enter your email" onChange={onChange} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-outfit text-sm font-semibold text-white">Password:</label>
                            <CredentialInputField name="password" type="password" placeholder="Enter password" onChange={onChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-outfit text-sm font-semibold text-white mb-2">Confirm Password:</label>
                            <CredentialInputField name="confirmPassword" type="password" placeholder="Re-enter password" onChange={onChange} />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="flex flex-col items-center justify-center mt-4">
                        <SignInButton name="Sign Up" loading={loading} />
                        <div className="text-xs text-white mt-2">OR</div>
                        <div className="flex items-center gap-1 mt-4 hover:cursor-pointer">
                            <Link to="/signin" className="text-sm text-white hover:underline ">Already have an account?</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupComponent;
