import React, { useState  } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from 'axios';
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
  const navigate = useNavigate()
  const dispatch = useDispatch()


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


try {
    const response = await Axios({
    ...SummaryApi.login,
    data:data

})
if(response.data.error){
  toast.error(response.data.message)
}
if(response.data.success){
  toast.success(response.data.message)
  localStorage.setItem('accesstoken',response.data.data.accesstoken)
  localStorage.setItem('refreshtoken',response.data.data.refreshtoken)
 const userDetails = await fetchUserDetils()
 dispatch( setUserDetails (userDetails.data))
  setData({

    email: "",
    password: "",

  })
}navigate("/")
console.log("response",response)

} catch (error) {
    AxiosToastError(error)
}
}
  return (
    <section className="  container px-2 mx-auto">
      <div className="bg-white my-4 w-full max-w-lg mx-auto py-4 rounded p-7  ">
        <p className="font-bold">Login</p>
        <form className="grid gap-4 py-4 " onSubmit={handleSubmit}>
          
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
              <Link to={"/forgot-password"} className="block ml-auto hover:text-blue-600">Forgot Password</Link>
            </div>
            
          </div>

          <button disabled={!validateValue} className={`${validateValue ? "bg-blue-500 hover:bg-blue-600" :"bg-red-500"}   text-white py-2 rounded font-semibold my-3 tracking-wide`}>
            Login
          </button>
        </form>
        <p>
          Don't Have An Account ? <Link to={"/register"} className="font-semibold text-blue-500 hover:text-blue-700">Register</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
