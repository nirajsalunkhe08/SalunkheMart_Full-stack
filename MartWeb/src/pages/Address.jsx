import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import EditAddress from "../components/EditAddress";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useGlobalContext } from "../provider/GlobalProvider";

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const[openEdit,setOpenEdit]=useState(false)
  const[editData,setEditData]=useState({})
  const {fetchAddress}=useGlobalContext()
  const handleDisableAddress = async(id)=>{
    try {
      const response = await Axios({
        ...SummaryApi.deleteAddress,
        data:{
          _id:id
        }
      })
      if (response.data.success) {
        toast.success("Address Removed")
        if (fetchAddress) {
          fetchAddress()
        }

      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className="">
      <div className="bg-white shadow-md px-2 py-2 flex justify-between item gap-4 ">
        <h2 className="font-semibold text-lg text-ellipsis line-clamp-1">
          Address
        </h2>
        <button
          onClick={() => setOpenAddress(true)}
          className="border border-blue-500 text-white p-2 bg-blue-500 hover:border-red-500 hover:bg-blue-600 rounded-full"
        >
          Add Address
        </button>
      </div>
      <div className="bg-white grid gap-4 p-2">
        {addressList.map((address, index) => {
          return (
            <div className={`border rounded p-3 flex gap-4 hover:bg-slate-200 justify-between ${!address.status && "hidden"} `}>
              <div>
                <p>{address.address_line}</p>
                <p>{address.city}</p>
                <p>{address.state}</p>
                <p>
                  {address.country} - {address.pincode}
                </p>
                <p>{address.mobileno}</p>
              </div>
              <div className="grid gap-10">
                <button onClick={()=>{setOpenEdit(true) ,setEditData(address)}} className="bg-green-500 p-1 rounded text-black hover:text-white hover:bg-green-600">
                  <CiEdit size={25}/>
                </button>

                <button onClick={()=>handleDisableAddress(address._id)} className="bg-red-500 p-1 hover:text-white rounded hover:bg-red-600 ">
                  <MdDelete size={25} />
                </button>
              </div>
            </div>
          );
        })}
        <div 
          onClick={() => setOpenAddress(true)}
          className="h-16 bg-blue-100 border-2 border-gray-500 border-dashed flex justify-center items-center cursor-pointer"
        >
          Add Address
        </div>
      </div>
      {openAddress && 
      <AddAddress 
      close={() => setOpenAddress(false)} />
      }
      {
        openEdit && <EditAddress 
        close={()=>setOpenEdit(false)}
       data={editData}
       />
      }
    </div>
  );
};

export default Address;
