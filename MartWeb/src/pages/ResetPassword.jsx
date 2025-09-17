import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../common/SummaryApi';
import Axios from "../utils/Axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const validateValue = Object.values(data).every(el => el);

  useEffect(() => {
    if (!(location?.state?.data?.success)) {
      navigate("/");
    }
    if (location?.state?.email) {
      setData(prev => ({
        ...prev,
        email: location.state.email
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data
      });

      if (response.data.error) {
        toast.error(response.data.message);
      } else if (response.data.success) {
        toast.success(response.data.message);
        setData({ email: "", newPassword: "", confirmPassword: "" });
        navigate("/login");
      }

    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="container px-2 mx-auto">
      <div className="bg-white my-4 w-full max-w-lg mx-auto py-4 rounded p-7">
        <p className="font-bold text-lg mb-2">Enter Your New Password</p>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="grid gap-1">
            <label htmlFor="newPassword">New Password:</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-blue-500">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                className="w-full outline-none bg-blue-50"
                name="newPassword"
                value={data.newPassword}
                placeholder="Enter Your New Password"
                onChange={handleChange}
              />
              <div
                onClick={() => setShowPassword(prev => !prev)}
                className="cursor-pointer"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-blue-500">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="w-full outline-none bg-blue-50"
                name="confirmPassword"
                value={data.confirmPassword}
                placeholder="Enter Your Confirm Password"
                onChange={handleChange}
              />
              <div
                onClick={() => setShowConfirmPassword(prev => !prev)}
                className="cursor-pointer"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>

          <button
            disabled={!validateValue}
            className={`${validateValue ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Reset Your Password
          </button>
        </form>
        <p>
          Already have an Account? <Link to="/login" className="font-semibold text-blue-500 hover:text-blue-700">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default ResetPassword;
