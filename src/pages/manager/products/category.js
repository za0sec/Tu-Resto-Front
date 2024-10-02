import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/router";
import ManagerNavbar from "../../../components/ManagerNavbar";
import apiClient from "/utils/apiClient";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import withAuth from "../../../components/withAuth";
import NewCategoryDialog from "./newCategoryDialog";
import NewProductDialog from "./newProductDialog";
import DeleteModal from "../../../components/Delete";
import ProductPreview from "./ProductPreview";

function CategoryProducts() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        discount: 0,
        photo: null,
    });
    const [editingProductId, setEditingProductId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: "",
        description: "",
        icon: "",
        photo: null,
    });
    const router = useRouter();
    const [restaurantId, setRestaurantId] = useState(null);

    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRestaurantId(decodedToken.restaurant_id);
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                setError("Error al obtener la información del restaurante");
            }
        } else {
            setError("No se encontró el token de acceso");
        }
    }, []);

    useEffect(() => {
        if (restaurantId) {
            fetchCategories();
        }
    }, [restaurantId]);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get(
                `/restaurant/${restaurantId}/categories`
            );
            if (response.status === 200) {
                setCategories(response.data);
                if (response.data.length > 0) {
                    setSelectedCategory(response.data[0]);
                }
            } else {
                setError("Error al obtener las categorías");
            }
        } catch (error) {
            console.error("Error al obtener datos:", error);
            setError("Error al cargar los datos");
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "file") {
            setNewProduct({ ...newProduct, [name]: e.target.files[0] });
        } else {
            setNewProduct({ ...newProduct, [name]: value });
        }
    };

    const handleCategoryInputChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "file") {
            setNewCategory({ ...newCategory, [name]: e.target.files[0] });
        } else {
            setNewCategory({ ...newCategory, [name]: value });
        }
    };

    const handleSubmit = async (formData) => {
        try {
            const newFormData = new FormData();
            newFormData.append("name", formData.name);
            newFormData.append("description", formData.description);
            newFormData.append("price", parseFloat(formData.price).toFixed(2));
            newFormData.append("discount", parseInt(formData.discount));
            newFormData.append("category", selectedCategory.id);
            if (formData.photo) {
                newFormData.append("photo", formData.photo);
            }

            const response = await apiClient.post(
                "/product/create",
                newFormData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 201) {
                const newProduct = response.data; 
                const updatedCategories = categories.map((category) => {
                    if (category.id === selectedCategory.id) {
                        return {
                            ...category,
                            products: [...category.products, newProduct],
                        };
                    }
                    return category;
                });
    
                setCategories(updatedCategories); 
                setSelectedCategory((prevCategory) => ({
                    ...prevCategory,
                    products: [...prevCategory.products, newProduct],
                }));
    
                setIsModalOpen(false);
                setNewProduct({
                    name: "",
                    description: "",
                    price: "",
                    discount: 0,
                    photo: null,
                });
            }
        } catch (error) {
            console.error("Error al crear el producto:", error);
            if (error.response) {
                console.error("Detalles del error:", error.response.data);
            }
        }
    };

    const handleCategorySubmit = async (formData) => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("icon", formData.icon);

            if (formData.photo) {
                const byteString = atob(formData.photo.split(",")[1]);
                const mimeString = formData.photo
                    .split(",")[0]
                    .split(":")[1]
                    .split(";")[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                const file = new File([blob], "photo.jpg", {
                    type: mimeString,
                });

                formDataToSend.append("photo", file);
            }

            const response = await apiClient.post(
                `/restaurant/${restaurantId}/category/create`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 201) {
                const newCategory = response.data;
                await fetchCategories();
                setSelectedCategory(newCategory);
                setIsCategoryModalOpen(false);
                setNewCategory({
                    name: "",
                    description: "",
                    icon: "",
                    photo: null,
                });
            }
        } catch (error) {
            console.error("Error al crear la categoría:", error);
        }
    };

    const toggleProductEdit = (productId) => {
        setEditingProductId(editingProductId === productId ? null : productId);
    };

    const handleProductUpdate = async (productId, updatedData) => {
        try {
            console.log("Datos recibidos para actualizar:", updatedData); // Para depuración

            const response = await apiClient.patch(
                `/product/${productId}`,
                updatedData
            );
            if (response.status === 200) {
                setEditingProductId(null);
                await fetchCategories(); // Esperar a que se complete la actualización
                console.log("Producto actualizado:", response.data); // Verificar la respuesta
            } else {
                console.error("Error en la respuesta:", response);
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            if (error.response) {
                console.error("Detalles del error:", error.response.data);
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
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Error
                    </h2>
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
            const response = await apiClient.delete(
                `/product/${productToDelete.id}`
            );
            if (response.status === 204) {
                // Update the local state to remove the deleted product
                const updatedCategories = categories.map((category) => {
                    if (category.id === selectedCategory.id) {
                        return {
                            ...category,
                            products: category.products.filter(
                                (product) => product.id !== productToDelete.id
                            ),
                        };
                    }
                    return category;
                });

                setCategories(updatedCategories);
                setSelectedCategory((prevCategory) => ({
                    ...prevCategory,
                    products: prevCategory.products.filter(
                        (product) => product.id !== productToDelete.id
                    ),
                }));

                setProductToDelete(null);
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            if (error.response) {
                console.error("Detalles del error:", error.response.data);
            }
        }
    };
    // const handleDeleteConfirm = async () => {
    //     try {
    //         await apiClient.delete(`/product/${productToDelete.id}/`);
    //         setIsDeleteModalOpen(false);
    //         setProductToDelete(null);
    //         fetchCategories();
    //     } catch (error) {
    //         console.error("Error al eliminar el producto:", error);
    //     }
    // };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <ManagerNavbar />
            <div className="flex-grow flex">
                {/* Sidebar */}
                <div className="w-64 bg-white shadow-md py-10">
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Categorías
                            </h2>
                            <button
                                onClick={() => setIsCategoryModalOpen(true)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded-full text-sm transition-all duration-300 transform hover:rotate-90 hover:scale-110">
                                <FaPlus className="transition-colors duration-300 hover:rotate-90" />
                            </button>
                        </div>
                        <ul>
                            {categories.map((category) => (
                                <li
                                    key={category.id}
                                    className={`cursor-pointer p-2 rounded ${
                                        selectedCategory?.id === category.id
                                            ? "bg-blue-100"
                                            : "hover:bg-gray-100"
                                    }`}
                                    onClick={() =>
                                        handleCategoryClick(category)
                                    }>
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Main content */}
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Productos de {selectedCategory?.name}
                        </h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center group">
                            <FaPlus className="mr-2 transition-transform duration-300 group-hover:rotate-90 " />{" "}
                            Agregar Producto
                        </button>
                    </div>

                    <div className="bg-white shadow-md rounded my-6">
                        <table className="min-w-max w-full table-auto">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">
                                        Nombre
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Descripción
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Precio
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Descuento
                                    </th>
                                    <th className="py-3 px-6 text-center">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {selectedCategory?.products.map((product) => (
                                    <ProductPreview
                                        key={product.id}
                                        product={product}
                                        onEdit={handleProductUpdate}
                                        onDelete={handleDeleteClick}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {isModalOpen && (
                <NewProductDialog
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                />
            )}

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemName="este producto"
            />

            {isCategoryModalOpen && (
                <NewCategoryDialog
                    isOpen={isCategoryModalOpen}
                    onClose={() => setIsCategoryModalOpen(false)}
                    onSubmit={handleCategorySubmit}
                />
            )}
        </div>
    );
}

export default withAuth(CategoryProducts, ["Manager"]);
