import { Twitter, Facebook, Youtube, Instagram, Droplet } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8 animate-fadeInUp">
            <div className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <Droplet className="w-10 h-10 text-blood-500 fill-blood-500" />
            </div>
            <span className="text-xl font-bold text-navy-500 hover:text-blood-500 transition-colors duration-300">
              <span className="text-blood-500">दयालु हात</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav
            className="flex flex-wrap justify-center space-x-8 mb-8 animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            <a
              href="#"
              className="text-gray-600 hover:text-blood-500 transition-all duration-300 hover:scale-105 relative group"
            >
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blood-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blood-500 transition-all duration-300 hover:scale-105 relative group"
            >
              Campaigns
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blood-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blood-500 transition-all duration-300 hover:scale-105 relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blood-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blood-500 transition-all duration-300 hover:scale-105 relative group"
            >
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blood-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blood-500 transition-all duration-300 hover:scale-105 relative group"
            >
              Privacy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blood-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Social Links */}
          <div className="flex space-x-6 mb-8 animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
            <a
              href="#"
              className="text-gray-400 hover:text-blood-500 transition-all duration-300 hover:scale-125 hover:-translate-y-1"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blood-600 transition-all duration-300 hover:scale-125 hover:-translate-y-1"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-red-500 transition-all duration-300 hover:scale-125 hover:-translate-y-1"
            >
              <Youtube className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-pink-500 transition-all duration-300 hover:scale-125 hover:-translate-y-1"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-center text-gray-500 text-sm animate-fadeInUp" style={{ animationDelay: "0.6s" }}>
            © 2024 दयालु हात. All rights reserved. Saving lives, one donation at a time.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


