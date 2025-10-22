import React, { useState } from 'react'
import loginBg from '../assets/images/login-bg.png'
import Logo from '../assets/images/logo.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import AuthApi from '../apis/auth/auth.api'

const Signup = () => {
  const [fullName, setFullName] = useState("")
  const [contact, setContact] = useState("") // <-- renamed from mobileNumber
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const authApi = new AuthApi();
  const navigate = useNavigate()

  // simple email regex check
  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setLoading(true)

      // decide payload
      let payload = {
        fullName,
        password
      }

      if (isEmail(contact)) {
        payload.email = contact
      } else {
        payload.mobileNumber = contact
      }

      const res = await authApi.signup(payload)

      console.log("Register success:", res.data)

      if (res.status === "success") {
        navigate("/otp", { 
          state: { 
            contact, // send the same input back
            purpose: "TO_VERIFY_USER" 
          } 
        }) 
      }

    } catch (err) {
      console.error("Register error:", err)
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="flex w-full md:w-3/4 items-center justify-center p-1">
        <div className="max-w-xl bg-white p-6 px-10 rounded-2xl w-full">
          <Link to={'/'} className="flex justify-center">
            <img src={Logo} width={150} height={130} alt="logo" />
          </Link>
          <h2 className="mt-8 text-center text-3xl font-semibold text-gray-900 font-noto-serif">
            Create Your Account
          </h2>
          <p className="mt-2 font-poppins text-center text-lg text-gray-600">
            Start managing or finding your rental property today.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <p className="mb-1 font-poppins text-black">Full Name</p>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full font-poppins rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 border-2 border-[#E5E5E5]"
                placeholder="Enter your name"
              />
            </div>

            {/* Contact (Mobile or Email) */}
            <div className="mb-4">
              <p className="mb-1 font-poppins text-black">Mobile Number or Email</p>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full font-poppins rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 border-2 border-[#E5E5E5]"
                placeholder="Enter your mobile number or email"
              />
            </div>

            {/* Password */}
            <div className="relative mb-4">
              <p className="mb-1 font-poppins text-black">Password</p>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full font-poppins rounded-md px-2 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-600 border-2 border-[#E5E5E5]"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-11 right-3 text-gray-600 hover:text-black"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative mb-4">
              <p className="mb-1 font-poppins text-black">Confirm Password</p>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full font-poppins rounded-md px-2 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-600 border-2 border-[#E5E5E5]"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-11 right-3 text-gray-600 hover:text-black"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg bg-[#033E4A] text-white font-poppins hover:bg-[#042930] hover:scale-102 hover:shadow-lg transition-all duration-300 ease-in-out"
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-2">
              <span className="text-sm text-gray-700 font-poppins">
                Already have an Account?{" "}
                <Link to="/login" className="text-[#033E4A] font-[600] hover:underline">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
