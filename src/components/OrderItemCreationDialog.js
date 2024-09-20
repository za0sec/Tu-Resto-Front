import React, { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FaMinus, FaPlus } from 'react-icons/fa';

const OrderItemDialog = ({ isOpen, onClose, item = null, product = null, quantity, setQuantity, additionalComments, setAdditionalComments, handleAddToOrder, editingIndex }) => {
    useEffect(() => {
        if (item) {
            setQuantity(item.quantity || 1);
            setAdditionalComments(item.comments || '');
        } else if (product) {
            setQuantity(1);
            setAdditionalComments('');
        }
        // Solo ejecuta el efecto al cambiar item o product
    }, [item, product]);


    const currentProduct = item ? item.product : product; // Usa el producto del item o el product recibido

    if (!currentProduct) return null; // Si no hay ni item ni product, no renderiza nada

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 bg-black opacity-30" />
                <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-h-[80vh] overflow-y-auto relative z-20">
                    <Dialog.Title className="text-2xl font-bold mb-4">{currentProduct.name}</Dialog.Title>
                    <p className="mb-4">{currentProduct.description}</p>
                    <p className="font-semibold mb-4">Precio: ${parseFloat(currentProduct.price).toFixed(2)}</p>
                    <div className="mb-4">
                        <label className="block mb-2">Cantidad:</label>
                        <div className="flex items-center">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="bg-gray-200 px-3 py-1 rounded-l">
                                <FaMinus />
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-16 text-center border-t border-b border-gray-200 py-1"
                            />
                            <button onClick={() => setQuantity(quantity + 1)} className="bg-gray-200 px-3 py-1 rounded-r">
                                <FaPlus />
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Comentarios adicionales:</label>
                        <textarea
                            value={additionalComments}
                            onChange={(e) => setAdditionalComments(e.target.value)}
                            className="w-full p-2 border rounded"
                            rows="3"
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleAddToOrder} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                            {editingIndex !== null ? 'Actualizar pedido' : 'Agregar al pedido'}
                        </button>
                        <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default OrderItemDialog;
