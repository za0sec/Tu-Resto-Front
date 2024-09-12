import React, { useState, useEffect } from 'react';
import EmployeeNavbar from '../components/EmployeeNavbar';
import Product from '../components/Product';
import apiClient from "@/pages/utils/apiClient";
import withAuth from '@/pages/components/withAuth';

function Menu() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', categoryId: '' });

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        // try {
        //     const response = await apiClient.get('/categories');
        //     setCategories(response.data);
        // } catch (error) {
        //     console.error('Error fetching categories:', error);
        // }
    };

    const fetchProducts = async () => {
        // try {
        //     const response = await apiClient.get('/products');
        //     setProducts(response.data);
        // } catch (error) {
        //     console.error('Error fetching products:', error);
        // }
    };

    const createCategory = async () => {
        // try {
        //     const response = await apiClient.post('/categories', { name: newCategory });
        //     setCategories([...categories, response.data]);
        //     setNewCategory('');
        // } catch (error) {
        //     console.error('Error creating category:', error);
        // }
    };

    const createProduct = async () => {
        // try {
        //     const response = await apiClient.post('/products', newProduct);
        //     if (response.data) {
        //         setProducts([...products, response.data]);
        //         setNewProduct({ name: '', description: '', price: '', categoryId: '' });
        //         console.log('Product created successfully:', response.data);
        //     } else {
        //         console.error('Error creating product: No data returned from server');
        //     }
        // } catch (error) {
        //     console.error('Error creating product:', error);
        //     // You might want to show an error message to the user here
        // }
    };

    const groupProductsByCategory = () => {
        const groupedProducts = {};
        categories.forEach(category => {
            groupedProducts[category.name] = products.filter(product => product.categoryId === category.id);
        });
        return groupedProducts;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <EmployeeNavbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Restaurant Menu</h1>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Create Category</h2>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Category Name"
                        className="mr-2 p-2 border rounded"
                    />
                    <button onClick={createCategory} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Create Category
                    </button>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Create Product</h2>
                    <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Product Name"
                        className="mr-2 p-2 border rounded"
                    />
                    <input
                        type="text"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Description"
                        className="mr-2 p-2 border rounded"
                    />
                    <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="Price"
                        className="mr-2 p-2 border rounded"
                    />
                    <select
                        value={newProduct.categoryId}
                        onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                        className="mr-2 p-2 border rounded"
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <button onClick={createProduct} className="bg-green-500 text-white px-4 py-2 rounded">
                        Create Product
                    </button>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Products</h2>
                    <ul className="list-none">
                        {products.map(product => (
                            <li key={product.id} className="mb-4 p-4 bg-white rounded shadow">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-semibold">{product.name}</h3>
                                        <p className="text-gray-600">{product.description}</p>
                                    </div>
                                    <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="menu-list">
                    {Object.entries(groupProductsByCategory()).map(([category, categoryProducts]) => (
                        <div key={category} className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
                            <ul className="list-none">
                                {categoryProducts.map(product => (
                                    <li key={product.id} className="mb-4 p-4 bg-white rounded shadow">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-semibold">{product.name}</h3>
                                                <p className="text-gray-600">{product.description}</p>
                                            </div>
                                            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default withAuth(Menu, ['Manager']);
