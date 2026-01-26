import React from 'react';
import { Link } from 'react-router-dom'; // Make sure you have react-router-dom installed

// A simple progress bar component to be used within the card
const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-1.5 my-4">
    <div
      className="bg-blood-500 h-1.5 rounded-full transition-all duration-500"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

/**
 * A reusable card for displaying a fundraising campaign.
 * @param {object} props
 * @param {string} props.id - The unique ID for the campaign, used for the link.
 * @param {string} props.title - The title of the fundraiser (e.g., "Help Shubham Khanal").
 * @param {string} props.image - URL of the patient's image.
 * @param {number} props.raised - The amount of money raised so far.
 * @param {number} props.goal - The target fundraising amount.
 * @param {number} props.donors - The number of donors.
 * @param {(amount: number) => string} props.formatCurrency - Function to format currency.
 * @param {string} [props.className] - Additional Tailwind CSS classes for animation or styling.
 * @param {object} [props.style] - Additional inline styles for animation delay.
 */
const FundraiserCard = ({ id, title, image, raised, goal, donors, formatCurrency, className = "", style }) => {
  const progress = goal > 0 ? (raised / goal) * 100 : 0;

  return (
    <div 
      className={`bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col h-full ${className}`}
      style={style}
    >
      {/* Image Section */}
      <div className="relative h-56 mb-4 flex items-center justify-center overflow-hidden rounded-md">
        <img
          src={image || "/placeholder.svg?height=200&width=200"}
          alt={title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">{title}</h3>

        <ProgressBar progress={progress} />

        {/* Stats Section */}
        <div className="space-y-2 text-sm mb-5">
          <div className="flex justify-between">
            <span className="text-gray-500">Raised:</span>
            <span className="font-bold text-blood-600">{formatCurrency(raised)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Goal:</span>
            <span className="font-medium text-gray-800">{formatCurrency(goal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Donors:</span>
            <span className="font-medium text-gray-800">{donors}</span>
          </div>
        </div>

        {/* Donate Button - mt-auto pushes it to the bottom of the flex container */}
        <Link
          to={`/donate/${id}`} // Link to the specific donation page
          className="w-full mt-auto bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-300"
        >
          Donate →
        </Link>
      </div>
    </div>
  );
};

export default FundraiserCard;

