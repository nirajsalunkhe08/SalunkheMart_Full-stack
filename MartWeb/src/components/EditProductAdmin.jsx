import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from "../components/AddFieldComponent";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import successAlert from "../utils/SuccessAlert";

const EditProductAdmin = ({ close,data:propsData,fetchProductData }) => {
  const [data, setData] = useState({
   _id:propsData?._id || "", 
   name: propsData?.name || "",
  email: propsData?.email || "",
  categoryId: propsData?.categoryId ||[],
  sub_categoryId: propsData?.sub_categoryId || [],
  unit: propsData?.unit || "",
  stock: propsData?.stock || 0,
  price: propsData?.price || 0,
  discount: propsData?.discount || 0,
  description: propsData?.description || "",
  more_details: propsData?.more_details || {},
  image: propsData?.image || "",
  });
  const [imageloading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectCategory, setselectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const [morefield, setMoreField] = useState([]);
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");
   const [isOpen, setIsOpen] = useState(true);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };
 const handleClose = () => {
    
    setIsOpen(false); 
  };
  if (!isOpen) return null; 
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;

    setData((preve) => ({
      ...preve,
      image: [...preve.image, imageUrl],
    }));
    setImageLoading(false);
  };
  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };
  const handleRemoveCategory = async (index) => {
    data.categoryId.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };
  const handleRemoveSubCategory = async (index) => {
    data.sub_categoryId.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };
  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: "",
        },
      };
    });
    setFieldName("");
    setOpenAddField(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data", data);
    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        successAlert(responseData.message);
        fetchProductData()
        setData({
          name: "",
          email: "",
          categoryId: [],
          sub_categoryId: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
          image: [],
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };


  return (
    <section className="fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70">
      <div className="bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]">
        <section>
          <div className="p-2 bg-white shadow-md flex items-center justify-between">
            <h2 className="font-semibold">Upload Product</h2>
             <button  onClick={handleClose}>
              <IoClose size={20}/>
            </button>
          </div>

          <div className="grid p-3">
            <form className="grid gap-3 " onSubmit={handleSubmit}>
              <div className="grid gap-1">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter a product name"
                  value={data.name}
                  onChange={handleChange}
                  required
                  className="bg-blue-100 p-2 outline-none border focus-within:border-blue-500 rounded"
                />
              </div>

              <div className="grid gap-1">
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Enter a product description"
                  value={data.description}
                  onChange={handleChange}
                  rows={3}
                  className="bg-blue-100 p-2 outline-none border focus-within:border-blue-500 rounded resize-none"
                />
              </div>

              <div>
                <p>Image</p>
                <label
                  htmlFor="productImage"
                  className="bg-blue-100 h-25 border rounded flex justify-center items-center cursor-pointer"
                >
                  <div className="text-center flex justify-center items-center flex-col">
                    {imageloading ? (
                      <Loading />
                    ) : (
                      <>
                        <FaCloudUploadAlt size={28} />
                        <p>Upload Image</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    id="productImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUploadImage}
                  />
                </label>

                <div className=" gap-2 my-2">
                  {Array.isArray(data.image) && data.image.length > 0 ? (
                    data.image.map((img, index) => (
                      <div
                        key={img + index}
                        className="h-20 w-20 min-w-20 bg-blue-100 border relative group"
                      >
                        <img
                          src={img}
                          alt={`product-${index}`}
                          className="w-full h-full object-scale-down cursor-pointer"
                          onClick={() => setViewImageURL(img)}
                        />
                        <div
                          onClick={() => handleDeleteImage(index)}
                          className="absolute bottom-0 right-0 bg-red-500 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer"
                        >
                          <MdDelete />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No image found</p>
                  )}
                </div>
              </div>
              <div>
                <label>Category</label>
                <div>
                  <select
                    className="bg-blue-100 w-full p-2 rounded "
                    value={selectCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      const category = allCategory.find(
                        (el) => el._id === value
                      );
                      setData((preve) => {
                        return {
                          ...preve,
                          categoryId: [...preve.categoryId, category],
                        };
                      });
                      setselectCategory("");
                    }}
                  >
                    <option value={""}>Select Category</option>
                    {allCategory.map((c, index) => {
                      return <option value={c?._id}>{c.name}</option>;
                    })}
                  </select>
                  <div>
                    {data.categoryId.map((c, index) => {
                      return (
                        <div
                          key={c._id + index + "product section"}
                          className="text-sm flex items-center gap-1 bg-blue-100 mt-1"
                        >
                          <p>{c.name}</p>
                          <div
                            className="hover:text-red-500 cursor-pointer"
                            onClick={() => handleRemoveCategory(index)}
                          >
                            <IoClose size={20} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div>
                <label>Sub Category</label>
                <div>
                  <select
                    className="bg-blue-100 w-full p-2 rounded "
                    value={selectSubCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      const subCategory = allSubCategory.find(
                        (el) => el._id === value
                      );
                      setData((preve) => {
                        return {
                          ...preve,
                          sub_categoryId: [
                            ...preve.sub_categoryId,
                            subCategory,
                          ],
                        };
                      });
                      setSelectSubCategory("");
                    }}
                  >
                    <option value={""}>Select Sub Category</option>
                    {allSubCategory.map((c, index) => {
                      return <option value={c?._id}>{c.name}</option>;
                    })}
                  </select>
                  <div className="flex flex-wrap gap-3">
                    {data.sub_categoryId.map((c, index) => {
                      return (
                        <div
                          key={c._id + index + ""}
                          className="text-sm flex items-center gap-1 bg-blue-100 mt-1"
                        >
                          <p>{c.name}</p>
                          <div
                            className="hover:text-red-500 cursor-pointer"
                            onClick={() => handleRemoveSubCategory(index)}
                          >
                            <IoClose size={20} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="grid gap-1">
                <label htmlFor="unit">Unit</label>
                <input
                  type="text"
                  name="unit"
                  id="unit"
                  placeholder="Enter a product unit"
                  value={data.unit}
                  onChange={handleChange}
                  required
                  className="bg-blue-100 p-2 outline-none border focus-within:border-blue-500 rounded"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="stock"> Number of Stock</label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  placeholder="Enter a product stock"
                  value={data.stock}
                  onChange={handleChange}
                  required
                  className="bg-blue-100 p-2 outline-none border focus-within:border-blue-500 rounded"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Enter a product price"
                  value={data.price}
                  onChange={handleChange}
                  required
                  className="bg-blue-100 p-2 outline-none border focus-within:border-blue-500 rounded"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="discount">Discount</label>
                <input
                  type="number"
                  name="discount"
                  id="discount"
                  placeholder="Enter a product discount"
                  value={data.discount}
                  onChange={handleChange}
                  required
                  className="bg-blue-100 p-2 outline-none border focus-within:border-blue-500 rounded"
                />
              </div>
              {/** add more filed */}

              <div>
                {Object.keys(data?.more_details).map((k, index) => {
                  return (
                    <div className="grid gap-1">
                      <label htmlFor={k}>{k}</label>
                      <input
                        type="text"
                        id={k}
                        value={data.more_details[k]}
                        onChange={(e) => {
                          const value = e.target.value;
                          setData((preve) => {
                            return {
                              ...preve,
                              more_details: {
                                ...preve.more_details,
                                [k]: value,
                              },
                            };
                          });
                        }}
                        required
                        className="bg-blue-100 p-2 outline-none border focus-within:border-blue-500 rounded"
                      />
                    </div>
                  );
                })}
              </div>
              <div
                onClick={() => setOpenAddField(true)}
                className="inline-block hover:bg-blue-500 bg-white py-1 px-3 text-center w-32 font-semibold border border-blue-500 "
              >
                Add Fileds
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 py-2 rounded font-semibold">
                Update Product
              </button>
            </form>
          </div>
          {ViewImageURL && (
            <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
          )}
          {openAddField && (
            <AddFieldComponent
              close={() => setOpenAddField(false)}
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              submit={handleAddField}
            />
          )}
        </section>
      </div>
    </section>
  );
};

export default EditProductAdmin;
