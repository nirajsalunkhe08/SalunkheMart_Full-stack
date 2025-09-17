import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='border-t '>
        <div className='container mx-auto p-4 text-center flex  flex-col lg:flex-row lg:justify-between gap-2'>
                    <p className=''>All Rights Reserved 1760 ©</p>
                    <div className='flex items-center gap-4 justify-center text-2 text-2xl'>
                        <a href=''className='hover:text-blue-500'><FaFacebook /></a>
                         <a href=''className='hover:text-red-500'><FaSquareInstagram /></a>
                          <a href=''className='hover:text-blue-400'><FaLinkedin /></a>
                    </div>
        </div>

    </footer>

  )
}

export default Footer
