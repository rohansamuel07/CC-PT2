import { auth, googleProvider, githubProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Login() {
  const handleLogin = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      console.log("Login Successful!");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm w-full text-center">
        {/* App Name - Centered */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">CodeCollab</h1>

        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Sign In to Continue
        </h2>

        {/* Google Login Button */}
        <button
          onClick={() => handleLogin(googleProvider)}
          className="w-full flex items-center justify-center gap-3 bg-red-500 text-white py-2 rounded-full mb-4 hover:bg-red-600 transition"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>

        {/* GitHub Login Button */}
        <button
          onClick={() => handleLogin(githubProvider)}
          className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white py-2 rounded-full hover:bg-gray-900 transition"
        >
          <FaGithub className="text-2xl" />
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
