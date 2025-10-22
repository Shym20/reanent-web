import React, { useState } from 'react'
import loginBg from '../assets/images/login-bg.png'
import { IoIosArrowBack } from 'react-icons/io'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthApi from '../apis/auth/auth.api'

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.state?.resetToken || ""; // coming from OTP page

  const authApi = new AuthApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      console.log("Calling reset password API with:", { password, resetToken });

      const response = await authApi.resetPassword({
        password,
        resetToken,
      });

      console.log("Reset Password Response:", response);

      if (response?.status === 200 || response?.status === "success") {
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(response?.data?.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Reset Password Error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="w-full mx-2 h-max max-w-lg bg-white rounded-2xl shadow p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate(-1)} className="p-1 cursor-pointer mr-2">
            <IoIosArrowBack size={20} />
          </button>
          <h1 className="text-[26px] font-semibold">Set a New Password</h1>
          <div className="p-1 mr-6"></div>
        </div>
        <hr className="text-gray-200 mb-4" />

        <p className="text-[#262626] text-[16px] mb-6">
          Choose a secure password for your account.
        </p>

        {/* Error / Success */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#033E4A] text-white py-2 rounded-lg font-medium hover:bg-teal-900 disabled:opacity-50 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            {loading ? "Resetting..." : "Reset Password & Login"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
