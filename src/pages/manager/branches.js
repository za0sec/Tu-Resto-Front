import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import apiClient from "/utils/apiClient";
import withAuth from "../../components/withAuth";
import ManagerNavbar from "../../components/ManagerNavbar";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import DeleteModal from "../../components/Delete";
import BranchCard from "../../components/BranchCard";
import { Toaster, toast } from 'react-hot-toast';

function BranchesPage() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBranch, setCurrentBranch] = useState({
        id: "",
        name: "",
        address: "",
        phone: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [restaurantId, setRestaurantId] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setRestaurantId(decodedToken.restaurant_id);
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                setError("Error al obtener la información del restaurante");
            }
        } else {
            setError("No se encontró el token de acceso");
        }
    }, []);

    useEffect(() => {
        if (restaurantId) {
            fetchBranches();
        }
    }, [restaurantId]);

    const fetchBranches = async () => {
        try {
            const response = await apiClient.get(`/branches/${restaurantId}`);
            setBranches(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching branches:", error);
            setError("Error al cargar las sucursales");
            setLoading(false);
        }
    };

    const handleOpenModal = (branch = null) => {
        if (branch) {
            setCurrentBranch(branch);
            setIsEditMode(true);
        } else {
            setCurrentBranch({ id: "", name: "", address: "", phone: "" });
            setIsEditMode(false);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentBranch({ id: "", name: "", address: "", phone: "" });
        setIsEditMode(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentBranch({ ...currentBranch, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await apiClient.put(
                    `/branch/${currentBranch.id}`,
                    currentBranch
                );
            } else {
                currentBranch.restaurant = restaurantId;
                await apiClient.post("/branch/create", currentBranch);
            }
            fetchBranches();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving branch:", error);
            toast.error("Error al guardar la sucursal. Inténtalo de nuevo más tarde");
            // setError("Error al guardar la sucursal");
        }
    };

    const handleDelete = async (id) => {
        if (
            window.confirm(
                "¿Estás seguro de que quieres eliminar esta sucursal?"
            )
        ) {
            try {
                await apiClient.delete(`/branch/${id}`);
                fetchBranches();
            } catch (error) {
                console.error("Error deleting branch:", error);
                toast.error("Error deleting branch. Intentalo de nuevo más tarde");
                // setError("Error al eliminar la sucursal");
            }
        }
    };

    const redirectToBranch = (branch) => {
        window.location.href = `/manager/branches/branch?id=${branch.id}`;
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
        <div className="min-h-screen">
             <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
            <ManagerNavbar />
            <main className="container mx-auto px-4 py-20">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-600 mb-2">
                        Sucursales
                    </h1>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-secondary text-white px-6 py-3 rounded-full hover:bg-secondaryDark transition duration-300 flex items-center shadow-lg">
                        <FaPlus className="mr-2" />
                        Añadir Sucursal
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {branches.map((branch) => (
                        <BranchCard
                            key={branch.id}
                            data={branch}
                            isBranch={true} // Es una sucursal
                            onCardClick={redirectToBranch}
                            onDeleteClick={(branch) => {
                                setProductToDelete(branch);
                                setIsDeleteModalOpen(true);
                            }}
                        />
                    ))}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4 text-indigo-800">
                                {isEditMode
                                    ? "Editar Sucursal"
                                    : "Añadir Nueva Sucursal"}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label
                                        htmlFor="name"
                                        className="block text-gray-700 text-sm font-bold mb-2">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={currentBranch.name}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="address"
                                        className="block text-gray-700 text-sm font-bold mb-2">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={currentBranch.address}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="phone"
                                        className="block text-gray-700 text-sm font-bold mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={currentBranch.phone}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300">
                                        {isEditMode ? "Actualizar" : "Crear"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={() => {
                        handleDelete(currentBranch.id);
                        setIsDeleteModalOpen(false);
                    }}
                    itemName="esta sucursal"
                />
            </main>
        </div>
    );
}

export default withAuth(BranchesPage, ["Manager"]);
