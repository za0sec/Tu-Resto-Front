
import React, { useState } from 'react';

const NewProductDialog = ({ isOpen, onClose, onSubmit }) => {
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        discount: 0,
        photo: null
    });

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newProduct);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Agregar Nuevo Producto</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
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
    );
};

export default NewProductDialog;
