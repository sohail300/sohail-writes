"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.push("/admin/blogs");
    }
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("adminToken", data.token);

      // Redirect to add-blog page
      router.push("/admin/blogs");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="neo-container min-h-screen flex items-center justify-center bg-neo-gray">
      <div className="neo-card bg-neo-white max-w-md w-full mx-4">
        <h1 className="text-2xl md:text-3xl font-black mb-2 text-center">
          Admin Login
        </h1>
        <p className="font-bold mb-8 text-neo-gray-dark text-center">
          Enter your credentials to access the admin panel
        </p>

        {error && (
          <div className="border-4 border-neo-black bg-red-100 p-4 mb-6">
            <p className="font-bold text-red-800">❌ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block font-black text-lg mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="neo-input"
              placeholder="Enter username"
              required
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block font-black text-lg mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neo-input"
              placeholder="Enter password"
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neo-btn w-full text-xl"
          >
            <span className="mx-auto">
              {loading ? "Logging in..." : "Login"}
            </span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t-4 border-neo-black">
          <p className="text-sm font-bold text-neo-gray-dark text-center">
            🔒 Secure admin access only
          </p>
        </div>
      </div>
    </div>
  );
}
