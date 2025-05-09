import React, { useState } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate, Navigate, Link } from 'react-router-dom';

import loginComp1 from '../../assets/images/loginComp1.png';
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from '../../firebase/auth';
import { useAuth } from '../../contexts/authContext';
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";


const SignupPage = () => {
  const [credentials, setCredentials] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const { firstName, lastName, email, password, confirmPassword } = credentials;
  
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
  
    try {
      await doCreateUserWithEmailAndPassword(email, password);
      const userId = auth.currentUser.uid;
  
      // Create user profile in Firestore
      await setDoc(doc(db, "user_profile", userId), {
        firstName,
        lastName,
        savedGrants: [],
        savedConferences: [],
        savedJournals: []
      });
  
      navigate('/grants');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      await doSignInWithGoogle();
      navigate('/grants');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  if (user) return <Navigate to="/grants" />;

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-auto">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center font-outfit bg-white px-6 sm:px-10 py-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 text-center">Create an Account</h1>
        <p className="text-center text-base sm:text-lg text-gray-600 mb-8 px-2">
          Join <strong>ScholarSphere</strong> to simplify your workflow and boost your productivity.
        </p>

        <form className="w-full max-w-sm space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={credentials.firstName}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border rounded-xl outline-none"
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={credentials.lastName}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border rounded-xl outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border rounded-xl outline-none"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={onChange}
              required
              className="w-full px-4 py-3 pr-10 border rounded-xl outline-none"
            />
            <button
              type="button"
              className="absolute right-4 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={credentials.confirmPassword}
              onChange={onChange}
              required
              className="w-full px-4 py-3 pr-10 border rounded-xl outline-none"
            />
            <button
              type="button"
              className="absolute right-4 top-3 text-gray-500"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-500 text-white rounded-xl font-medium hover:opacity-90"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="flex items-center justify-center gap-3 w-full bg-black/5 border border-gray-300 text-gray-700 rounded-xl px-4 py-3 shadow-sm hover:bg-gray-100 transition duration-200"
          >
            <FcGoogle className="text-xl" />
            <span className="font-medium">Register with Google</span>
          </button>


          <p className="text-center text-sm text-gray-700 mt-6">
            Already have an account?{' '}
            <Link to="/signin" className="text-green-700 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      {/* Right Section (Image) */}
      <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center bg-gray-50">
        <img src={loginComp1} alt="signup illustration" className="object-contain w-full max-h-[90vh]" />
      </div>
    </div>
  );

};

export default SignupPage;
