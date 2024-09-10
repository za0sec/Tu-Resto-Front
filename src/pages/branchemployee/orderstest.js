import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { useRouter } from 'next/router';

const EditTakeAwayOrder = ({ orderId, closeModal }) => {
    const [formData, setFormData] = useState({
        phone_number: '',
        ready: false,
        payment_method: '',
        commentary: '',
        order_items: []
    });

    // Cargar los datos actuales de la orden cuando el componente se monte
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await apiClient.get(`/order/takeaway/${orderId}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error al obtener los datos de la orden:', error);
            }
        };

        fetchOrderData();
    }, [orderId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleOrderItemChange = (index, field, value) => {
        const updatedOrderItems = [...formData.order_items];
        updatedOrderItems[index] = {
            ...updatedOrderItems[index],
            [field]: value
        };
        setFormData({
            ...formData,
            order_items: updatedOrderItems
        });
    };

    const handleAddOrderItem = () => {
        setFormData({
            ...formData,
            order_items: [...formData.order_items, { product: '', quantity: 1, commentary: '', extras: [] }]
        });
    };

    // Función para actualizar la orden
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Formatear los items de la orden para asegurarnos de que los IDs del producto son números
            const formattedOrderItems = formData.order_items.map(item => ({
                ...item,
                product: parseInt(item.product) // Convertir el ID del producto a número
            }));

            const dataToSend = {
                ...formData,
                order_items: formattedOrderItems
            };

            const orderId = 6
            const response = await apiClient.patch(`/order/takeaway/${orderId}`, JSON.stringify(dataToSend), {
            });

            if (response.status === 200 || response.status === 204) {
                closeModal();
                console.log('Orden actualizada exitosamente');
            }
        } catch (error) {
            console.error('Error al actualizar la orden:', error.response?.data || error.message);
        }
    };

    return (
        <form onSubmit={handleUpdate}>
            <div>
                <label>Phone Number</label>
                <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div>
                <label>Payment Method</label>
                <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Payment Method</option>
                    <option value="card">Card</option>
                    <option value="cash">Cash</option>
                </select>
            </div>

            <div>
                <label>Commentary</label>
                <input
                    type="text"
                    name="commentary"
                    value={formData.commentary}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Order Items</label>
                {formData.order_items.map((item, index) => (
                    <div key={index}>
                        <input
                            type="number"
                            placeholder="Product ID"
                            value={item.product}
                            onChange={(e) => handleOrderItemChange(index, 'product', e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={item.quantity}
                            onChange={(e) => handleOrderItemChange(index, 'quantity', e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Commentary"
                            value={item.commentary}
                            onChange={(e) => handleOrderItemChange(index, 'commentary', e.target.value)}
                        />
                    </div>
                ))}
                <button type="button" onClick={handleAddOrderItem}>
                    Add Order Item
                </button>
            </div>

            <button type="submit">Update Order</button>
        </form>
    );
};

export default EditTakeAwayOrder;
