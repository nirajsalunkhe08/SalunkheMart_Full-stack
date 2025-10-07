import React, { useState } from "react";
import Divider from "../components/Divider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddress from "../components/AddAddress";
import { useSelector, useDispatch } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { setLatestOrder } from "../store/orderSlice";

const CheckoutPage = () => {
  const {
    notDiscountTotalPrice,
    totalPrice,
    totalQyt,
    fetchCartItem,
    fetchOrder,
    currentAddress,
    setCurrentAddress,
  } = useGlobalContext();

  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const cartItemList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🛒 Handle Cash on Delivery (with debug logs)
const handleCashOnDelivery = async () => {
    if (!currentAddress?._id) {
      toast.error("Please select an address before placing order");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrderController,
        data: {
          list_items: cartItemList,
          totalAmt: totalPrice,
          addressId: currentAddress._id,
          subTotalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        // 'responseData.data' is the single, complete order object
        const newOrder = responseData.data; 

        toast.success(responseData.message);
        
        // --- THIS IS THE FIX ---
        // Use the 'newOrder' object directly. Do not use [0].
        dispatch(setLatestOrder(newOrder)); 
        // --------------------
        
        if (fetchCartItem) fetchCartItem();
        if (fetchOrder) fetchOrder();

        // This part is correct and passes the newOrder object to the next page
        navigate("/order-success", { 
            state: { 
                text: "Order", 
                order: newOrder 
            } 
        });
      } else {
          toast.error(responseData.message || "Order could not be placed.");
      }
    } catch (error) {
      AxiosToastError(error);
    }
};

  // 💳 Handle Online Payment
  const handleOnlinePayment = async () => {
    if (!currentAddress?._id) {
      toast.error("Please select an address before payment");
      return;
    }
    // ... your online payment logic
    try {
      toast.loading("Redirecting to payment gateway...");
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      const stripePromise = await loadStripe(stripePublicKey);

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemList,
          totalAmt: totalPrice,
          addressId: currentAddress._id,
          subTotalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;
      stripePromise.redirectToCheckout({ sessionId: responseData.id });

      if (fetchCartItem) fetchCartItem();
      if (fetchOrder) fetchOrder();
    } catch (error) {
      AxiosToastError(error);
      console.log(error);
    }
  };

  return (
    <section className="bg-blue-100 p-4">
      <div className="container mx-auto p-4 flex-col lg:flex-row flex gap-5 justify-between">
        {/* Address Section */}
        <div className="w-full">
          <h3 className="text-lg font-semibold">Choose Your Address</h3>
          <div className="bg-white grid gap-4 p-2">
            {addressList
              .filter((addr) => addr.status)
              .map((address) => (
                <label key={address._id} className="cursor-pointer">
                  <div
                    className={`border rounded p-3 flex gap-4 hover:bg-slate-200 ${
                      currentAddress?._id === address._id
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                  >
                    <div>
                      <input
                        type="radio"
                        checked={currentAddress?._id === address._id}
                        onChange={() => setCurrentAddress(address)}
                        name="address"
                      />
                    </div>
                    <div>
                      <p>{address.address_line}</p>
                      <p>{address.city}, {address.state}</p>
                      <p>{address.country} - {address.pincode}</p>
                      <p>{address.mobileno}</p>
                    </div>
                  </div>
                </label>
              ))}
            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-100 border-2 border-gray-500 border-dashed flex justify-center items-center cursor-pointer"
            >
              Add Address
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="w-full max-w-md bg-white py-4 px-2">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="bg-white p-4">
            <h3 className="font-semibold">Bill Details</h3>
            <div className="flex gap-4 justify-between ml-1 ">
              <p>Items Total</p>
              <p className="flex items-center gap-3">
                <span className="line-through text-neutral-500">
                  {DisplayPriceInRupees(notDiscountTotalPrice)}
                </span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
              </p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Total Quantity</p>
              <p className="flex items-center gap-3">{totalQyt} items</p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Delivery Charge</p>
              <p className="flex items-center gap-3">Free</p>
            </div>
            <Divider />
            <div className="font-semibold flex items-center justify-between">
              <p>Grand Total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className="w-full max-w-sm flex flex-col gap-4">
            <button
              className="py-2 px-4 bg-blue-500 border-2 border-green-600 hover:bg-blue-600 text-white"
              onClick={handleOnlinePayment}
            >
              Online Payment
            </button>
            <button
              className="py-2 px-4 text-white border-2 shadow-sm border-blue-400 bg-green-500 hover:bg-green-600"
              onClick={handleCashOnDelivery}
            >
              Cash On Delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;