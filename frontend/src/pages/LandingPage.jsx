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
            <div className='flex items-center ml-16  '>
                <div className='mt-14 w-[60%]'>
                    <h1 className='text-6xl font-bold text-heading-1'>Welcome to ScholarSphere:</h1>
                    <h1 className='text-5xl font-bold mt-1 text-heading-1'>Your Academic Compass</h1>
                    <p className='mt-6 font-medium text-2xl text-heading-1 mb-8'>Navigate Your Research Journey with Confidence. Unlock funding, conferences, and publication opportunities all in one platform designed for academic professionals.</p>
                    <LandingPageButton text={"Get Started - It's Free"} onClick={() => navigate("/signup")} logo={gradHat} />
                </div>
                <div className='w-[40%] mt-'>
                    <img src={landing1} className='' />

                </div>
            </div>


            {/* discover grants card  */}
            <div className='mx-16 mt-36'>
                <h1 className='text-5xl font-bold text-heading-1'>Discover Grant Opportunities Tailored to You</h1>
                <div className='flex items-start gap-4 mt-6 mb-8'>
                    <div className=' w-[50%] shadow p-4 rounded-xl mt-2'>
                        <div className='bg-black/5 p-1 rounded-lg inline-block'>
                            <img src={magnifyingGlass} className='size-16 ' />
                        </div>
                        <h1 className='text-2xl font-bold mt-2 mb-4 text-heading-1'>Stop Wasting Time on Irrelevant Searches</h1>
                        <p className='text-lg font-medium'>ScholarSphere’s AI matches you with grants that fit your research profile, saving hours of searching. 80% of researchers find our grant recommendations highly relevant (2024 internal survey).</p>
                    </div>

                    <div className=' w-[50%] shadow p-4 rounded-xl mt-2'>
                        <div className='bg-black/5 p-1 rounded-lg inline-block'>
                            <img src={gradHat} className='size-16 ' />
                        </div>
                        <h1 className='text-2xl font-bold mt-2 mb-4 text-heading-1'>Streamlined Application Tracking</h1>
                        <p className='text-lg font-medium'>Easily manage and track your grant applications all in one place, ensuring you never miss a deadline. 80% of researchers find our grant recommendations highly relevant (2024 internal survey).</p>
                    </div>

                </div>
                <LandingPageButton text={"Find Your Perfect Grant"} onClick={() => navigate('/grants')} logo={recomGrants} />
            </div>


            {/* conference section  */}
            <div className='mx-16'>
                <div className='flex items-start'>
                    <div className="w-[60%] mt-44">
                        <h1 className='text-5xl font-bold text-heading-1 leading-[55px]'>Connect with Leading Conferences Worldwide</h1>
                        <div className='flex items-start gap-4 my-8'>
                            <div>
                                <div className='bg-black/5 p-1 rounded-lg inline-block'>
                                    <img src={searchBot} className='size-16 ' />
                                </div>
                                <h1 className='text-2xl font-bold mt-2 mb-4 text-heading-1'>AI-Powered Matching</h1>
                                <p className='text-lg font-medium'>ScholarSphere suggests conferences based on your research interests, providing details on location, deadlines, and speaker lineups via AI analysis.</p>
                                <p className='text-lg font-medium'>Research shows conference attendance boosts citation rates by 30% (PLOS One, 2022).</p>
                            </div>

                            <div>
                                <div className='bg-black/5 p-1 rounded-lg inline-block'>
                                    <img src={globeIcon} className='size-16 ' />
                                </div>
                                <h1 className='text-2xl font-bold mt-2 mb-4 text-heading-1'>Global Event Exploration</h1>
                                <p className='text-lg font-medium'>Explore upcoming academic events globally with our interactive map and tailored suggestions to expand your research network.</p>
                            </div>

                        </div>
                        <LandingPageButton text={"Explore Upcoming Conferences"} onClick={() => navigate('/conferences')} logo={recomConferences} />
                    </div> 
                    <div className="w-[40%] mt-24">
                        <img src={globe} alt="" />
                    </div>
                </div>
            </div>

            {/* journal section  */}
            <div className='mx-16 mt-44'>
                <h1 className='text-5xl font-bold text-heading-1'>Publish Smarter: AI-Powered Journal </h1>
                <h1 className='text-5xl font-bold text-heading-1 mt-1'>Recommendations</h1>
                <div className="flex items-start gap-4 my-8">
                    <div className='shadow p-4 rounded-xl'>
                        <div className='bg-black/5 p-1 rounded-lg inline-block'>
                            <img src={research} className='size-16 ' />
                        </div>
                        <h1 className='text-2xl font-bold mt-2 mb-4 text-heading-1'>Maximize Your Research Impact</h1>
                        <p className='text-lg font-medium'>Our AI analyzes your paper's abstract to recommend journals by impact factor, acceptance rate, and publication speed.</p>
                    </div>
                    <div className='shadow p-4 rounded-xl'>
                        <div className='bg-black/5 p-1 rounded-lg inline-block'>
                            <img src={badge} className='size-16 ' />
                        </div>
                        <h1 className='text-2xl font-bold mt-2 mb-4 text-heading-1'>Trusted Success</h1>
                        <p className='text-lg font-medium'>Professor Chen published in Nature after ScholarSphere identified the perfect journal match for his work.</p>
                    </div>
                </div>
                <LandingPageButton text={"Get Journal Recommendation"} onClick={() => navigate('/journals')} logo={recomJournals} />
            </div>

            {/* join scholarsphere section  */}
            <div className="flex items-start gap-8 mr-16 mt-36">
                <div className='w-[40%]'><img src={community} /></div>
                <div className='w-[60%]'>
                    <h1 className='text-5xl font-bold text-heading-1 mb-8'>Join the ScholarSphere Community Today</h1>
                    <div className="flex items-center gap-2">
                        <div><img src={conferenceIntl} className='size-28' /></div>
                        <div>
                            <h1 className='text-2xl font-bold mt-2 mb-2 text-heading-1'>Exclusive Webinars</h1>
                            <p className='text-lg font-medium'>Learn from research leaders on topics like grant writing and peer review navigation.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div><img src={Grants} className='size-28' /></div>
                        <div>
                            <h1 className='text-2xl font-bold mt-2 mb-2 text-heading-1'>Networking Opportunities</h1>
                            <p className='text-lg font-medium'>Connect with fellow academics through forums and discussion groups tailored to your interests.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-8">
                        <div><img src={Journals} className='size-28' /></div>
                        <div>
                            <h1 className='text-2xl font-bold mt-2 mb-2 text-heading-1'>Early Feature Access</h1>
                            <p className='text-lg font-medium'>Be the first to try new tools and research resources.</p>
                        </div>
                    </div>
                    <LandingPageButton text={"Create Your Free Account - No Credit Card Required"} onClick={()=>navigate('/signup')} logo={creditCard}/>

                </div>
            </div>

            {/* footer section */}
            <div className='px-16 mt-36 py-20 bg-heading-1  text-white'>
                <h1 className='text-5xl font-bold'>About ScholarSphere: Powering the Future of Research</h1>
                <div className='flex items-start gap-12 mt-8'>
                    <div>
                        <p className='text-lg font-medium mb-4'>Our mission is to democratize access to research resources through cutting-edge AI technology and expert knowledge.</p>
                        <p className='text-lg font-medium'>Over 10,000 researchers worldwide trust ScholarSphere to advance their academic careers.</p>
                    </div>
                    <div>
                        <p className='text-lg font-medium mb-4'>Meet the team: Experts from academic and AI fields dedicated to enhancing the research landscape.</p>
                        <LandingPageButton text={"Contact Us"} onClick={() => window.location.href = "mailto:scholarspherefyp@gmail.com"} logo={rocket}/>

                    </div>
                </div>
            </div>


        </div>
    )
}

export default LandingPage