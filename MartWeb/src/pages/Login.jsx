import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import fetchUserDetils from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accesstoken", response.data.data.accesstoken);
        localStorage.setItem("refreshtoken", response.data.data.refreshtoken);

        const userDetails = await fetchUserDetils();
        dispatch(setUserDetails(userDetails.data));

        setData({ email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="min-h-screen bg-[#9A616D] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl flex overflow-hidden max-w-5xl w-full">
        {/* Left Image Section */}
        <div className="hidden md:block w-1/2">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
            alt="login visual"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back 👋</h1>
            <p className="text-gray-600 text-center mb-8">
              Sign in to your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full outline-none"
                  />
                  <div
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="cursor-pointer text-gray-500"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:underline float-right mt-2"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                disabled={!validateValue}
                type="submit"
                className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                  validateValue
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Login
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Register here
              </Link>
            </p>

            <div className="mt-4 text-xs text-gray-500 text-center">
              <a href="#" className="hover:underline mr-2">
                Terms of Use
              </a>
              <span>|</span>
              <a href="#" className="hover:underline ml-2">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
