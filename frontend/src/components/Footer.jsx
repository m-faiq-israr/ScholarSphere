import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#000235] to-[#824B95] flex items-center justify-between font-outfit text-white text-center p-6 mt-20">
        <p>Contact us: scholarsphere@gmail.com</p>
      <p className="">&copy; {new Date().getFullYear()} ScholarSphere. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
