import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import {getFirestore, doc, getDoc } from 'firebase/firestore';
import { doSignOut } from '../../firebase/auth';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [fullName, setFullName] = useState("");
  const dropdownRef = useRef(null); 
  const navigate = useNavigate();
  const location = useLocation();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); 
  }, [auth]);

   useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "user_profile", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setFullName(`${userData.firstName} ${userData.lastName}`);
        }
      }
    };

    fetchUserProfile();
  }, [auth, db]);

  const handleLogout = async () => {
    await doSignOut();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/user");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 font-outfit px-8 py-3 z-10 bg-white select-none">
      <div className="container mx-auto flex items-center justify-between relative">
        
        {/* Left Section: Heading */}
        <div className="text-3xl font-bold">
          ScholarSphere
        </div>
  
 {/* Middle Section: Options (Centered) */}
{user && (
  <ul className="absolute left-1/2 transform -translate-x-1/2 flex space-x-20 font-semibold z-10">
    <li
      className={`cursor-pointer ${
        location.pathname === '/grants' ? 'underline underline-offset-4 decoration-2 decoration-[#000235]' : ''
      }`}
      onClick={() => navigate('/grants')}
    >
      Grants
    </li>
    <li
      className={`cursor-pointer ${
        location.pathname === '/conferences' ? 'underline underline-offset-4 decoration-2 decoration-[#000235]' : ''
      }`}
      onClick={() => navigate('/conferences')}
    >
      Conferences
    </li>
    <li
      className={`cursor-pointer ${
        location.pathname === '/journals' ? 'underline underline-offset-4 decoration-2 decoration-[#000235]' : ''
      }`}
      onClick={() => navigate('/journals')}
    >
      Journals
    </li>
  </ul>
)}


  
        {/* Right Section: Conditional Buttons */}
        {!user ? (
          <div className="flex items-center space-x-2">
            <Link to={'/signin'} className="font-semibold">
              Login
            </Link>
            <Link to={'/signup'} className="bg-heading-1 rounded-full px-3 py-1 text-white">
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-2 flex-1 justify-end relative" ref={dropdownRef}>
            <div className="flex items-center gap-2">
              <div className='font-outfit font-semibold text-heading-1'>
                {fullName || "Guest"}
              </div>
              <div onClick={toggleDropdown} className='cursor-pointer bg-heading-1 hover:bg-gray-700 rounded-full p-1.5'>
                <FaUser className="text-white font-outfit" /> 
              </div>
            </div>
  
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                    onClick={() => {
                      setIsDropdownOpen(false); 
                      handleProfileClick();
                    }}
                  >
                    <FiEdit size={18} className='text-heading-1' />
                    <span className="text-heading-1">Edit Profile</span>
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                    onClick={() => {
                      setIsDropdownOpen(false); 
                      handleLogout();
                    }}
                  >
                    <FaSignOutAlt className="text-red-600" /> 
                    <span className="text-red-600">Logout</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
  
};

export default Navbar;
