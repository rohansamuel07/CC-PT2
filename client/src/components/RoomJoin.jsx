import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoomJoin() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/editor/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4 text-blue-400">Join a Room</h1>
      <input
        type="text"
        className="border p-2 rounded w-64 mb-4 bg-gray-800 text-white"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button
        onClick={joinRoom}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Join Room
      </button>
    </div>
  );
}
