import { useState, useEffect } from 'react';
import React from 'react';
import { useRouter } from 'next/router';
import ManagerNavbar from '../../components/ManagerNavbar';
import apiClient from "../../utils/apiClient";
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function CategoryProducts() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', discount: 0, photo: null });
    const [editingProductId, setEditingProductId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: '', photo: null });
    const router = useRouter();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get('/categories');
            if (response.status === 200) {
                setCategories(response.data);
                if (response.data.length > 0) {
                    setSelectedCategory(response.data[0]);
                }
            } else {
                setError('Error al obtener las categorías');
            }
        } catch (error) {
            console.error('Error al obtener datos:', error);
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            setNewProduct({ ...newProduct, [name]: e.target.files[0] });
        } else {
            setNewProduct({ ...newProduct, [name]: value });
        }
    };

    const handleCategoryInputChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            setNewCategory({ ...newCategory, [name]: e.target.files[0] });
        } else {
            setNewCategory({ ...newCategory, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('description', newProduct.description);
            formData.append('price', parseFloat(newProduct.price).toFixed(2));
            formData.append('discount', parseInt(newProduct.discount));
            formData.append('category', selectedCategory.id);
            if (newProduct.photo) {
                formData.append('photo', newProduct.photo);
            }

            const response = await apiClient.post('/product/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                setIsModalOpen(false);
                fetchCategories();
                setNewProduct({ name: '', description: '', price: '', discount: 0, photo: null });
            }
        } catch (error) {
            console.error('Error al crear el producto:', error);
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
            }
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newCategory.name);
            formData.append('description', newCategory.description);
            formData.append('icon', newCategory.icon);

            if (newCategory.photo) {
                const byteString = atob(newCategory.photo.split(',')[1]);
                const mimeString = newCategory.photo.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                const file = new File([blob], "photo.jpg", { type: mimeString });

                formData.append('photo', file);
            }

            const response = await apiClient.post('/category/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                setIsCategoryModalOpen(false);
                fetchCategories();
                setNewCategory({ name: '', description: '', icon: '', photo: null });
            }
        } catch (error) {
            console.error('Error al crear la categoría:', error);
        }
    };

    const toggleProductEdit = (productId) => {
        setEditingProductId(editingProductId === productId ? null : productId);
    };

    const handleProductUpdate = async (e, productId) => {
        e.preventDefault();
        try {
            const form = e.target;
            const updatedProduct = {
                name: form.name.value,
                description: form.description.value,
                price: parseFloat(form.price.value).toFixed(2),
                discount: parseInt(form.discount.value),
            };

            console.log('Datos enviados:', updatedProduct);  // Para depuración

            const response = await apiClient.patch(`/product/${productId}`, updatedProduct);
            if (response.status === 200) {
                setEditingProductId(null);
                fetchCategories();
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const handleDeleteClick = (e, product) => {
        e.stopPropagation();
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await apiClient.delete(`/product/${productToDelete.id}/`);
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
            fetchCategories();
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <ManagerNavbar />
            <div className="flex-grow flex">
                {/* Sidebar */}
                <div className="w-64 bg-white shadow-md py-10">
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Categorías</h2>
                            <button
                                onClick={() => setIsCategoryModalOpen(true)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm transition-all duration-300 transform hover:rotate-90 hover:scale-110"
                            >
                                <FaPlus className="transition-colors duration-300 hover:text-yellow-300" />
                            </button>
                        </div>
                        <ul>
                            {categories.map((category) => (
                                <li
                                    key={category.id}
                                    className={`cursor-pointer p-2 rounded ${selectedCategory?.id === category.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Main content */}
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Productos de {selectedCategory?.name}</h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                        >
                            <FaPlus className="mr-2" /> Agregar Producto
                        </button>
                    </div>

                    <div className="bg-white shadow-md rounded my-6">
                        <table className="min-w-max w-full table-auto">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Nombre</th>
                                    <th className="py-3 px-6 text-left">Descripción</th>
                                    <th className="py-3 px-6 text-left">Precio</th>
                                    <th className="py-3 px-6 text-left">Descuento</th>
                                    <th className="py-3 px-6 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {selectedCategory?.products.map((product) => (
                                    <React.Fragment key={product.id}>
                                        <tr
                                            className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => toggleProductEdit(product.id)}
                                        >
                                            <td className="py-3 px-6 text-left whitespace-nowrap">
                                                <span>{product.name}</span>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <span>{product.description}</span>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <span>${product.price}</span>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <span>{product.discount}%</span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex item-center justify-center">
                                                    <button
                                                        className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                                                        onClick={(e) => handleDeleteClick(e, product)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <AnimatePresence>
                                            {editingProductId === product.id && (
                                                <motion.tr
                                                    className="bg-gray-50"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <td colSpan="5" className="py-3 px-6">
                                                        <form onSubmit={(e) => handleProductUpdate(e, product.id)}>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    defaultValue={product.name}
                                                                    className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    name="description"
                                                                    defaultValue={product.description}
                                                                    className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    name="price"
                                                                    defaultValue={product.price}
                                                                    className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    name="discount"
                                                                    defaultValue={product.discount}
                                                                    className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                                                />
                                                            </div>
                                                            <div className="mt-4 flex justify-end">
                                                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                                                                    Guardar
                                                                </button>
                                                                <button type="button" onClick={() => setEditingProductId(null)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
                                                                    Cancelar
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">Agregar Nuevo Producto</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newProduct.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={newProduct.price}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">Descuento (%)</label>
                                <input
                                    type="number"
                                    id="discount"
                                    name="discount"
                                    value={newProduct.discount}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">Foto del Producto</label>
                                <input
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    accept="image/*"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Agregar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirmar eliminación</h2>
                        <p className="mb-4">¿Estás seguro de que quieres eliminar este producto?</p>
                        <div className="flex justify-end">
                            <button
                                onClick={handleDeleteConfirm}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">Agregar Nueva Categoría</h2>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleCategorySubmit} className="p-6">
                            <div className="mb-4">
                                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Categoría</label>
                                <input
                                    type="text"
                                    id="categoryName"
                                    name="name"
                                    value={newCategory.name}
                                    onChange={handleCategoryInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    id="categoryDescription"
                                    name="description"
                                    value={newCategory.description}
                                    onChange={handleCategoryInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="categoryIcon" className="block text-sm font-medium text-gray-700 mb-2">Icono</label>
                                <input
                                    type="text"
                                    id="categoryIcon"
                                    name="icon"
                                    value={newCategory.icon}
                                    onChange={handleCategoryInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="categoryPhoto" className="block text-sm font-medium text-gray-700 mb-2">Foto de la Categoría</label>
                                <input
                                    type="file"
                                    id="categoryPhoto"
                                    name="photo"
                                    onChange={handleCategoryInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                    accept="image/*"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Agregar Categoría
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
