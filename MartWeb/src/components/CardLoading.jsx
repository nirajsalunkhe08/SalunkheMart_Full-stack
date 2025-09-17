import React from 'react'

const CardLoading = () => {
  return (
    <div className='border p-2 grid gap-3 w-full rounded animate-pulse'>
        <div className='min-h-[50px] lg:min-h-[65px] bg-blue-100 rounded'>
        </div>
        <div className='p-3 bg-blue-100 rounded w-20'>
        </div>
        <div className='p-3 bg-blue-100 rounded '>
        </div>
        <div className='p-3 bg-blue-100 rounded w-16'>
        </div>
        <div className='flex items-center justify-between gap-3'>
           <div className='p-3 bg-blue-100 rounded w-16'>
        </div>
         <div className='p-3 bg-blue-100 rounded w-16'>
        </div>
        </div>

    </div>
  )
}

export default CardLoading
