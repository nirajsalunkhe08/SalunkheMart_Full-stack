import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import ConfirmBox from './ConfirmBox'
import { IoClose } from 'react-icons/io5'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'

const ProductCardAdmin = ({data,fetchProductData}) => {
  const [editOpen,setEditOpen]=useState(false)
  const [openDelete,setOpenDelete]=useState(false)
  const handleDeleteCancel=()=>{
    setOpenDelete(false)
  }
  const handleDelete = async()=>{
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data:{
          _id : data._id
        }
      })
      const {data:responseData}=response
      if(responseData.success){
        toast.success(responseData.message)
        if(fetchProductData){
          fetchProductData()
        } 
        setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className='w-36 p-4 bg-white rounded'>
      <div>
        <img src={data?.image[0]}
        alt={data.name}
        className='w-full h-full object-scale-down'
        />
      </div>
      <p className='text-ellipsis line-clamp-2 font-medium'>
        {data?.name}</p>
        <p className='text-slate-500'>{data?.unit}</p>
        <div className='grid grid-cols-2 gap-3 py-2'>
          <button onClick={()=>setEditOpen(true)} className='border px-1 py-1 text-sm border-blue-500 bg-blue-500 text-white hover:bg-blue-600 rounded'>Edit</button>
          <button onClick={()=>setOpenDelete(true)} className='border px-1 py-1 text-sm border-red-500 bg-red-600 text-white hover:bg-red-500 rounded'>Delete</button>
        </div>
        {
          editOpen &&(
          <EditProductAdmin fetchProductData={fetchProductData} data={data} close={()=>setEditOpen(false)}/>
          )
        }
        {
          openDelete && (
            <section className='fixed p-4 flex justify-center items-center top-0 right-0 left-0 bottom-0 bg-neutral-600 z-50 bg-opacity-70'>
              <div className='bg-white p-4 rounded-md  w-full max-w-md'>
              <div className='flex justify-between items-center gap-4'>
                <h3 className='font-semibold'>Permamnt Delete</h3>
                <button onClick={()=>setOpenDelete(false)}>
                  <IoClose size={25}/>
                </button>
              </div>
              <p className='my-2'>Are you sure to want to delete ?</p>
              <div className='flex justify-end gap-5 py-4'>
                <button onClick={handleDeleteCancel} className='border px-3 py-1 rounded border-blue-500 hover:bg-blue-400 '>Cancle</button>
                <button onClick={handleDelete} className='border px-3 py-1 rounded border-red-500 bg-red-500 hover:bg-red-600 text-white '>Delete</button>
              </div>
              </div>
            </section>
          )
        }
    </div>
  )
}

export default ProductCardAdmin
