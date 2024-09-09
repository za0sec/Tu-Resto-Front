import React, { useState, useEffect } from 'react';
// import apiClient from '@/pages/utils/apiClient';

const Product = ({ id }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        // Fetch product details
        // const fetchProduct = async () => {
        //     try {
        //         const response = await apiClient.get(`/product/${id}`);
        //         setProduct(response.data);
        //     } catch (error) {
        //         console.error('Error fetching product:', error);
        //     }
        // };
        // fetchProduct();
    }, [id]);

    if (!product) return <div>Loading...</div>;

    return (
        <div className="product">
            <h2 className="product-name">{product.name}</h2>
            {product.photo && <img src={product.photo} alt={product.name} className="product-photo" />}
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price.toFixed(2)}</p>
            {product.discount > 0 && <p className="product-discount">Discount: {product.discount}%</p>}
            {product.category && <p className="product-category">Category: {product.category.name}</p>}
        </div>
    );
};

export default Product;
