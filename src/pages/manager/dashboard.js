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
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(new Date());

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

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }



    function handleDateChange(selectedDate) {
        setDate(selectedDate);
    }

    const navigateToSupervisor = (supervisorId) => {
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col overflow-auto">
            <AdminNavbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-24">
                <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Hola, <span className="text-primary">{firstName}</span>
                        </h1>
                        <div className="flex items-center space-x-4">
                            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primaryDark transition duration-300">
                                Nuevo Pedido
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">Pedidos Hoy</h3>
                            <p className="text-3xl font-bold">24</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">Ingresos</h3>
                            <p className="text-3xl font-bold">$1,234.56</p>
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
                            {[1, 2, 3].map((order) => (
                                <li key={order} className="flex justify-between items-center border-b pb-2">
                                    <div>
                                        <p className="font-semibold">Mesa {order}</p>
                                        <p className="text-sm text-gray-600">3 items - $45.00</p>
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
        </div>
    );
}

