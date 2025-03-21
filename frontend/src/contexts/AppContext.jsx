import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [navItem, setNavItem] = useState('Grants'); 
const [userName, setuserName] = useState('')
  return (
    <AppContext.Provider
      value={{
        navItem,
        setNavItem, 
        userName,
        setuserName

      }}
    >
      {children}
    </AppContext.Provider>
  );
};