import { useEffect, useState } from 'react';
import axios from 'axios';

const PAGE_SIZE = 20;

export default function DonationsManagement() {
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = { page, limit: PAGE_SIZE };
      if (search) params.search = search;
      if (status) params.paymentStatus = status;
      const res = await axios.get('/api/donations/admin/list', { params });
      setDonations(res.data.donations);
      setTotal(res.data.total);
    } catch (err) {
      setDonations([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, [page, search, status]);

  const handleExport = async () => {
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (status) params.push(`paymentStatus=${encodeURIComponent(status)}`);
    const url = `/api/donations/admin/export${params.length ? '?' + params.join('&') : ''}`;
    window.open(url, '_blank');
  };

  // Defensive: always use an array
  const safeDonations = Array.isArray(donations) ? donations : [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Donations Management</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by donor, email, transaction..."
          value={search}
          onChange={e => { setPage(1); setSearch(e.target.value); }}
          className="border px-3 py-2 rounded w-64"
        />
        <select value={status} onChange={e => { setPage(1); setStatus(e.target.value); }} className="border px-3 py-2 rounded">
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <button onClick={handleExport} className="bg-blood-600 text-white px-4 py-2 rounded font-semibold">Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Campaign</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Donor</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Anonymous</th>
              <th className="px-4 py-2 border">Gateway</th>
              <th className="px-4 py-2 border">Transaction</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-8">Loading...</td></tr>
            ) : safeDonations.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8">No donations found.</td></tr>
            ) : safeDonations.map(d => (
              <tr key={d._id} className="border-b">
                <td className="px-4 py-2 border">{new Date(d.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 border">{d.campaignId?.description || ''}</td>
                <td className="px-4 py-2 border">{d.amount}</td>
                <td className="px-4 py-2 border">{d.donorName}</td>
                <td className="px-4 py-2 border">{d.donorEmail}</td>
                <td className="px-4 py-2 border">{d.isAnonymous ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 border">{d.paymentGateway}</td>
                <td className="px-4 py-2 border">{d.transactionId}</td>
                <td className="px-4 py-2 border">{d.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span>Total: {total}</span>
        <div className="space-x-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <span>Page {page}</span>
          <button disabled={page * PAGE_SIZE >= total} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
} 

