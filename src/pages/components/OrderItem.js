import React, { useState, useEffect } from 'react';
import Product from './Product';
import ProductExtra from './ProductExtra';
// import apiClient from '@/pages/utils/apiClient';

const OrderItem = ({ orderId, product, initialQuantity = 1, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(initialQuantity);
    const [commentary, setCommentary] = useState('');
    const [extras, setExtras] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        calculateTotal();
    }, [quantity, extras]);

    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
        if (onQuantityChange) {
            onQuantityChange(newQuantity);
        }
    };

    const handleExtraToggle = (extra) => {
        setExtras(prevExtras =>
            prevExtras.includes(extra)
                ? prevExtras.filter(e => e !== extra)
                : [...prevExtras, extra]
        );
    };

    const calculateTotal = () => {
        let itemTotal = product.price * quantity;
        extras.forEach(extra => {
            itemTotal += extra.price * quantity;
        });
        setTotal(itemTotal);
    };

    // const createOrderItem = async () => {
    //     try {
    //         const response = await apiClient.post('/order/create', {
    //             order: orderId,
    //             product: product.id,
    //             quantity: quantity,
    //             extras: extras.map(extra => extra.id),
    //             commentary: commentary
    //         });
    //         console.log('Order item created:', response.data);
    //     } catch (error) {
    //         console.error('Error creating order item:', error);
    //     }
    // };

    // const getOrderItemDetails = async (orderItemId) => {
    //     try {
    //         const response = await apiClient.get(`/order/${orderItemId}`);
    //         console.log('Order item details:', response.data);
    //     } catch (error) {
    //         console.error('Error fetching order item details:', error);
    //     }
    // };

    return (
        <div className="order-item border rounded-lg p-4 mb-4">
            <Product product={product} />

            <div className="mt-2">
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
            </div>

            <div className="mt-2 flex items-center">
                <label htmlFor="quantity" className="mr-2">Cantidad:</label>
                <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="border rounded px-2 py-1 w-16"
                />
            </div>

            <div className="mt-2">
                <label htmlFor="commentary" className="block mb-1">Comentarios:</label>
                <textarea
                    id="commentary"
                    value={commentary}
                    onChange={(e) => setCommentary(e.target.value)}
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
                        isSelected={extras.includes(extra)}
                        onToggle={() => handleExtraToggle(extra)}
                    />
                ))}
            </div>

            <div className="mt-2">
                <p className="font-bold">Total: ${total.toFixed(2)}</p>
            </div>

            {/* Uncomment and use these buttons when ready to implement API calls */}
            {/* <button onClick={createOrderItem}>Create Order Item</button> */}
            {/* <button onClick={() => getOrderItemDetails(orderItemId)}>Get Order Item Details</button> */}
        </div>
    );
};

export default OrderItem;
