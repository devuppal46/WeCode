interface User {
  socketId: string;
  userName: string;
}

interface UserListProps {
  users: User[];
  currentUser?: string;
}

// Cycle through a set of distinct colors per user index
const DOT_COLORS = [
  "bg-emerald-500",
  "bg-amber-500",
  "bg-blue-500",
  "bg-rose-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-pink-500",
];

export default function UserList({ users, currentUser }: UserListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">
          {users.length} {users.length === 1 ? "participant" : "participants"}
        </p>
      </div>

      {/* User cards */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
        {users.length === 0 ? (
          <p className="text-xs text-zinc-600 text-center mt-8">
            No users yet…
          </p>
        ) : (
          users.map((user, index) => {
            const dotColor = DOT_COLORS[index % DOT_COLORS.length];
            const isMe = user.userName === currentUser;

            return (
              <div
                key={user.socketId}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-colors ${isMe
                    ? "bg-blue-600/10 border-blue-500/20"
                    : "bg-zinc-900 border-zinc-800"
                  }`}
              >
                {/* Presence dot */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />

                {/* Name */}
                <span className="text-sm text-zinc-300 truncate flex-1">
                  {user.userName}
                </span>

                {/* "You" badge */}
                {isMe && (
                  <span className="text-[9px] font-semibold uppercase tracking-wide text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                    You
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}