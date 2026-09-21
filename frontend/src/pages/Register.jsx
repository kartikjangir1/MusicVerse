import { useState } from "react";

import {
  Music,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const result = await register(
      name.trim(),
      email.trim(),
      password
    );

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Registration successful
    // Go to login page instead of website
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#181818] rounded-2xl p-8 border border-[#2f2f2f] shadow-2xl">

        {/* Header */}

        <div className="text-center mb-8">

          <div className="flex justify-center mb-4">

            <div className="w-16 h-16 bg-green-500 text-black rounded-full flex items-center justify-center">
              <Music size={30} />
            </div>

          </div>

          <h1 className="text-3xl font-bold">
            Create Account
          </h1>

          <p className="text-gray-400 mt-2">
            Join MusicVerse
          </p>

        </div>

        {/* Error */}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Name */}

          <div>

            <label className="block text-sm text-gray-400 mb-2">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Your name"
              className="w-full bg-[#282828] border border-[#444] rounded-lg px-4 py-3 text-white outline-none focus:border-green-500"
            />

          </div>

          {/* Email */}

          <div>

            <label className="block text-sm text-gray-400 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              className="w-full bg-[#282828] border border-[#444] rounded-lg px-4 py-3 text-white outline-none focus:border-green-500"
            />

          </div>

          {/* Password */}

          <div>

            <label className="block text-sm text-gray-400 mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="At least 6 characters"
                className="w-full bg-[#282828] border border-[#444] rounded-lg px-4 py-3 pr-12 text-white outline-none focus:border-green-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Confirm Password */}

          <div>

            <label className="block text-sm text-gray-400 mb-2">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm password"
                className="w-full bg-[#282828] border border-[#444] rounded-lg px-4 py-3 pr-12 text-white outline-none focus:border-green-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Register */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-black py-3 rounded-full font-bold hover:bg-green-400 disabled:opacity-50 transition"
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login */}

        <p className="text-center text-gray-400 mt-7">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-white font-semibold hover:text-green-400"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;