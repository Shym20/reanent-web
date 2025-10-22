import React, { useState } from "react";
import loginBg from "../assets/images/login-bg.png";
import Logo from "../assets/images/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthApi from "../apis/auth/auth.api";
import { updateToken, updateUser } from "../redux/redux-slice/user.slice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [contact, setContact] = useState(""); // ✅ unified field (email or mobile)
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authApi = new AuthApi();

  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);
  const isMobile = (value) => /^[6-9]\d{9}$/.test(value);

  const validate = () => {
    let newErrors = {};

    if (!contact) {
      newErrors.contact = "Mobile number or Email is required";
    } else if (!isEmail(contact) && !isMobile(contact)) {
      newErrors.contact = "Enter a valid mobile number or email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      let payload = { password };

      if (isEmail(contact)) {
        payload.email = contact;
      } else {
        payload.mobileNumber = contact;
      }

      const res = await authApi.login(payload);

      if (res?.data?.token) {
        dispatch(updateToken(res.data.token));
        dispatch(updateUser(res.data.user));

        toast.success("Login successful 🎉");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error(res?.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="flex w-full md:w-3/4 items-center justify-center p-1">
        <div className="max-w-xl bg-white p-6 px-10 rounded-2xl w-full">
          <Link to={"/"} className="flex justify-center">
            <img src={Logo} width={150} height={130} alt="logo" />
          </Link>
          <h2 className="mt-8 text-center text-3xl font-semibold text-gray-900 font-noto-serif">
            Welcome Back to Reanent
          </h2>
          <p className="mt-2 font-poppins text-center text-lg text-gray-600">
            Login to manage properties, connect with tenants, or find your next home.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Contact (Mobile or Email) */}
            <div className="mb-4">
              <p className="mb-1 font-poppins text-black">Mobile Number or Email</p>
              <input
                name="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={`w-full focus:ring-2 focus:ring-teal-600 font-poppins rounded-md px-2 py-2 focus:outline-none border-2 ${
                  errors.contact ? "border-red-500" : "border-[#E5E5E5]"
                } text-[#404040]`}
                placeholder="Enter your mobile number or email"
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <p className="mb-1 font-poppins text-black">Password</p>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full font-poppins rounded-md px-2 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-600 border-2 ${
                  errors.password ? "border-red-500" : "border-[#E5E5E5]"
                } text-[#404040]`}
                placeholder="Enter Your Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute font-poppins top-11 right-3 text-gray-600 hover:text-black"
              >
                {showPassword ? (
                  <FaEye className="h-5 w-5" />
                ) : (
                  <FaEyeSlash className="h-5 w-5" />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}

              <div className="flex justify-end mt-2">
                <Link
                  to="/forget-password"
                  className="text-[14px] text-[#007AFF] hover:underline font-poppins"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg bg-[#033E4A] cursor-pointer text-white font-poppins hover:bg-[#042930] focus:outline-none hover:scale-102 hover:shadow-lg 
                   transition-all duration-300 ease-in-out"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            {/* Signup */}
            <div className="text-center mt-2">
              <span className="text-sm text-gray-700 font-poppins">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#033E4A] font-[600] hover:underline"
                >
                  Signup
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Login;
