import React, { useState } from 'react';

const NewCategoryDialog = ({ isOpen, onClose, onSubmit }) => {
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        icon: '',
        photo: null
    });

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setNewCategory(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newCategory);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Agregar Nueva Categoría</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Categoría</label>
                        <input
                            type="text"
                            id="categoryName"
                            name="name"
                            value={newCategory.name}
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="categoryPhoto" className="block text-sm font-medium text-gray-700 mb-2">Foto de la Categoría</label>
                        <input
                            type="file"
                            id="categoryPhoto"
                            name="photo"
                            onChange={handleInputChange}
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
    );
};

export default NewCategoryDialog;
