import { FaTrash } from 'react-icons/fa';

export default function OrderCreationPreview({ order, handleEditItem, handleDeleteItem, handleCreateOrder }) {
    const totalAmount = order.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    return (
        <div className="w-full md:w-1/2 pl-4">
            <h2 className="text-2xl font-semibold mb-4">Pedido actual</h2>
            {order.length > 0 ? (
                <div className="bg-white p-4 rounded-lg shadow">
                    {order.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b cursor-pointer"
                            onClick={() => handleEditItem(index)}
                        >
                            <div className="flex-grow">
                                <h3 className="font-semibold">{item?.name || 'Producto desconocido'}</h3>
                                <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                {item.extras.length > 0 && (
                                    <p className="text-sm text-gray-600">
                                        Extras: {item.extras.map(extra => `${extra.name} (x${extra.quantity})`).join(', ')}
                                    </p>
                                )}
                                {item.comments && <p className="text-sm text-gray-600">Comentarios: {item.comments}</p>}
                            </div>
                            <div className="flex items-center">
                                <p className="font-semibold mr-2">${(item.price * item.quantity).toFixed(2)}</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteItem(index);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4 pt-2">
                        <p className="text-xl font-bold">
                            Total: <span className="text-green-600">${totalAmount}</span>
                        </p>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={handleCreateOrder}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                        >
                            Crear Orden
                        </button>
                    </div>
                </div>
            ) : (
                <p>No hay productos en el pedido actual.</p>
            )}
        </div>
    );
}
