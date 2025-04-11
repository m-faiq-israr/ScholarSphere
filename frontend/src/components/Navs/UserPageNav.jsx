import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { useNavigate, useLocation } from "react-router-dom";
import { doSignOut } from "../../firebase/auth";
import { AppContext } from '../../contexts/AppContext';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Nav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [fullName, setFullName] = useState("");
  const dropdownRef = useRef(null); 
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const db = getFirestore();
  const {setinterests} = useContext(AppContext)

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "user_profile", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setFullName(`${userData.firstName} ${userData.lastName}`);
          setinterests(userData.fieldsofInterest)
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
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Section: Heading */}
        <div className="text-3xl font-bold flex-1 cursor-pointer" onClick={()=> navigate('/')}>
          ScholarSphere
        </div>

        {/* Middle Section: Options */}
        <ul className="flex space-x-20 font-semibold justify-center flex-1">
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

        {/* Right Section: Profile and Dropdown */}
        <div className="flex items-center space-x-2 flex-1 justify-end relative" ref={dropdownRef}>
          <div className="flex items-center gap-2">
            <div className='font-outfit font-semibold text-heading-1 '>
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
                  <span className="text-red-600 ">Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
