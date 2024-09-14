import { useState, useEffect } from 'react';
import React from 'react';
import ManagerNavbar from '../components/ManagerNavbar';
import apiClient from "../utils/apiClient";
import { FaUser, FaPhone, FaCalendar, FaBuilding, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import withAuth from '@/pages/components/withAuth';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import NewEmployeeDialog from './newEmployeeDialog';
import EmployeePreview from './EmployeePreview';
function Employees() {
    const [employees, setEmployees] = useState([]);
    const [branches, setBranches] = useState([]);
    const [restaurantId, setRestaurantId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        user: {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
        },
        phone: '',
        branch: ''
    });


    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRestaurantId(decodedToken.restaurant_id);
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                setError('Error al obtener la información del restaurante');
            }
        } else {
            setError('No se encontró el token de acceso');
        }
    }, []);

    useEffect(() => {
        if (restaurantId) {
            fetchBranches();
            fetchEmployees();
        }
    }, [restaurantId]);

    const fetchBranches = async () => {
        try {
            const response = await apiClient.get(`/branches/${restaurantId}`);
            if (response.status === 200) {
                setBranches(response.data);
            } else {
                setError('Error al obtener las sucursales');
            }
        } catch (error) {
            console.error('Error al obtener sucursales:', error);
            setError('Error al obtener las sucursales');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await apiClient.get(`/restaurant/${restaurantId}/staff`);
            if (response.status === 200) {
                setEmployees(response.data);
            } else {
                setError('Error al obtener los empleados');
            }
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            setError('Error al obtener los empleados');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (['first_name', 'last_name', 'username', 'email'].includes(name)) {
            setNewEmployee({
                ...newEmployee,
                user: {
                    ...newEmployee.user,
                    [name]: value
                }
            });
        } else {
            setNewEmployee({ ...newEmployee, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/branchStaff/create', newEmployee);
            if (response.status === 201) {
                setIsModalOpen(false);
                fetchEmployees();
                setNewEmployee({
                    user: {
                        first_name: '',
                        last_name: '',
                        username: '',
                        email: '',
                    },
                    phone: '',
                    branch: ''
                });
            }
        } catch (error) {
            console.error('Error al crear el empleado:', error);
        }
    };

    const toggleEmployeeEdit = (employeeId) => {
        setEditingEmployeeId(editingEmployeeId === employeeId ? null : employeeId);
    };

    const handleEmployeeUpdate = async (e, employeeId) => {
        e.preventDefault();
        try {
            const form = e.target;
            const updatedEmployee = {
                user: {
                    first_name: form.first_name.value,
                    last_name: form.last_name.value,
                    email: form.email.value,
                },
                phone: form.phone.value,
                branch: form.branch.value,
            };

            const response = await apiClient.patch(`/branchStaff/${employeeId}`, updatedEmployee);
            if (response.status === 200) {
                setEditingEmployeeId(null);
                fetchEmployees();
            }
        } catch (error) {
            console.error('Error al actualizar el empleado:', error);
        }
    };

    const handleDeleteClick = (e, employee) => {
        e.stopPropagation();
        // Aquí puedes implementar la lógica para eliminar al empleado
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
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <ManagerNavbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Empleados</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Agregar Empleado
                    </button>
                </div>

                <div className="bg-white shadow-md rounded my-6">
                    <table className="min-w-max w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Usuario</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Teléfono</th>
                                <th className="py-3 px-6 text-left">Sucursal</th>
                                <th className="py-3 px-6 text-left">Fecha de Inicio</th>
                                <th className="py-3 px-6 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {employees.map((employee) => (
                                <EmployeePreview
                                    key={employee.user.id}
                                    employee={employee}
                                    branches={branches}
                                    onUpdate={handleEmployeeUpdate}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {isModalOpen && (
                    <NewEmployeeDialog
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmit}
                        branches={branches}
                        isLoading={isLoading}
                    />
                )}
            </main>
        </div>
    );
}

export default withAuth(Employees, 'Manager');
