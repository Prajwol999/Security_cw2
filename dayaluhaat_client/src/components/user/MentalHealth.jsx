import React from 'react';
import { useState } from "react"
import Button from "../buttons"  // Default import, no curly braces
import Badge from "../badge"    // Default import, no curly braces
import { Card, CardContent, CardHeader, CardTitle } from "../card" // Named imports, use curly braces
import { Heart, Play, Star, Sun, Users, BookOpen, MessageCircle, ArrowRight, Quote } from "lucide-react"

// Video Modal Component
const VideoModal = ({ videoId, onClose }) => {
  if (!videoId) return null
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg w-full max-w-4xl aspect-video relative" onClick={(e) => e.stopPropagation()}>
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-12 right-0 text-white hover:text-gray-300"
          onClick={onClose}
        >
          <X className="w-8 h-8" />
        </Button>
      </div>
    </div>
  )
}

export default function MentalHealthPage() {
  const [activeVideoId, setActiveVideoId] = useState(null)

  const motivationalQuotes = [
    { text: "The bravest thing I ever did was continuing my life when I wanted to die.", author: "Juliette Lewis" },
    { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
    { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
    { text: "Healing takes time, and asking for help is a courageous step.", author: "Mariska Hargitay" },
  ]
  
  // ✅ Updated with more realistic stories and external links
  const hopeStories = [
    {
      title: "From Burnout to Balance",
      description: "An ER nurse shares her journey of recognizing burnout and building a life with intention and self-compassion.",
      category: "Self-Care",
      href: "#", // Replace with a real URL
    },
    {
      title: "The Quiet Strength of Showing Up",
      description: "Mark's story of overcoming social anxiety by joining a local hiking group and finding community in nature.",
      category: "Community",
      href: "#", // Replace with a real URL
    },
    {
      title: "Art as a Lifeline",
      description: "How discovering pottery gave a young student an outlet to process grief and rediscover joy.",
      category: "Recovery",
      href: "#", // Replace with a real URL
    },
  ]

  // ✅ Updated with real YouTube videos
  const motivationalVideos = [
    {
      id: 1,
      title: "How to Stop Overthinking",
      speaker: "Sadhguru",
      videoId: "3O2yD5t211c", // YouTube Video ID
      thumbnail: "https://i.ytimg.com/vi/3O2yD5t211c/hqdefault.jpg",
      category: "Mindfulness",
    },
    {
      id: 2,
      title: "The Single Most Important Parenting Strategy",
      speaker: "Dr. Becky Kennedy",
      videoId: "gmwnz_a3o5U",
      thumbnail: "https://i.ytimg.com/vi/gmwnz_a3o5U/hqdefault.jpg",
      category: "Personal Growth",
    },
  ]

  const resources = [
    { icon: <Heart className="w-8 h-8" />, title: "Self-Care Toolkit", description: "Daily practices for your wellbeing." },
    { icon: <Users className="w-8 h-8" />, title: "Support Groups", description: "Connect with others who understand." },
    { icon: <BookOpen className="w-8 h-8" />, title: "Learning Center", description: "Educate yourself on mental health." },
    { icon: <MessageCircle className="w-8 h-8" />, title: "Crisis Support", description: "24/7 helplines and resources." },
  ]

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800">
      <VideoModal videoId={activeVideoId} onClose={() => setActiveVideoId(null)} />

      {/* Hero Section */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-6 bg-teal-100 text-teal-800 text-sm py-1 px-3">Your Journey to Wellness Starts Here</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-slate-900">
            A Quiet Place for Your Mind to Heal
          </h1>
          <p className="text-xl text-slate-600 mb-10">
            Find hope, inspiration, and practical tools to support your mental health journey. You are not alone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white text-lg px-8 py-3 shadow-lg">
              Explore Resources <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Motivational Quotes */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">A Moment of Encouragement</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {motivationalQuotes.map((quote, index) => (
              <Card key={index} className="bg-slate-50 border-slate-200 shadow-sm">
                <CardContent className="p-8">
                  <Quote className="w-8 h-8 text-teal-400 mb-4" />
                  <p className="text-slate-700 text-lg leading-relaxed italic">"{quote.text}"</p>
                  <p className="text-slate-500 font-medium mt-4 text-right">— {quote.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Motivational Videos */}
      <section className="py-20 px-4 bg-sky-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Inspiring Voices of Hope</h2>
            <p className="text-lg text-slate-600">Listen to stories of resilience, recovery, and finding strength.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {motivationalVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white group">
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-56 object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="lg" variant="secondary" onClick={() => setActiveVideoId(video.videoId)}>
                      <Play className="w-6 h-6 mr-2" /> Play
                    </Button>
                  </div>
                  <Badge className="absolute top-3 right-3 bg-teal-500 text-white">{video.category}</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                  <p className="text-slate-500">by {video.speaker}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hope Stories */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Stories of Hope & Recovery</h2>
            <p className="text-lg text-slate-600">Real stories from people who found their way to healing.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {hopeStories.map((story, index) => (
              <a href={story.href} target="_blank" rel="noopener noreferrer" className="block group" key={index}>
                <Card className="h-full bg-slate-50 border-slate-200 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-sky-100 text-sky-800">{story.category}</Badge>
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{story.description}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Wellness Toolkit</h2>
            <p className="text-lg text-slate-600">Practical resources to support your journey.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="text-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                <div className="bg-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-teal-600">
                  {resource.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                <p className="text-slate-600 text-sm">{resource.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

