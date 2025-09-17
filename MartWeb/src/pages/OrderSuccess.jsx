import React, { useState } from 'react'
import { FaRegCheckCircle } from "react-icons/fa";
import{Link, useLocation} from 'react-router-dom'
const OrderSuccess = () => {
  const location = useLocation()
  return (
    <section>
    <div className='m-2 w-full max-w-md bg-gradient-to-b from-green-300 to-blue-300 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-3 '>
      <p className='text-green-800 font-bold text-lg flex  gap-2 items-center justify-center'>{Boolean( location?.state?.text) ? location?.state?.text:"Payment" } Successfully <FaRegCheckCircle /></p>
      <Link to={"/"} className='border border-blue-800 px-4 py-1 hover:text-white hover:bg-blue-500'>Go To Home</Link>
      </div>
      <div className="flex justify-center mt-4">
  <div className="w-[75vw] h-[30vh] bg-gradient-to-r from-emerald-600 to-blue-600 flex flex-col justify-center items-center rounded-lg shadow-lg text-white p-6">
    <h1 className="text-3xl font-bold mb-2">🙏 Thank You!</h1>
    <p className="text-lg">For visiting <span className="font-semibold">Salunkhe Mart</span></p>
    <p className="text-md mt-1 italic">We appreciate your support — come again soon!</p>
    <p className="text-sm mt-2">✨ Great offers & fresh products are always waiting for you ✨</p>
    <Link to={"/"} className='underline  px-4 py-1 hover:text-white  hover:bg-blue-500'>Shop More</Link>

  </div>
  
</div>

    </section>

  )
  
}

export default OrderSuccess
