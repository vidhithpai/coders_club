import { Trophy, CheckCircle, Clock } from 'lucide-react';

const UserCard = ({ user, rank, currentUserId, onSafeSubmit }) => {
    const isMe = user.id === currentUserId;

    return (
        <div className={`p-4 rounded-xl border ${isMe ? 'border-primary bg-primary/10' : 'border-surface-hover bg-surface'} mb-4 shadow-lg transition-all hover:scale-[1.02]`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${rank <= 3 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-700 text-gray-400'}`}>
                        {rank}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-white">{user.name}</h3>
                        <p className="text-xs text-gray-400">@{user.leetcodeUsername}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-xl font-bold text-secondary">{user.pointsToday}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Points</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-hover/50">
                <div className="flex items-center text-sm text-gray-400">
                    {user.solvedToday ? (
                        <span className="flex items-center text-green-400"><CheckCircle className="w-4 h-4 mr-1" /> Solved</span>
                    ) : (
                        <span className="flex items-center text-gray-500"><Clock className="w-4 h-4 mr-1" /> Pending</span>
                    )}
                </div>
                {isMe && !user.solvedToday && (
                    <button
                        onClick={onSafeSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-green-900/20"
                    >
                        Check & Submit
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserCard;
