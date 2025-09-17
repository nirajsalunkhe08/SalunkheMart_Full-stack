import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const ProductListPage = () => {
  const params = useParams()
  const [data,setData]=useState([])
  const[loading,setLoading]=useState(false)
  const[totalPage,setTotalPage]=useState(1)
  const [page,setPage]=useState(1)
  const AllSubCategory = useSelector(state=>state?.product.allSubCategory)
  const [DisplaySubCategory,setDisplaySubCategory] = useState([])
  


  const subCategory =params?.subCategory.split("-")
  const subCategoryName = subCategory?.slice(0,subCategory?.length -1)?.join(" ")
  
  const categoryId = params.category.split("-").slice(-1)[0] 
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]  
   const fetchProductdata=async()=>{
      
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data:{
          categoryId:categoryId,
          sub_categoryId:subCategoryId,
          page:page,
          limit:10

        }
      })
      const {data:responseData}=response
      if(responseData.success){
        if(responseData.page==1){
          setData(responseData.data )
        }else{
          setData([...data, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
        
      }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    fetchProductdata()
  },[params,page])

  useEffect(()=>{
    const sub= AllSubCategory.filter(s =>{
      const filterData = s.categoryId.some(el =>{
        return el._id === categoryId
      })
      return filterData ? filterData : false
    } )
    setDisplaySubCategory(sub)
  },[params,AllSubCategory])
  return (
    <section className='sticky top-24 lg:h-20'>
      <div className='container mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]'>
        {/**subcategory */}
        <div className=' min-h-[80vh] max-h-[80vh] overflow-y-scroll p-1 grid  scrollbarCustom'>
      {
        DisplaySubCategory.map((s,index)=>{
         
          const link = `/${valideURLConvert(s?.categoryId[0]?.name)}-${s?.categoryId[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
          
          return(
            <Link to={link} className={`w-full p-2 bg-white lg:flex items-center lg:w-full lg:h-17 lg:gap-4 border border-green-300
              hover:bg-green-200 cursor-pointer
             ${subCategoryId ===s._id ? "bg-green-300": ""}`}>
              <div className='w-fit mx-auto lg:mx-0 max-w-28 box-border'>
                <img 
                src={s.image}
                alt='subCategory'
                className='w-14 lg:h-17 lg:w-13 h-full object-scale-down'
                />

              </div>
              <p className=' -mt-1 text-xs font-bold text-center'>{s.name}</p>
            </Link>
          )
        })
      }
        </div>
        {/**product */}
       <div className='sticky top-20 '>
  <div className="bg-lime-500 text-white shadow-md p-4">
    <h3 className="font-semibold">
      {subCategoryName}
    </h3>
  </div>

 <div className="min-h-[80vh] overflow-y-auto relative">
  <div className="max-w-screen-xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
      {data.map((p, index) => (
        <CardProduct
          data={p}
          key={p._id + "productSubCategory" + index}
        />
      ))}
    </div>
  </div>
</div>
    {loading && <Loading />}
  </div>
</div>
      
    </section>
  )
}

export default ProductListPage
