/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  BookOpen,
} from "lucide-react";

interface AuthScreenProps {
  mode: "login" | "register";
  setMode: (mode: "login" | "register") => void;
  onLogin: (email: string, password: string) => boolean;
  onRegister: (
    name: string,
    email: string,
    password: string,
    role: "student" | "instructor"
  ) => boolean;
}

export default function AuthScreen({
  mode,
  setMode,
  onLogin,
  onRegister,
}: AuthScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [showAdminHint, setShowAdminHint] = useState(false);

  // Check if email already exists when in register mode
  useEffect(() => {
    if (mode === "register" && email) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const exists = users.some((user: any) => user.email === email);
      setEmailExists(exists);
    } else {
      setEmailExists(false);
    }

    // Show admin hint if email is admin@gmail.com
    setShowAdminHint(email === "admin@gmail.com");
  }, [email, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      if (emailExists) {
        setError("Email is already in use");
        setLoading(false);
        return;
      }

      const success = onRegister(name, email, password, role);
      if (!success) {
        setError("Failed to create account. Please check your information.");
      }
    } else {
      const success = onLogin(email, password);
      if (!success) {
        setError("Incorrect email or password");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-600 to-primary-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex justify-center mb-6">
            <ShieldCheck className="h-16 w-16 text-primary-600" />
          </div>
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
            CyberTech
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {mode === "login" ? "Log in to your account" : "Create a new account"}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 ml-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {showAdminHint && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 ml-2 flex-shrink-0" />
              <span>Admin account: admin@gmail.com / admin123</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                    emailExists ? "border-red-300" : "border-gray-300"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="Enter your email"
                />
              </div>
              {mode === "register" && emailExists && (
                <p className="mt-1 text-sm text-red-600">
                  This email is already in use
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {mode === "register" && password && password.length < 6 && (
                <p className="mt-1 text-sm text-red-600">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {mode === "register" && (
              <>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`appearance-none block w-full px-3 py-3 pr-10 border ${
                        confirmPassword && password !== confirmPassword
                          ? "border-red-300"
                          : "border-gray-300"
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                      placeholder="Re-enter your password"
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`flex items-center justify-center p-3 rounded-lg border ${
                        role === "student"
                          ? "bg-primary-50 border-primary-500 text-primary-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      } transition`}
                    >
                      <User className="h-5 w-5 ml-2" />
                      <span>Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("instructor")}
                      className={`flex items-center justify-center p-3 rounded-lg border ${
                        role === "instructor"
                          ? "bg-primary-50 border-primary-500 text-primary-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      } transition`}
                    >
                      <BookOpen className="h-5 w-5 ml-2" />
                      <span>Instructor</span>
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {role === "instructor"
                      ? "As an instructor, you can create and publish your own courses."
                      : "As a student, you can enroll in courses and access them."}
                  </p>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={Boolean(
                  loading ||
                    (mode === "register" &&
                      (emailExists ||
                        password.length < 6 ||
                        (confirmPassword && password !== confirmPassword)))
                )}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : mode === "login" ? (
                  "Log In"
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-center">
          <p className="text-sm text-gray-600">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                  className="font-medium text-primary-600 hover:text-primary-500 transition"
                >
                  Create a new account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className="font-medium text-primary-600 hover:text-primary-500 transition"
                >
                  Log In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
