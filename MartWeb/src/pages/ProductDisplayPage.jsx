import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import bestpriceimage from '../assets/bestprice.jpg'
import fastdelivimage from '../assets/fastdelivery.jpg'
import wideassortimage from '../assets/wideassortment.jpg'
import { PriceWithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
const ProductDisplayPage = () => {
   const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data,setData] = useState({
    name : "",
    image : []
  })
  const [image,setImages]=useState(0)
  const [loading,setLoading] = useState(false)
  const imageContainer = useRef()

  const fetchProductDetails = async()=>{
    try {
        const response = await Axios({
          ...SummaryApi.getProductDetails,
          data : {
            productId : productId 
          }
        })

        const { data : responseData } = response

        if(responseData.success){
          setData(responseData.data)
          
        }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchProductDetails()
  },[params])
 
  const handleScrollRight = ()=>{
    imageContainer.current.scrollLeft +=100
  }
  const handleScrollLeft = ()=>{
    imageContainer.current.scrollLeft -=100
  }
  return (
    <section className='container mx-auto p-4  grid lg:grid-cols-3'>
      <div className='col-span-2'>
    <div className='min-h-56 max-h-56 lg:min-h[65vh] lg:max-h-[65vh] bg-white rounded h-full w-full '>
      <img
       src={data.image[image]}
       className='w-full h-full object-scale-down'
       />
    </div>
    <div className='flex items-center justify-center gap-3 my-3'>
      {
        data.image.map((img,index)=>{
          return(
            <div key={img+index+"point"} className={`bg-slate-500 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-600"}`}>

            </div>
          )
        })
      }
    </div>
    <div className='grid relative '>
      <div ref={imageContainer} className='flex gap-3 relative z-10 w-full overflow-x-auto scrollbar-none'>
      {
        data.image.map((img,index)=>{
          return(
            <div className='h-20 w-20 min-h-20 min-w-20  cursor-pointer shadow-md' key={img+index}>
              <img src={img} 
              alt='min-product'
              onClick={()=>setImages(index)}
              className='w-full h-full object-scale-down'
              />
            </div>
          )
        })
      }
    </div>
     <div className='w-full h-full -ml-4 flex justify-between absolute items-center'>
      <button onClick={handleScrollLeft} className=' z-10 bg-white relative p-1 shadow-md rounded-full '>
        <FaAngleLeft/>
      </button>
      <button onClick={handleScrollRight} className='z-10 bg-white p-1 relative  shadow-md rounded-full '>
        <FaAngleRight/>
      </button>
    </div>
    
    </div>
   <div className='my-4 grid gap-3'>
   <div>
     <p className='font-semibold'>Description</p>
    <p className='text-sm '>{data.description}</p>
   </div>
   <div>
     <p className='font-semibold'>Unit</p>
    <p className='text-sm '>{data.unit}</p>
   </div>
   
   </div>
      </div>
      <div className='p-4 lg:pl-7 text-base lg:text-lg'>
        <p className='bg-green-500 w-fit px-2 rounded-full'>10 Min</p>
      <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>
      <div className='flex gap-3'>
        <h3 className='font-bold'>Unit :</h3>
        <p className='font-semibold'>{data.unit}</p>
      </div>
     < Divider/>
        <h3 className='font-bold text-lg'>Price</h3>
         <div className='flex items-center gap-4'>
          <div className=' gap-3 border border-green-300 rounded bg-green-200 w-fit px-4 py-2 '>
        <p  className='font-semibold  text-lg lg:text-xl'>{DisplayPriceInRupees(PriceWithDiscount(data.price,data.discount))}</p>
      </div> 
      {
        data.discount && (
          <p className='line-through text-lg '>{DisplayPriceInRupees(data.price)}</p>
        )
      }
      {
        data.discount && (
           <p className='font-bold text-lg text-green-900 lg:text-2xl'>{data.discount}% <span className='text-base text-neutral-500'>DISCOUNT</span></p>
        )
      }
     
         </div>
      <div>
      {
        data.stock === 0 ? (
          <p className='text-lg text-red-500 my-2'>Out of stock</p>
        ):(
                //<button className='my-4 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'>Add</button>
                <div className='my-4'>
                  <AddToCartButton data={data}/>
                </div>
                
        )
      }
    </div>
      <h2 className='font-semibold'>Why shop from Salunkhe Mart ?</h2>
      <div>
        <div className='flex items-center gap-4 my-4'>
          <img src={fastdelivimage} alt="fast delivery"
           className='w-25 h-20 '/>
           <div>
            <div className='font-semibold'>Superfast Delivery</div>
            <p>Get your order delivery to your doorstep at yhe earliest from dark stores near you.</p>
           </div>
        </div>
         <div className='flex items-center gap-4 my-4'>
          <img src={bestpriceimage} alt="best price offer"
           className='w-25 h-20 '/>
           <div>
            <div className='font-semibold'>Best Prices and Offer</div>
            <p>Best price destination with offers directtly from manufactures</p>
           </div>
        </div>
         <div className='flex items-center gap-4 my-4'>
          <img src={wideassortimage} alt="wide assortment"
           className='w-25 h-20 '/>
           <div>
            <div className='font-semibold'>Wide Assortment</div>
            <p>Choose from 10000 + products accross food personal care, household and others categories.</p>
           </div>
        </div>
      </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage
