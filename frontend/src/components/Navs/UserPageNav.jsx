import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { useNavigate, useLocation } from "react-router-dom";
import { doSignOut } from "../../firebase/auth";
import { AppContext } from '../../contexts/AppContext';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import logo_transparent from '../../assets/images/logo_transparent.png'
import { FaBars } from "react-icons/fa";

const Nav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const db = getFirestore();
  const { setinterests } = useContext(AppContext)
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        setIsLoggedIn(true);
        const userRef = doc(db, "user_profile", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setFullName(`${userData.firstName} ${userData.lastName}`);
          setinterests(userData.fieldsofInterest)
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    fetchUserProfile();
  }, [auth, db]);


  const handleLogout = async () => {
    await doSignOut();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/user-profile");
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
  <nav className="fixed top-0 left-0 right-0 font-outfit px-4 sm:px-8 py-3 z-10 bg-white  select-none">
    <div className="flex items-center justify-between w-full">
      {/* Logo */}
      <div className="flex items-center cursor-pointer space-x-2" onClick={() => navigate('/')}>
        <img src={logo_transparent} className="size-10" />
        <div className="text-2xl sm:text-3xl font-bold text-heading-1">ScholarSphere</div>
      </div>

      {/* Center Tabs - shown on medium and up */}
      {isLoggedIn && (
        <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
          <ul className="flex space-x-12 font-semibold">
            <li
              className={`cursor-pointer ${location.pathname.startsWith('/grants') ? 'underline underline-offset-4 decoration-2 decoration-[#000235]' : ''}`}
              onClick={() => navigate('/grants')}
            >
              Grants
            </li>
            <li
              className={`cursor-pointer ${location.pathname.startsWith('/conferences') ? 'underline underline-offset-4 decoration-2 decoration-[#000235]' : ''}`}
              onClick={() => navigate('/conferences')}
            >
              Conferences
            </li>
            <li
              className={`cursor-pointer ${location.pathname.startsWith('/journals') ? 'underline underline-offset-4 decoration-2 decoration-[#000235]' : ''}`}
              onClick={() => navigate('/journals')}
            >
              Journals
            </li>
          </ul>
        </div>
      )}

      {/* Desktop Profile - hidden on mobile */}
      {isLoggedIn && (
        <div
          className="hidden lg:flex items-center space-x-2 relative hover:bg-gray-300 p-2 rounded-xl cursor-pointer"
          onClick={handleProfileClick}
        >
          <div className="font-semibold text-heading-1">{fullName || "Guest"}</div>
          <div className="bg-heading-1 hover:bg-gray-700 rounded-full p-1.5">
            <FaUser className="text-white" />
          </div>
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg -lg z-50">
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleProfileClick();
                  }}
                >
                  <FiEdit size={18} className="text-heading-1" />
                  <span className="text-heading-1">Edit Profile</span>
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
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

      {/* Mobile Hamburger */}
      <div className="lg:hidden relative">
        <FaBars
          className="text-2xl text-heading-1 cursor-pointer"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg  z-50">
            <ul className="py-2">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => { setIsDropdownOpen(false); navigate('/grants'); }}
              >
                Grants
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => { setIsDropdownOpen(false); navigate('/conferences'); }}
              >
                Conferences
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => { setIsDropdownOpen(false); navigate('/journals'); }}
              >
                Journals
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                onClick={() => { setIsDropdownOpen(false); handleProfileClick(); }}
              >
                <FiEdit size={16} className="text-heading-1" />
                <span>Edit Profile</span>
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
              >
                <FaSignOutAlt className="text-red-600" />
                <span className="text-red-600">Logout</span>
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
