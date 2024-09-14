import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ManagerNavbar from '../components/ManagerNavbar';
import cookie from 'cookie';
import Cookies from "js-cookie";
import config from "@/pages/utils/config";
import apiClient from "@/pages/utils/apiClient";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import withAuth from "@/pages/components/withAuth";
import { FaChevronDown, FaBuilding, FaPlus } from "react-icons/fa";
import Reservation from '../components/Reservation';
import ReservationList from './reservations';
import NewBranchDialog from './newBranchDialog';
import ActiveOrders from './dailyOrders';
function Dashboard() {
    const router = useRouter();
    const [firstName, setFirstName] = useState(null);
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(new Date());
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBranch, setNewBranch] = useState({
        name: '',
        address: '',
        phone: '',
        restaurant: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const first_name = Cookies.get('user_first_name');
                const response = await apiClient.get(`/user/profile`);
                setUserData(response.data);
                console.log(response.data);
                if (first_name && response.data && response.data.restaurant) {
                    setFirstName(first_name);
                    const ordersData = await apiClient.get(`/restaurant/${response.data.restaurant.id}/orders/daily/${date.toISOString().split('T')[0]}`);
                    setOrders(ordersData.data);
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
    }, [date, router]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBranch({ ...newBranch, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/branch/create', {
                ...newBranch,
                restaurant: userData.restaurant.id
            });
            if (response.status === 201) {
                setIsModalOpen(false);
                // Aquí puedes agregar lógica adicional después de crear la sucursal
            }
        } catch (error) {
            console.error('Error al crear la sucursal:', error);
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
                            <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primaryDark transition duration-300 flex items-center">
                                <FaPlus className="mr-2" />
                                Añadir Sucursal
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
                        <div className="bg-yellow-100 p-4 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <h3 className="text-xl font-semibold mb-2">Mesas Ocupadas</h3>
                            <p className="text-3xl font-bold">8/20</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">

                    <ActiveOrders orders={orders} />


                    {/* <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Menú del Día</h2>
                        <ul className="space-y-4">
                            {['Ensalada César', 'Pasta Alfredo', 'Filete de Salmón'].map((item, index) => (
                                <li key={index} className="flex justify-between items-center">
                                    <span>{item}</span>
                                    <span className="text-green-600 font-semibold">Disponible</span>
                                </li>
                            ))}
                        </ul>
                    </div> */}
                </div>

                <div className="mt-10">
                    <ReservationList
                        reservations={[
                            { name: 'Juan Pérez', time: '19:00', people: 4, status: 'Confirmada' },
                            { name: 'María García', time: '20:30', people: 2, status: 'Pendiente' },
                        ]}
                    />
                </div>
            </main>

            {isModalOpen && (
                <NewBranchDialog
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}

export default withAuth(Dashboard, ['Manager']);
