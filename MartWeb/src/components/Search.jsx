import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);

  const params = new URLSearchParams(location.search);
  const searchText = params.get('q') || "";

  useEffect(() => {
    setIsSearchPage(location.pathname === "/search");
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    const url = `/search?q=${value}`;
    navigate(url);
  };

  return (
    <div className='w-full bg-emerald-200 min-w-[300px] lg:min-w-[420px] h-12 rounded-md border overflow-hidden flex items-center text-neutral-500 group focus-within:border-blue-500'>
      
      {/* Search / Close Button */}
      <button
        onClick={() => isSearchPage ? navigate("/") : redirectToSearchPage()}
        className='flex justify-center items-center h-full p-3 text-neutral-700 group-focus-within:text-blue-700'
      >
        {isSearchPage ? <IoClose size={22} /> : <FaSearch size={22} />}
      </button>

      {/* Search input or animation */}
      <div className='w-full h-full'>
        {!isSearchPage ? (
          // Not in search page
          <div onClick={redirectToSearchPage} className='w-full h-full flex items-center'>
            <TypeAnimation
              sequence={[
                "Search 'milk'", 1000,
                "Search 'Beard'", 1000,
                "Search 'Panner'", 1000,
                "Search 'Sugar'", 1000,
                "Search 'Rice'", 1000,
                "Search 'Maggie'", 1000,
                "Search 'Fruits'", 1000,
                "Search 'Oil'", 1000,
                "Search 'Biscuits'", 1000,
                "Search 'Cold Drinks'", 1000,
                "Search 'Mutton Masala'", 1000,
                "Search 'Toothpaste'", 1000,
                "Search 'Tea Powder'", 1000,
                "Search 'Chips'", 1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          // Search page input
          <input
            type="text"
            placeholder="Search atta, dal and more..."
            autoFocus
            value={searchText}
            className="bg-white border rounded-md px-4 py-2 w-full outline-none"
            onChange={handleOnChange}
          />
        )}
      </div>
    </div>
  );
};

export default Search;
