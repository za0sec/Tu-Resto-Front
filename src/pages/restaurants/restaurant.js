import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import apiClient from "/utils/apiClient";
import BranchCard from "../../components/BranchCard";
import { Toaster } from 'react-hot-toast';

export default function RestaurantBranches() {
    const router = useRouter();
    const { id } = router.query;

    const [branches, setBranches] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            fetchRestaurantAndBranches();
        }
    }, [id]);

    const fetchRestaurantAndBranches = async () => {
        try {
            // Obtener datos del restaurante
            const restaurantResponse = await apiClient.get(`/restaurant/${id}`);
            if (restaurantResponse.status === 200) {
                setRestaurant(restaurantResponse.data);
            }

            // Obtener sucursales
            const branchesResponse = await apiClient.get(`/branches/${id}`);
            if (branchesResponse.status === 200) {
                setBranches(branchesResponse.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Error al cargar los datos. Por favor, intenta de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const redirectToBranch = (branch) => {
        window.location.href = `/restaurants/${id}/branches/${branch.id}/reservation`;
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
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Error
                    </h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
            <main className="container mx-auto px-4 py-20">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        {restaurant?.name}
                    </h1>
                    <p className="text-gray-600">
                        Selecciona una sucursal para hacer tu reserva
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {branches.map((branch) => (
                        <BranchCard
                            key={branch.id}
                            data={branch}
                            isBranch={true}
                            onCardClick={redirectToBranch}
                            showDelete={false}
                        />
                    ))}
                </div>

                {branches.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-600 text-lg">
                            Este restaurante aún no tiene sucursales disponibles.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
} 