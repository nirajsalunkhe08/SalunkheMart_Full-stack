import { createContext, useContext, useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import toast from "react-hot-toast";
import { PriceWithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice"; 

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQyt, setTotalQyt] = useState();
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
   const [currentAddress, setCurrentAddress] = useState(null);

  const clearCurrentAddress = () => setCurrentAddress(null);
  const dispatch = useDispatch();
  const fetchCartItem = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItem,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  const updateCartItem = async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItem,
        data: {
          _id: id,
          qty: qty,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        // toast.success(responseData.message)
        fetchCartItem();
        return responseData;
      }
    } catch (error) {
      AxiosToastError(error);
      return error;
    }
  };
  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: {
          _id: cartId,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  const fetchAddress = async()=>{
    try {
      const response = await Axios({
        ...SummaryApi.getAddress,
      });
      const { data: responseData } = response; 
      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data));
    }
     } catch (error) {
      AxiosToastError(error);
    }
  }
  const fetchOrder = async()=>{
    try {
      const response = await Axios({
        ...SummaryApi.getOrderItems,
      })
      const {data : responseData}=response
      if (responseData.success) {
        dispatch(setOrder(responseData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
useEffect(() => {
  const token = localStorage.getItem("token");
  if (user?._id && token) {
    fetchCartItem();
    fetchAddress();
    fetchOrder();
  } else {
    dispatch(handleAddItemCart([]));
    setTotalPrice(0);
    setTotalQyt(0);
    setNotDiscountTotalPrice(0);
    clearCurrentAddress();
  }
}, [user]);


  useEffect(() => {
    const qyt = cartItem.reduce((preve, curr) => {
      return preve + curr.quantity;
    }, 0);
    setTotalQyt(qyt);

    const tPrice = cartItem.reduce((preve, curr) => {
      const priceAfterDiscount = PriceWithDiscount(
        curr?.productId.price,
        curr?.productId?.dicount
      );
      return preve + priceAfterDiscount * curr.quantity;
    }, 0);
    setTotalPrice(tPrice);
    const notDiscountTotalPrice = cartItem.reduce((preve, curr) => {
      return preve + curr?.productId.price * curr.quantity;
    }, 0);
    setNotDiscountTotalPrice(notDiscountTotalPrice);
  }, [cartItem]);

 useEffect(() => {
  if (user?._id) {
    fetchCartItem();
    fetchAddress();
    fetchOrder();
  }
}, [user?._id]);
  return (
    <GlobalContext.Provider
      value={{
        fetchCartItem,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        totalPrice,
        totalQyt,
        notDiscountTotalPrice,
         
         currentAddress, setCurrentAddress, clearCurrentAddress 
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalProvider;
