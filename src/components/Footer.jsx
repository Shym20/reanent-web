import React from 'react'
import logo from '../assets/images/logo.png'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#B7B7B733] ">
      <div className="max-w-6xl mx-auto text-center px-4 py-10">
        {/* Logo */}
        <img src={logo} alt="Reanent Logo" className="mx-auto h-10 mb-4" />

        {/* Description */}
        <p className="text-gray-700 max-w-3xl mx-auto text-sm leading-relaxed">
          Reanent is transforming the way rental property management works in India — designed to simplify and
          streamline the entire journey for both tenants and property owners. From listing properties and finding
          the right fit, to secure rent tracking, document sharing, and end-of-stay reviews, Reanent brings all the
          essential tools into one intelligent platform. Whether you’re renting out your space or searching for your
          next home, we make the process clear, efficient, and built on mutual trust. Our goal is to create a digital
          rental experience that feels less like paperwork — and more like progress.
        </p>

        {/* Contact */}
        <p className="mt-4 text-gray-700 text-sm">
          Contact us: <a href="mailto:reanent@gmail.com" className="text-[#033E4A] font-medium">reanent@gmail.com</a>
        </p>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-6">
          <a href="#" className="p-2 bg-[#033E4A] text-[#D7B56D] rounded-md hover:scale-105 hover:shadow-lg 
                   transition-all duration-300 ease-in-out hover:bg-[#05505d]">
            <FaFacebookF />
          </a>
          <a href="#" className="p-2 bg-[#033E4A] text-[#D7B56D] hover:scale-105 hover:shadow-lg 
                   transition-all duration-300 ease-in-out rounded-md hover:bg-[#05505d]">
            <FaWhatsapp />
          </a>
          <a href="#" className="p-2 bg-[#033E4A] text-[#D7B56D] hover:scale-105 hover:shadow-lg 
                   transition-all duration-300 ease-in-out rounded-md hover:bg-[#05505d]">
            <FaInstagram />
          </a>
          <a href="#" className="p-2 bg-[#033E4A] text-[#D7B56D] hover:scale-105 hover:shadow-lg 
                   transition-all duration-300 ease-in-out rounded-md hover:bg-[#05505d]">
            <FaLinkedinIn />
          </a>
          <a href="#" className="p-2 bg-[#033E4A] text-[#D7B56D] hover:scale-105 hover:shadow-lg 
                   transition-all duration-300 ease-in-out rounded-md hover:bg-[#05505d]">
            <FaYoutube />
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#033E4A] py-2 text-center flex justify-around text-white text-xs">
       <p className='text-[14px] '> © 2025 Reanent. All Rights Reserved.</p>
       <div className='text-[14px] flex gap-10 '>
        <Link to={'/privacy-policy'} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className='hover:underline hover:underline-offset-2 ' >Privacy Policy</Link>
        <Link to={'/terms-conditions'} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className='hover:underline hover:underline-offset-2 '>Terms & Condition</Link>
       </div>
      </div>
    </footer>
  )
}

export default Footer
