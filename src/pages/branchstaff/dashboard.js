import { useState, useEffect } from 'react';
import EmployeeNavbar from '../components/EmployeeNavbar';
import apiClient from "@/pages/utils/apiClient";
import OrderModal from '@/pages/components/CreateOrderDialog';
import { useRouter } from 'next/router';
import { FaTrash, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Cookies from 'js-cookie';

export default function BranchDashboard() {
    const [branchId, setBranchId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ orderType: '', responsible: '', consumer: '' });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const router = useRouter();
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchOrders = async () => {
            const branchId = Cookies.get('user_branch_id');
            setBranchId(branchId);
            try {
                const ordersData = await apiClient.get(`/branch/${branchId}/orders`);
                setOrders(ordersData.data);
            } catch (error) {
                console.error('Error al obtener órdenes:', error);
                setError('Error al cargar las órdenes');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const selectOrder = async (orderId) => {
        try {
            const orderDetails = await apiClient.get(`/order/${orderId}`);
            setSelectedOrder(orderDetails.data);
        } catch (error) {
            console.error('Error al obtener detalles del pedido:', error);
            setError('Error al cargar los detalles del pedido');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post(`branch/${branchId}/order/${formData.orderType}/create`, { order_items: [] });
            setFormData({ orderType: '', responsible: '', consumer: '' });
            closeModal();
            if (response.status === 201 && response.data.id) {
                console.log('Orden creada exitosamente:', response.data);
                router.push(`/branchstaff/editorder?id=${response.data.id}`);
            }
        } catch (error) {
            console.error('Error al crear la orden:', error);
            setError('Error al crear la orden');
        }
    };

    const handleUpdateOrder = async (orderId) => {
        try {
            if (!selectedOrder) {
                console.error('No hay orden seleccionada para actualizar');
                return;
            }
            router.push(`/branchstaff/editorder?id=${orderId}`);
        } catch (error) {
            console.error('Error al actualizar la orden:', error.response?.data || error.message);
        }
    };

    const openDeleteDialog = (orderId) => {
        setOrderToDelete(orderId);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setOrderToDelete(null);
    };

    const handleDelete = async () => {
        try {
            const response = await apiClient.delete(`/order/takeaway/${orderToDelete}`);
            if (response.status === 200 || response.status === 204) {
                console.log('Orden eliminada exitosamente');
                setOrders(orders.filter(order => order.id !== orderToDelete));
                setSelectedOrder(null);
                closeDeleteDialog();
            }
        } catch (error) {
            console.error('Error al eliminar la orden:', error.response?.data || error.message);
            setError('Error al eliminar la orden');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <EmployeeNavbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8 py-8">
                    <h1 className="text-4xl font-bold text-gray-800">Órdenes</h1>
                    <button
                        onClick={openModal}
                        className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primaryDark transition duration-300 flex items-center group"
                    >
                        <FaPlus className="mr-2 transition-transform duration-300 group-hover:rotate-90" /> Crear Orden
                    </button>
                </div>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg overflow-hidden">
                        <h2 className="text-2xl font-semibold bg-yellow-100 text-black p-4">Ordenes recientes</h2>
                        <ul className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <li
                                    key={order.id}
                                    className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
                                    onClick={() => selectOrder(order.id)}
                                >
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">Pedido #{order?.id}</p>
                                        <p className="text-sm text-gray-600">Items: {order?.items.length} - Total: ${order?.total}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg overflow-hidden">
                        {selectedOrder ? (
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
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h3 className="text-xl font-medium mb-4 text-gray-700">Ítems del pedido:</h3>
                                    <ul className="space-y-4">
                                        {selectedOrder.items.map((item, index) => (
                                            <li key={index} className="bg-blue-100 shadow rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                                                <h4 className="text-lg font-semibold text-blue-900 mb-2">{item.product.name}</h4>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-medium text-black">Precio: ${item.product.price}</span>
                                                    <span className="bg-gray-200 px-3 py-1 rounded-full text-black">Cantidad: {item.quantity}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
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
                        ) : (
                            <div className="p-6 text-center text-gray-500">
                                <FaTimes className="mx-auto text-4xl mb-4" />
                                <p className="text-xl">Seleccione un pedido para ver los detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <OrderModal
                isModalOpen={isModalOpen}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                closeModal={closeModal}
            />
            <Transition appear show={isDeleteDialogOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeDeleteDialog}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Confirmar eliminación
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            ¿Está seguro de que desea eliminar esta orden? Esta acción no se puede deshacer.
                                        </p>
                                    </div>

                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-red-900 hover:bg-primaryDark focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={handleDelete}
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeDeleteDialog}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}