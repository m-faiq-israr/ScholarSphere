import React, { useState } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate, Navigate, Link } from 'react-router-dom';

import loginComp1 from '../../assets/images/loginComp1.png';
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth';
import { useAuth } from '../../contexts/authContext';

const SignupPage = () => {
  const [credentials, setCredentials] = useState({
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

    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await doCreateUserWithEmailAndPassword(credentials.email, credentials.password);
      navigate('/grants');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) return <Navigate to="/grants" />;

  return (
    <div className='flex items-start pl-10 max-h-screen overflow-hidden '>
      {/* Left Section */}
      <div className="flex flex-col items-center font-outfit justify-center w-[50%] min-h-screen bg-white px-4 ">
        <h1 className="text-6xl font-bold mb-5">Create an Account</h1>
        <p className="text-center text-lg text-gray-600 mb-10">
          Join <strong>ScholarSphere's</strong> to simplify your workflow and boost your productivity.
        </p>

        <form className="w-full max-w-sm space-y-4" onSubmit={handleSignup}>
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
            className="flex items-center justify-center gap-3 w-full bg-black/5 border border-gray-300 text-gray-700 rounded-xl px-4 py-3 shadow-sm hover:bg-gray-100 transition duration-200"
          >
            <FcGoogle className="text-xl" />
            <span className="font-medium">Register with Google</span>
          </button>

          <p className="text-center text-sm text-gray-700 mt-9">
            Already have an account?{' '}
            <Link to="/signin" className="text-green-700 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      {/* Right Image Section */}
      <div className='w-[50%]'>
        <img src={loginComp1} alt="signup illustration" className='object-contain' />
      </div>
    </div>
  );
};

export default SignupPage;
