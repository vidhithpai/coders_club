import { CheckCircle, Clock } from 'lucide-react';

const UserTable = ({ users = [], currentUserId, onSafeSubmit }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-surface-hover bg-surface/50 shadow-xl backdrop-blur-sm">
            <table className="min-w-full divide-y divide-surface-hover">
                <thead className="bg-surface">
                    <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Coder</th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Points</th>
                        <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-surface-hover">
                    {users.map((user, index) => {
                        const isMe = user.id === currentUserId;
                        return (
                            <tr key={user.id} className={isMe ? 'bg-primary/5 hover:bg-primary/10 transition-colors' : 'hover:bg-surface-hover/30 transition-colors'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${index < 3 ? 'bg-yellow-500/10 text-yellow-500 font-bold' : 'text-gray-500'}`}>
                                        {index + 1}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-medium ${isMe ? 'text-white' : 'text-gray-200'}`}>{user.name}</span>
                                        <span className="text-xs text-gray-500">@{user.leetcodeUsername}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.solvedToday ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Done
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-400">
                                            <Clock className="w-3 h-3 mr-1" />
                                            --
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-secondary">
                                    {user.pointsToday}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {isMe && !user.solvedToday && (
                                        <button
                                            onClick={onSafeSubmit}
                                            className="text-primary hover:text-indigo-400 font-semibold transition-colors"
                                        >
                                            Safe Submit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
