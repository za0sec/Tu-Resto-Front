import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import apiClient from '/utils/apiClient';
import BranchCard from '../../components/BranchCard';

export default function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await apiClient.get('/restaurants');
            if (response.status === 200) {
                setRestaurants(response.data);
            } else {
                setError('Error al obtener los restaurantes. Intenta refrescar la página.');
            }
        } catch (error) {
            console.error('Error al obtener datos:', error);
            setError('Error al cargar los datos. Intenta refrescar la página.');
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (restaurant) => {
        window.location.href = `/restaurants/restaurant?id=${restaurant.id}`;
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
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Nuestros Restaurantes</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {restaurants.map((restaurant) => (
                        <BranchCard
                            key={restaurant.id}
                            data={restaurant}
                            isBranch={false}
                            onCardClick={handleCardClick}
                            showDelete={false}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}