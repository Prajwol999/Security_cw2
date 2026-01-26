"use client"

import React from 'react';
import { Heart, Droplet, Calendar, HandHeart } from "lucide-react"
import { useEffect, useState } from "react"
import Card from "./dashboardCard"

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("services-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const services = [
    {
      icon: Heart,
      title: "Saves Lives",
      description: "Every donation can save up to three lives. Your contribution makes a real difference in emergency situations.",
      color: "bg-blood-100 text-blood-600",
    },
    {
      icon: Droplet,
      title: "Free Health Checkup",
      description: "Get a complimentary health screening including blood pressure, hemoglobin levels, and infectious disease testing.",
      color: "bg-lightBlue-200 text-lightBlue-700",
    },
    {
      icon: Calendar,
      title: "Quick & Easy Process",
      description: "The entire donation process takes less than an hour. Schedule your appointment at your convenience.",
      color: "bg-navy-100 text-navy-600",
    },
    {
      icon: HandHeart,
      title: "Helps Others",
      description: "Join a community of heroes making a difference. Your donation helps patients in need across our community.",
      color: "bg-blood-100 text-blood-600",
    },
  ]

  return (
    <section id="services-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center transition-all duration-1000 ${isVisible ? "animate-fadeInUp opacity-100" : "opacity-0 translate-y-[50px]"}`}
        >
          <h2 className="text-3xl font-extrabold text-navy-500 sm:text-4xl">Why Support दयालु हात?</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how your contribution to दयालु हात creates lasting impact through compassionate healthcare and community support.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`group ${isVisible ? "animate-fadeInUp opacity-100" : "opacity-0 translate-y-[50px]"}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 ${service.color} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6`}
              >
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-navy-500 mb-2 group-hover:text-blood-500 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection


