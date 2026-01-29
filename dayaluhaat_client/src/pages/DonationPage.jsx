import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CreditCard, User, Mail, Phone } from 'lucide-react';

const formatCurrency = (amount) => {
  if (isNaN(amount) || amount === '') return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const DonationPageSkeleton = () => (
  <div className="bg-gray-50 min-h-screen py-12 px-4">
    <div className="animate-pulse max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-5 bg-gray-300 rounded w-1/2 mb-8"></div>
      <div className="h-14 bg-gray-300 rounded w-full mb-4"></div>
      <div className="h-14 bg-gray-300 rounded w-full mb-4"></div>
      <div className="h-14 bg-gray-300 rounded w-full mb-4"></div>
      <div className="h-16 bg-gray-300 rounded-lg w-full"></div>
    </div>
  </div>
);

const DonationPage = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

  // Fetch Campaign Details
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${backendUrl}/api/campaigns/${campaignId}`);
        if (!response.ok) throw new Error('Campaign not found');
        const data = await response.json();
        setCampaign(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaignDetails();
  }, [campaignId, backendUrl]);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('khalti');

  // Handle Khalti Payment
  const handleKhaltiPayment = async () => {
    try {
      // ... existing Khalti logic ...
      const amountInPaisa = Number(amount) * 100;
      const response = await axios.post(
        `${backendUrl}/api/donations/khalti-payment-initiate`,
        {
          return_url: `${window.location.origin}/donation/success`,
          website_url: window.location.origin,
          amount: amountInPaisa,
          purchase_order_id: `Order_${campaignId}_${Date.now()}`,
          purchase_order_name: campaign.title,
          customer_info: {
            name: isAnonymous ? 'Anonymous' : name,
            email: email,
            phone: phone,
          },
        }
      );

      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        navigate(`/donation/failure?message=${response.data.message || 'Failed to initiate payment'}`);
      }
    } catch (error) {
      console.error('Error initiating Khalti payment:', error);
      const errorMessage = error.response?.data?.message || 'Payment initiation failed';
      navigate(`/donation/failure?message=${errorMessage}`);
    }
  };

  // Handle eSewa Payment
  const handleEsewaPayment = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/donations/esewa-payment-initiate`,
        {
          amount: Number(amount),
          purchase_order_id: `Order-${campaignId}-${Date.now()}`,
          purchase_order_name: campaign.title,
          website_url: window.location.origin,
        }
      );

      const { payment_url, params } = response.data;

      // Create a hidden form and submit it
      const form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", payment_url);
      form.setAttribute("target", "_self");

      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", params[key]);
          form.appendChild(hiddenField);
        }
      }

      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error('Error initiating eSewa payment:', error);
      const errorMessage = error.response?.data?.error || 'eSewa payment initiation failed';
      toast.error(errorMessage);
    }
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // ... validations ...
    if (!amount || Number(amount) < 10) {
      toast.error('Please enter an amount of at least ₹10.');
      return;
    }
    if (!isAnonymous && !name.trim()) {
      toast.error('Please enter your name or choose to donate anonymously.');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || !/^\d{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    if (paymentMethod === 'khalti') {
      handleKhaltiPayment();
    } else {
      handleEsewaPayment();
    }
  };

  // Render Logic
  if (isLoading) return <DonationPageSkeleton />;

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-600">Error: {error}</h2>
        <p className="text-gray-500 mt-2">Could not load the campaign details.</p>
        <a href="/" className="mt-4 inline-block bg-blood-600 text-white px-6 py-2 rounded-lg">
          Go to Homepage
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800">Donate to {campaign.title}</h1>
        <p className="text-gray-500 mt-2">
          Your contribution will make a difference. Goal: {formatCurrency(campaign.goalAmount)}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose an amount (INR)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[500, 1000, 2500, 5000].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${amount == val ? 'bg-blood-600 text-white border-blood-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blood-500'
                    }`}
                >
                  {formatCurrency(val)}
                </button>
              ))}
            </div>
            <div className="relative mt-4">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
              <input
                type="number"
                placeholder="Or enter a custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blood-500 focus:border-blood-500"
              />
            </div>
          </div>

          {/* Donor Details */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute inset-y-0 left-0 pl-3 h-full w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAnonymous}
                required={!isAnonymous}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blood-500 focus:border-blood-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute inset-y-0 left-0 pl-3 h-full w-5 text-gray-400 pointer-events-none" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blood-500 focus:border-blood-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative mt-1">
              <Phone className="absolute inset-y-0 left-0 pl-3 h-full w-5 text-gray-400 pointer-events-none" />
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blood-500 focus:border-blood-500"
              />
            </div>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center">
            <input
              id="anonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 text-blood-600 border-gray-300 rounded focus:ring-blood-500"
            />
            <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
              Make my donation anonymous
            </label>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('khalti')}
                className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center font-semibold transition-all ${paymentMethod === 'khalti'
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-purple-400'
                  }`}
              >
                Khalti
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('esewa')}
                className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center font-semibold transition-all ${paymentMethod === 'esewa'
                  ? 'border-green-600 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-green-400'
                  }`}
              >
                eSewa
              </button>
            </div>
          </div>

          {/* Payment Button */}
          <button
            type="submit"
            className={`w-full text-white font-bold py-4 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed ${paymentMethod === 'khalti' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            disabled={isLoading}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pay with {paymentMethod === 'khalti' ? 'Khalti' : 'eSewa'} {formatCurrency(amount)}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationPage;

