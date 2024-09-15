import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection({ openModal }) {
    return (
        <main className="mt-10 mx-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28 lg:flex lg:items-center lg:justify-between relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 text-left z-10 pr-8"
            >
                <motion.h1
                    className="text-3xl tracking-tight font-extrabold text-gray-600 sm:text-5xl md:text-6xl leading-relaxed tracking-wide"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="block xl:inline">Revoluciona la Gestión de tu Restaurante con</span>{' '}
                    <br />
                    <span className="block text-primary xl:inline mt-2">
                        Tu Resto
                    </span>
                </motion.h1>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "32%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-1 bg-gray-500 mt-2"
                />

                <motion.p
                    className="mt-6 text-base text-gray-500 sm:text-lg md:text-xl lg:max-w-full lg:mx-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Centraliza tus operaciones, optimiza tus recursos y eleva la experiencia de tus clientes con nuestra plataforma integral.
                </motion.p>

                <motion.div
                    className="mt-8 sm:mt-10 flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <motion.button
                        onClick={openModal}
                        className="bg-primary text-white text-lg px-8 py-3 rounded-full shadow-lg hover:bg-primaryDark transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Comenzar Ahora
                    </motion.button>
                    <motion.a
                        href="#funcionalidades"
                        className="ml-4 text-primary font-semibold hover:text-primaryDark transition duration-300"
                        whileHover={{ x: 5 }}
                    >
                        Descubre más →
                    </motion.a>
                </motion.div>
            </motion.div>
            <motion.div
                className="mt-10 lg:mt-0 lg:w-1/2 flex justify-center lg:justify-end relative z-10"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="w-full h-auto overflow-hidden rounded-lg shadow-xl">
                    <img
                        src="/jpg/turesto.png"
                        alt="Tu Resto en acción"
                        className="w-full h-full object-contain"
                    />
                </div>
            </motion.div>
            <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-purple-50 to-yellow-50 opacity-20 z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1.5 }}
            />
        </main>
    );
}
