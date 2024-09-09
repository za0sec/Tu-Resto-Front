import React from 'react';
import Product from './Product';

const Order = ({ order }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
                Order #{order.id} - Table {order.tableNumber}
            </h2>
            <ul className="space-y-2">
                {order.products.map((product, index) => (
                    <li key={index}>
                        <Product
                            name={product.name}
                            description={product.description}
                            price={product.price}
                        />
                    </li>
                ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default Order;
