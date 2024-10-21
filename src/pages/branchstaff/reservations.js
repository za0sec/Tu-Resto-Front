import React, { useState, useEffect } from "react";
import apiClient from "/utils/apiClient";
import EmployeeNavbar from "@/components/EmployeeNavbar";
import Cookies from "js-cookie";

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]); // Estado para almacenar las mesas
    const [showDialog, setShowDialog] = useState(false); 
    const [isEditing, setIsEditing] = useState(false); // Estado para editar
    const [selectedReservationId, setSelectedReservationId] = useState(null); // ID de la reserva seleccionada
    const [newReservation, setNewReservation] = useState({
        name: '',
        phone: '',
        guests: '',
        table: '',
        date: '',
        time: '',
        message: '',
        branch: Cookies.get("user_branch_id") // Usar el branch ID desde la cookie
    });

    useEffect(() => {
        fetchReservations();
        fetchTables();  // Obtener las mesas al cargar el componente
    }, []);

    const fetchReservations = async () => {
        try {
            const branchId = Cookies.get("user_branch_id");
            const response = await apiClient.get(`/branch/${branchId}/reservations`);
            setReservations(response.data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const fetchTables = async () => {
        try {
            const branchId = Cookies.get("user_branch_id");
            const response = await apiClient.get(`/branch/${branchId}/tables`);
            setTables(response.data); // Guardar las mesas obtenidas en el estado
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReservation({ ...newReservation, [name]: value });
    };

    const handleCreateReservation = async () => {
        try {
            if (isEditing && selectedReservationId) {
                // Si estamos editando, actualizamos la reserva
                await apiClient.put(`/reservation/${selectedReservationId}`, newReservation);
            } else {
                // Si es una nueva reserva, la creamos
                await apiClient.post("/reservation/create", newReservation);
            }
            setShowDialog(false); // Cerrar el diálogo después de crear o editar la reserva
            fetchReservations();  // Refrescar la lista de reservas
            resetForm();  // Resetear el formulario
        } catch (error) {
            console.error("Error saving reservation:", error);
        }
    };

    const handleEditReservation = (reservation) => {
        setNewReservation({
            name: reservation.name,
            phone: reservation.phone,
            guests: reservation.guests,
            table: reservation.table,
            date: reservation.date,
            time: reservation.time,
            message: reservation.message,
            branch: reservation.branch
        });
        setSelectedReservationId(reservation.id);
        setIsEditing(true);
        setShowDialog(true);  // Mostrar el diálogo con los datos cargados
    };

    const handleDeleteReservation = async (id) => {
        try {
            await apiClient.delete(`/reservation/${id}`);
            fetchReservations();  // Refrescar la lista después de borrar
        } catch (error) {
            console.error("Error deleting reservation:", error);
        }
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

    // Crear opciones de tiempo con intervalos de 1 hora y media
    const timeOptions = ["20:00", "21:30", "23:00"];

    return (
        <div className="min-h-screen bg-gray-100">
            <EmployeeNavbar />
            <div className="container mx-auto mb-3 mt-20 max-w-lg"> {/* Reducir el ancho */}
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    Reservas
                </h1>

                {/* Botón para abrir el diálogo de crear reserva */}
                <button
                    onClick={() => { 
                        resetForm();
                        setShowDialog(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded">
                    Crear Reserva
                </button>

                {/* Mostrar el diálogo solo si showDialog es true */}
                {showDialog && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                            <h2 className="text-lg font-bold mb-4">
                                {isEditing ? "Editar Reserva" : "Crear Nueva Reserva"}
                            </h2>

                            <form>
                                <label className="block mb-2">
                                    Nombre:
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={newReservation.name} 
                                        onChange={handleInputChange} 
                                        className="border p-2 rounded w-full mb-2" 
                                    />
                                </label>

                                <label className="block mb-2">
                                    Teléfono:
                                    <input 
                                        type="text" 
                                        name="phone" 
                                        value={newReservation.phone} 
                                        onChange={handleInputChange} 
                                        className="border p-2 rounded w-full mb-2" 
                                    />
                                </label>

                                <label className="block mb-2">
                                    Número de Mesa:
                                    <select
                                        name="table"
                                        value={newReservation.table}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded w-full mb-2">
                                        <option value="">Selecciona una mesa</option>
                                        {tables.map((table) => (
                                            <option key={table.id} value={table.id}>
                                                Mesa {table.number} (Capacidad: {table.capacity})
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block mb-2">
                                    Capacidad:
                                    <input 
                                        type="number" 
                                        name="guests" 
                                        value={newReservation.guests} 
                                        onChange={handleInputChange} 
                                        className="border p-2 rounded w-full mb-2" 
                                    />
                                </label>

                                <label className="block mb-2">
                                    Fecha:
                                    <input 
                                        type="date" 
                                        name="date" 
                                        value={newReservation.date} 
                                        onChange={handleInputChange} 
                                        className="border p-2 rounded w-full mb-2" 
                                    />
                                </label>

                                <label className="block mb-2">
                                    Hora:
                                    <select
                                        name="time"
                                        value={newReservation.time}
                                        onChange={handleInputChange}
                                        className="border p-2 rounded w-full mb-2">
                                        {timeOptions.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block mb-2">
                                    Mensaje Adicional:
                                    <textarea 
                                        name="message" 
                                        value={newReservation.message} 
                                        onChange={handleInputChange} 
                                        className="border p-2 rounded w-full mb-2" 
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={handleCreateReservation}
                                    className="bg-green-500 text-white px-4 py-2 rounded w-full">
                                    {isEditing ? "Guardar Cambios" : "Crear"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowDialog(false)}
                                    className="bg-red-500 text-white px-4 py-2 rounded w-full mt-2">
                                    Cancelar
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Reservas Activas</h2>
                    <ul>
                        {reservations.map((reservation) => (
                            <li key={reservation.id} className="border-b py-2">
                                <div>
                                    <strong>Nombre:</strong> {reservation.name}
                                </div>
                                <div>
                                    <strong>Mesa:</strong> {reservation.table}
                                </div>
                                <div>
                                    <strong>Capacidad:</strong> {reservation.guests}
                                </div>
                                <div>
                                    <strong>Hora:</strong> {reservation.time}
                                </div>
                                <button
                                    onClick={() => handleEditReservation(reservation)}
                                    className="text-blue-500 mt-2">Editar</button>
                                <button
                                    onClick={() => handleDeleteReservation(reservation.id)}
                                    className="text-red-500 ml-4 mt-2">Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Reservations;
