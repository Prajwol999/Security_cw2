// src/pages/NotFoundPage.jsx

import { Link } from 'react-router-dom';
// We'll use a more thematic icon from lucide-react
import { Stethoscope } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 text-gray-800">
      <div className="text-center p-8 max-w-lg">
        {/* Thematic Illustration Area */}
        <div className="relative inline-block">
          <Stethoscope 
            className="relative z-10 h-32 w-32 text-blood-500" 
            strokeWidth={1.5} 
          />
          {/* A faint background shape for more visual appeal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 bg-blood-100 rounded-full -z-0"></div>
        </div>

        {/* Witty & Thematic Copywriting */}
        <h1 className="mt-8 text-2xl md:text-4xl font-bold">
          We're listening for a heartbeat...
        </h1>
        
        <p className="mt-4 text-base md:text-lg text-gray-600">
          But it seems the page you're looking for was never admitted or has already been discharged.
        </p>

        {/* Simplified Call to Action */}
        <div className="mt-10">
           <p className="text-sm text-gray-500 mb-4">Let's guide you back to the main lobby.</p>
           <Link 
              to="/" 
              className="inline-block px-8 py-3 bg-blood-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blood-700 focus:outline-none focus:ring-2 focus:ring-blood-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
            >
              Return to Homepage
            </Link>
        </div>
      </div>
    </div>
  );
}

