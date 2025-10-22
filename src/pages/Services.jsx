import React from 'react'
import { TbCircleCheck } from "react-icons/tb";
import {Link} from "react-router-dom";

import BetterIcon2 from '../assets/icons/serviceIcon2.png'
import BetterIcon3 from '../assets/icons/serviceIcon3.png'
import BetterIcon4 from '../assets/icons/serviceIcon4.png'
import BetterIcon5 from '../assets/icons/serviceIcon5.png'
import BetterIcon6 from '../assets/icons/serviceIcon6.png'
import serviceBg from '../assets/images/service-hero-bg.png'
import service1 from '../assets/images/service-1.png'
import service2 from '../assets/images/service-2.png'
import Testimonial from '../components/Testimonial';


const features = [
    {
        icon: BetterIcon2,
        title: "Verified Users Only",
        description: "Connect with verified tenants and owners for secure interactions.",

    },
    {
        icon: BetterIcon2,
        title: "Digital Docs & Checklists",
        description: "Specialized healthcare for infants, children, and teenagers."
    },
    {
        icon: BetterIcon3,
        title: "Instant Chat",
        description: "Built-in chat for quick and secure tenant-owner conversations."
    },
    {
        icon: BetterIcon4,
        title: "Rent & Utility Tracker",
        description: "Manage rent payments and utility bills in one smart dashboard."
    },
    {
        icon: BetterIcon5,
        title: "Ratings That Build Trust",
        description: "Review and rate your experience to help future users."
    },
    // {
    //     icon: BetterIcon6,
    //     title: "No Middlemen, No Hassle",
    //     description: "Direct interactions – no brokers or hidden fees."
    // }
];

const Services = () => {
    return (
        <>
            <div className="relative w-full h-[80vh] flex items-center justify-center">
                {/* Background Image */}
                <img
                    src={serviceBg}
                    alt="Property Management"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Text content */}
                <div className="relative text-center text-white px-4 max-w-3xl">
                    <h1 className="text-3xl md:text-5xl  font-[500] mb-4">
                        Powerful Services for Smarter Property Management
                    </h1>
                    <p className="text-sm md:text-lg font-[400]">
                        From property listings and secure tenant interaction to rent tracking,
                        utilities, and reputation building — Reanent offers everything you
                        need in one platform.
                    </p>
                </div>
            </div>

            <section className="px-4 py-12">
                <div className="text-center mt-6 mb-12">

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-[#24292E]">
                        Our Services
                    </h2>

                    {/* Subtitle */}
                    <p className="text-[#383F45] max-w-xl mx-auto mt-2 text-lg">
                        “Reanent brings all rental needs under one platform — from property listing to payments, documents, and trust-building.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`p-6 py-10 rounded-xl shadow-sm text-center ${feature.highlight ? "bg-[#033E4A] text-white" : "bg-[#00000008] text-gray-900"
                                }`}
                        >
                            <div className={`flex items-center flex-col justify-center ${feature.highlight ? "text-white" : "text-gray-800"}`}>
                                <img src={feature.icon} className='w-22 hover:text-red-400 ' alt="" />
                                <h3 className="text-lg mt-5 font-semibold mb-2">{feature.title}</h3>
                                <p className={`text-lg text-center w-70 ${feature.highlight ? "text-white/80" : "text-gray-500"}`}>
                                    {feature.description}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-7xl mx-auto py-6 px-4 grid md:grid-cols-2 gap-12 items-center">

                {/* Left Side - Single Image */}
                <div className="flex justify-center">
                    <img
                        src={service1}
                        alt="Modern Renters Features"
                        className="rounded-3xl"
                    />
                </div>

                {/* Right Side - Text */}
                <div>
                    <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                    <p className="text-[#383F45] text-lg mb-8">
                        From sign-up to move-in, Reanent makes renting simple, secure, and stress-free.
                    </p>
                    <p className="text-[#383F45] flex gap-3 items-center text-lg mb-5"><TbCircleCheck className='text-[#D7B56D] text-[23px] ' /> Sign up and verify your profile to build trust and safety.</p>
                    <p className="text-[#383F45] flex gap-3 items-center text-lg mb-5"><TbCircleCheck className='text-[#D7B56D] text-[23px] ' /> List your property with rent, photos, and details in minutes.</p>
                    <p className="text-[#383F45] flex gap-3 items-center text-lg mb-5"><TbCircleCheck className='text-[#D7B56D] text-[23px] ' /> Tenants browse verified listings and show interest easily.</p>
                    <p className="text-[#383F45] flex gap-3 items-center text-lg mb-5"><TbCircleCheck className='text-[#D7B56D] text-[23px] ' />Connect instantly through secure chat and digital document sharing.</p>
                    <p className="text-[#383F45] flex gap-3 items-center text-lg mb-5"><TbCircleCheck className='text-[#D7B56D] text-[23px] ' /> Manage rent payments, utilities, and tenancy records in one dashboard.</p>

                </div>

            </section>

            <section className="max-w-7xl mx-auto py-6 px-4 grid md:grid-cols-2 gap-12 items-center">

                {/* Left Side - Text */}
                <div>
                    <h2 className="text-4xl font-bold mb-4">Why Choose Reanent?</h2>
                    <p className="text-[#383F45] text-lg mb-8">
                       Designed for simplicity, security, and trust — here’s why thousands of owners and tenants prefer us.
                    </p>
                    <p className="text-[#383F45] flex gap-3 items-center text-lg mb-5"><TbCircleCheck className='text-[#D7B56D] text-[23px] ' /> Verified users ensure safe and reliable rental experiences.</p>
                    <p className="text-[#383F45] flex gap-3 items-center text-lg mb-5"><TbCircleCheck className='text-[#D7B56D] text-[23px] ' /> Secure chat and digital documents make communication effortless.</p>
                    <p className="text-[#383F45] flex gap-3 items-center text-lg mb-5"><TbCircleCheck className='text-[#D7B56D] text-[23px] ' /> Smart rent and utility tracking saves time and avoids confusion.</p>
                    <p className="text-[#383F45] flex gap-3 items-center text-lg mb-5"><TbCircleCheck className='text-[#D7B56D] text-[23px] ' />Transparent ratings and reviews build long-term trust.</p>
                    <p className="text-[#383F45] flex gap-3 items-center text-lg mb-5"><TbCircleCheck className='text-[#D7B56D] text-[23px] ' /> Direct connections mean no brokers, no hidden costs.</p>

                </div>

                {/* Right Side - Single Image */}
                <div className="flex justify-center">
                    <img
                        src={service2}
                        alt="Modern Renters Features"
                        className="rounded-3xl"
                    />
                </div>

            </section>

            <Testimonial/>

            <div className="bg-[#023C46] py-16 flex flex-col items-center text-center px-4">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Ready to Simplify Your Rentals?
      </h2>

      {/* Subtext */}
      <p className="text-white text-sm md:text-base mb-8 max-w-2xl">
        Join Reanent today and experience a smarter, safer, and hassle-free way
        of renting.
      </p>

      {/* Button */}
      <Link to={'/signup'} >
      <button className="bg-[#D7B46A] text-[#023C46] font-medium px-8 py-3 rounded-full shadow-md hover:bg-[#c5a158] hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
        Get Started
      </button>
      </Link>
    </div>
        </>
    )
}

export default Services
