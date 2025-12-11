import { useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { Settings, Save } from 'lucide-react';

const Admin = () => {
    const [slug, setSlug] = useState('');
    const [resetDaily, setResetDaily] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/admin/daily-problem',
                { slug },
                { headers: { 'x-auth-token': token } }
            );
            setMessage('Daily problem updated successfully! Submission status reset for all users.');
            setSlug('');
        } catch (err) {
            setMessage('Error updating problem');
            console.error(err);
        }
    };

    const handleResetPoints = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:5000/api/admin/reset-points',
                {},
                { headers: { 'x-auth-token': token } }
            );
            console.log('Reset points for all users');
            setMessage(`Successfully reset points for ${response.data.count} users`);
            setResetDaily(false);
        } catch (err) {
            setMessage('Error resetting points');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-background text-white">
            <NavBar />
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-surface border border-surface-hover rounded-xl p-8 shadow-2xl">
                    <div className="flex items-center space-x-3 mb-6">
                        <Settings className="w-8 h-8 text-secondary" />
                        <h1 className="text-2xl font-bold">Admin Control Panel</h1>
                    </div>

                    {message && (
                        <div className={`p-4 mb-6 rounded-lg ${message.includes('Error') ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Daily Problem Slug
                            </label>
                            <div className="flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-surface-hover bg-surface-hover text-gray-400 sm:text-sm">
                                    leetcode.com/problems/
                                </span>
                                <input
                                    type="text"
                                    required
                                    className="flex-1 min-w-0 block w-full px-3 py-3 rounded-none rounded-r-md border border-surface-hover bg-background text-white focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="two-sum"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Copy the slug from the LeetCode URL (e.g., "two-sum" from leetcode.com/problems/two-sum)
                            </p>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Set Daily Problem
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-surface-hover">
                        <h2 className="text-lg font-semibold mb-4">Reset Points</h2>
                        <p className="text-sm text-gray-400 mb-4">
                            Reset all users' points to 0. This will not affect submission status or last updated time.
                        </p>
                        <div className="flex items-center mb-4">
                            <input
                                id="reset-points"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                checked={resetDaily}
                                onChange={(e) => setResetDaily(e.target.checked)}
                            />
                            <label htmlFor="reset-points" className="ml-2 block text-sm text-gray-300">
                                Reset daily points for all users?
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={handleResetPoints}
                            disabled={!resetDaily}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Reset Points
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
