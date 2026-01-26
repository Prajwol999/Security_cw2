import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const DonationSuccessPage = () => (
    <div className="text-center py-20">
        <CheckCircle className="mx-auto h-16 w-16 text-blood-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-800">Thank You!</h2>
        <p className="text-gray-600 mt-2">Your donation has been successfully processed.</p>
        <Link to="/" className="mt-6 inline-block bg-blood-600 text-white px-8 py-3 rounded-lg font-semibold">
            Go to Homepage
        </Link>
    </div>
);
export default DonationSuccessPage;

