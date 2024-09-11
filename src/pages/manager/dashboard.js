import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ManagerNavbar from '../components/ManagerNavbar';
import cookie from 'cookie';
import Cookies from "js-cookie";
import config from "@/pages/utils/config";
import apiClient from "@/pages/utils/apiClient";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { FaChevronDown, FaBuilding } from "react-icons/fa";

export default function Dashboard() {
    const router = useRouter();
    const [recentActivities, setRecentActivities] = useState([]);
    const [firstName, setFirstName] = useState(null);
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(new Date());
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeType, setEmployeeType] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const first_name = Cookies.get('user_first_name');
                const response = await apiClient.get(`/user/profile`);
                const ordersData = await apiClient.get(`/orders/daily/${date.toISOString().split('T')[0]}`);
                // const ordersData = await apiClient.get(`/orders`);
                setOrders(ordersData.data);
                setUserData(response.data);
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
    }, [date]);

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

    function handleDateChange(selectedDate) {
        setDate(selectedDate);
    }

    const navigateToSupervisor = (supervisorId) => {
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEmployeeType('');
    };

    const handleEmployeeTypeChange = (type) => {
        setEmployeeType(type);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const employeeData = {
            user: {
                username: formData.get('username'),
                password: formData.get('password'),
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                email: formData.get('email')
            },
            phone: formData.get('phone'),
            restaurant: userData.restaurant.id
        };

        try {
            let endpoint;
            switch (employeeType) {
                case 'waiter':
                    endpoint = '/users/waiter/create';
                    break;
                case 'cashier':
                    endpoint = '/users/cashier/create';
                    break;
                case 'kitchen':
                    endpoint = '/users/kitchen/create';
                    break;
                default:
                    throw new Error('Tipo de empleado no válido');
            }

            const response = await apiClient.post(endpoint, employeeData);
            console.log('Empleado creado:', response.data);
            closeModal();
        } catch (error) {
            console.error('Error al crear empleado:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col overflow-auto">
            <ManagerNavbar restaurantId={userData?.restaurant?.id} />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-24">
                <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Hola, <span className="text-primary">{firstName}</span>
                        </h1>
                        <div className="flex items-center space-x-4">
                            <button onClick={openModal} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primaryDark transition duration-300">
                                Añadir Empleado
                            </button>
                            <DatePicker
                                selected={date}
                                onChange={handleDateChange}
                                className="bg-white text-gray-800 p-2 rounded-md border border-gray-300"
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Fecha"
                            />
                        </div>
                    </div>

                    {userData && userData.restaurant && (
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
                            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                                <FaBuilding className="mr-2" />
                                Restaurant
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-primary text-2xl"> <strong className="text-gray-800">Nombre: </strong>{userData.restaurant.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700"><strong>Sitio Web:</strong> <a href={userData.restaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{userData.restaurant.website}</a></p>
                                    <p className="text-gray-700"><strong>Suscripción:</strong> {Object.keys(userData.restaurant.subscriptions).length > 0 ? 'Activa' : 'Inactiva'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-100 p-4 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <h3 className="text-xl font-semibold mb-2">Pedidos Hoy</h3>
                            <p className="text-3xl font-bold">{orders?.length}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <h3 className="text-xl font-semibold mb-2">Ingresos</h3>
                            <p className="text-3xl font-bold">${orders?.reduce((total, order) => total + order.total, 0)}</p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">Mesas Ocupadas</h3>
                            <p className="text-3xl font-bold">8/20</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pedidos Activos</h2>
                        <ul className="space-y-4">
                            {orders.map((order) => (
                                <li key={order} className="flex justify-between items-center border-b pb-2">
                                    <div>
                                        <p className="font-semibold">Pedido  #{order?.id}</p>
                                        <p className="text-sm text-gray-600"> {order?.items.length} items - ${order?.total}</p>
                                    </div>
                                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-sm">
                                        En Preparación
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Menú del Día</h2>
                        <ul className="space-y-4">
                            {['Ensalada César', 'Pasta Alfredo', 'Filete de Salmón'].map((item, index) => (
                                <li key={index} className="flex justify-between items-center">
                                    <span>{item}</span>
                                    <span className="text-green-600 font-semibold">Disponible</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Reservaciones de Hoy</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hora
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Personas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {[
                                    { name: 'Juan Pérez', time: '19:00', people: 4, status: 'Confirmada' },
                                    { name: 'María García', time: '20:30', people: 2, status: 'Pendiente' },
                                ].map((reservation, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{reservation.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{reservation.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{reservation.people}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reservation.status === 'Confirmada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {reservation.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative mx-auto p-8 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="text-center">
                            <h3 className="text-2xl leading-6 font-medium text-gray-900 mb-6">Añadir Nuevo Empleado</h3>
                            <div className="mt-2">
                                {!employeeType ? (
                                    <div className="w-full">
                                        <h4 className="mb-6 text-lg">Seleccione tipo de empleado:</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <button
                                                onClick={() => handleEmployeeTypeChange('waiter')}
                                                className="px-6 py-3 bg-blue-100 text-blue-600 text-lg font-medium rounded-full shadow-sm hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 ease-in-out transform hover:scale-105"
                                            >
                                                Empleado
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                                        <input className="p-2 border rounded" type="text" name="username" placeholder="Nombre de usuario" required />
                                        <input className="p-2 border rounded" type="password" name="password" placeholder="Contraseña" required />
                                        <input className="p-2 border rounded" type="text" name="first_name" placeholder="Nombre" required />
                                        <input className="p-2 border rounded" type="text" name="last_name" placeholder="Apellido" required />
                                        <input className="p-2 border rounded" type="email" name="email" placeholder="Correo electrónico" required />
                                        <input className="p-2 border rounded" type="tel" name="phone" placeholder="Teléfono" required />
                                        <button type="submit" className="col-span-2 px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                                            Crear Empleado
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
