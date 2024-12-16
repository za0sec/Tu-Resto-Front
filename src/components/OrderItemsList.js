import React, { useEffect, useState } from "react";
import {
    FaEdit,
    FaTrash,
    FaTimes,
    FaUtensils,
    FaRunning,
    FaWhatsapp,
    FaExchangeAlt,
} from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const OrderItemsList = ({
    selectedOrder,
    handleUpdateOrder,
    openDeleteDialog,
    handleCloseOrder,
    openTransferDialog,
}) => {
    if (!selectedOrder) {
        return (
            <div className="p-6 text-center text-gray-500">
                <FaTimes className="mx-auto text-4xl mb-4" />
                <p className="text-xl">
                    Seleccione un pedido para ver los detalles
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Detalles del Pedido #{selectedOrder.id}
                </h2>
                <button
                    onClick={() => handleUpdateOrder(selectedOrder.id)}
                    className="bg-secondary text-white px-4 py-2 rounded-full transition hover:bg-secondaryDark duration-300 flex items-center">
                    <FaEdit className="mr-2" /> Editar Orden
                </button>
            </div>
            <div className="mb-4 flex items-center">
                {selectedOrder.table ? (
                    <>
                        <FaUtensils className="text-xl mr-2 text-blue-500" />
                        <span className="text-lg font-medium">
                            Para comer aquí - Mesa {selectedOrder.table.number}
                        </span>
                    </>
                ) : (
                    <>
                        <FaRunning className="text-xl mr-2 text-green-500" />
                        <span className="text-lg font-medium">Para llevar</span>
                    </>
                )}
            </div>
            <div className="rounded-lg">
                <div className="border-b border-gray-200 mb-4"></div>
                <h3 className="text-xl font-medium mb-4 text-gray-700">
                    Ítems del pedido:
                </h3>
                <ul className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                        <li
                            key={index}
                            className="py-3 flex justify-between items-center">
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    {item.product.name}
                                </h4>
                                <span className="text-sm text-gray-600">
                                    Precio: ${item.product.price}
                                </span>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm text-gray-700">
                                Cantidad: {item.quantity}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-6">
                <p className="text-gray-700">
                    <strong>Responsable de la orden:</strong>{" "}
                    {selectedOrder.branch_staff?.user?.first_name}{" "}
                    {selectedOrder.branch_staff?.user?.last_name}
                </p>
            </div>

            <div className={`flex ${selectedOrder.table ? 'justify-between' : 'justify-end'} items-center`}>
                {selectedOrder.table && (
                    <button
                        onClick={openTransferDialog}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 flex items-center">
                        <FaExchangeAlt className="mr-2" /> Transferir Pedido
                    </button>
                )}
                <div className="flex space-x-4">
                    <button
                        onClick={() => openDeleteDialog(selectedOrder.id)}
                        className="bg-primary text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300 flex items-center justify-center">
                        <FaTrash />
                    </button>
                    {selectedOrder.table ? (
                        <button
                            onClick={() => handleCloseOrder(selectedOrder.id)}
                            className="bg-secondary text-white font-medium px-4 py-2 rounded-full hover:bg-secondaryDark">
                            Cerrar Orden
                        </button>
                    ) : (
                        <button
                            onClick={() => handleCloseOrder(selectedOrder.id)}
                            className="bg-green-500 text-white font-medium px-4 py-2 rounded-full hover:bg-green-600 flex items-center">
                            <FaWhatsapp className="mr-2" />
                            Pedido Listo
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderItemsList;
