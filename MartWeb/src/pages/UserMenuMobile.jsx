import React from 'react'
import UserMenu from '../components/userMenu'
import { IoCloseOutline } from "react-icons/io5";
const UserMenuMobile = () => {
  return (
    <section className='bg-white h-full w-full py-2' >
      <button onClick={()=>window.history.back()} className='text-red-600 block w-fut ml-auto'>
      <IoCloseOutline size={25}/>
      </button>
      <div className='container mx-auto px-3 pb-8'>
        <UserMenu/>
      </div>
      
    </section>
  )
}

export default UserMenuMobile
