import React, { useEffect, useState } from "react";
import "./Categories.scss";
import Product from "../../components/product/Product";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { axiosClient } from "../../utils/axiosClient";

function Categories() {
    const navigate = useNavigate();
    const params = useParams();

    const [categoryId, setCategoryId] = useState("");
    const categories = useSelector((state) => state.categoryReducer.categories);

    const [products, setProducts] = useState([]);

    const sortOptions = [
        {
            key: "newest-first",
            value: "Newest First",
            sort: "createdAt",
        },
        {
            key: "price-asc",
            value: "Price - Low to High",
            sort: "price:asc",
        },
        { key: "price-desc", value: "Price - High to Low", sort: "price:desc" },
    ];

    const [sortBy, setSortBy] = useState(sortOptions[0].sort);

    async function fetchProductsByCategory() {
        const url = params.categoryId
            ? `/products?populate=image&filters[category][key][$eq]=${params.categoryId}&sort=${sortBy}`
            : `/products?populate=image&sort=${sortBy}`;
        const response = await axiosClient.get(url);
        // console.log("Products:", response.data.data);
        setProducts(response.data.data);
    }

    useEffect(() => {
        setCategoryId(params.categoryId);
        fetchProductsByCategory();
    }, [params, sortBy]);

    function updateCategory(e) {
        // console.log(e.target.value);
        navigate(`/category/${e.target.value}`);
    }

    function handleSortFunction(e) {
        const sortKey = e.target.value;
        const sortOption = sortOptions.find((option) => option.key === sortKey);
        const sortByVal = sortOption?.sort || sortOptions[0].sort;
        setSortBy(sortByVal);
    }

    return (
        <div className="Categories">
            <div className="container">
                <div className="header">
                    <div className="info">
                        <h2>Explore All prints and Artwork</h2>
                        <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing
                            elit. At, earum!
                        </p>
                    </div>

                    <div className="sort-by">
                        <div className="sort-by-container">
                            <h3 className="sort-by-text">Sort By</h3>

                            <select
                                className="select-sort-by"
                                name="sort-by"
                                id="sort-by"
                                onChange={handleSortFunction}
                            >
                                {sortOptions?.map((option) => (
                                    <option key={option.key} value={option.key}>
                                        {option.value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="filter-box">
                        <div className="category-filter">
                            <h3>Category</h3>
                            {categories.map((category) => (
                                <div key={category.id} className="filter-radio">
                                    <input
                                        name="category"
                                        type="radio"
                                        value={category?.key}
                                        id={category?.id}
                                        onChange={updateCategory}
                                        checked={categoryId === category?.key}
                                    />
                                    <label htmlFor={category?.id}>
                                        {category?.title}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="products-box">
                        {products?.map((product) => (
                            <Product key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Categories;
