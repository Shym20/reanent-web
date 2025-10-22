import React, { useRef, useState } from 'react'
import loginBg from '../assets/images/login-bg.png'
import { IoIosArrowBack } from 'react-icons/io'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthApi from '../apis/auth/auth.api'

const OtpPage = () => {
  const authApi = new AuthApi();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const location = useLocation();
  const contact = location.state?.contact || ""; // <-- unified field (mobile or email)
  const purpose = location.state?.purpose || "TO_VERIFY_USER";

  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleChange = (element, index) => {
    if (!/^\d*$/.test(element.value)) return; // Only digits allowed

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // payload depending on contact type
      const payload = {
        otp: otpCode,
        purpose,
        ...(isEmail(contact) ? { email: contact } : { mobileNumber: contact }),
      };

      console.log("Calling verifyOtp API with:", payload);

      const response = await authApi.verifyOtp(payload);
      console.log("API Raw Response:", response);

      if (response?.status === "success" && response?.code === 200) {
        if (purpose === "TO_VERIFY_USER") {
          navigate("/survey", { state: { contact } });
        } else if (purpose === "TO_RESET_PASSWORD") {
          navigate("/reset-password", {
            state: { resetToken: response?.data?.resetToken, contact },
          });
        }
      } else {
        setError(response?.data?.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
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
      <div className="w-full mx-3 h-max max-w-lg bg-white rounded-2xl shadow p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate(-1)} className="p-1 cursor-pointer mr-2">
            <IoIosArrowBack size={20} />
          </button>
          <h1 className="text-[26px] font-semibold">Enter OTP</h1>
          <div className="p-1 mr-6"></div>
        </div>
        <hr className="text-gray-200 mb-4" />

        {/* Subtitle */}
        <p className="text-[#262626] text-[16px] mb-6">
          Enter the code sent to your {isEmail(contact) ? "email" : "mobile"}:{" "}
          <span className="font-semibold">{contact}</span>
        </p>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <div className="flex mt-4 gap-4">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputsRef.current[index] = el)}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-lg"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#033E4A] text-white py-2 rounded-lg font-medium hover:bg-teal-900 disabled:opacity-50 hover:scale-102 hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpPage;
