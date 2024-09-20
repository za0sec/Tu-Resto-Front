import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LoginModal from "./components/LoginModal";
import { useRouter } from "next/router";
import Subscription from './components/subscription';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import config from "@/pages/utils/config";
import React from 'react';
import { FaMobileAlt, FaTabletAlt, FaDesktop } from 'react-icons/fa';

export default function Home({ token = true }) {
    const router = useRouter();

    const [visitedClients, setVisitedClients] = useState(0);
    const [counter1, setCounter1] = useState(50);
    const [counter2, setCounter2] = useState(15);
    const [counter3, setCounter3] = useState(10);

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const checkAuthAndRedirect = async () => {
            const accessToken = Cookies.get('accessToken');
            const userRole = Cookies.get('user_role');

            if (accessToken) {
                try {
                    const response = await fetch(`${config.apiUrl}/user/profile`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok && userRole) {
                        router.replace(`/${userRole.toLowerCase()}/dashboard`);
                    } else {
                        Cookies.remove('accessToken');
                        Cookies.remove('refreshToken');
                        Cookies.remove('user_role');
                    }
                } catch (error) {
                    console.error('Error al verificar el token:', error);
                    Cookies.remove('accessToken');
                    Cookies.remove('refreshToken');
                    Cookies.remove('user_role');
                }
            }
            // Si no hay token, el usuario se queda en la página de inicio
        };

        checkAuthAndRedirect();
    }, []);

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    if (loading) {
        return <p className="text-gray-700">Cargando...</p>;
    }
    return (
        <div className="min-h-screen flex flex-col overflow-hidden">
            <Navbar openModal={openModal} />
            <div className="relative w-full">
                {/* Fondo con curvas suaves */}
                <div className="absolute inset-0 bg-gradient-to-b from-white to-purple-100 transform skew-y-3"></div>

                <div className="relative z-10">
                    <HeroSection openModal={openModal} />

                    {/* Sección de Funcionalidades */}
                    <section id="funcionalidades" className="py-20 px-8">
                        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Funcionalidades</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'Gestión de Reservas',
                                    description: 'Optimiza la organización de tus mesas y clientes.',
                                    icon: 'fas fa-calendar-check'
                                },
                                {
                                    title: 'Control de Inventario',
                                    description: 'Mantén un registro preciso de tus suministros.',
                                    icon: 'fas fa-boxes'
                                },
                                {
                                    title: 'Análisis de Datos',
                                    description: 'Toma decisiones informadas con estadísticas detalladas.',
                                    icon: 'fas fa-chart-line'
                                }
                            ].map((feature, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-lg overflow-hidden relative group">
                                    <div className="transition-all duration-300 ease-in-out transform group-hover:-translate-y-full">
                                        <i className={`${feature.icon} text-4xl text-indigo-600 mb-4`}></i>
                                        <h3 className="text-xl font-semibold mb-4 text-indigo-600">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-indigo-600 text-white p-6 transition-all duration-300 ease-in-out transform translate-y-full group-hover:translate-y-0 flex items-center justify-center text-center">
                                        <p className="text-lg">Descubre cómo esta funcionalidad puede revolucionar tu negocio</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Sección de Dispositivos */}
                    <section id="dispositivos" className="py-20 px-8">
                        <h2 className="text-5xl font-bold text-center mb-16 text-gray-800 animate-fade-in-down">
                            Dispositivos Compatibles
                        </h2>
                        <div className="flex flex-wrap justify-center gap-16">
                            {[
                                { name: 'Móvil', icon: FaMobileAlt, description: 'Accede a tu restaurante desde cualquier lugar con nuestra app móvil.' },
                                { name: 'Tablet', icon: FaTabletAlt, description: 'Perfecta para tomar pedidos en mesa o gestionar el inventario.' },
                                { name: 'Escritorio', icon: FaDesktop, description: 'Gestiona tu negocio con todas las funcionalidades en tu ordenador.' }
                            ].map((device, index) => (
                                <div key={index} className="relative group">
                                    <div className="text-center transition-all duration-300 ease-in-out cursor-pointer">
                                        <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl flex items-center justify-center animate-float group-hover:shadow-2xl">
                                            <device.icon className="text-5xl text-white" />
                                        </div>
                                        <p className="text-2xl font-semibold text-gray-800">{device.name}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-10 flex items-center justify-center">
                                        <p className="text-gray-700 text-center px-4">{device.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
            <LoginModal isOpen={isModalOpen} closeModal={closeModal} />
        </div>
    );
}
