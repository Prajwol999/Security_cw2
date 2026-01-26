import React, { useState, useEffect } from 'react';
import { getAllLogsApi } from '../../api/admin/userApi';
import { Clock, Shield, AlertTriangle, CheckCircle, Search, RefreshCw, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AuditLogViewer = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await getAllLogsApi();
            if (res.data.success) {
                setLogs(res.data.logs);
            }
        } catch (error) {
            console.error("Failed to fetch logs:", error);
            toast.error("Failed to load security logs");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchLogs();
    };

    const getStatusColor = (status) => {
        if (status >= 500) return 'text-red-600 bg-red-100';
        if (status >= 400) return 'text-orange-600 bg-orange-100';
        if (status >= 300) return 'text-blue-600 bg-blue-100';
        if (status >= 200) return 'text-emerald-600 bg-emerald-100';
        return 'text-gray-600 bg-gray-100';
    };

    const filteredLogs = logs.filter(log =>
        log.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.includes(searchTerm) ||
        (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-3 bg-blood-100 rounded-2xl">
                            <Shield className="w-6 h-6 text-blood-600" />
                        </div>
                        Security Audit Logs
                    </h2>
                    <p className="text-gray-500 mt-2 ml-14">
                        Monitor system access and security events in real-time
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className={`p-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                        title="Refresh Logs"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl w-64 focus:ring-2 focus:ring-blood-100 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading && !isRefreshing ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="w-12 h-12 border-4 border-blood-100 border-t-blood-500 rounded-full animate-spin mb-4"></div>
                    <p>Loading audit trails...</p>
                </div>
            ) : filteredLogs.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No logs found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search filters</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Request</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User / IP</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredLogs.map((log, index) => (
                                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium font-mono">
                                                <div className={`w-1.5 h-1.5 rounded-full ${log.level === 'ERROR' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                                {log.timestamp}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusColor(log.status)}`}>
                                                {log.status >= 500 ? <AlertTriangle className="w-3 h-3 mr-1" /> :
                                                    log.status === 200 || log.status === 201 ? <CheckCircle className="w-3 h-3 mr-1" /> : null}
                                                {log.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 font-mono">
                                                    {log.method} <span className="text-gray-500 font-normal">{log.url}</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded w-fit mb-1 font-mono">
                                                    {log.ip}
                                                </span>
                                                <span className="text-xs text-gray-500 truncate max-w-[150px]" title={log.user}>
                                                    {log.user === 'Unauthenticated' ? 'Guest' : log.user}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 tabular-nums">
                                            {log.duration}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="mt-4 text-center text-xs text-gray-400">
                Displaying the latest 1000 system events from secure log storage
            </div>
        </div>
    );
};

export default AuditLogViewer;
