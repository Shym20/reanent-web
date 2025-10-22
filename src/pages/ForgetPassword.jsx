import React, { useState } from 'react'
import loginBg from '../assets/images/login-bg.png'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import AuthApi from '../apis/auth/auth.api'

const ForgetPassword = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const authApi = new AuthApi();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!value) {
    setError("Please enter your email or mobile number.");
    return;
  }

  try {
    setLoading(true);
    console.log("Sending OTP to:", value);

    // ✅ check if it's an email or number
    const isEmail = /\S+@\S+\.\S+/.test(value);

    const payload = isEmail
      ? { email: value }
      : { mobileNumber: value };

    const response = await authApi.forgotPassword(payload);

    console.log("Forget Password Response:", response);

    if (response?.status === "success") {
      setSuccess(response.message);

      navigate("/otp", {
        state: {
          contact: value, // ✅ unified field
          purpose: "TO_RESET_PASSWORD",
        },
      });
    } else {
      setError(response?.message || "Something went wrong");
    }
  } catch (err) {
    console.error("Forget Password Error:", err);
    setError("Failed to send OTP. Try again.");
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
          <h1 className="text-[26px] font-semibold">Forgot Password</h1>
          <div className="p-1 mr-6"></div>
        </div>
        <hr className='text-gray-200 mb-4' />

        {/* Subtitle */}
        <p className="text-[#262626] text-[16px] mb-6">
          Enter your email or mobile to get a reset OTP.
        </p>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Mobile Number
            </label>
            <input
              type="text"
              placeholder="Enter your email or mobile number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#033E4A] text-white py-2 rounded-lg font-medium hover:bg-teal-900 disabled:opacity-50 hover:scale-102 hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgetPassword
