import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CountersSection from './components/CountersSection';
import LoginModal from "./components/LoginModal";
import { useRouter } from "next/router";
import Subscription from './components/Subscription';

export default function Home({ token = true }) {
    const router = useRouter();

    const [visitedClients, setVisitedClients] = useState(0);
    const [counter1, setCounter1] = useState(50);
    const [counter2, setCounter2] = useState(15);
    const [counter3, setCounter3] = useState(10);

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div className="bg-gray-100 min-h-screen flex flex-col overflow-auto">
            <Navbar openModal={openModal} />
            <div className="w-full">
                <div className="relative z-10 pb-8 bg-gray-100 rounded-lg sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32 ml-20">
                    <HeroSection openModal={openModal} />
                    <Subscription />
                </div>
            </div>
            <LoginModal isOpen={isModalOpen} closeModal={closeModal} />
        </div>
    );
}
