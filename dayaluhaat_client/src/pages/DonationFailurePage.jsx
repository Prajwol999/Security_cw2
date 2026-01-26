import { Link, useLocation } from 'react-router-dom';
import { XCircle } from 'lucide-react';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const DonationFailurePage = () => {
    const query = useQuery();
    const errorMessage = query.get('message');
    return (
        <div className="text-center py-20">
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Payment Failed</h2>
            <p className="text-gray-600 mt-2">
                {errorMessage ? errorMessage : 'There was a problem processing your donation. Please try again.'}
            </p>
            <Link to="/" className="mt-6 inline-block bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold">
                Return to Homepage
            </Link>
        </div>
    );
};
export default DonationFailurePage;

