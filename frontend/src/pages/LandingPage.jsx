import React from 'react'
import landing1 from '../assets/images/landing1.png'
import magnifyingGlass from '../assets/images/magnifyingGlass.png'
import gradHat from '../assets/images/gradHat.png'
import globe from '../assets/images/globe.png'
import globeIcon from '../assets/images/globeIcon.png'
import research from '../assets/images/research.png'
import searchBot from '../assets/images/searchBot.png'
import community from '../assets/images/community.png'
import recomGrants from '../assets/images/recomGrants.png'
import recomJournals from '../assets/images/recomJournals.png'
import creditCard from '../assets/images/creditCard.png'
import rocket from '../assets/images/rocket.png'
import recomConferences from '../assets/images/recomConferences.png'
import conferenceIntl from '../assets/images/conferenceIntl.png'
import Grants from '../assets/images/Grants.png'
import Journals from '../assets/images/Journals.png'
import badge from '../assets/images/badge.png'
import Nav from '@/components/Navs/UserPageNav'
import LandingPageButton from '@/components/Buttons/LandingPageButton'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className='font-outfit'>
            <Nav />
            {/* intro card */}
            <div className='md:flex items-center ml-4 mt-24 md:mt-0 md:ml-16  '>
                <h1 className='text-3xl md:hidden md:text-6xl font-bold text-heading-1'>Welcome to ScholarSphere:</h1>
                <div className='md:mt-14 md:w-[60%]'>
                    <h1 className='hidden md:block text-3xl md:text-6xl font-bold text-heading-1'>Welcome to ScholarSphere:</h1>
                    <h1 className='text-2xl md:text-5xl font-bold mt-1 text-heading-1'>Explore International Research Opportunities</h1>
                    <p className='mt-6 font-medium text-xl md:text-2xl text-heading-1 mb-5 md:mb-8'>Navigate Your Research Journey with Confidence. Unlock Research Grants, Conferences, and Research Journals all in one platform designed for academic professionals.</p>
                    <LandingPageButton text={"Get Started - It's Free"} onClick={() => navigate("/signup")} logo={gradHat} />
                </div>
                <div className=' md:w-[40%] flex justify-center w-full md:block '>
                    <img src={landing1} className='size-72  md:size-full' />

                </div>
            </div>


            {/* discover grants card  */}
            <div className='mx-4 mt-16 md:mx-16 md:mt-36'>
                <h1 className='text-2xl md:text-5xl font-bold text-heading-1'>Discover Grant Opportunities Tailored to You</h1>
                <div className='md:flex items-start gap-4 mt-6 mb-5 md:mb-8'>
                    <div className=' md:w-[50%] shadow p-4 rounded-xl mt-2'>
                        <div className='bg-black/5 p-1 rounded-lg inline-block'>
                            <img src={magnifyingGlass} className='size-8 md:size-16 ' />
                        </div>
                        <h1 className='text-lg md:text-2xl font-bold mt-2 mb-2 md:mb-4 text-heading-1'>Stop Wasting Time on Irrelevant Searches</h1>
                        <p className='text-sm md:text-lg font-medium'>ScholarSphere’s AI matches you with grants that fit your research profile, saving hours of searching. 80% of researchers find our grant recommendations highly relevant (2024 internal survey).</p>
                    </div>

                    <div className=' md:w-[50%] shadow p-4 rounded-xl mt-2'>
                        <div className='bg-black/5 p-1 rounded-lg inline-block'>
                            <img src={gradHat} className='size-8 md:size-16 ' />
                        </div>
                        <h1 className='text-lg md:text-2xl font-bold mt-2 mb-4 text-heading-1'>Global Grant Opportunities for Scholars</h1>
                        <p className='text-sm md:text-lg font-medium'>Discover and track funding opportunities from around the world — tailored to your research interests and academic profile. ScholarSphere connects scholars everywhere with grants that matter.</p>
                    </div>

                </div>
                <LandingPageButton text={"Find Your Perfect Grant"} onClick={() => navigate('/grants')} logo={recomGrants} />
            </div>


            {/* conference section  */}
            <div className='mx-4 md:mx-16'>
                <div className='flex items-start'>
                    <div className="md:w-[60%] mt-20 md:mt-44">
                        <h1 className='text-2xl md:text-5xl font-bold text-heading-1 md:leading-[55px]'>Connect with Leading Conferences Worldwide</h1>
                        <div className='md:flex items-start gap-4 my-5 md:my-8'>
                            <div className='border md:border-none p-4 md:p-0 rounded-xl'>
                                <div className='bg-black/5 p-1 rounded-lg inline-block'>
                                    <img src={searchBot} className='size-8 md:size-16' />
                                </div>
                                <h1 className='text-lg md:text-2xl font-bold mt-2 mb-4 text-heading-1'>AI-Powered Matching</h1>
                                <p className='text-sm md:text-lg font-medium'>ScholarSphere suggests conferences based on your research interests and publication history providing details on location, deadlines, and speaker lineups.</p>
                            </div>

                            <div className='border md:border-none p-4 md:p-0 rounded-xl mt-2 md:mt-0'>
                                <div className='bg-black/5 p-1 rounded-lg inline-block'>
                                    <img src={globeIcon} className='size-8 md:size-16' />
                                </div>
                                <h1 className='text-lg md:text-2xl font-bold mt-2 mb-4 text-heading-1'>Global Event Exploration</h1>
                                <p className='text-sm md:text-lg font-medium'>Discover research grants from around the world with personalized recommendations to support your academic journey and fuel your next breakthrough.</p>
                            </div>

                        </div>
                        <LandingPageButton text={"Explore Upcoming Conferences"} onClick={() => navigate('/conferences')} logo={recomConferences} />
                    </div>
                    <div className="w-[40%] mt-24 hidden md:block">
                        <img src={globe} alt="" />
                    </div>
                </div>
            </div>

            {/* journal section  */}
            <div className='mx-4 md:mx-16 mt-20 md:mt-44'>
                <h1 className='text-2xl md:text-5xl font-bold text-heading-1'>Publish Smarter: AI-Powered Journal </h1>
                <h1 className='text-2xl md:text-5xl font-bold text-heading-1 mt-1'>Recommendations</h1>
                <div className="md:flex items-start gap-4 my-5 md:my-8">
                    <div className='shadow p-4 rounded-xl'>
                        <div className='bg-black/5 p-1 rounded-lg inline-block'>
                            <img src={research} className='size-8 md:size-16 ' />
                        </div>
                        <h1 className='text-lg md:text-2xl font-bold mt-2 mb-4 text-heading-1'>Maximize Your Research Impact</h1>
                        <p className='text-sm md:text-lg font-medium'>Our AI analyzes your abstract to recommend the most relevant journals based on impact factor, scope, and publication speed.</p>
                    </div>
                    <div className='shadow p-4 rounded-xl mt-2 md:mt-0'>
                        <div className='bg-black/5 p-1 rounded-lg inline-block'>
                            <img src={badge} className='size-8 md:size-16  ' />
                        </div>
                        <h1 className='text-lg md:text-2xl font-bold mt-2 mb-4 text-heading-1'>From Insight to Publication</h1>
                        <p className='text-sm md:text-lg font-medium'>Turn your research into published success with targeted journal suggestions powered by AI.</p>
                    </div>
                </div>
                <LandingPageButton text={"Get Journal Recommendation"} onClick={() => navigate('/journals')} logo={recomJournals} />
            </div>

            {/* join scholarsphere section  */}
            <div className="flex items-start gap-8 mx-4 md:mr-16 mt-36">
                <div className='hidden md:block w-[40%]'><img src={community} /></div>
                <div className='md:w-[60%]'>
                    <h1 className='text-2xl md:text-5xl font-bold text-heading-1 mb-8'>Join the ScholarSphere Community Today</h1>
                    <div className="flex items-center gap-2">
                        <div><img src={conferenceIntl} className='size-20 md:size-28' /></div>
                        <div>
                            <h1 className='text-lg md:text-2xl font-bold mt-2 md:mb-2 text-heading-1'>Global Conference Matching</h1>
                            <p className='text-sm md:text-lg font-medium'>Explore upcoming academic events worldwide with suggestions based on your field and publication history.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-5 md:mb-0">
                        <div><img src={Grants} className='size-20 md:size-28' /></div>
                        <div>
                            <h1 className='text-lg md:text-2xl font-bold mt-2 md:mb-2 text-heading-1'>Personalized Grant Discovery</h1>
                            <p className='text-sm md:text-lg font-medium'>Find funding opportunities that align with your research interests, career stage, and eligibility — all in one place.</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 mb-8 ">
                        <div><img src={Journals} className='size-20 md:size-28' /></div>
                        <div>
                            <h1 className='text-lg md:text-2xl font-bold mt-2 md:mb-2 text-heading-1'>AI-Powered Journal Recommendations</h1>
                            <p className='text-sm md:text-lg font-medium'>Get smart journal matches based on your abstract, scope, and keywords — helping you publish where it matters most.</p>
                        </div>
                    </div>
                    <LandingPageButton text={"Create Your Free Account - No Credit Card Required"} onClick={() => navigate('/signup')} logo={creditCard} />

                </div>
            </div>

            {/* footer section */}
            <div className='px-4 md:px-16 mt-20 md:mt-36 py-10 md:py-20 bg-heading-1  text-white'>
                <h1 className='text-2xl md:text-5xl font-bold'>About ScholarSphere: Powering the Future of Research</h1>
                <div className='flex items-start gap-12 mt-8'>
                    <div>
                        <p className='text-base md:text-lg font-medium mb-4'>Our mission is to democratize access to research resources through cutting-edge AI technology and expert knowledge.</p>
                        <p className='text-base md:text-lg  font-medium'>Your companion in research discovery — trusted by academics across disciplines and borders.</p>
                    </div>
                    <div>
                        <p className='text-base md:text-lg  font-medium mb-4'>Meet the team: Experts from academic and AI fields dedicated to enhancing the research landscape.</p>
                        <LandingPageButton text={"Contact Us"} onClick={() => window.location.href = "mailto:scholarspherefyp@gmail.com"} logo={rocket} />

                    </div>
                </div>
            </div>


        </div>
    )
}

export default LandingPage