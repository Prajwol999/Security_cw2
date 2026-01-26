"use client"

import { useEffect, useState } from "react"

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [counters, setCounters] = useState([0, 0, 0, 0])

  const stats = [
    {
      number: "0%",
      label: "Platform charge",
      description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
      finalValue: 0,
    },
    {
      number: "12+ Lakh",
      label: "Donations given",
      description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
      finalValue: 12,
    },
    {
      number: "16+ Lakh",
      label: "Active Donors",
      description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
      finalValue: 16,
    },
    {
      number: "2000+",
      label: "Success stories",
      description: "contrary to popular belief, Lorem Ipsum is not simply random text.",
      finalValue: 2000,
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Animate counters
          stats.forEach((stat, index) => {
            let start = 0
            const end = stat.finalValue
            const duration = 2000
            const increment = end / (duration / 16)

            const timer = setInterval(() => {
              start += increment
              if (start >= end) {
                start = end
                clearInterval(timer)
              }
              setCounters((prev) => {
                const newCounters = [...prev]
                newCounters[index] = Math.floor(start)
                return newCounters
              })
            }, 16)
          })
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("stats-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="stats-section" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center group hover:scale-105 transition-all duration-500 hover:bg-white hover:shadow-lg hover:rounded-lg hover:p-6 ${isVisible ? "animate-fadeInUp opacity-100" : "opacity-0 translate-y-[50px]"}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-4xl font-bold text-blood-600 mb-2 group-hover:text-blood-700 transition-colors duration-300">
                {index === 0
                  ? "0%"
                  : index === 1
                    ? `${counters[index]}+ Lakh`
                    : index === 2
                      ? `${counters[index]}+ Lakh`
                      : `${counters[index]}+`}
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                {stat.label}
              </div>
              <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection


