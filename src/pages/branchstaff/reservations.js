import React, { useState, useEffect } from "react";
import apiClient from "/utils/apiClient";
import EmployeeNavbar from "@/components/EmployeeNavbar";
import Cookies from "js-cookie";
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaClock, FaUsers, FaChair } from "react-icons/fa";

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showAllDates, setShowAllDates] = useState(false);
    const [newReservation, setNewReservation] = useState({
        name: '',
        phone: '',
        guests: '',
        table: '',
        date: '',
        time: '',
        message: '',
        branch: Cookies.get("user_branch_id")
    });

    useEffect(() => {
        fetchTables();
        if (showAllDates) {
            fetchAllReservations();
        } else {
            fetchReservationsByDate(selectedDate);
        }
    }, [selectedDate, showAllDates]);

    const fetchAllReservations = async () => {
        try {
            const branchId = Cookies.get("user_branch_id");
            const response = await apiClient.get(`/branch/${branchId}/reservations`);
            const sortedReservations = response.data.sort((a, b) => a.time.localeCompare(b.time));
            setReservations(sortedReservations);
        } catch (error) {
            console.error("Error al cargar las reservas", error);
        }
    };

    const fetchReservationsByDate = async (date) => {
        try {
            const branchId = Cookies.get("user_branch_id");
            const restaurantId = Cookies.get("user_restaurant_id");
            const response = await apiClient.get(`/reservations/${restaurantId}/branches/${branchId}/${date}`);
            const sortedReservations = response.data.sort((a, b) => a.time.localeCompare(b.time));
            setReservations(sortedReservations);
        } catch (error) {
            console.error("Error al cargar las reservas por fecha", error);
        }
    };

    const fetchTables = async () => {
        try {
            const branchId = Cookies.get("user_branch_id");
            const response = await apiClient.get(`/branch/${branchId}/tables`);
            setTables(response.data);
        } catch (error) {
            console.error("Error al cargar las mesas", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReservation({ ...newReservation, [name]: value });
    };

    const handleCreateReservation = async () => {
        try {
            if (isEditing && selectedReservationId) {
                await apiClient.put(`/reservation/${selectedReservationId}`, newReservation);
            } else {
                await apiClient.post("/reservation/create", newReservation);
            }
            setShowDialog(false);
            if (showAllDates) {
                fetchAllReservations();
            } else {
                fetchReservationsByDate(selectedDate);
            }
            resetForm();
        } catch (error) {
            console.error("Error al guardar la reserva", error);
        }
    };

    const handleEditReservation = (reservation) => {
        setNewReservation({...reservation});
        setSelectedReservationId(reservation.id);
        setIsEditing(true);
        setShowDialog(true);
    };

    const handleDeleteReservation = async (id) => {
        try {
            await apiClient.delete(`/reservation/${id}`);
            if (showAllDates) {
                fetchAllReservations();
            } else {
                fetchReservationsByDate(selectedDate);
            }
        } catch (error) {
            console.error("Error al eliminar la reserva", error);
        }
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        fetchReservationsByDate(newDate);
    };

    const resetForm = () => {
        setNewReservation({
            name: '',
            phone: '',
            guests: '',
            table: '',
            date: '',
            time: '',
            message: '',
            branch: Cookies.get("user_branch_id")
        });
        setIsEditing(false);
        setSelectedReservationId(null);
    };

    const timeOptions = ["12:00", "13:30", "20:00", "22:00"];

    return (
        <div className="min-h-screen bg-gray-100">
            <EmployeeNavbar />
            <div className="container mx-auto px-4 mt-20">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">Gestión de Reservas</h1>

                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => { 
                            resetForm();
                            setShowDialog(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <FaPlus className="inline mr-2" /> Nueva Reserva
                    </button>

                    <div className="flex items-center space-x-4">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="p-2 border rounded-lg"
                            disabled={showAllDates}
                        />
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={showAllDates}
                                onChange={(e) => setShowAllDates(e.target.checked)}
                                className="form-checkbox"
                            />
                            <span>Mostrar todas las fechas</span>
                        </label>
                    </div>
                </div>

                {showDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                {isEditing ? "Editar Reserva" : "Nueva Reserva"}
                            </h2>
                            <form className="space-y-4">
                                <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Nombre"
                                    value={newReservation.name} 
                                    onChange={handleInputChange} 
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                />
                                <input 
                                    type="text" 
                                    name="phone" 
                                    placeholder="Teléfono"
                                    value={newReservation.phone} 
                                    onChange={handleInputChange} 
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                />
                                <select
                                    name="table"
                                    value={newReservation.table}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Selecciona una mesa</option>
                                    {tables.map((table) => (
                                        <option key={table.id} value={table.id}>
                                            Mesa {table.number} (Capacidad: {table.capacity})
                                        </option>
                                    ))}
                                </select>
                                <input 
                                    type="number" 
                                    name="guests" 
                                    placeholder="Número de comensales"
                                    value={newReservation.guests} 
                                    onChange={handleInputChange} 
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                />
                                <input 
                                    type="date" 
                                    name="date" 
                                    value={newReservation.date} 
                                    onChange={handleInputChange} 
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                />
                                <select
                                    name="time"
                                    value={newReservation.time}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {timeOptions.map((time) => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                                <textarea 
                                    name="message" 
                                    placeholder="Mensaje adicional"
                                    value={newReservation.message} 
                                    onChange={handleInputChange} 
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                />
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={handleCreateReservation}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out"
                                    >
                                        {isEditing ? "Guardar" : "Crear"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowDialog(false)}
                                        className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-lg transition duration-300 ease-in-out"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">
                        {showAllDates ? "Todas las Reservas" : `Reservas para ${selectedDate}`}
                    </h2>
                    <ul className="space-y-4">
                        {reservations.map((reservation) => (
                            <li key={reservation.id} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xl font-semibold text-gray-800 mb-2">{reservation.name}</p>
                                        <div className="flex space-x-4 text-gray-600">
                                            <p className="flex items-center"><FaChair className="mr-2" /> Mesa: {reservation.table}</p>
                                            <p className="flex items-center"><FaUsers className="mr-2" /> Comensales: {reservation.guests}</p>
                                            <p className="flex items-center"><FaClock className="mr-2" /> Hora: {reservation.time}</p>
                                            <p className="flex items-center"><FaCalendarAlt className="mr-2" /> Fecha: {reservation.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleEditReservation(reservation)}
                                            className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
                                        >
                                            <FaEdit size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteReservation(reservation.id)}
                                            className="text-red-600 hover:text-red-800 transition duration-300 ease-in-out"
                                        >
                                            <FaTrash size={20} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Reservations;
