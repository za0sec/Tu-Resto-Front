import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CountersSection from './components/CountersSection';
import LoginModal from "./components/LoginModal";
import { useRouter } from "next/router";

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
        <div className="bg-gray-100 overflow-hidden min-h-screen flex flex-col px-4 sm:px-6 lg:px-24">
            <div className="sticky top-0 z-50">
                <Navbar openModal={openModal} />
            </div>
            <div className="w-full">
                <div className="relative z-10 pb-8 bg-gray-100 rounded-lg sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
                    <HeroSection openModal={openModal} />
                    <br /><br />
                    <CountersSection visitedClients={visitedClients} counter1={counter1} counter2={counter2} counter3={counter3} />
                </div>
            </div>
            <LoginModal isOpen={isModalOpen} closeModal={closeModal} />
        </div>
    );
}
