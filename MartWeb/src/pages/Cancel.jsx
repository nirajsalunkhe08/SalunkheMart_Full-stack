import React from 'react'
import { Link } from 'react-router-dom'
import { PiSmileySad } from "react-icons/pi";
const Cancel = () => {
  return (
    <div className='m-2 w-full max-w-md bg-gradient-to-b from-red-300 to-amber-300 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-3 '>
      <p className='text-red-800 font-bold text-lg flex  gap-2 items-center justify-center'>Order Cancel <PiSmileySad size={25}/></p>
      <Link to={"/"} className='border border-red-800 px-4 py-1 hover:text-white hover:bg-red-500 rounded'>Go To Home</Link>
    </div>
  )
}

export default Cancel
