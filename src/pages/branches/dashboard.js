import { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export default function BranchDashboard() {
    const [branches] = useState([
        { id: 1, name: 'Sucursal Centro' },
        { id: 2, name: 'Sucursal Norte' },
        { id: 3, name: 'Sucursal Sur' }
    ]);
    const [tables, setTables] = useState([
        { id: 1, number: 1 },
        { id: 2, number: 2 },
        { id: 3, number: 3 }
    ]);
    const [orders, setOrders] = useState([
        { id: 1, status: 'Pendiente' },
        { id: 2, status: 'En proceso' },
        { id: 3, status: 'Completada' }
    ]);
    const [date, setDate] = useState(new Date());
    const [selectedBranch, setSelectedBranch] = useState(1);

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
    };

    const handleBranchChange = (branchId) => {
        setSelectedBranch(Number(branchId));
    };

    const addTable = () => {
        const newTable = { id: tables.length + 1, number: tables.length + 1 };
        setTables([...tables, newTable]);
    };

    const editTable = (tableId) => {
        const newNumber = prompt("Ingrese el nuevo número de mesa:");
        if (newNumber) {
            setTables(tables.map(table =>
                table.id === tableId ? { ...table, number: Number(newNumber) } : table
            ));
        }
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
            <AdminNavbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Dashboard de Sucursal</h1>

                <div className="mb-6">
                    <select
                        value={selectedBranch}
                        onChange={(e) => handleBranchChange(e.target.value)}
                        className="p-2 border rounded"
                    >
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">Mesas</h2>
                    <button onClick={addTable} className="bg-blue-500 text-white p-2 rounded mb-4">
                        <FaPlus className="inline mr-2" /> Agregar Mesa
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {tables.map(table => (
                            <div key={table.id} className="bg-white p-4 rounded shadow">
                                <h3 className="text-xl font-bold mb-2">Mesa {table.number}</h3>
                                <button onClick={() => editTable(table.id)} className="bg-yellow-500 text-white p-2 rounded mr-2">
                                    <FaEdit className="inline mr-2" /> Editar
                                </button>
                                <button onClick={() => deleteTable(table.id)} className="bg-red-500 text-white p-2 rounded">
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
        </div>
    );
}
