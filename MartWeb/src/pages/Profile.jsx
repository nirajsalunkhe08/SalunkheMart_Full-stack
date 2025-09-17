import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserLarge } from "react-icons/fa6";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetils from '../utils/fetchUserDetails';

const Profile = () => {
    const user = useSelector(state=>state.user)
    const [userData,setUserData]=useState({
      name:user.name,
      email:user.email,
      mobile:user.mobile,
    })
    const [loading,setLoading]=useState(false)
    const dispatch =useDispatch()

useEffect(() => {
  setUserData({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });
}, [user]);

    const handleOnChange=(e)=>{
      const {name,value}=e.target
      setUserData((preve)=>{
        return{
          ...preve,
          [name]:value
        }
      })
    }

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const response = await Axios({
      ...SummaryApi.updateUserdetails,
      data: userData,
    });
    const { data: responseData } = response;

    if (responseData.success) {
      toast.success(responseData.message);
      const userData = await fetchUserDetils()
      dispatch(setUserDetails(userData.data))
    } else {
      toast.error(responseData.message || "Failed to update");
    }
  } catch (error) {
    AxiosToastError(error);
  } finally {
    setLoading(false);
  }
};
  return (
    <div>
    <div className='w-16 h-16 flex justify-center items-center'>
        <FaUserLarge size={60} className='text-violet-700' />
    </div>
    <form className='my-4 grid gap-4' onSubmit={handleSubmit}>
      <div className='grid'>
        <label>Name</label>
        <input 
        type='text'
        placeholder='Enter your Name'
        className='p-2 outline-none border focus-within:border-blue-300 rounded'
        value={userData.name}
        name='name'
        onChange={handleOnChange}
        required
        />
      </div>
      <div className='grid'>
        <label htmlFor='email'>Email</label>
        <input 
        type='email'
        id='email'
        placeholder='Enter your Email'
        className='p-2 outline-none border focus-within:border-blue-300 rounded'
        value={userData.email}
        name='email'
        onChange={handleOnChange}
        required
        />
      </div>
            <div className='grid'>
        <label htmlFor='mobile'>mobile</label>
        <input 
        type='text'
        id='mobile'
        placeholder='Enter your Mobile No.'
        className='p-2 outline-none border focus-within:border-blue-300 rounded'
        value={userData.mobile}
        name='mobile'
        onChange={handleOnChange}
        required
        />
      </div>
      <button className='border px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600'>
        {
          loading ? "Loading...." : "Submit"
        }
      </button>
    </form>
    </div>
  )
}

export default Profile
