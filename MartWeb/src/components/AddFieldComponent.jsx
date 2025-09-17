import React from 'react'
import { IoClose } from "react-icons/io5";
const AddFieldComponent = ({close,value,onChange,submit}) => {
  return (
    <section className='fixed top-0 bottom-0 right-0 left-0 bg-neutral-700 bg-opacity-70 z-50 flex items-center justify-center'>
        <div className='bg-white rounded p-4 w-full max-w-md'>
            <div className='flex items-center justify-between gp-3'>
                <h1 className='font-semibold'>Add Field </h1>
                <button onClick={close}>
                <IoClose size={28} />
                </button>
            </div>
            <input 
            className='bg-blue-100 my-3 p-2 border outline-none focus-within:border-blue-500 rounded w-full '
            placeholder='Enter field name'
            value={value}
            onChange={onChange}
            />
            <button onClick={submit} className='bg-blue-500 px-4 text-white hover:bg-blue-600 mx-auto rounded py-2'>Add Field</button>
        </div>
      
    </section>
  )
}

export default AddFieldComponent
