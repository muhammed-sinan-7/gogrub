import axios from "axios";
import { ShoppingBag, ShoppingBagIcon, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Product() {
    const { id } = useParams();
    const [datas, setDatas] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                let res = await axios.get(`http://localhost:3005/product/${id}`);
                console.log(res.data);
                setDatas(res.data)
            } catch (error) {
                setDatas("Item not Available")
            }
        }
        fetchData();
    },[id])

    return (
        <section className="py-8 bg-white text-gray-800  h-[100vh]  antialiased">
            <h1>Single Product</h1>
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                

                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:mt-50 xl:gap-16">
                        

                            {/* Image */ }
                            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto ">
                                <img
                                    className="w-180  shadow-2xl shadow-gray-700 rounded-2xl "
                                    src={datas.img_url}

                                />
                            </div>

                            {/* Content */ }
                            <div className="mt-6 sm:mt-8 lg:mt-0">
                                <h1 className="lg:text-4xl font-semibold text-gray-900 sm:text-4xl ">
                                    {datas.name}
                                </h1>
                                <h1 className=" font-bold text-amber-600  sm:text-3xl lg:mt-5">
                                    <span className="text-gray-800">Estimate Time :</span> {datas.est_time}
                                </h1>
                                     {/* Buttons */}
                               

                                <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

                                {/* Description */}
                                <p className="mb-6 text-xm sm:text-xl dark:text-gray-600">
                                    {datas.description}
                                </p>

                                <div className="flex pt-5 gap-10 text-xl text-gray-100">
                                    <button className="bg-amber-400 pl-5 pr-5 pt-3 pb-3 transition duration-200 rounded-[50px] flex gap-3 items-center hover:bg-amber-500"><span><ShoppingCart/></span>Add To Cart</button>
                                    <button className="bg-amber-500 pl-5 pr-5 pt-3 pb-3 transition duration-200 rounded-[50px] flex gap-3 items-center hover:bg-amber-600"><span><ShoppingBagIcon/></span>Buy Now</button>
                                    
                                </div>


                            </div>
                    
                    </div>
                
            </div>
        </section>
    );
}

export default Product;
