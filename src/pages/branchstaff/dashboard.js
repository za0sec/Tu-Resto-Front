import { useState, useEffect } from "react";
import EmployeeNavbar from "../../components/EmployeeNavbar";
import apiClient from "/utils/apiClient";
import OrderModal from "../../components/CreateOrderDialog";
import { useRouter } from "next/router";
import { FaPlus, FaExchangeAlt } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Cookies from "js-cookie";
import OrderItemsList from "../../components/OrderItemsList";
import { FaUtensils, FaRunning } from "react-icons/fa";
import { Toaster, toast } from 'react-hot-toast';

export default function BranchDashboard() {
    const [branchId, setBranchId] = useState(null);
    const [openOrders, setOpenOrders] = useState([]);
    const [closedOrders, setClosedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderType, setOrderType] = useState(null);
    const [formData, setFormData] = useState({
        orderType: "",
        branch_staff: "",
        consumer: "",
        table: "",
        payment_method: "",
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
    const [newTableNumber, setNewTableNumber] = useState("");
    const [availableTables, setAvailableTables] = useState([]);
    const router = useRouter();
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        fetchOrders();
        fetchTables();
    }, []);

    const fetchTables = async () => {
        const branchId = Cookies.get("user_branch_id");
        setBranchId(branchId);
        try {
            const response = await apiClient.get(`/branch/${branchId}/tables`);
            setAvailableTables(response.data);
        } catch (error) {
            console.error("Error fetching tables:", error);
            toast.error("Error al cargar las mesas disponibles");
        }
    };

    const handleCloseOrder = async (orderId) => {
        try {
            const payload = orderType === 'takeaway' ? { ready: true } : { status_closed: true };
            const response = await apiClient.patch(
                `/order/${orderType}/${orderId}`,
                payload
            );

            if (response.status === 200) {
                console.log("Orden cerrada exitosamente");
                toast("Se cerró la orden y se notificó al cliente.");
                
                // Volver a cargar las órdenes
                await fetchOrders();
            }
        } catch (error) {
            console.error("Error al cerrar la orden:", error);
            toast.error("Error al cerrar la orden! No se notificó al cliente.");
        }
    };

    const fetchOrders = async () => {
        const branchId = Cookies.get("user_branch_id");
        setBranchId(branchId);
        try {
            const ordersData = await apiClient.get(`/branch/${branchId}/orders`);
            const open = [];
            const closed = [];
            ordersData.data.forEach(order => {
                if ((order.order_type === 'TableOrder' && !order.status) ||
                    (order.order_type === 'TakeAwayOrder' && !order.status)) {
                    open.push(order);
                } else {
                    closed.push(order);
                }
            });
            setOpenOrders(open);
            setClosedOrders(closed);
        } catch (error) {
            toast.error("Error al cargar las órdenes");
            console.error("Error al obtener órdenes:", error);
        } finally {
            setLoading(false);
        }
    };

    const selectOrder = async (orderId) => {
        try {
            const orderDetails = await apiClient.get(`/order/${orderId}`);
            console.log("orderdetails", orderDetails);
            setSelectedOrder(orderDetails.data);
            const orderTypeMap = {
                TableOrder: "table",
                TakeAwayOrder: "takeaway",
                DeliveryOrder: "delivery",
            };
            setOrderType(
                orderTypeMap[orderDetails.data.order_type] || "unknown"
            );
            console.log(orderDetails.data.order_type);
        } catch (error) {
            toast.error("Error al cargar los detalles del pedido.")
            console.error("Error al obtener detalles del pedido:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                order_items: [],
                branch_staff: formData.branch_staff,
                consumer: formData.consumer,
                payment_method: formData.payment_method,
            };

            if (formData.orderType === "table" && formData.table) {
                orderData.table = formData.table;
            }

            const response = await apiClient.post(
                `branch/${branchId}/order/${formData.orderType}/create`,
                orderData
            );
            setFormData({
                orderType: "",
                branch_staff: "",
                consumer: "",
                table: "",
                payment_method: "",
            });
            closeModal();
            if (response.status === 201 && response.data.id) {
                console.log("Orden creada exitosamente:", response.data);
                toast("Orden creada exitosamente!")
                router.push(
                    `/branchstaff/editorder?id=${response.data.id}&orderType=${formData.orderType}`
                );
            }
        } catch (error) {
            console.error("Error al crear la orden:", error);
            toast.error("Error al crear la orden")
        }
    };

    const handleUpdateOrder = async (orderId) => {
        try {
            if (!selectedOrder) {
                console.error("No hay orden seleccionada para actualizar");
                return;
            }
            router.push(
                `/branchstaff/editorder?id=${orderId}&orderType=${orderType}`
            );
        } catch (error) {
            console.error(
                "Error al actualizar la orden:",
                error.response?.data || error.message
            );
            toast.error("Error al actualizar la orden. No se guardaron los cambios.")
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
            const response = await apiClient.delete(
                `/order/${orderType}/${orderToDelete}`
            );
            if (response.status === 200 || response.status === 204) {
                console.log("Orden eliminada exitosamente");
                setOpenOrders(openOrders.filter((order) => order.id !== orderToDelete));
                setClosedOrders(closedOrders.filter((order) => order.id !== orderToDelete));
                setSelectedOrder(null);
                closeDeleteDialog();
                toast("Orden eliminada exitosamente.")
            }
        } catch (error) {
            console.error(
                "Error al eliminar la orden:",
                error.response?.data || error.message
            );
            toast.error("Error: No se pudo eliminar la orden.")
        }
    };

    const openTransferDialog = () => {
        setIsTransferDialogOpen(true);
    };

    const closeTransferDialog = () => {
        setIsTransferDialogOpen(false);
        setNewTableNumber("");
    };

    const handleTransferOrder = async (orderId, newTableNumber) => {
        try {
            const response = await apiClient.patch(`/order/table/${orderId}`, {
                table: newTableNumber
            });
            if (response.status === 200) {
                console.log("Orden transferida exitosamente");
                toast("Orden transferida exitosamente");
                await fetchOrders();
                closeTransferDialog();
            }
        } catch (error) {
            console.error("Error al transferir la orden:", error);
            toast.error("Error al transferir la orden");
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
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Error
                    </h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
            <EmployeeNavbar />
            <div className="container mx-auto mt-20">
                <div className="flex justify-between items-center mb-2 mt-12">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Órdenes
                    </h1>
                    <button
                        onClick={openModal}
                        className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primaryDark transition duration-300 flex items-center group">
                        <FaPlus className="mr-2 transition-transform duration-300 group-hover:rotate-90" />{" "}
                        Crear Orden
                    </button>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
                        <h2 className="text-2xl font-semibold bg-green-100 text-black p-4">
                            Órdenes abiertas
                        </h2>
                        <ul className="divide-y divide-gray-200 overflow-y-auto max-h-[400px] flex-grow">
                            {openOrders.slice(0, 5).map((order) => (
                                <li
                                    key={order.id}
                                    className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
                                    onClick={() => selectOrder(order.id)}>
                                    <div className="flex items-center">
                                        {order?.table ? (
                                            <FaUtensils className="text-xl mr-3 text-blue-500" />
                                        ) : (
                                            <FaRunning className="text-xl mr-3 text-green-500" />
                                        )}
                                        <div>
                                            <p className="text-lg font-semibold text-gray-800">
                                                Pedido #{order?.id}{" "}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Items: {order?.items?.length} -
                                                Total: ${order?.total}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <h2 className="text-2xl font-semibold bg-red-100 text-black p-4">
                            Órdenes cerradas
                        </h2>
                        <ul className="divide-y divide-gray-200 overflow-y-auto max-h-[400px] flex-grow">
                            {closedOrders.slice(0, 5).map((order) => (
                                <li
                                    key={order.id}
                                    className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
                                    onClick={() => selectOrder(order.id)}>
                                    <div className="flex items-center">
                                        {order?.table ? (
                                            <FaUtensils className="text-xl mr-3 text-blue-500" />
                                        ) : (
                                            <FaRunning className="text-xl mr-3 text-green-500" />
                                        )}
                                        <div>
                                            <p className="text-lg font-semibold text-gray-800">
                                                Pedido #{order?.id}{" "}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Items: {order?.items?.length} -
                                                Total: ${order?.total}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
                        <OrderItemsList
                            selectedOrder={selectedOrder}
                            handleUpdateOrder={handleUpdateOrder}
                            openDeleteDialog={openDeleteDialog}
                            handleCloseOrder={handleCloseOrder}
                            openTransferDialog={openTransferDialog}
                        />
                    </div>
                </div>
            </div>
            <OrderModal
                isModalOpen={isModalOpen}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                closeModal={closeModal}
                branchId={branchId}
            />
            <Transition appear show={isDeleteDialogOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={closeDeleteDialog}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
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
                                leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900">
                                        Confirmar eliminación
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            ¿Está seguro de que desea eliminar
                                            esta orden? Esta acción no se puede
                                            deshacer.
                                        </p>
                                    </div>

                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-red-900 hover:bg-primaryDark focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={handleDelete}>
                                            Eliminar
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeDeleteDialog}>
                                            Cancelar
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={isTransferDialogOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={closeTransferDialog}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
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
                                leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900">
                                        Transferir Pedido
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Seleccione la nueva mesa para transferir el pedido:
                                        </p>
                                        <select
                                            value={newTableNumber}
                                            onChange={(e) => setNewTableNumber(e.target.value)}
                                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        >
                                            <option value="">Seleccione una mesa</option>
                                            {availableTables.map((table) => (
                                                <option key={table.id} value={table.id}>
                                                    Mesa {table.number}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => handleTransferOrder(selectedOrder.id, newTableNumber)}
                                            disabled={!newTableNumber}
                                        >
                                            Transferir
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                            onClick={closeTransferDialog}
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
