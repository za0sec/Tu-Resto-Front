import React, { useState } from 'react';

const NewEmployeeDialog = ({ isOpen, onClose, onSubmit, branches, isLoading }) => {
    const [newEmployee, setNewEmployee] = useState({
        user: {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
        },
        phone: '',
        branch: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name in newEmployee.user) {
            setNewEmployee(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    [name]: value
                }
            }));
        } else {
            setNewEmployee(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(newEmployee);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
                                    Nombre
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="first_name"
                                    name="first_name"
                                    value={newEmployee.user.first_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
                                    Apellido
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="last_name"
                                    name="last_name"
                                    value={newEmployee.user.last_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                    Usuario
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="username"
                                    name="username"
                                    value={newEmployee.user.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    name="email"
                                    value={newEmployee.user.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                    Teléfono
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="phone"
                                    name="phone"
                                    value={newEmployee.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="branch">
                                    Sucursal
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="branch"
                                    name="branch"
                                    value={newEmployee.branch}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleccione una sucursal</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline relative"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </span>
                                            <span className="opacity-0">Cargando...</span>
                                        </>
                                    ) : (
                                        'Agregar Empleado'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewEmployeeDialog;
