import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const loadingCardNumber = new Array(6).fill(null);

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
  }, [id]);

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200;
  };
  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200;
  };

  const handleRedirectProductListPage = () => {
    const subCategory = subCategoryData.find((sub) =>
      sub.categoryId.some((c) => c._id === id)
    );

    if (!subCategory) {
      return `/category/${valideURLConvert(name)}-${id}`;
    }

    return `/${valideURLConvert(name)}-${id}/${valideURLConvert(
      subCategory.name
    )}-${subCategory._id}`;
  };

  const reDirectURL = handleRedirectProductListPage();

  return (
    <div>
      <div className="container mx-auto p-4 flex items-center justify-between">
        <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
        <Link to={reDirectURL} className="text-green-500 hover:text-green-600">
          See All
        </Link>
      </div>
      <div className="relative flex items-center">
        <div
          className="flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scroll-smooth"
          ref={containerRef}
        >
          {loading &&
            loadingCardNumber.map((_, index) => (
              <CardLoading
                key={"CartegoryWiseProductDisplay-loading-" + index}
              />
            ))}

          {!loading && data.length === 0 && (
            <p className="text-gray-500">No products found</p>
          )}

          {data.map((p, index) => (
            console.log("productdata",p),
            <CardProduct
              key={p._id + "CartegoryWiseProductDisplay" + index}
              data={p}
            />
          ))}
        </div>
        <div className="w-full right-0 left-0 container mx-auto px-2 absolute hidden lg:flex justify-between">
          <button
            onClick={handleScrollLeft}
            className="z-10 relative bg-white shadow-md text-lg p-3 rounded-full"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={handleScrollRight}
            className="z-10 relative bg-white hover:bg-gray-200 shadow-md text-lg p-3 rounded-full"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
