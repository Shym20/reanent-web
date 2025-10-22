import React from 'react'
import pointImage from '../assets/images/pointImg.png'
import sideImg from '../assets/images/about-sideImg.png'
import sideImg1 from '../assets/images/about-sideImg2.png'
import sideImg2 from '../assets/images/about-sideImg3.png'

const points = [
  { title: "Smart Search", description: "Browse verified homes with powerful filters" },
  { title: "Show Interest", description: "Reach out to owners in just one click" },
  { title: "Instant Chat", description: "No calls needed, chat directly in-app" },
  { title: "Track Payments", description: "View rent history & due reminders" },
  { title: "Your Docs, Safe", description: "Access lease & utility records anytime" }
];

const About = () => {
  return (
    <>
       {/* Better Rentals Cards Section*/}
            <section className="max-w-7xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-12 items-center">

              {/* Left Side - Single Image */}
              <div className="flex justify-center">
                <img
                  src={pointImage}
                  alt="Modern Renters Features"
                  className="rounded-3xl"
                />
              </div>

              {/* Right Side - Text */}
              <div>
                <h2 className="text-4xl font-bold mb-4">Made for Modern Renters</h2>
                <p className="text-[#383F45] text-lg mb-8">
                  Reanent empowers you to explore, connect, and manage rentals without hassle or middlemen.
                </p>
      
                <div className="grid sm:grid-cols-2 gap-8">
                  {points.map((feature, index) => (
                    <div
                      key={index}
                      className="border border-[#D7B56D] rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
                    >
                      <h3 className="text-[#D7B56D] font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
      
            </section>

         {/* Our Story Section*/}
            <section className="max-w-7xl mx-auto py-6 px-4 grid md:grid-cols-2 gap-12 items-center">

              {/* Left Side - Text */}
              <div>
                <h2 className="text-4xl font-bold mb-4">Our Story</h2>
                <p className="text-[#383F45] text-lg mb-8">
                  Reanent was founded to solve one of the biggest problems in real estate — the complexity and lack of trust in rentals. By combining technology with transparency, we’re building a platform where tenants and owners can connect directly and manage rentals with ease.
                </p>
      
              </div>

              {/* Right Side - Single Image */}
              <div className="flex justify-center">
                <img
                  src={sideImg}
                  alt="Modern Renters Features"
                  className="rounded-3xl"
                />
              </div>

            </section>

         {/* Our Mission & Vision Section*/}
            <section className="max-w-7xl mx-auto py-6 px-4 grid md:grid-cols-2 gap-12 items-center">

              {/* Left Side - Single Image */}
              <div className="flex justify-center">
                <img
                  src={sideImg1}
                  alt="Modern Renters Features"
                  className="rounded-3xl"
                />
              </div>

               {/* Right Side - Text */}
              <div>
                <h2 className="text-4xl font-bold mb-4">Our Mission & Vision</h2>
                <p className="text-[#383F45] text-lg mb-8">
                  Our mission is to simplify and modernize the rental experience by providing secure and intelligent tools that make property management seamless for both tenants and owners. We envision becoming the most trusted platform worldwide, fostering transparency, reliability, and convenience in every rental interaction.
                </p>
      
              </div>

            </section>

         {/* Our Story Section*/}
            <section className="max-w-7xl mx-auto py-6 px-4 grid md:grid-cols-2 gap-12 items-center">

              {/* Left Side - Text */}
              <div>
                <h2 className="text-4xl font-bold mb-4">Powered by Expereince</h2>
                <p className="text-[#383F45] text-lg mb-8">
                 eanent is built in collaboration with First500days — a venture studio with over 50 years of combined experience in startups, enterprises, and innovation. With expertise in product development, technology, and business consulting, we bring credibility and scale to the rental ecosystem.
                </p>
      
              </div>

              {/* Right Side - Single Image */}
              <div className="flex justify-center">
                <img
                  src={sideImg2}
                  alt="Modern Renters Features"
                  className="rounded-3xl"
                />
              </div>

            </section>
    </>
  )
}

export default About
