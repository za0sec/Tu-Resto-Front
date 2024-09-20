import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ManagerNavbar from '../../../components/ManagerNavbar';
import cookie from 'cookie';
import Cookies from "js-cookie";
import config from "/utils/config";
import apiClient from "/utils/apiClient";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { FaChevronDown } from "react-icons/fa";
import withAuth from '../../../components/withAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { FaUser, FaPhone, FaCalendar, FaBuilding, FaTrash } from 'react-icons/fa';
import NewBranchDialog from '../newBranchDialog';

function Branch() {
    const router = useRouter();
    const { id } = router.query;

    const [firstName, setFirstName] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [branches, setBranches] = useState([]);
    const [restaurantId, setRestaurantId] = useState(null);
    const [branch, setBranch] = useState(null);

    const [totalEmployees, setTotalEmployees] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        user: {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
        },
        phone: '',
        branch: '',
    });

    const [editingEmployeeId, setEditingEmployeeId] = useState(null);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRestaurantId(decodedToken.restaurant_id);
                const first_name = decodedToken.first_name;
                setFirstName(first_name);
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
        }
    }, [restaurantId]);

    useEffect(() => {
        if (id) {
            fetchBranchData();
        }
    }, [id]);

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
        }
    };

    const fetchBranchData = async () => {
        try {
            const response = await apiClient.get(`/branch/${id}`);
            if (response.status === 200) {
                const branchData = response.data;
                setBranch(branchData);

                const employeesData = branchData.branch_employees || [];

                const employeesList = employeesData.map((employee) => {
                    return {
                        user: employee.user,
                        phone: employee.phone,
                        branch: employee.branch,
                        started_at: employee.started_at,
                    };
                });

                setEmployees(employeesList);
                setTotalEmployees(employeesList.length);
            } else {
                setError('Error al obtener la sucursal');
            }
        } catch (error) {
            console.error('Error al obtener datos:', error);
            setError('Error al cargar los datos');
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
                    [name]: value,
                },
            });
        } else {
            setNewEmployee({ ...newEmployee, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Establecemos la sucursal actual en el nuevo empleado
            const employeeData = {
                ...newEmployee,
                branch: id,
            };

            const response = await apiClient.post('/branchStaff/create', employeeData);
            if (response.status === 201) {
                setIsModalOpen(false);
                fetchBranchData();
                setNewEmployee({
                    user: {
                        first_name: '',
                        last_name: '',
                        username: '',
                        email: '',
                    },
                    phone: '',
                    branch: '',
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
                fetchBranchData();
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
        <div className="bg-gray-100 min-h-screen flex flex-col overflow-auto">
            <ManagerNavbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-24">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-5xl font-bold text-gray-800">
                        Buenos días, <span className="text-primary">{firstName}</span>
                    </h1>
                </div>

                <div className="mb-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen de la Sucursal</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50 p-6 rounded-lg shadow-md transition-all duration-500 hover:shadow-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-gray-600">Nombre de la Sucursal</span>
                                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <span className="text-3xl font-bold text-blue-600">{branch?.name}</span>
                            </div>
                            <div className="bg-green-50 p-6 rounded-lg shadow-md transition-all duration-500 hover:shadow-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-gray-600">Dirección</span>
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <span className="text-2xl font-bold text-green-600">{branch?.address}</span>
                            </div>
                            <div className="bg-yellow-50 p-6 rounded-lg shadow-md transition-all duration-500 hover:shadow-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-gray-600">Total de Empleados</span>
                                    <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <span className="text-4xl font-bold text-yellow-600">{totalEmployees}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Actividad Reciente</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                "Nuevo empleado registrado: 'Juan Pérez'",
                                "Actualización de horario: 'María Gómez'",
                                "Solicitud de vacaciones: 'Carlos Rodríguez'",
                                "Nuevo pedido recibido: #1234",
                                "Actualización de inventario",
                                "Reporte de ventas generado"
                            ].map((activity, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <p className="flex items-center">
                                        <span className="mr-2 text-blue-500">•</span>
                                        <span>{activity}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Estadísticas Rápidas</h2>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Ventas del Día</h3>
                                <p className="text-2xl font-bold text-green-600">$1,234.56</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Pedidos Pendientes</h3>
                                <p className="text-2xl font-bold text-blue-600">7</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Satisfacción del Cliente</h3>
                                <p className="text-2xl font-bold text-yellow-600">4.8/5</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Empleados de la Sucursal</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primaryDark transition duration-300"
                        >
                            Agregar Empleado
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-50">
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Usuario</th>
                                    <th className="py-3 px-6 text-left">Email</th>
                                    <th className="py-3 px-6 text-left">Teléfono</th>
                                    <th className="py-3 px-6 text-left">Fecha de Inicio</th>
                                    <th className="py-3 px-6 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {employees.map((employee) => (
                                    <React.Fragment key={employee.user.id}>
                                        <tr
                                            className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => toggleEmployeeEdit(employee.user.id)}
                                        >
                                            <td className="py-3 px-6 text-left whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaUser className="mr-2" />
                                                    <span>{employee.user.username}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <span>{employee.user.email}</span>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <div className="flex items-center">
                                                    <FaPhone className="mr-2" />
                                                    <span>{employee.phone}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <div className="flex items-center">
                                                    <FaCalendar className="mr-2" />
                                                    <span>
                                                        {employee.started_at
                                                            ? new Date(employee.started_at).toLocaleDateString()
                                                            : 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex item-center justify-center">
                                                    <button
                                                        className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                                                        onClick={(e) => handleDeleteClick(e, employee)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <AnimatePresence>
                                            {editingEmployeeId === employee.user.id && (
                                                <motion.tr
                                                    className="bg-gray-50"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <td colSpan="5" className="py-3 px-6">
                                                        <form onSubmit={(e) => handleEmployeeUpdate(e, employee.user.id)}>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <input
                                                                    type="text"
                                                                    name="first_name"
                                                                    defaultValue={employee.user.first_name}
                                                                    className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                                                    required
                                                                />
                                                                <input
                                                                    type="text"
                                                                    name="last_name"
                                                                    defaultValue={employee.user.last_name}
                                                                    className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                                                    required
                                                                />
                                                                <input
                                                                    type="email"
                                                                    name="email"
                                                                    defaultValue={employee.user.email}
                                                                    className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                                                    required
                                                                />
                                                                <input
                                                                    type="text"
                                                                    name="phone"
                                                                    defaultValue={employee.phone}
                                                                    className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="mt-4 flex justify-end">
                                                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                                                                    Guardar
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEditingEmployeeId(null)}
                                                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                                                >
                                                                    Cancelar
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isModalOpen && (
                    <NewBranchDialog
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                )}
            </main>
        </div>
    );
}

export default withAuth(Branch, ['Manager']);