import React from "react";
import { useNavigate } from "react-router-dom";
import { doSignOut } from "../firebase/auth";

const UserPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await doSignOut(); 
    navigate("/"); 
  };

  return (
    <>
      <div>UserPage</div>
      <button onClick={handleLogout}>LOGOUT</button>
    </>
  );
};

export default UserPage;
