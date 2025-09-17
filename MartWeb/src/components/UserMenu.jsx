import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { TbExternalLink } from "react-icons/tb";
import isAdmin from "../utils/isAdmin";
import { handleAddItemCart } from "../store/cartProduct";
import { useGlobalContext } from "../provider/GlobalProvider";



const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [totalPrice,setTotalPrice]=useState(0)
        const[totalQyt,setTotalQyt]=useState()
        const [notDiscountTotalPrice,setNotDiscountTotalPrice]=useState(0)
        const {clearCurrentAddress }= useGlobalContext()
const handlelogout = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.logout,
    });

    if (response.data.success) {
      if (close) close();

      // Redux logout
      dispatch(logout());

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("guestCart");

      // ✅ Reset cart in Redux
      dispatch(handleAddItemCart([]));

      // ✅ Reset totals in context
      setTotalPrice(0);
      setTotalQyt(0);
      setNotDiscountTotalPrice(0);

      // ✅ Clear selected address from context
      clearCurrentAddress();

      toast.success(response.data.message);

      navigate("/");
    }
  } catch (error) {
    console.log(error);
    AxiosToastError(error);
  }
};
const handleClose=()=>{
  if (close) {
    close()
  }
}
  return (
    <div>
      <div className="font-semibold">My Account</div>
      <div className="text-bold  flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">{user.name || user.mobile} <span className="text-medium text-green-600">{user.role==="ADMIN" ? "(ADMIN)":""}</span></span> 
      <Link onClick={handleClose} to={"/dashboard/profile"} className="hover:text-blue-600"> <TbExternalLink size={20} /></Link>
      </div>
      <Divider />
      <div className="text-sm grid gap-3  ">
        {
          isAdmin(user.role)&& (
             <Link onClick={handleClose} to={"/dashboard/category"} className="px-2 hover:bg-cyan-400 py-1">
          Category
        </Link>
          )
        }

         {
          isAdmin(user.role)&& (
            <Link onClick={handleClose} to={"/dashboard/sub-category"} className="px-2 hover:bg-cyan-400 py-1">
         Sub Category
        </Link>
          )
        }

        {
          isAdmin(user.role)&& (
            <Link onClick={handleClose} to={"/dashboard/upload-products"} className="px-2 hover:bg-cyan-400 py-1">
           Upload Products
        </Link>
          )
        }
        {
          isAdmin(user.role)&& (
           <Link onClick={handleClose} to={"/dashboard/product-admin"} className="px-2 hover:bg-cyan-400 py-1">
          Products
        </Link>
          )
        }
        
       
        
        
        

        <Link onClick={handleClose} to={"/dashboard/myorders"} className="px-2 hover:bg-cyan-400 py-1">
          My Orders
        </Link>
        <Link onClick={handleClose} to="/dashboard/address" className="px-2 hover:bg-cyan-400 py-1">
          Save Address
        </Link>
        <button
          onClick={handlelogout}
          className="text-left text-red-500 font-bold  px-2"
        >
          Log Out
        </button>
      </div>
    </div>
  );

};

export default UserMenu;
