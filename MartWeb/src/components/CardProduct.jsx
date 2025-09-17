import React from 'react'
import { DisplayPriceInRupees} from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { PriceWithDiscount } from '../utils/PriceWithDiscount'
import AxiosToastError from '../utils/AxiosToastError'
import { useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'
const CardProduct = ({data}) => {
    const url =`/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading,setLoading]=useState(false)
   
    
  return (
    
     <Link to={url} className='border py-2 p-2 grid gap-4 lg:gap-7 min-w-36 w-full rounded cursor-pointer hover:shadow-md bg-orange-50'>
       
        <div className='min-h-[20vh] min-w-[13vw] max-h-24 lg:max-h-32 rounded overflow-hidden'>
            <img
            src={data.image[0]}
            className='w-full h-full object-scale-down scale-125 '
            />
        </div>
        <div className='flex gap-4'>
            <div className=' bg-blue-100 text-green-500 p-[1px] px-2 rounded-full text-sm w-fit '>
            10 min
        </div>
        <div>
            {
           Boolean(data.discount ) && (
                <p className='text-green-700 w-fit rounded-md  bg-green-300'>{data.discount}%  ↓</p>
            )
        }
        </div>
        </div>
        <div className='font-medium px-2 text-sm lg:text-base text-ellipsis line-clamp-2'>
            {
               data.name 
            }
        </div>
        <div className='w-fit px-2 text-sm lg:text-base'>
            {
                data.unit
            }
        </div>
        <div className='px-2  lg:px-0 flex items-center justify-between gap-10'>

          <div className='flex items-center gap-4'>
             <div className='font-semibold'>
           {
            DisplayPriceInRupees(PriceWithDiscount(data.price,data.discount))
           }
        </div>
        
          </div>
         <div className=''>
            {
                data.stock ==0 ? (
                    <p className='text-red-500 text-sm font-semibold'>Out of stock</p>
                ) : (
                   <AddToCartButton data={data}/>
                )
            }
           
        </div>
        </div>

    </Link>
  )
}

export default CardProduct
