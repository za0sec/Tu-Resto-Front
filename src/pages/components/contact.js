import React from 'react';
import Navbar from './Navbar';
import LoginModal from './LoginModal';
import { useState } from 'react';

const Contact = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    return (
        <div>
            <Navbar openModal={openModal} />
            <div className="py-20 px-8">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Contáctanos</h2>
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <form className="space-y-6">
                        <input type="text" placeholder="Nombre" className="w-full p-3 border border-gray-300 rounded-md" />
                        <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-md" />
                        <textarea placeholder="Mensaje" rows="4" className="w-full p-3 border border-gray-300 rounded-md"></textarea>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300">Enviar</button>
                    </form>
                </div>
            </div>
            <LoginModal isOpen={isModalOpen} closeModal={closeModal} />
        </div>
    );
};

export default Contact;
