import React from 'react';

const ActiveOrders = ({ orders }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pedidos Activos</h2>
            <ul className="space-y-4">
                {orders?.map((order) => (
                    <li key={order?.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                            <p className="font-semibold">Pedido #{order?.id}</p>
                            <p className="text-sm text-gray-600">{order?.items?.length} items - ${order?.total}</p>
                        </div>
                        <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-sm">
                            En Preparación
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActiveOrders;
