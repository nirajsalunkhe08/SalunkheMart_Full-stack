import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
const Product = () => {
    const[productData,setProductData]=useState([])
    const[page,setPage]=useState(1)
    const fetchProductData =async()=>{
        try {
            const response = await Axios({
                ...SummaryApi.getProduct,
                data:{
                    page:1,

                }
            })
            const {data:responseData}=response
            console.log("product page",responseData)
            if(responseData.success){
                setProductData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
    useEffect(()=>{
        fetchProductData()
    },[])
  return (
    <div>
      
    </div>
  )
}

export default Product
