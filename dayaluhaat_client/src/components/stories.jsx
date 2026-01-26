// "use client"

// import { useEffect, useState } from "react"
// import Badge from "./badge"

// const StoriesSection = () => {
//   const [isVisible, setIsVisible] = useState(false)

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true)
//         }
//       },
//       { threshold: 0.1 },
//     )

//     const element = document.getElementById("stories-section")
//     if (element) observer.observe(element)

//     return () => observer.disconnect()
//   }, [])

//   const stories = [
//     {
//       image: "/placeholder.svg?height=300&width=400",
//       title: "Success Story",
//       subtitle: "Medical Emergency",
//       size: "large",
//     },
//     {
//       image: "/placeholder.svg?height=200&width=300",
//       title: "Education Fund",
//       subtitle: "Student Support",
//       size: "medium",
//     },
//     {
//       image: "/placeholder.svg?height=200&width=300",
//       title: "Community Help",
//       subtitle: "Social Cause",
//       size: "medium",
//     },
//     {
//       image: "/placeholder.svg?height=200&width=300",
//       title: "Family Support",
//       subtitle: "Emergency Aid",
//       size: "medium",
//     },
//     {
//       image: "/placeholder.svg?height=200&width=300",
//       title: "Healthcare",
//       subtitle: "Medical Treatment",
//       size: "medium",
//     },
//   ]

//   return (
//     <section id="stories-section" className="py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div
//           className={`mb-12 transition-all duration-1000 ${isVisible ? "animate-fadeInUp opacity-100" : "opacity-0 translate-y-[50px]"}`}
//         >
//           <Badge variant="success" className="mb-4 animate-bounce">
//             Success Stories
//           </Badge>
//           <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">By you It's happened</h2>
//           <p className="mt-4 text-lg text-gray-600 max-w-3xl">
//             Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
//             industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
//             scrambled it.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {stories.map((story, index) => (
//             <div
//               key={index}
//               className={`relative rounded-lg overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
//                 story.size === "large" ? "md:row-span-2" : ""
//               } ${isVisible ? "animate-zoomIn opacity-100" : "opacity-0 scale-75"}`}
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <img
//                 src={story.image || "/placeholder.svg"}
//                 alt={story.title}
//                 className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
//                   story.size === "large" ? "h-96" : "h-48"
//                 }`}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
//               <div className="absolute inset-0 flex flex-col justify-end p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
//                 <h3 className="text-white font-semibold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
//                   {story.title}
//                 </h3>
//                 <p className="text-white text-sm opacity-90 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
//                   {story.subtitle}
//                 </p>
//                 <button className="text-orange-400 text-sm mt-2 flex items-center hover:text-orange-300 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 hover:scale-105">
//                   Read more →
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// export default StoriesSection


