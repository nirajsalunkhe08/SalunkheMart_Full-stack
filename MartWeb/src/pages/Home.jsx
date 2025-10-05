import React, { useEffect, useState } from 'react'
import banner from '../assets/banner.png'
import banner_mob from '../assets/banner_mob.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import img1 from '../assets/img1.jpg'
import img2 from '../assets/img2.jpg'
import img3 from '../assets/img3.jpg'
import img4 from '../assets/img4.jpg'
import img5 from '../assets/img5.jpg'
const Home = () => {
  const loadingCategory = useSelector(state=>state.product.loadingCategory)
  const categoryData = useSelector(state=>state.product.allCategory)
  const subCategoryData = useSelector(state=>state.product.allSubCategory)
  const navigate = useNavigate()
  const handleRedirectProductListPage = (id,cat)=>{
  
    const subCategory = subCategoryData.find(sub=>{
    const filterData = sub.categoryId.some(c =>{
      return c._id==id
    })
    return filterData ? true: null
    })
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subCategory.name)}-${subCategory._id}`

    navigate(url)
     
}
const images = [img1,img2,img3,img4,img5]
const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);
return (
  <section className='bg-emerald-100'>
    <div>
      
      <div className="container mx-auto">

        <div className="relative w-full h-full min-h-[12rem] lg:min-h-[25rem] overflow-hidden">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`img-${index}`}
              className={`absolute top-0 left-0 w-full h-full  transition-opacity duration-1000 ${
                index === current ? "opacity-100 z-20" : "opacity-0 z-10" 
              }`}
            />
          ))}
        </div>
      </div>
          <div className='ml-12 flex justify-center mt-4  gap-3 '>
            <h2 className='text-xl font-bold text-green-900'>Explore the Food And Grocery</h2>
          </div>
      <div className='container mx-auto px-4 my-2 grid grid-cols-7 md:grid-cols-8 lg:grid-cols-12 gap-4'>
        
        {loadingCategory ? (
          new Array(12).fill(null).map((_, index) => (
            <div key={index +"loadingcategory"} className='bg-emerald-500 rounded-lg p-4 shadow-md animate-pulse'>
              <div className='bg-blue-200 h-24 w-full rounded-md'></div>
              <div className='bg-blue-200 h-8 w-3/4 mt-3 rounded'></div>
            </div>
          ))
        ) : (
          categoryData.map((cat,index)=>{
            return(
              <div key={cat._id+"displayCategory"}  className='w-full h-full ' onClick={()=>handleRedirectProductListPage(cat._id,cat.name)}>
                <div>
                  <img src={cat.image} alt=""
                    className='w-full h-full object-scale-down' />
                </div>
              </div>
            )
          })
        )
        }
      </div>
      {/* category wise product */}
      {
        categoryData?.map((c,index)=>{
          return(
            <CategoryWiseProductDisplay 
              key={c?._id+"CategorywiseProduct"} 
              id={c?._id} 
              name={c?.name}
            />
          )
        })
        
      }
   
    </div>
    
  </section>

)
}

export default Home
