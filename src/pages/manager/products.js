import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ManagerNavbar from '../components/ManagerNavbar';
import Cookies from "js-cookie";
import apiClient from "@/pages/utils/apiClient";
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function Categories() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', photo: '' });
    const [firstName, setFirstName] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const first_name = Cookies.get('user_first_name');
                if (first_name) {
                    setFirstName(first_name);
                } else {
                    router.push('/');
                    return;
                }

                const response = await apiClient.get('/categories');
                if (response.status === 200) {
                    setCategories(response.data);
                } else {
                    setError('Error al obtener las categorías');
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
                setError('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/category/create', newCategory);
            if (response.status === 201) {
                setIsModalOpen(false);
                const updatedCategories = await apiClient.get('/categories');
                setCategories(updatedCategories.data);
            }
        } catch (error) {
            console.error('Error al crear la categoría:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col overflow-auto">
            <ManagerNavbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-24">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-5xl font-bold text-gray-800">
                        Bienvenido, <span className="text-primary">{firstName}</span>
                    </h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                        <FaPlus className="mr-2" /> Agregar Categoría
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Categorías</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-gray-50 p-6 rounded-lg shadow-md transition-all duration-500 hover:shadow-xl">
                                <img src={category.photo} alt={category.name} className="w-full h-48 object-cover rounded-md mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
                                <p className="text-gray-600 mb-4">{category.description}</p>
                                <div className="flex justify-end space-x-2">
                                    <button className="text-blue-500 hover:text-blue-700">
                                        <FaEdit />
                                    </button>
                                    <button className="text-red-500 hover:text-red-700">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                                        <input type="text" name="name" id="name" value={newCategory.name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                                        <textarea name="description" id="description" value={newCategory.description} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="photo" className="block text-gray-700 text-sm font-bold mb-2">URL de la foto</label>
                                        <input type="text" name="photo" id="photo" value={newCategory.photo} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                        Guardar
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
