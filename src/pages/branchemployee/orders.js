import { useState, useEffect } from 'react';
import EmployeeNavbar from '../components/EmployeeNavbar';
import { Dialog } from '@headlessui/react';
import apiClient from "@/pages/utils/apiClient";
import { FaCocktail, FaHamburger, FaIceCream } from 'react-icons/fa'; // Import icons

export default function CreateOrder() {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Bebidas', icon: FaCocktail, color: 'bg-blue-200' },
        { id: 2, name: 'Platos principales', icon: FaHamburger, color: 'bg-green-200' },
        { id: 3, name: 'Postres', icon: FaIceCream, color: 'bg-pink-200' },
    ]);
    const [products, setProducts] = useState([
        { id: 1, name: 'Coca-Cola', price: 2.5, categoryId: 1, description: 'Refresco carbonatado', ingredients: ['Agua carbonatada', 'Azúcar', 'Colorante caramelo', 'Ácido fosfórico', 'Aromas naturales'], extras: [] },
        { id: 2, name: 'Hamburguesa', price: 8.99, categoryId: 2, description: 'Hamburguesa clásica con carne de res', ingredients: ['Pan', 'Carne de res', 'Lechuga', 'Tomate', 'Queso', 'Salsa especial'], extras: ['Bacon', 'Huevo frito', 'Queso extra'] },
        { id: 3, name: 'Helado', price: 3.5, categoryId: 3, description: 'Helado cremoso de vainilla', ingredients: ['Leche', 'Crema', 'Azúcar', 'Yemas de huevo', 'Extracto de vainilla'], extras: ['Salsa de chocolate', 'Nueces', 'Chispas de chocolate'] },
    ]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [additionalComments, setAdditionalComments] = useState('');
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [order, setOrder] = useState([]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
        setSelectedExtras([]);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedProduct(null);
        setQuantity(1);
        setAdditionalComments('');
        setSelectedExtras([]);
    };

    const handleAddToOrder = () => {
        const newOrderItem = {
            ...selectedProduct,
            quantity: quantity,
            comments: additionalComments,
            extras: selectedExtras
        };
        setOrder([...order, newOrderItem]);
        handleDialogClose();
    };

    const handleExtraToggle = (extra) => {
        setSelectedExtras(prevExtras =>
            prevExtras.includes(extra)
                ? prevExtras.filter(e => e !== extra)
                : [...prevExtras, extra]
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <EmployeeNavbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Create New Order</h1>

                <div className="grid grid-cols-4 gap-2 mb-8">
                    {categories.map(category => (
                        <div
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className={`${category.color} p-2 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow ${selectedCategory?.id === category.id ? 'border-2 border-blue-500' : ''} flex flex-col items-center justify-center aspect-square`}
                        >
                            {category.icon && <category.icon className="text-2xl mb-1" />}
                            <h2 className="text-sm font-semibold text-center">{category.name}</h2>
                        </div>
                    ))}
                </div>

                {selectedCategory && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">{selectedCategory.name}</h2>
                        <div className="grid grid-cols-4 gap-2">
                            {products
                                .filter(product => product.categoryId === selectedCategory.id)
                                .map(product => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductClick(product)}
                                        className="bg-white p-2 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <h3 className="font-semibold text-sm">{product.name}</h3>
                                        <p className="text-xs">${product.price.toFixed(2)}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}

                {isDialogOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center pt-16">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold">{selectedProduct?.name}</h3>
                                <p className="text-3xl font-bold text-green-600">${selectedProduct?.price.toFixed(2)}</p>
                            </div>
                            <p className="mb-4 text-gray-600">{selectedProduct?.description}</p>

                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Ingredientes:</h4>
                                <p>{selectedProduct?.ingredients.join(', ')}</p>
                            </div>

                            <div className="mb-4 flex items-center">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 bg-gray-200 rounded-l">-</button>
                                <span className="px-4 py-1 bg-gray-100">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 bg-gray-200 rounded-r">+</button>
                            </div>

                            {selectedProduct?.extras.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">Extras:</h4>
                                    {selectedProduct.extras.map((extra, index) => (
                                        <label key={index} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedExtras.includes(extra)}
                                                onChange={() => handleExtraToggle(extra)}
                                                className="mr-2"
                                            />
                                            {extra}
                                        </label>
                                    ))}
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block mb-2 font-semibold">Comentarios adicionales:</label>
                                <textarea
                                    value={additionalComments}
                                    onChange={(e) => setAdditionalComments(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleDialogClose}
                                    className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddToOrder}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Agregar al pedido
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {order.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Pedido actual</h2>
                        {order.map((item, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow mb-4">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p>Cantidad: {item.quantity}</p>
                                <p>Precio: ${(item.price * item.quantity).toFixed(2)}</p>
                                {item.extras.length > 0 && <p>Extras: {item.extras.join(', ')}</p>}
                                {item.comments && <p>Comentarios: {item.comments}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
