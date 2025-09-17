

import React, { useEffect, useRef, useState  } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from 'axios';
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
const OtpVerification = () => {
  const [data, setData] = useState(["","","","","",""]);
  const navigate = useNavigate()
  const inputRef =useRef([])
  const location = useLocation()
console.log("loaction",location)

useEffect(()=>{
if(!location?.state?.email){
    navigate("/forgot-password")
}
},[])


const validateValue=data.every(el=>el)

const handleSubmit =async (e)=>{
e.preventDefault()


try {
    const response = await Axios({
    ...SummaryApi.forgot_password_otp_verification,
    data:{
        otp:data.join(""),
        email:location?.state?.email
    }

})
if(response.data.error){
  toast.error(response.data.message)
}
if(response.data.success){
  toast.success(response.data.message)
  setData(["","","","","",""])
  navigate("/reset-password",{
    state:{
        data:response.data,
        email:location?.state?.email
    }
  })
}
//navigate("/verification-otp")
console.log("response",response)

} catch (error) {
    AxiosToastError(error)
}
}
  return (
    <section className="  container px-2 mx-auto">
      <div className="bg-white my-4 w-full max-w-lg mx-auto py-4 rounded p-7  ">
        <p className="font-bold text-lg mb-2">Enter Otp</p>
        <form className="grid gap-4 py-4 " onSubmit={handleSubmit}>
          
          <div className="grid gap-1 ">
            <label htmlFor="otp">Enter Your OTP :</label>
            <div className="flex items-center gap-2 justify-between mt-3">
                {
                    data.map((element,index)=>{
                        return(
                             <input
              type="text"
              id="otp"
              ref={(ref)=>{
                 inputRef.current[index]=ref
                 return ref

              }}
              maxLength={1}
              value={data[index]}
              onChange={(e)=>{
                const value = e.target.value
                const newData =[...data]
                newData[index]=value
                setData(newData)

                if(value && index<5){
                    inputRef.current[index+1].focus()
                }
              }}
              className="bg-blue-50 w-full max-w-16 p-2  rounded border outline-none focus-within:border-blue-500 text-center font-semibold"

              
            />
                        )
                    })
                }
            </div>
           
          </div>
          <div>
          
            
          </div>

          <button disabled={!validateValue} className={`${validateValue ? "bg-blue-500 hover:bg-blue-600" :"bg-red-500"}   text-white py-2 rounded font-semibold my-3 tracking-wide`}>
            Verify OTP
          </button>
        </form>
        <p>
          Already have Account ? <Link to={"/login"} className="font-semibold text-blue-500 hover:text-blue-700">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default OtpVerification
