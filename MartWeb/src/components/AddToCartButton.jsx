import React, { useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { useGlobalContext } from "../provider/GlobalProvider";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";   // ✅ added useDispatch
import { handleAddItemCart } from "../store/cartProduct";

const AddToCartButton = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const dispatch = useDispatch();   // ✅ initialize dispatch

  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemDetails] = useState();

const handleADDToCart = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    const response = await Axios({
      ...SummaryApi.addTOcart,
      data: { productId: data?._id },
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      toast.success(response.data.message);
      if (fetchCartItem) fetchCartItem(); // update Redux/UI
    }
  } catch (error) {
    AxiosToastError(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const checkingitem = cartItem.some(
      (item) => item.productId._id === data._id
    );
    setIsAvailableCart(checkingitem);
    const product = cartItem.find((item) => item.productId._id === data._id);
    setQty(product?.quantity);
    setCartItemDetails(product);
  }, [data, cartItem]);

  const increaseQty =async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const response = await updateCartItem(cartItemDetails?._id, qty + 1);
     if(response.success){
       toast.success("Item Added")
  };
  }
  const decreaseQty = async(e) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty === 1) {
      deleteCartItem(cartItemDetails?._id);
    } else {
      const response = await updateCartItem(cartItemDetails?._id, qty - 1);
      if(response.success){
       toast.success("Item Removed")
  };
    }
  };
  return (
    <div className="w-full max-w-[150px]">
      {isAvailableCart ? (
        <div className="flex items-center w-full h-full ">
          <button
            onClick={decreaseQty}
            className="bg-blue-500 hover:bg-blue-600 text-white flex-1 w-full p-1 rounded flex items-center justify-center "
          >
            <FaMinus />
          </button>
          <p className="flex-1 w-full px-1 rounded font-semibold flex items-center justify-center">
            {qty}
          </p>
          <button
            onClick={increaseQty}
            className="bg-blue-500 hover:bg-blue-600 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleADDToCart}
          className="bg-blue-600 text-white rounded px-4 p-1 hover:bg-blue-500"
        >
          {loading ? <Loading /> : "Add"}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
