import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import Nav from '../components/Navs/UserPageNav';
import GrantsPage from './GrantsPage';
import ConferencesPage from './ConferencesPage';
import JournalsPage from './JournalsPage';

const HomePage = () => {
  const { navItem } = useContext(AppContext); 

  return (
    <div>
      <Nav />
      {navItem === 'Grants' ? (
        <GrantsPage />
      ) : navItem === 'Conferences' ? (
        <ConferencesPage />
      ) : navItem === 'Journals' ? (
        <JournalsPage />
      ) : (
        <GrantsPage /> 
      )}
    </div>
  );
};

export default HomePage;