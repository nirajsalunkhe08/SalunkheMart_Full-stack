import React from 'react'
import { IoClose } from "react-icons/io5";

const ConfirmBox = ({cancel,confirm,close}) => {
  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 z-0 bg-neutral-800 bg-opacity-70 p-4 flex justify-center items-center'>
      <div className='bg-white w-full max-w-sm p-4 rounded '>
       <div className='flex justify-between item-center gap-3'>
         <h1 className='font-semibold'>Permanant Delete</h1>
        <button onClick={close}>
            <IoClose size={25} />

        </button>

       </div>
       <p className='my-4'>Are you sure to permanant delete</p>
      <div className='w-fit ml-auto gap-3 flex items-center'>
         <button onClick={cancel} className='py-1 px-4 border rounded border-blue-500 hover:bg-blue-500 hover:text-white'>Cancel</button>
       <button onClick={confirm} className='py-1 px-4 border rounded border-red-500 hover:bg-red-500 hover:text-white'>Confirm</button>
      </div>
      </div>
    </div>
  )
}

export default ConfirmBox
