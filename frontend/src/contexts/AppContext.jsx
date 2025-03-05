import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [navItem, setNavItem] = useState('Grants'); 

  return (
    <AppContext.Provider
      value={{
        navItem,
        setNavItem, 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};