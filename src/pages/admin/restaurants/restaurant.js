import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminNavbar from '../../components/AdminNavbar';
import apiClient from "../../utils/apiClient";
import { FaMapMarkerAlt, FaUsers, FaUtensils, FaUserTie, FaBuilding, FaCreditCard } from 'react-icons/fa';
import withAuth from '@/pages/components/withAuth';

function Restaurant() {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { id } = router.query;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newManager, setNewManager] = useState({
        user: {
            username: '',
            first_name: '',
            last_name: '',
            email: ''
        },
        phone: '',
        restaurant: null
    });

    useEffect(() => {
        if (id) {
            fetchRestaurant();
            setNewManager(prevState => ({
                ...prevState,
                restaurant: id
            }));
        }
    }, [id]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setNewManager(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setNewManager(prev => ({ ...prev, [name]: value }));
        }
    };

    const fetchRestaurant = async () => {
        try {
            const response = await apiClient.get(`/restaurant/${id}`);
            if (response.status === 200) {
                setRestaurant(response.data);
            } else {
                setError('Error al obtener los datos del restaurante');
            }
        } catch (error) {
            console.error('Error al obtener datos:', error);
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };


    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiClient.post('/users/manager/create', newManager);
            if (response.status === 201) {
                closeModal();
                fetchRestaurant();
            }
        } catch (error) {
            console.error('Error al crear el manager:', error);
        } finally {
            setIsLoading(false);
        }
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
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <AdminNavbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="relative mb-8">
                    <div className="h-64 w-full bg-cover bg-center rounded-t-lg" style={{ backgroundImage: `url(${restaurant.banner || "https://via.placeholder.com/1200x400"})` }}></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-32"></div>
                    <h1 className="absolute bottom-4 left-8 text-4xl font-bold text-white">{restaurant.name}</h1>
                    <button onClick={openModal} className="absolute top-4 right-4 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primaryDark transition duration-300 shadow-md">
                        {restaurant.manager ? 'Cambiar Manager' : 'Asignar Manager'}
                    </button>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Manager</h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="user.username"
                                        value={newManager.user.username}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="user.first_name"
                                        value={newManager.user.first_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="user.last_name"
                                        value={newManager.user.last_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="user.email"
                                        value={newManager.user.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={newManager.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        required
                                    />
                                </div>
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primaryDark transition duration-300 ease-in-out"
                                    >
                                        {isLoading ? (
                                            <div className="flex justify-center items-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            </div>
                                        ) : (
                                            'Crear Manager'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <a href="#" className="block transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                            <div className="bg-pink-100 p-6 rounded-lg shadow-sm h-full">
                                <h2 className="text-2xl font-bold text-pink-700 mb-4 flex items-center">
                                    <FaUserTie className="mr-2" />
                                    Manager
                                </h2>
                                <p className="text-gray-700">
                                    {restaurant.manager ? `${restaurant.manager.user.first_name} ${restaurant.manager.user.last_name}` : 'No asignado'}
                                </p>
                            </div>
                        </a>

                        <a href="#" className="block transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                            <div className="bg-green-100 p-6 rounded-lg shadow-sm h-full">
                                <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
                                    <FaBuilding className="mr-2" />
                                    Sucursales
                                </h2>
                                <p className="text-gray-700">
                                    {restaurant.branches ? restaurant.branches : 0} sucursales
                                </p>
                            </div>
                        </a>

                        <a href="#" className="block transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                            <div className="bg-blue-100 p-6 rounded-lg shadow-sm h-full">
                                <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                                    <FaUsers className="mr-2" />
                                    Empleados
                                </h2>
                                <p className="text-gray-700">
                                    {restaurant.employees ? restaurant.employees : 0} empleados
                                </p>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaCreditCard className="mr-2" />
                        Suscripción
                    </h2>
                    <p className="text-gray-700 mb-4">
                        {restaurant.subscriptions && Object.keys(restaurant.subscriptions).length > 0
                            ? 'Suscripción activa'
                            : 'Sin suscripción activa'}
                    </p>
                    <button className="bg-purple-400 text-white px-6 py-3 rounded-lg hover:bg-purple-500 transition duration-300 shadow-md">
                        Gestionar Suscripción
                    </button>
                </div>

                <div className="bg-white shadow-md rounded-lg p-8 mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Información Adicional</h2>
                    <p className="text-gray-600 mb-2">
                        <strong>Sitio Web:</strong> <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{restaurant.website}</a>
                    </p>
                    <p className="text-gray-600">
                        <strong>Fecha de Registro:</strong> {restaurant?.created_at ? new Date(restaurant.created_at).toLocaleDateString() : 'No disponible'}
                    </p>
                </div>
            </main>
        </div>
    );
}

export default withAuth(Restaurant, ['Admin']);
