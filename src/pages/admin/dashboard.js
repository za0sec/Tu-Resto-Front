import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminNavbar from '../components/AdminNavbar';
import cookie from 'cookie';
import Cookies from "js-cookie";
import config from "@/pages/utils/config";
import apiClient from "@/pages/utils/apiClient";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { FaChevronDown } from "react-icons/fa";

export default function Dashboard() {
    const router = useRouter();
    const [recentActivities, setRecentActivities] = useState([]);
    const [firstName, setFirstName] = useState(null);
    const [employees, setemployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(new Date());
    const [restaurants, setRestaurants] = useState([]);
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRestaurant, setNewRestaurant] = useState({ name: '', website: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const first_name = Cookies.get('user_first_name');
                if (first_name) {
                    setFirstName(first_name);
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
                setError('Error al cargar los datos del usuario');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [restaurantsResponse, employeesResponse] = await Promise.all([
                    apiClient.get('/restaurants'),
                    apiClient.get('/employees')
                ]);

                if (restaurantsResponse.status === 200) {
                    setRestaurants(restaurantsResponse.data);
                    setTotalRestaurants(restaurantsResponse.data.length);
                } else {
                    setError('Error al obtener los restaurantes');
                }

                if (employeesResponse.status === 200) {
                    setTotalEmployees(employeesResponse.data.length);
                    setemployees(employeesResponse.data);
                } else {
                    setError('Error al obtener los empleados');
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
                setError('Error al cargar los datos');
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    function handleDateChange(selectedDate) {
        setDate(selectedDate);
    }

    const navigateToemployee = (employeeId) => {
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewRestaurant({ name: '', website: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRestaurant({ ...newRestaurant, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/restaurant/create', newRestaurant);
            if (response.status === 201) {
                closeModal();
                const updatedRestaurants = await apiClient.get('/restaurants');
                setRestaurants(updatedRestaurants.data);
                setTotalRestaurants(updatedRestaurants.data.length);
            }
        } catch (error) {
            console.error('Error al crear el restaurante:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col overflow-auto">
            <AdminNavbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-24">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Buenos días, <span className="text-primary">{firstName}</span>
                    </h1>
                    <button
                        onClick={openModal}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primaryDark transition duration-300 ease-in-out"
                    >
                        Agregar Nuevo Restaurante
                    </button>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-2xl font-bold text-gray-900">Agregar Nuevo Restaurante</h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre del Restaurante</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newRestaurant.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
                                    <input
                                        type="url"
                                        id="website"
                                        name="website"
                                        value={newRestaurant.website}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="mb-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen General</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50 p-6 rounded-lg shadow-md transition-all duration-500 hover:shadow-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-gray-600">Restaurantes Activos</span>
                                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <span className="text-4xl font-bold text-blue-600 animate-pulse">{totalRestaurants}</span>
                            </div>
                            <div className="bg-green-50 p-6 rounded-lg shadow-md transition-all duration-500 hover:shadow-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-gray-600">Ingresos Totales</span>
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <span className="text-4xl font-bold text-green-600">
                                    <span className="inline-block animate-count-up" data-target="45678.90">$0</span>
                                </span>
                            </div>
                            <div className="bg-yellow-50 p-6 rounded-lg shadow-md transition-all duration-500 hover:shadow-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-gray-600">Nuevos Clientes (Mes)</span>
                                    <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <span className="text-4xl font-bold text-yellow-600">
                                    <span className="inline-block animate-count-up" data-target="18">0</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Actividad Reciente</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                "Nuevo restaurante registrado: 'Sabores del Mar'",
                                "Actualización de plan: 'La Pizzería' pasó a Premium",
                                "Solicitud de soporte: 'Café del Centro'",
                                "Nuevo employee añadido: 'Juan Pérez'",
                                "Actualización de menú: 'El Rincón Gourmet'",
                                "Nuevo módulo implementado: 'Gestión de Inventario'"
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
                                <h3 className="text-lg font-semibold mb-2">Tasa de Crecimiento</h3>
                                <p className="text-2xl font-bold text-green-600">+5.2%</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Satisfacción del Cliente</h3>
                                <p className="text-2xl font-bold text-blue-600">92%</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Tickets de Soporte Abiertos</h3>
                                <p className="text-2xl font-bold text-yellow-600">7</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurantes Destacados</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleados</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Array.isArray(restaurants) && restaurants.slice(0, 3).map((restaurant, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">{restaurant.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{restaurant.location}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{restaurant.plan}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{restaurant.employees.length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Empleados Activos</h2>
                        <ul className="space-y-4">
                            {employees.map((employee, index) => (
                                <li key={index} className="flex justify-between items-center border-b pb-2">
                                    <div>
                                        <p className="font-semibold">{employee.user.first_name} {employee.user.last_name}</p>
                                        <p className="text-sm text-gray-600">{employee.user.email}</p>
                                    </div>
                                    <span className="px-2 py-1 rounded-full text-sm bg-blue-200 text-blue-800">
                                        {employee.restaurants ? employee.restaurants.length : 0} Locales Asignados
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </main>
        </div>
    );
}
