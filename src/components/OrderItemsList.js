import React, { useEffect } from 'react';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const OrderItemsList = ({ selectedOrder, handleUpdateOrder, openDeleteDialog }) => {

    if (!selectedOrder) {
        return (
            <div className="p-6 text-center text-gray-500">
                <FaTimes className="mx-auto text-4xl mb-4" />
                <p className="text-xl">Seleccione un pedido para ver los detalles</p>
            </div>
        );
    }
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Detalles del Pedido #{selectedOrder.id}</h2>
                <button
                    onClick={() => handleUpdateOrder(selectedOrder.id)}
                    className="bg-secondary text-white px-4 py-2 rounded-full transition hover:bg-secondaryDark duration-300 flex items-center"
                >
                    <FaEdit className="mr-2" /> Editar Orden
                </button>
            </div>
            <div className="rounded-lg">
                <h3 className="text-xl font-medium mb-4 text-gray-700">Ítems del pedido:</h3>
                <div className="border-b border-gray-200 mb-4"></div>
                <ul className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                        <li key={index} className="py-3 flex justify-between items-center">
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-800">{item.product.name}</h4>
                                <span className="text-sm text-gray-600">Precio: ${item.product.price}</span>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm text-gray-700">Cantidad: {item.quantity}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-6">
                <p className="text-gray-700">
                    <strong>Responsable de la orden:</strong> {selectedOrder.branch_staff?.user?.first_name} {selectedOrder.branch_staff?.user?.last_name}
                </p>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    onClick={() => openDeleteDialog(selectedOrder.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300 flex items-center justify-center"
                >
                    <FaTrash />
                </button>
                <button
                    className="bg-secondary text-white font-medium px-4 py-2 rounded-full hover:bg-secondaryDark"
                >
                    Cerrar Orden
                </button>
            </div>
        </div>
    );
};

export default OrderItemsList;
