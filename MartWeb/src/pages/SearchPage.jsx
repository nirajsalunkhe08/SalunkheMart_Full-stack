import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import AxiosToastError from '../utils/AxiosToastError'
import axios from 'axios'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom'
import nothingyetimage from '../assets/nothing_yet.png'
const SearchPage = () => {
  const [data,setData]=useState([])
  const [loading,setLoading]=useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [totalPage,setToatlPage]=useState(1)
  const [page, setPage] = useState(1)
  const params = useLocation()
  const searchText = params?.search?.slice(3)
  const fetchData = async()=>{
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.searchproduct,
        data:{
          search:searchText,
          page:page,
        }
      })
      const {data:responseData}=response
      if(responseData.success){
        if (responseData.page==1) {
          setData(responseData.data)
        }else{
          setData((preve)=>{
            return[
              ...preve,
              ...responseData.data
            ]
          })
        }
        setToatlPage(responseData.totalPage)
        console.log(responseData)
      }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    fetchData()
  },[page,searchText])

  const handleFetchMore =()=>{
    if (totalPage > page) {
      setPage(preve => preve + 1)
    }
  }
  return (
    <section className='bg-white'>
      <div className='container mx-auto p-4 '>
        <p className='font-semibold'>Search result: {data.length}</p>
        <InfiniteScroll
        dataLength={data.length}
        hasMore={true}
        next={handleFetchMore}
        >
          
        
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          {
            data.map((p,index)=>{
              return(
                <CardProduct data={p} key={p?._id+"searchproduct"+index}/>
              )
            })
          }
          
      {/**loading data */}
      {
        loading && (
          loadingArrayCard.map((_,index)=>{
            return(
              <CardLoading key={"loadingsearchpage"+index}/>
            )
          })
        )
      }
        </div>
        </InfiniteScroll>
        {
            //no data
            !data[0] && !loading && (
              <div className='flex flex-col items-center justify-center w-full mx-auto  '>
                <img src={nothingyetimage} alt="no data found" 
                className='w-full h-full max-w-sm max-h-sm' 
                />
                <p className='font-semibold my-2'>No Data Found</p>
          
              </div>
            )
          }
      </div>
    </section>
  )
}

export default SearchPage
