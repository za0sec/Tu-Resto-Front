import React, { useState, useEffect } from 'react';
import apiClient from "@/pages/utils/apiClient";

export default function OrderModal({ isModalOpen, formData, handleInputChange, handleSubmit, closeModal, branchId }) {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await apiClient.get(`/branch/${branchId}/staff`);
                // console.log(response.data);
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        if (branchId) {
            fetchEmployees();
        }
    }, [branchId]);

    if (!isModalOpen) return null; // Si el modal no está abierto, no se renderiza nada.

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <h2 className="text-2xl font-bold mb-4">Crear Nueva Orden</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orderType">
                            Tipo de Orden
                        </label>
                        <select
                            id="orderType"
                            name="orderType"
                            value={formData.orderType}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Seleccionar tipo de orden</option>
                            <option value="takeaway">Para llevar</option>
                            <option value="delivery">Entrega a domicilio</option>
                            <option value="table">En mesa</option>
                        </select>
                    </div>

                    {/* Responsable Asignado */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="branch_staff">
                            Responsable Asignado
                        </label>
                        <select
                            id="branch_staff"
                            name="branch_staff"
                            value={formData.branch_staff}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Seleccionar responsable</option>
                            {employees.map(employee => (
                                <option key={employee.id} value={employee.id}>{employee.user.first_name} {employee.user.last_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Nombre del Consumidor */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="consumer">
                            Nombre del Consumidor
                        </label>
                        <input
                            type="text"
                            id="consumer"
                            name="consumer"
                            value={formData.consumer}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nombre del consumidor"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Crear Orden
                        </button>
                        <button
                            onClick={closeModal}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>

                {/* Botón de cerrar */}
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    &#x2715;
                </button>
            </div>
        </div>
    );
}
