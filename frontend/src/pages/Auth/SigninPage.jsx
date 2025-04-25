import React from 'react';
import layout1 from '../../assets/images/layout1.png';
import layout2 from '../../assets/images/layout2.png';
import layout3 from '../../assets/images/layout3.png';
import layout4 from '../../assets/images/layout4.png';
import LoginComponent from '../../components/Auth/LoginComponent'; 


const SigninPage = () => {
  return (
    <div className="relative h-screen flex">
      {/* Background Layout */}
      <div className="flex justify-between w-full">
        {/* Left Layout */}
        <div className="flex flex-col justify-between h-screen">
          <img src={layout1} alt="Layout Background" style={{ width: '140px', height: '330px' }} />
          <img src={layout3} alt="Layout Background" style={{ width: '306px', height: '200px' }} />
        </div>

        {/* Right Layout */}
        <div className="flex flex-col justify-between h-screen items-start p-0 m-0">
          <img src={layout2} alt="Layout Background" style={{ width: '125px', height: '390px' }} />
          <img src={layout4} alt="Layout Background" style={{ width: '125px', height: '150px' }} />
        </div>
      </div>

      {/* Overlay Login Page */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-md">
          <LoginComponent />
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
