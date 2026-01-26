"use client"

import { useEffect, useState } from "react"
import Button from "./buttons"
import heroImage from "../assets/images/hero-blood-donation.png"

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-lightBlue-100 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2 transition-all duration-1000"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1
                  className={`text-4xl tracking-tight font-extrabold text-navy-500 sm:text-5xl md:text-6xl transition-all duration-1000 ${isVisible ? "animate-slideInLeft opacity-100" : "opacity-0 translate-x-[-100px]"}`}
                >
                  <span className="block">
                    Compassionate Care,
                  </span>
                  <span className="block text-blood-500">
                    Helping Hands
                  </span>
                </h1>
                <p className={`mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 transition-all duration-1000 ${isVisible ? "animate-fadeInUp opacity-100" : "opacity-0"}`}>
                  Join दयालु हात in making a difference through blood donation and healthcare support
                </p>
                <div
                  className={`mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start transition-all duration-1000 ${isVisible ? " opacity-100" : "opacity-0 translate-y-[50px]"}`}
                  style={{ animationDelay: "0.8s" }}
                >
                  <div className="rounded-md shadow">
                    <Button variant="primary" size="large">
                      Become a Donor
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button variant="outline" size="large">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <div
        className={`lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 transition-all duration-1000 ${isVisible ? "animate-slideInRight opacity-100" : "opacity-0 translate-x-[100px]"}`}
      >
        <img
          className="h-56 w-full object-contain sm:h-72 md:h-96 lg:w-full lg:h-full hover:scale-105 transition-transform duration-700 p-8"
          src={heroImage}
          alt="दयालु हात - Compassionate Healthcare Support"
        />
      </div>
    </section>
  )
}

export default HeroSection


