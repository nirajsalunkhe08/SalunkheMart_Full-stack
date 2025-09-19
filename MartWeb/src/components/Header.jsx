import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import Search from "../components/Search";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import useMobile from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { VscTriangleDown } from "react-icons/vsc";
import { VscTriangleUp } from "react-icons/vsc";
import UserMenu from "../components/UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";
import { FaMapMarkerAlt } from "react-icons/fa";
const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const { totalPrice, totalQyt } = useGlobalContext();
  // const [totalPrice,setTotalPrice]=useState(0)
  // const[totalQyt,setTotalQyt]=useState()
  const [openCartSection, setOpenCartSection] = useState(false);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };
  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }
    navigate("/user-menu-mobile");
  };
  //total items and total price
  {
    /** 
    useEffect(()=>{
    const qyt = cartItem.reduce((preve,curr)=>{
      return preve + curr.quantity
    },0)
    setTotalQyt(qyt )
    const tPrice = cartItem.reduce((preve,curr)=>{
      return preve + (curr.quantity * curr.productId.price)
    },0) 
   setTotalPrice(tPrice)
  },[cartItem])*/
  }

  const addressList = useSelector((state) => state.addresses.addressList);
  const [isAvailableAddress, setIsAvailableAddress] = useState(false);
  const [availableAddress, setAvailableAddress] = useState(null);
  const { currentAddress, setCurrentAddress } = useGlobalContext();
  const [openAddressMenu, setOpenAddressMenu] = useState(false);

  useEffect(() => {
    if (!currentAddress && addressList?.length > 0) {
      const active = addressList.find((addr) => addr.status);
      if (active) setCurrentAddress(active);
    }
  }, [addressList, currentAddress, setCurrentAddress]);
  return (
    <header className="h-auto sticky top-0 z-40 bg-rose-500 shadow-md">
      {/* Top Header Section (hide on mobile + /search) */}
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto px-2 flex justify-between items-center py-2 lg:py-0">
          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                width={170}
                height={60}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={120}
                height={60}
                alt="logo"
                className="lg:hidden"
              />
            </Link>
          </div>

          {/* Address dropdown */}
          {currentAddress && (
            <div className="relative px-2 lg:px-4">
              <div
                onClick={() => setOpenAddressMenu((prev) => !prev)}
                className="flex items-center gap-2 cursor-pointer text-gray-800 font-medium select-none"
              >
                <div className="flex items-center gap-2  ">
                  <p className="text-green-600">
                    <FaMapMarkerAlt size={25} />
                  </p>
                  <p className=""></p>
                  <p className="lg:text-2xl font-semibold">
                    <span className="">Deliver to:</span>{" "}
                    <span className="text-rose-700">
                      {currentAddress.address_line}, {currentAddress.city}
                    </span>
                  </p>
                </div>
                {openAddressMenu ? (
                  <VscTriangleUp size={20} />
                ) : (
                  <VscTriangleDown size={20} />
                )}
              </div>

              {openAddressMenu && (
                <div className="absolute left-0 mt-2 bg-white shadow-lg rounded w-72 lg:w-80 z-50 max-h-64 overflow-y-auto">
                  {addressList
                    .filter((addr) => addr.status)
                    .map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => {
                          setCurrentAddress(addr);
                          setOpenAddressMenu(false);
                        }}
                        className="p-3 border-b cursor-pointer hover:bg-gray-100"
                      >
                        <p className="font-semibold">{addr.address_line}</p>
                        <p className="text-sm text-gray-600">
                          {addr.city}, {addr.state}, {addr.country} -{" "}
                          {addr.pincode}
                        </p>
                        <p className="text-sm text-gray-500">{addr.mobileno}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Search (desktop only) */}
          <div className="hidden lg:block w-full max-w-xl px-4">
            <Search />
          </div>

          {/* Login + Cart Section */}
          <div>
            {/* Mobile user icon only */}
            <button
              className="text-white lg:hidden"
              onClick={handleMobileUser}
            >
              <FaUserAlt size={26} />
            </button>

            {/* Desktop login and cart button with red bg */}
            <div className="hidden lg:flex  font-medium px-2 py-1 gap-10 rounded-sm items-center">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((preve) => !preve)}
                    className="flex select-none items-center gap-2 cursor-pointer "
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <VscTriangleUp size={25} />
                    ) : (
                      <VscTriangleDown size={25} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded w-64 p-4 min-w-64 shadow-lg lg:shadow-lg ">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button className="p-3 bg-white rounded-full border-2 " onClick={redirectToLoginPage}>Login</button>
              )}
              <button
                onClick={() => setOpenCartSection(true)}
                className="flex items-center text-white gap-2 bg-blue-500 hover:bg-red-600 px-3 py-2 rounded "
              >
                {/**add to card icon */}

                <div className="animate-bounce">
                  <BsCart4 size={28} />
                </div>

                <div className="font-bold">
                  {cartItem[0] ? (
                    <div>
                      <p>{totalQyt} Items</p>
                      <p>{DisplayPriceInRupees(totalPrice)}</p>
                    </div>
                  ) : (
                    <p>My Cart</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search section for mobile */}
      {isMobile && isSearchPage ? (
        <div className="w-full px-4 py-3">
          <Search />
        </div>
      ) : (
        <>
          <div className="container mx-auto px-2 lg:hidden pb-2">
            <Search />
          </div>
          {openCartSection && (
            <DisplayCartItem close={() => setOpenCartSection(false)} />
          )}
        </>
      )}
    </header>
  );
};

export default Header;
