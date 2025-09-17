import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";
import { PriceWithDiscount } from "../utils/PriceWithDiscount";
import empty_cart from "../assets/empty_cart.jpg"
import Divider from "./Divider";
import toast from "react-hot-toast";
const DisplayCartItem = ({close}) => {
  const{notDiscountTotalPrice , totalPrice , totalQyt} =useGlobalContext()
  const cartItem = useSelector(state =>state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    const redirectToCheckOutPage =()=>{
        if (user?._id) {
    navigate("/checkout");
    if (close) {
    close()
  } 
  return
  }
    toast.error("Please login For next process");
    }
  return (
    <section className="bg-neutral-900 fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70">
      <div className="bg-white w-full lg:max-w-sm min-h-screen lg:max-h-screen ml-auto">
        <div className="flex items-center shadow-md p-4 justify-between gap-3">
          <h2 className="font-semibold">Cart</h2>
          <Link to={"/"} onClick={close} className="lg:hidden">
          <IoClose size={25} />
          </Link>
          <button onClick={close} className="hidden lg:block">
            <IoClose size={25} />
          </button>
        </div>
        <div className="min-h-[77vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] p-2 flex flex-col gap-4">
            {/**Display items */}
            {
                cartItem[0] ? (
                    <>
                    <div className="flex items-center font-semibold text-lg text-green-600 bg-green-200 px-4 py-2 justify-between">
                <p>Your Total Savings</p>
                <p>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto">
                {
                    cartItem[0] && (
                        cartItem.map((item,index)=>{
                            return(
                                <div key={item._id+"cartitemdetails"} className="flex w-full gap-4">
                                    <div className="w-16 h-16 min-h-16 min-w-16 border ">
                                        <img src={item?.productId?.image[0]} alt="images"
                                         className="object-scale-down" />
                                    </div>
                                    <div className="w-full lg:max-w-sm text-xs">
                                        <p className="text-xs text-ellipsis line-clamp">{item?.productId?.name} </p>
                                        <p className="text-neutral-400">{item?.productId?.unit}</p>
                                        <p className="font-semibold">{DisplayPriceInRupees(PriceWithDiscount(item?.productId?.price,item?.productId?.discount))}</p>
                                    </div>
                                    <div>
                                        <AddToCartButton data={item?.productId}/>
                                    </div>
                                </div>
                            )
                        })
                    )
                }

            </div>
            <Divider/>
            <div className="bg-white p-4">
                <h3 className="font-semibold">Bill Details</h3>
                <div className="flex gap-4 justify-between ml-1 ">
                    <p>Items Total</p>
                    <p className="flex items-center gap-3"><span className="line-through text-neutral-500">{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
                </div>
                 <div className="flex gap-4 justify-between ml-1">
                    <p>Total Qauntity</p>
                    <p className="flex items-center gap-3">{totalQyt} items</p>
                </div>
                <div className="flex gap-4 justify-between ml-1">
                    <p>Delivery Charge</p>
                    <p className="flex items-center gap-3">Free</p>
                </div>
                <Divider/>
                <div className="font-semibold flex items-center justify-between">
                    <p >Grand Total</p>
                    <p>{DisplayPriceInRupees(totalPrice)}</p>
                </div>
            </div>
                    </>
                ):(
                    <div className="bg-white flex flex-col justify-center items-center">
                        <img src={empty_cart} alt="EmptyCart"
                        className="w-full h-full object-scale-down" />
                        <p className="text-2xl font-extrabold">Your Cart Is Empty</p>
                        <Link onClick={close} to={"/"} className="block font-bold underline rounded text-neutral-300 bg-blue-600 px-4 py-2">Shop Now</Link>
                    </div>
                    
                )
            }
            
        </div>
        {
            cartItem[0] && (
                 <div className="p-2">
            <div className="bg-blue-700 font-bold text-lg  text-white px-4 py-4 static bottom-3 rounded flex items-center gap-4 justify-between">
            <div>
                {DisplayPriceInRupees(totalPrice)}
            </div>
           
            <button onClick={redirectToCheckOutPage} className="flex items-center gap-2">
            Procceed
            <span><FaAngleDoubleRight /></span>
            </button>
        </div>
        </div>
            )
        }
       
      </div>
    </section>
  );
};

export default DisplayCartItem;
