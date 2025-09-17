import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
const [isSearchPage,setIsSearchPage]= useState(false)
  const params = useLocation()

  const searchText = params.search.slice(3)
useEffect(()=>{
const isSearch= location.pathname === "/search"
 setIsSearchPage(isSearch)
},[location])
    console
    
    const redirectTOSearchpage =()=>{
        navigate("/search")

    }

const handleonChanege =(e)=>{
  const value = e.target.value
  const url =`/search?q=${value}`
  navigate(url)
}


  return (
    <div className='w-full bg-emerald-200  min-w-[300px] lg:min-w-[420px] h-12 lg:h-12 rounded-md border overflow-hidden flex items-center text-neutral-500 group focus-within:border-blue-500  '>
      <button className='flex justify-center items-center h-full p-3 text-neutral-700 group-focus-within:text-blue-700 '>
    <FaSearch size={22} />
      </button>
      <div className='w-full h-full '>
        {
            !isSearchPage ? (
                //not in search page
                 <div onClick={redirectTOSearchpage} className='w-full h-full flex items-center'>
        <TypeAnimation
              sequence={[
                "Search 'milk'",
                1000,
                "Search 'Beard'",
                1000,
                "Search 'Panner'",
                1000,
                "Search 'Sugar'",
                1000,
                "Search 'Rice'",
                1000,
                "Search 'Maggie'",
                1000,
                "Search 'Fruits'",
                1000,
                "Search 'Oil'",
                1000,
                "Search 'Biscuits'",
                1000,
                "Search 'Cold Drinks'",
                1000,
                "Search 'Mutton Masala'",
                1000,
                "Search 'Toothpaste'",
                1000,
                "Search 'Tea Powder'",
                1000,
                "Search 'Chips'",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
      </div >
            ):(
                //when i  was earch page
                <div>
                    <input
  type="text"
  placeholder="Search atta, dal and more..."
  autoFocus={true}
  defaultValue={searchText}
  className="bg-white border rounded-md px-4 py-2 w-full outline-none  "
  onChange={handleonChanege}
/>

                </div> 
            )
        }
      </div>
     
    </div>
  )
}

export default Search
