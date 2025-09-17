import React, { useState  } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from 'axios';
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
const ForgotPassword = () => {
  const [data, setData] = useState({
    
    email: "",
   
  });
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


try {
    const response = await Axios({
    ...SummaryApi.forgot_password,
    data:data

})
if(response.data.error){
  toast.error(response.data.message)
}
if(response.data.success){
  toast.success(response.data.message)
  navigate("/verification-otp",{
    state:data
})
  setData({

    email: "",

  })
}

} catch (error) {
    AxiosToastError(error)
}
}
  return (
    <section className="  container px-2 mx-auto">
      <div className="bg-white my-4 w-full max-w-lg mx-auto py-4 rounded p-7  ">
        <p className="font-bold text-lg mb-2">Forgot Password</p>
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
          
            
          </div>

          <button disabled={!validateValue} className={`${validateValue ? "bg-blue-500 hover:bg-blue-600" :"bg-red-500"}   text-white py-2 rounded font-semibold my-3 tracking-wide`}>
            Send OTP
          </button>
        </form>
        <p>
          Already have Account ? <Link to={"/login"} className="font-semibold text-blue-500 hover:text-blue-700">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
