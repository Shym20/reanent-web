import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="bg-white py-16 px-6 md:px-12 lg:px-20">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-[600] text-gray-900">Contact Us</h2>
        <p className="mt-4 text-gray-600 text-[18px] max-w-2xl mx-auto">
          REANENT isn't just another rental property management platform. We're a
          social network, a community, a bridge between landlords and tenants seeking
          more than just a transaction.
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1  md:grid-cols-2 gap-12 md:gap-30 max-w-5xl mx-auto">
        {/* Left - Contact Form */}
        <form className="space-y-6">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#24292E] mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="First Name"
                className="w-full border-2 border-[#CED2D6] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#023C46]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#24292E] mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Last Name"
                className="w-full border-2 border-[#CED2D6] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#023C46]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#24292E] mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="abc@comp.com"
              className="w-full border-2 border-[#CED2D6] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#023C46]"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-[#24292E] mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+(918)762 8908"
              className="w-full border-2 border-[#CED2D6] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#023C46]"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-[#24292E] mb-1">
              Message
            </label>
            <textarea
              placeholder="Message here"
              rows="4"
              className="w-full border-2 border-[#CED2D6] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#023C46]"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#023C46] text-white py-3 rounded-md hover:bg-[#035360] hover:scale-102 hover:shadow-lg 
                   transition-all duration-300 ease-in-out"
          >
            Send Message
          </button>
        </form>

        {/* Right - Contact Info */}
        <div className="space-y-8">
          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
            <p className="text-gray-600 mt-2">
              977 urmila, Talie Alie, Maruti Mandir Chowk,
              <br />
              Talegaon Dabhade, 410506
            </p>
          </div>

          {/* Call Us */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Call us</h3>
            <p className="text-gray-600 mt-1">
              Call our team on mon–fri, from 9AM to 6 PM
            </p>
            <div className="flex items-center mt-2 text-gray-700">
              <FaPhoneAlt className="mr-2 text-[#023C46]" />
              +91 9822345687
            </div>
          </div>

          {/* Email */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Email</h3>
            <p className="text-gray-600 mt-1">
              For all your property needs, contact us at:
            </p>
            <div className="flex items-center mt-2 text-gray-700">
              <FaEnvelope className="mr-2 text-[#023C46]" />
              contact.reanent@gmail.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
