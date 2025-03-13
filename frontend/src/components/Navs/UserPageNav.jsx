import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { doSignOut } from "../../firebase/auth";

const Nav = () => {
  const { navItem, setNavItem } = useContext(AppContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownRef = useRef(null); 
  const navigate = useNavigate();
  
    const handleLogout = async () => {
      await doSignOut();
      navigate("/");
    };


  const navItemClicked = (item) => {
    console.log('Clicked:', item);
    setNavItem(item);
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
        <div className="text-3xl font-bold flex-1">
          ScholarSphere
        </div>

        {/* Middle Section: Options */}
        <ul className="flex space-x-20 font-semibold justify-center flex-1">
          <li
            className={`cursor-pointer ${
              navItem === 'Grants' ? 'underline underline-offset-4 decoration-2 decoration-[#000235]' : ''
            }`}
            onClick={() => navItemClicked('Grants')}
          >
            Grants
          </li>
          <li
            className={`cursor-pointer ${
              navItem === 'Conferences' ? 'underline underline-offset-4 decoration-2 decoration-[#000235]' : ''
            }`}
            onClick={() => navItemClicked('Conferences')}
          >
            Conferences
          </li>
          <li
            className={`cursor-pointer ${
              navItem === 'Journals' ? 'underline underline-offset-4 decoration-2 decoration-[#000235]' : ''
            }`}
            onClick={() => navItemClicked('Journals')}
          >
            Journals
          </li>
        </ul>

        {/* Right Section: Hamburger Icon and Dropdown */}
        <div className="flex items-center space-x-2 flex-1 justify-end relative" ref={dropdownRef}>
          <div className="cursor-pointer" onClick={toggleDropdown}>
            <FaBars className="text-xl font-outfit" />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                  onClick={() => {
                    console.log('User Profile clicked');
                    setIsDropdownOpen(false); 
                  }}
                >
                  <FaUser className="text-heading-1" /> 
                  <span className="text-heading-1">User Profile</span>
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                  onClick={() => {
                    setIsDropdownOpen(false); 
                    handleLogout();
                  }}
                >
                  <FaSignOutAlt className="text-red-600" /> {/* Log Out Icon */}
                  <span className="text-red-600 font-semibold">Log Out</span>
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