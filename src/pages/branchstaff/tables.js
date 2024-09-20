import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import EmployeeNavbar from '../../components/EmployeeNavbar';
import axios from 'axios';

const TableItem = ({ id, number, capacity, x, y, onMove, onEdit, onDelete }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'table',
        item: { id, x, y },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            style={{
                position: 'absolute',
                left: x,
                top: y,
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
            }}
            className="bg-primary text-white p-2 rounded-lg shadow-md"
        >
            <p>Mesa {number}</p>
            <p>Capacidad: {capacity}</p>
            <div className="mt-2">
                <button onClick={() => onEdit(id)} className="mr-2 text-sm">
                    <FaEdit />
                </button>
                <button onClick={() => onDelete(id)} className="text-sm">
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

const TablesPage = () => {
    const [tables, setTables] = useState([]);
    const [editingTable, setEditingTable] = useState(null);
    const [newTable, setNewTable] = useState({ number: '', capacity: '' });

    useEffect(() => {
        // Fetch tables from API
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const response = await axios.get('/api/tables');
            setTables(response.data);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const handleMove = (id, x, y) => {
        setTables(
            tables.map((table) =>
                table.id === id ? { ...table, x, y } : table
            )
        );
    };

    const handleEdit = (id) => {
        const tableToEdit = tables.find((table) => table.id === id);
        setEditingTable(tableToEdit);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/tables/${id}`);
            setTables(tables.filter((table) => table.id !== id));
        } catch (error) {
            console.error('Error deleting table:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingTable) {
            try {
                await axios.put(`/api/tables/${editingTable.id}`, editingTable);
                setTables(
                    tables.map((table) =>
                        table.id === editingTable.id ? editingTable : table
                    )
                );
                setEditingTable(null);
            } catch (error) {
                console.error('Error updating table:', error);
            }
        } else {
            try {
                const response = await axios.post('/api/tables', newTable);
                setTables([...tables, response.data]);
                setNewTable({ number: '', capacity: '' });
            } catch (error) {
                console.error('Error creating table:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <EmployeeNavbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Gestión de Mesas</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">
                            {editingTable ? 'Editar Mesa' : 'Agregar Nueva Mesa'}
                        </h2>
                        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Número de Mesa</label>
                                <input
                                    type="text"
                                    value={editingTable ? editingTable.number : newTable.number}
                                    onChange={(e) =>
                                        editingTable
                                            ? setEditingTable({ ...editingTable, number: e.target.value })
                                            : setNewTable({ ...newTable, number: e.target.value })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Capacidad</label>
                                <input
                                    type="number"
                                    value={editingTable ? editingTable.capacity : newTable.capacity}
                                    onChange={(e) =>
                                        editingTable
                                            ? setEditingTable({ ...editingTable, capacity: e.target.value })
                                            : setNewTable({ ...newTable, capacity: e.target.value })
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primaryDark transition duration-300"
                            >
                                {editingTable ? 'Actualizar Mesa' : 'Agregar Mesa'}
                            </button>
                            {editingTable && (
                                <button
                                    type="button"
                                    onClick={() => setEditingTable(null)}
                                    className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
                                >
                                    Cancelar
                                </button>
                            )}
                        </form>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Disposición de Mesas</h2>
                        <DndProvider backend={HTML5Backend}>
                            <div
                                className="bg-white p-4 rounded-lg shadow relative"
                                style={{ height: '400px', width: '100%' }}
                            >
                                {tables.map((table) => (
                                    <TableItem
                                        key={table.id}
                                        {...table}
                                        onMove={handleMove}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </DndProvider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TablesPage;
