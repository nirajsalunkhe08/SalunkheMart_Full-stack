import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/SummaryApi'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { FaSearch } from "react-icons/fa";
import EditProductAdmin from '../components/EditProductAdmin'
const ProductAdmin = () => {
   const[productData,setProductData]=useState([])
    const[page,setPage]=useState(1)
    const [totalPageCount,setTotalPageCount]=useState(1)
    const[loading,setLoading]=useState(false)
    const [search,setSearch]=useState()
        const fetchProductData =async()=>{
            try {
                setLoading(true)
                const response = await Axios({
                    ...SummaryApi.getProduct,
                    data:{
                        page:page,
                        limit:12,
                        search:search
    
                    }
                })
                const {data:responseData}=response
                  if(responseData.success){
                    setProductData(responseData.data)
                    setTotalPageCount(responseData.totalNoPage)
                }
            } catch (error) {
                AxiosToastError(error)
            }finally{
                setLoading(false)
            }
        }
         useEffect(()=>{
                fetchProductData()
            },[page])
  const handleNext =()=>{
    if(page !== totalPageCount){
      setPage(preve =>preve +1)
    }
    
  }
  const handlePrevious = () => {
  if (page > 1) {
    setPage(prev => prev - 1);
  }
}
const handleOnChange=(e)=>{
  const{value}=e.target
  setSearch(value)
  setPage(1)
}
useEffect(()=>{
  const interval = setTimeout(()=>{
  fetchProductData()
  },300);
  return()=>{
    clearTimeout(interval)
  }
  
},[search,page])  
  return (
    <section>
      <div className='p-2 h-full bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'> Product</h2>
        <div className='h-full w-full max-w-56  ml-auto min-w-24 bg-slate-200 px-4 flex items-center gap-3 py-2 rounded-md border focus-within:border-blue-500' >
          <FaSearch />
          <input type="text" 
           placeholder='search product here...'
           className='h-full w-full outline-none bg-transparent'
           value={search}
           onChange={handleOnChange}  />
        </div>
      </div>
      {
        loading && (
           <Loading/>
        )
      }
     <div className='p-4 bg-blue-100'>
      <div className='min-h-[55vh]'>
       <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4  '>
        {
        productData.map((p,index)=>{
          return(
            <ProductCardAdmin data={p} fetchProductData={fetchProductData}/>
          )
        })
      }

      </div>
      </div>
      
      <div className='flex justify-between my-4'>
        <button onClick={handlePrevious} className='border border-blue-500 px-4 py-1 hover:bg-blue-400 '>Previous</button>
        <button className='w-full bg-white'>{page}/{totalPageCount}</button>
        <button onClick={handleNext} className='border border-blue-500 px-4 py-1 hover:bg-blue-400 '>Next</button>
      </div>
      
      
     </div>
     <EditProductAdmin/>
      </section>
  )
}

export default ProductAdmin
