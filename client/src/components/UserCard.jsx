import { CheckCircle, Clock } from 'lucide-react';

const UserCard = ({ user, rank, currentUserId }) => {
  // safety: filter admin
  if (user.role === 'admin') return null;

  const isMe = user.id === currentUserId;
  const topRank = rank <= 3;

  return (
    <div
      className={`p-4 rounded-xl mb-4 transition-all transform
        ${isMe ? 'border-primary bg-primary/6' : 'border-surface-hover bg-surface'}
        border shadow-2xl`}
      style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.55)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          {/* Rank circle */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-bold pixel-font text-lg
              ${topRank ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-800 text-gray-400'}`}
            style={{ boxShadow: topRank ? '0 10px 30px rgba(255,200,80,0.06)' : undefined }}
          >
            {rank}
          </div>

          {/* Name / username */}
          <div>
            <h3 className={`font-semibold text-base ${isMe ? 'text-white' : 'text-gray-100'}`}>{user.name}</h3>
            <p className="text-xs text-gray-400">@{user.leetcodeUsername}</p>
          </div>
        </div>

        {/* Points */}
        <div className="text-right">
          <span className="block text-xl font-bold text-secondary">{user.pointsToday ?? 0}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Points</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-surface-hover/50">
        <div className="flex items-center text-sm">
          {user.solvedToday ? (
            <span className="flex items-center text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" /> Solved
            </span>
          ) : (
            <span className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" /> Pending
            </span>
          )}
        </div>

        {/* optional small badge */}
        <div>
          {isMe && (
            <span className="px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary">You</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
