import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { NavSearchField } from '../InputFields/NavSearchField';

const Nav = () => {
  const { navItem, setNavItem } = useContext(AppContext);

  const navItemClicked = (item) => {
    console.log('Clicked:', item); // Log the clicked item
    setNavItem(item); // Update navItem state
  };

  return (
    <nav className="fixed top-0 left-0 right-0 font-outfit px-8 py-3 z-10 bg-white">
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

        {/* Right Section: Buttons */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <NavSearchField/>
        </div>
      </div>
    </nav>
  );
};

export default Nav;