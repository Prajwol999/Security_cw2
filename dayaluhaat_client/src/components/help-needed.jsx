"use client"

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

// Import the new card component
import FundraiserCard from "../components/FundraiserCard";
import Badge from "../components/Badge"; // Assuming you have this component

// --- Helper Functions ---
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = 0;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getBackendImageUrl = (filePath) => {
  if (!filePath) return "/placeholder.svg?height=200&width=300";
  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";
  return `${backendUrl}/${filePath.replace(/\\/g, "/")}`;
};


// --- Skeleton Loader for the new card design ---
const FundraiserSkeletonCard = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="bg-gray-300 h-56 w-full rounded-md mb-4"></div>
    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4 mx-auto"></div>
    <div className="h-1.5 bg-gray-300 rounded-full w-full my-4"></div>
    <div className="space-y-3 mt-4">
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
    <div className="h-12 bg-gray-300 rounded-lg w-full mt-5"></div>
  </div>
);


const HelpNeededSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById("help-needed-section");
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    }
  }, []);

  // Fetching campaign data
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";
        const response = await fetch(`${backendUrl}/api/campaigns`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // Here we can add a default donor count if the API doesn't provide it
        const campaignsWithDefaults = data.map(c => ({ ...c, donors: c.donors || 0 }));
        setCampaigns(campaignsWithDefaults);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <section id="help-needed-section" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "animate-fadeInUp opacity-100" : "opacity-0 translate-y-[50px]"}`}
        >
          <Badge variant="primary" className="mb-4 animate-pulse">
            Donate
          </Badge>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">दयालु हात - Your Help is Needed</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <FundraiserSkeletonCard key={i} />)}
          </div>
        ) : isError ? (
          <div className="text-center py-10 px-4 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-lg font-medium text-red-800">Failed to load campaigns</h3>
            <p className="mt-1 text-sm text-red-700">Please try refreshing the page.</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-10 px-4 bg-gray-100 rounded-lg">
            <h3 className="mt-2 text-lg font-medium text-gray-800">No Active Campaigns</h3>
            <p className="mt-1 text-sm text-gray-600">There are currently no campaigns needing help. Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {campaigns.map((campaign, index) => (
              <FundraiserCard
                key={campaign._id}
                id={campaign._id}
                title={campaign.title}
                image={getBackendImageUrl(campaign.userImage)}
                raised={campaign.raisedAmount}
                goal={campaign.goalAmount}
                donors={campaign.donors}
                formatCurrency={formatCurrency}
                className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default HelpNeededSection;

