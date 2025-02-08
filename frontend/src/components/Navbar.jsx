import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 font-outfit px-8 py-3 z-10 bg-white">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Section: Heading */}
        <div className="text-3xl font-bold">
          ScholarSphere
        </div>

        {/* Middle Section: Options */}
        <ul className="flex space-x-20 font-semibold ">
          <li className=" cursor-pointer">Grants</li>
          <li className=" cursor-pointer">Conferences</li>
          <li className=" cursor-pointer">Journals</li>
        </ul>

        {/* Right Section: Buttons */}
        <div className="flex items-center space-x-2">
          <Link to={'/signin'} className=" font-semibold ">
            Login
          </Link>
          <Link to={'/signup'} className=" bg-heading-1 rounded-full px-3 py-1 text-white">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
