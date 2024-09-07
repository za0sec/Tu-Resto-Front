import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import apiClient from "../utils/apiClient";
import { FaMapMarkerAlt, FaUsers, FaUtensils } from 'react-icons/fa';

export default function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRestaurant, setNewRestaurant] = useState({ name: '', website: '' });

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await apiClient.get('/restaurants');
            if (response.status === 200) {
                setRestaurants(response.data);
            } else {
                setError('Error al obtener los restaurantes');
            }
        } catch (error) {
            console.error('Error al obtener datos:', error);
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
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
                fetchRestaurants();
            }
        } catch (error) {
            console.error('Error al crear el restaurante:', error);
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
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <AdminNavbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Nuestros Restaurantes</h1>
                    <button onClick={openModal} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Agregar Restaurante
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {restaurants.map((restaurant) => (
                        <a href={`/admin/restaurants/${restaurant.id}`} key={restaurant.id} className="block">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer">
                                <img
                                    src={restaurant.banner || "https://via.placeholder.com/400x200"}
                                    alt={restaurant.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{restaurant.name}</h2>
                                    <p className="text-gray-600 mb-4">{restaurant.description}</p>
                                    <div className="flex items-center text-gray-500 mb-2">
                                        <FaMapMarkerAlt className="mr-2" />
                                        <span>{restaurant.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 mb-2">
                                        <FaUsers className="mr-2" />
                                        <span>{restaurant.employees.length} empleados</span>
                                    </div>
                                    <div className="flex items-center text-gray-500">
                                        <FaUtensils className="mr-2" />
                                        <span>{restaurant.cuisine}</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </main>

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
                            <div className="mb-4">
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
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primaryDark transition duration-300 ease-in-out"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
