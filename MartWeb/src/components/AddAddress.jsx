import React from 'react'
import { useForm } from "react-hook-form"
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { IoIosClose } from "react-icons/io";
import { useGlobalContext } from '../provider/GlobalProvider'

const AddAddress = ({close}) => {
      const {register,handleSubmit, reset  ,watch, formState: { errors },  } = useForm()
    const {fetchAddress}=useGlobalContext()
    const onSubmit = async(data)=>{
        console.log(data)
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data:{
                    address_line:data.adressline,
                    city:data.city,
                    state:data.state,
                    country:data.country,
                    pincode:data.pincode,
                    mobile:data.mobileno,
                    userId : data.userId 
                }
            })
            const {data:responseData} = response
            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                    reset()
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error)
            
        }
    }


  return (

    <section className='bg-black fixed right-0
    left-0 top-0 bottom-0 bg-opacity-70 z-50 '>
      <div className='bg-white p-4 w-full max-w-lg mt-2 lg:mt-8 mx-auto rounded h-screen overflow-auto '>
    <div className='flex items-center justify-between'>
        <h2 className='font-semibold'>Add Address</h2>
        <button>
            <IoIosClose size={28} onClick={close} className='hover:text-red-600'/>
        </button>
    </div>
        <form className='mt-4 ' onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-1'>
                <label htmlFor='adressline'>Address Line :</label>

                <input type="text" id='adressline' className='border bg-blue-100 p-2 rounded '
                {...register("adressline",{required:true})}
                />
            </div>
             <div className='grid gap-1'>
                <label htmlFor='city'>City :</label>

                <input type="text" id='city' className='border bg-blue-100 p-2 rounded '
                {...register("city",{required:true})}
                />
            </div>
             <div className='grid gap-1'>
                <label htmlFor='state'>State :</label>

                <input type="text" id='state' className='border bg-blue-100 p-2 rounded '
                {...register("state",{required:true})}
                />
            </div>
            <div className='grid gap-1'>
                <label htmlFor='pincode'>Pincode :</label>

                <input type="text" id='pincode' className='border bg-blue-100 p-2 rounded '
                {...register("pincode",{required:true})}
                />
            </div>
            <div className='grid gap-1'>
                <label htmlFor='country'>Country :</label>

                <input type="text" id='country' className='border bg-blue-100 p-2 rounded '
                {...register("country",{required:true})}
                />
            </div>
            <div className='grid gap-1'>
                <label htmlFor='mobileno'>Mobile NO :</label>

                <input type="number" id='mobileno' className='border bg-blue-100 p-2 rounded '
                {...register("mobileno",{required:true})}
                />
            </div>
            <button type='submit' className='bg-blue-500 mt-4 w-full py-2 font-semibold text-white hover:bg-blue-600 rounded'>Submit</button>
        </form>
      </div>
    </section>
  )
}

export default AddAddress
