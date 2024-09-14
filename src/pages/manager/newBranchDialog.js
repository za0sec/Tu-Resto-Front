import React, { useState } from 'react';

const NewBranchDialog = ({ isOpen, onClose, onSubmit }) => {
    const [newBranch, setNewBranch] = useState({
        name: '',
        address: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBranch(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newBranch);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Añadir Nueva Sucursal</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                        <input type="text" id="name" name="name" value={newBranch.name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Dirección</label>
                        <input type="text" id="address" name="address" value={newBranch.address} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
                        <input type="tel" id="phone" name="phone" value={newBranch.phone} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-primary hover:bg-primaryDark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Crear Sucursal
                        </button>
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewBranchDialog;
