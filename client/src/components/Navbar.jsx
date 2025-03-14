import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const [user] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
      <h1 className="text-3xl font-extrabold text-gray-800">CodeCollab</h1>

      {user ? (
        <button
          onClick={() => signOut(auth)}
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300"
        >
          Sign Out
        </button>
      ) : (
        <p className="text-gray-600 font-medium">Not signed in</p>
      )}
    </nav>
  );
}
