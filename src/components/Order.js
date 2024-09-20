import React, { useState, useEffect } from 'react';
import Product from './Product';
import ProductExtra from './ProductExtra';
// import apiClient from '/utils/apiClient';

const Order = ({ orderId, initialProducts = [] }) => {
    const [products, setProducts] = useState(initialProducts);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        calculateTotal();
    }, [products]);

    const handleQuantityChange = (productId, newQuantity) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId ? { ...product, quantity: newQuantity } : product
            )
        );
    };

    const handleExtraToggle = (productId, extra) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId
                    ? {
                        ...product,
                        extras: product.extras.includes(extra)
                            ? product.extras.filter(e => e !== extra)
                            : [...product.extras, extra]
                    }
                    : product
            )
        );
    };

    const handleCommentaryChange = (productId, newCommentary) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId ? { ...product, commentary: newCommentary } : product
            )
        );
    };

    const calculateTotal = () => {
        const orderTotal = products.reduce((acc, product) => {
            let productTotal = product.price * product.quantity;
            product.extras.forEach(extra => {
                productTotal += extra.price * product.quantity;
            });
            return acc + productTotal;
        }, 0);
        setTotal(orderTotal);
    };

    const addProduct = (newProduct) => {
        setProducts(prevProducts => [...prevProducts, { ...newProduct, quantity: 1, extras: [], commentary: '' }]);
    };

    const removeProduct = (productId) => {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
    };

    return (
        <div className="order border rounded-lg p-4 mb-4">
            {products.map((product) => (
                <div key={product.id} className="order-item border-b pb-4 mb-4">
                    <Product product={product} />

                    <div className="mt-2">
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.description}</p>
                    </div>

                    <div className="mt-2 flex items-center">
                        <label htmlFor={`quantity-${product.id}`} className="mr-2">Cantidad:</label>
                        <input
                            type="number"
                            id={`quantity-${product.id}`}
                            min="1"
                            value={product.quantity}
                            onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                            className="border rounded px-2 py-1 w-16"
                        />
                    </div>

                    <div className="mt-2">
                        <label htmlFor={`commentary-${product.id}`} className="block mb-1">Comentarios:</label>
                        <textarea
                            id={`commentary-${product.id}`}
                            value={product.commentary}
                            onChange={(e) => handleCommentaryChange(product.id, e.target.value)}
                            className="w-full border rounded px-2 py-1"
                            rows="2"
                        />
                    </div>

                    <div className="mt-2">
                        <h4 className="font-semibold mb-1">Extras:</h4>
                        {product.extras && product.extras.map((extra) => (
                            <ProductExtra
                                key={extra.id}
                                extra={extra}
                                isSelected={product.extras.includes(extra)}
                                onToggle={() => handleExtraToggle(product.id, extra)}
                            />
                        ))}
                    </div>

                    <button onClick={() => removeProduct(product.id)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded">
                        Eliminar producto
                    </button>
                </div>
            ))}

            <div className="mt-4">
                <p className="font-bold text-xl">Total de la orden: ${total.toFixed(2)}</p>
            </div>

            <button onClick={() => addProduct({ id: Date.now(), name: 'Nuevo Producto', price: 0 })} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
                Agregar Producto
            </button>

            {/* Uncomment and implement these functions when ready for API integration */}
            {/* <button onClick={createOrder}>Crear Orden</button> */}
            {/* <button onClick={() => getOrderDetails(orderId)}>Ver Detalles de la Orden</button> */}
        </div>
    );
};

export default Order;
