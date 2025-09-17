import React from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { FaCartShopping } from 'react-icons/fa6'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretSquareRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
const cartMobile = () => {
const {totalPrice, totalQyt} = useGlobalContext()
const cartItem = useSelector(state => state.cartItem.cart)
  return (
    <>
    {
        cartItem[0] && (
            <div className=' sticky p-2 bottom-4'>
      <div className=' bg-red-600 px-2 py-1 rounded text-neutral-100 flex  items-center justify-between gap-3 lg:hidden'>
      <div className='flex items-center gap-2'>
            <div className='p-2 bg-red-500 rounded w-fit'>
            <FaCartShopping />
            </div>
            <div className='text-xs'>
              <p>{totalQyt} items</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
      </div>
    
    <Link to={"/cart"} className="flex items-center gap-1">
    <span className='text-sm'>View Cart</span>
    <FaCaretSquareRight />
    </Link>
    </div>
    </div>
        )
    }
    </>
    
    
  )
}

export default cartMobile
