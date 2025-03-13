import React, { useState } from 'react';
import CredentialInputField from '../InputFields/CredentialInputField';
import SignInButton from '../Buttons/SignInButton';
import { Link, useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../../firebase/auth';
import { Navigate } from "react-router-dom";
import { useAuth } from '../../contexts/authContext';

const LoginComponent = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); 
        setError('');

        try {
            await doSignInWithEmailAndPassword(credentials.email, credentials.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    if (user) return <Navigate to="/dashboard" />;

    return (
        <div className="h-screen flex flex-col items-center justify-center font-outfit">
            <div className="text-heading-1 text-center font-outfit mb-6">
                <h1 className="font-semibold text-2xl">Welcome Back!</h1>
                <h1 className="font-semibold text-lg">Please enter credentials to continue</h1>
            </div>
            <div className="w-full max-w-md mx-auto bg-gradient-to-b from-[#000235] to-[#F2BDFA] px-7 py-4 rounded-[50px]">
                <form onSubmit={handleLogin}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-outfit text-sm font-semibold text-white">Email:</label>
                            <CredentialInputField name="email" type="email" placeholder="Enter your email" onChange={onChange} />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-outfit text-sm font-semibold text-white mb-2">Password:</label>
                            <CredentialInputField name="password" type="password" placeholder="Enter password" onChange={onChange} />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="text-right text-sm text-white font-outfit hover:cursor-pointer">Forgot Password?</div>
                    <div className="flex flex-col items-center justify-center mt-4">
                        <SignInButton name="Sign In" loading={loading} />
                        <div className="text-xs text-white mt-2">OR</div>
                        <Link to="/signup" className="text-sm text-white hover:underline mt-2">Create a new account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginComponent;
