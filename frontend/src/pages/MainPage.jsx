import React from 'react';
import Navbar from '../components/Navs/Navbar';
import HomePageCard from '../components/Cards/HomePageCard';
import homecard1 from '../assets/images/homecard1.png';
import homecard2 from '../assets/images/homecard2.png';
import homecard3 from '../assets/images/homecard3.png';
import layout1 from '../assets/images/layout1.png';
import layout2 from '../assets/images/layout2.png';
import layout5 from '../assets/images/layout5.png'
import layout6 from '../assets/images/layout6.png'
import layout7 from '../assets/images/layout7.png'
import layout10 from '../assets/images/layout10.png'
import layout11 from '../assets/images/layout11.png'
import layout12 from '../assets/images/layout12.png'
import layout13 from '../assets/images/layout13.png'
import layout14 from '../assets/images/layout14.png'
import layout15 from '../assets/images/layout15.png'
import HomeSearchField from '../components/InputFields/HomeSearchField';
import CredentialButton from '../components/Buttons/CredentialButton';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";

const MainPage = () => {

  const navigate = useNavigate();
  return (
    <div className='overflow-x-hidden'>
      <Navbar />

      <div className="relative pt-28 overflow-hidden select-none">
        <img
          src={layout1}
          alt="Layout Left"
          className="absolute top-12 left-0 "
          style={{ width: '120px', height: '350px' }}
        />
        <img
          src={layout2}
          alt="Layout Right"
          className="absolute top-6 right-0 "
          style={{ width: '110px', height: '500px' }}
        />

        {/* Exploring international academic opportunities */}
        <div className="w-screen text-center">
          <h1 className="text-2xl font-bold text-heading-1 font-outfit">
            Exploring International Academic Opportunities
          </h1>
          <div className="flex justify-center items-center gap-x-24 mt-12">
            <HomePageCard image={homecard1} text={'Easily find grants for your research.'} />
            <HomePageCard image={homecard2} text={'Never miss the chance to attend conferences.'} />
            <HomePageCard image={homecard3} text={'Find journals to publish your work.'} />
          </div>
        </div>
      </div>


      <div className="relative select-none">
        {/* Layout 6 and Layout 7 on the left */}
        <div className="absolute left-0 top-52 transform -translate-y-1/2">
          <img src={layout6} style={{ width: '220px', height: '200px' }} className="block" />
          <img src={layout7} style={{ width: '220px', height: '200px' }} className="-ml-1 -mt-1 block" />
        </div>

        {/* Layout 5 centered and overlapping */}
        <div className="relative flex justify-center items-center top-52">
          {/* Image Wrapper */}
          <div className="relative">
            <img
              src={layout5}
              alt="Layout Center"
              style={{ width: "670px", height: "670px" }}
              className="z-0"
            />

            {/* Centered HomeSearchField */}
            <div className="absolute inset-0 flex justify-center items-center">
              <div className='text-center'>

                <HomeSearchField />
                <div className='font-outfit mt-4 font-semibold  '>Browse through our vast collection</div>
              </div>
            </div>
          </div>
        </div>


        {/* Layout 10 and Layout 11 on the right */}
        <div className="absolute right-0 flex flex-col items-end ">
          <img src={layout10} style={{ width: '200px', height: '200px' }} className="block right-0" />
          <img src={layout11} style={{ width: '200px', height: '260px' }} className="-mr-2 -mt-1 block right-0" />
        </div>

        <div>
          <img src={layout12} style={{ width: '110px', height: '400px' }} className="mt-" />

        </div>
      </div>



      <div className="  ">
        {/* Extreme Left Image (layout14) */}
        <img
          src={layout14}
          className="absolute left-0 mt-20"
          style={{ width: '80px', height: '450px' }}
        />

        {/* Centered Content */}
        <div className='flex justify-center font-outfit'>
          <div className='text-heading-1'>
            <h1 className='font-bold text-3xl mt-8'>One-Stop Solution</h1>
            <div className="before:content-['•'] before:text-lg before:font-bold before:mr-2 font-semibold mt-1 ">
              Expedite delivery using custom templates
            </div>

            <div className="before:content-['•'] before:text-lg before:font-bold before:mr-2 font-semibold mt-1">
              Expedite delivery using custom templates
            </div>
            <div className="before:content-['•'] before:text-lg before:font-bold before:mr-2 font-semibold mt-1">
              Expedite delivery using custom templates
            </div>
          </div>
          <img src={layout13} style={{ width: '300px', height: '230px' }} />
        </div>
      </div>


      <div className='flex justify-center mt-16 relative font-outfit'>
  {/* Background Image */}
  <img src={layout15} className="max-w-full" />

  {/* Centered Text */}
  <div className="absolute inset-0 flex flex-col justify-center  text-center text-white">
    <h1 className="text-2xl font-bold">Join us today! In few easy steps</h1>
<div className='block max-w-4xl mx-auto'>

    <div className="mt-20 flex justify-center items-center gap-4">
      <h1 className="text-lg">Already have an account?</h1>
      <CredentialButton name={'Login'} color={'bg-gray-200'} textColor={'text-heading-1'} onclick={()=>navigate('/signin')} />
    </div>
    
    <div className="mt-5 flex justify-end gap-4 items-center ">
      <h1 className="text-lg">New User?</h1>
      <CredentialButton name={'Signup'} color={'bg-heading-1'} textColor={'text-white'} onclick={()=>navigate('signup')}/>
    </div>
</div>
  </div>
</div>








<Footer/>
    </div>
  );
};

export default MainPage;
