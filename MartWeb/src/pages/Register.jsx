import React, { useState  } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from 'axios';
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
  const navigate = useNavigate()


  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
const validateValue=Object.values(data).every(el=>el)

const handleSubmit =async (e)=>{
e.preventDefault()

if(data.password !== data.confirmPassword){
 toast.error(
    "password and confirm password must be same"
 )
}

try {
    const response = await Axios({
    ...SummaryApi.register,
    data:data

})
if(response.data.error){
  toast.error(response.data.message)
}
if(response.data.success){
  toast.success(response.data.message)
  setData({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",

  })
}navigate("/login")
console.log("response",response)

} catch (error) {
    AxiosToastError(error)
}
}
  return (
    <section className="  container px-2 mx-auto">
      <div className="bg-white my-4 w-full max-w-lg mx-auto py-4 rounded p-7  ">
        <p className="font-bold">Welcome To SMart</p>
        <form className="grid gap-4 mt-5 " onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              autoFocus
              className="bg-blue-50 p-2 border rounded outline-none focus-within:border-blue-500"
              name="name"
              value={data.name}
              placeholder="Enter Your Name"
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1 ">
            <label htmlFor="email">Email :</label>
            <input
              type="text"
              id="email"
              className="bg-blue-50 p-2  rounded border outline-none focus-within:border-blue-500"
              name="email"
              value={data.email}
              placeholder="Enter Your Email"
              onChange={handleChange}
            />
          </div>
          <div>
            <div className="grid gap-1">
              <label htmlFor="password">Password :</label>
              <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-blue-500">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full outline-none bg-blue-50"
                  name="password"
                  value={data.password}
                  placeholder="Enter Your Password"
                  onChange={handleChange}
                />

                <div
                  onClick={() => setShowPassword((preve) => !preve)}
                  className="cursor-pointer"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
            </div>
            <div className="grid gap-1">
              <label htmlFor="confirmPassword">Confirm Password :</label>
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
                  onClick={() => setShowConfirmPassword((preve) => !preve)}
                  className="cursor-pointer"
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
            </div>
          </div>

          <button disabled={!validateValue} className={`${validateValue ? "bg-blue-500 hover:bg-blue-600" :"bg-red-500"}   text-white py-2 rounded font-semibold my-3 tracking-wide`}>
            Register
          </button>
        </form>
        <p>
          Already have an Account ? <Link to={"/login"} className="font-semibold text-blue-500 hover:text-blue-700">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
