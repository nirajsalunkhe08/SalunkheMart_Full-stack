import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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

    if (data.password !== data.confirmPassword) {
      toast.error("Password and Confirm Password must be same");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden max-w-6xl w-full">
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h1>
            <p className="text-center text-gray-600 mb-8">
              Join SMart and start your journey with us!
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
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

              {/* Password */}
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
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="w-full outline-none"
                  />
                  <div
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="cursor-pointer text-gray-500"
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                </div>
              </div>

              {/* Terms of Service */}
              <div className="flex items-center text-sm">
                <input type="checkbox" id="terms" className="mr-2" />
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>
                </label>
              </div>

              {/* Register Button */}
              <button
                disabled={!validateValue}
                type="submit"
                className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                  validateValue
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Register
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-4">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
            alt="Register illustration"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Register;
