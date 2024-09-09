import { useState } from 'react';
import EmployeeNavbar from '../components/EmployeeNavbar';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function BranchDashboard() {
    const [tables, setTables] = useState([
        { id: 1, number: 1, capacity: 4, reservable: true, inCharge: 'Juan' },
        { id: 2, number: 2, capacity: 2, reservable: false, inCharge: 'María' },
        { id: 3, number: 3, capacity: 6, reservable: true, inCharge: 'Pedro' }
    ]);
    const [orders, setOrders] = useState([
        { id: 1, status: 'Pendiente' },
        { id: 2, status: 'En proceso' },
        { id: 3, status: 'Completada' }
    ]);
    const [date, setDate] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [newTable, setNewTable] = useState({
        number: tables.length + 1,
        capacity: '',
        reservable: false,
        inCharge: ''
    });

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
    };

    const openDialog = (table = null) => {
        if (table) {
            setEditingTable(table);
            setNewTable({ ...table });
        } else {
            setEditingTable(null);
            setNewTable({
                number: tables.length + 1,
                capacity: '',
                reservable: false,
                inCharge: ''
            });
        }
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setEditingTable(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewTable(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addOrUpdateTable = () => {
        if (newTable.capacity && newTable.inCharge) {
            if (editingTable) {
                setTables(prev => prev.map(table =>
                    table.id === editingTable.id ? { ...newTable, id: table.id } : table
                ));
            } else {
                setTables(prev => [...prev, { ...newTable, id: prev.length + 1 }]);
            }
            closeDialog();
        }
    };

    const editTable = (tableId) => {
        const table = tables.find(t => t.id === tableId);
        openDialog(table);
    };

    const deleteTable = (tableId) => {
        if (confirm("¿Está seguro de que desea eliminar esta mesa?")) {
            setTables(tables.filter(table => table.id !== tableId));
        }
    };

    const addOrder = () => {
        const newOrder = { id: orders.length + 1, status: 'Pendiente' };
        setOrders([...orders, newOrder]);
    };

    const editOrder = (orderId) => {
        const newStatus = prompt("Ingrese el nuevo estado de la orden:");
        if (newStatus) {
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        }
    };

    const deleteOrder = (orderId) => {
        if (confirm("¿Está seguro de que desea eliminar esta orden?")) {
            setOrders(orders.filter(order => order.id !== orderId));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <EmployeeNavbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Dashboard de Sucursal</h1>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">Mesas</h2>
                    <button onClick={() => openDialog()} className="bg-blue-500 text-white p-2 rounded mb-4">
                        <FaPlus className="inline mr-2" /> Agregar Mesa
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {tables.map(table => (
                            <div key={table.id} className="bg-white p-4 rounded shadow">
                                <h3 className="text-xl font-bold mb-2">Mesa {table.number}</h3>
                                <p>Capacidad: {table.capacity}</p>
                                <p>Reservable: {table.reservable ? 'Sí' : 'No'}</p>
                                <p>A cargo: {table.inCharge}</p>
                                <button onClick={() => editTable(table.id)} className="bg-yellow-500 text-white p-2 rounded mr-2 mt-2">
                                    <FaEdit className="inline mr-2" /> Editar
                                </button>
                                <button onClick={() => deleteTable(table.id)} className="bg-red-500 text-white p-2 rounded mt-2">
                                    <FaTrash className="inline mr-2" /> Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">Órdenes</h2>
                    <div className="flex items-center mb-4">
                        <DatePicker
                            selected={date}
                            onChange={handleDateChange}
                            className="p-2 border rounded mr-4"
                        />
                        <button onClick={addOrder} className="bg-green-500 text-white p-2 rounded">
                            <FaPlus className="inline mr-2" /> Agregar Orden
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white p-4 rounded shadow">
                                <h3 className="text-xl font-bold mb-2">Orden #{order.id}</h3>
                                <p className="mb-2">Estado: {order.status}</p>
                                <button onClick={() => editOrder(order.id)} className="bg-yellow-500 text-white p-2 rounded mr-2">
                                    <FaEdit className="inline mr-2" /> Editar
                                </button>
                                <button onClick={() => deleteOrder(order.id)} className="bg-red-500 text-white p-2 rounded">
                                    <FaTrash className="inline mr-2" /> Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeDialog}>
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
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-bold leading-6 text-gray-900 mb-6"
                                    >
                                        {editingTable ? 'Editar Mesa' : 'Agregar Nueva Mesa'}
                                    </Dialog.Title>
                                    <div className="mt-4 space-y-6">
                                        <div>
                                            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                                                Capacidad
                                            </label>
                                            <input
                                                type="number"
                                                id="capacity"
                                                name="capacity"
                                                value={newTable.capacity}
                                                onChange={handleInputChange}
                                                placeholder="Ingrese la capacidad de la mesa"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg p-3"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="reservable"
                                                name="reservable"
                                                checked={newTable.reservable}
                                                onChange={handleInputChange}
                                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label htmlFor="reservable" className="ml-3 block text-lg font-medium text-gray-700">
                                                Reservable
                                            </label>
                                        </div>
                                        <div>
                                            <label htmlFor="inCharge" className="block text-sm font-medium text-gray-700 mb-2">
                                                Persona a cargo
                                            </label>
                                            <input
                                                type="text"
                                                id="inCharge"
                                                name="inCharge"
                                                value={newTable.inCharge}
                                                onChange={handleInputChange}
                                                placeholder="Nombre de la persona a cargo"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg p-3"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-6 py-3 text-lg font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                            onClick={closeDialog}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-lg font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={addOrUpdateTable}
                                        >
                                            {editingTable ? 'Actualizar Mesa' : 'Agregar Mesa'}
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
