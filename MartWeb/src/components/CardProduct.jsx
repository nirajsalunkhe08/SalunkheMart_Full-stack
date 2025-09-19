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
        <Link 
            to={url} 
            className='border py-2 p-2 grid gap-1 lg:gap-2 w-32 sm:w-36 md:w-40 lg:w-48 h-52 sm:h-60 lg:h-72 rounded cursor-pointer hover:shadow-md bg-orange-100 transition-shadow duration-200 flex-shrink-0'
        >
            {/* Image Container - Smaller Height */}
            <div className='h-20 sm:h-24 lg:h-28 w-full rounded overflow-hidden flex-shrink-0'>
                <img
                    src={data.image[0]}
                    className='w-full h-full object-cover'
                    alt={data.name}
                />
            </div>
            
            {/* Tags Section */}
            <div className='flex gap-1 lg:gap-2 flex-shrink-0'>
                <div className='bg-blue-100 text-green-500 p-[1px] px-1 rounded-full text-[10px] lg:text-xs w-fit'>
                    10 min
                </div>
                <div>
                    {
                        Boolean(data.discount) && (
                            <p className='text-green-700 w-fit rounded-md bg-green-300 text-[10px] lg:text-xs px-1'>{data.discount}%</p>
                        )
                    }
                </div>
            </div>
            
            {/* Product Name - Compact */}
            <div className='font-medium px-1 text-[10px] sm:text-xs lg:text-sm text-ellipsis line-clamp-2 flex-grow'>
                {data.name}
            </div>
            
            {/* Unit */}
            <div className='w-fit px-1 text-[10px] sm:text-xs lg:text-sm flex-shrink-0'>
                {data.unit}
            </div>
            
            {/* Price and Cart Section - Compact */}
            <div className='px-1 flex items-center justify-between gap-1 mt-auto'>
                <div className='flex items-center gap-1'>
                    <div className='font-semibold text-[10px] sm:text-xs lg:text-sm'>
                        {DisplayPriceInRupees(PriceWithDiscount(data.price,data.discount))}
                    </div>
                </div>
                
                <div className=''>
                    {
                        data.stock == 0 ? (
                            <p className='text-red-500 text-[10px] sm:text-xs font-semibold'>Out of stock</p>
                        ) : (
                            <div className='scale-75 lg:scale-100'>
                                <AddToCartButton data={data}/>
                            </div>
                        )
                    }
                </div>
            </div>
        </Link>
    )
}

export default CardProduct