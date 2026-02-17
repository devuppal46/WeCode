interface User {
  socketId: string;
  userName: string;
}

export default function UserList({ users }: { users: User[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Active Users</h2>

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.socketId}
            className="bg-zinc-800 p-2 rounded text-sm"
          >
            🟢 {user.userName}
          </div>
        ))}
      </div>
    </div>
  );
}