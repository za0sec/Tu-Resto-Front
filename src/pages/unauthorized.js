import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Unauthorized() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCount) => prevCount - 1);
        }, 1000);

        const redirect = setTimeout(() => {
            router.push('/');
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex flex-col justify-center items-center">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md w-full mx-4 transform hover:scale-105 transition-transform duration-300">
                <div className="mb-6">
                    <i className="fas fa-exclamation-triangle text-6xl text-yellow-500"></i>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! Acceso Restringido</h1>
                <p className="text-xl text-gray-600 mb-6">
                    Parece que has intentado acceder a un área para la que no tienes permiso.
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(countdown / 5) * 100}%` }}></div>
                </div>
                <p className="text-lg text-gray-500">
                    Te redirigiremos a un lugar seguro en <span className="font-bold text-blue-600">{countdown}</span> segundos.
                </p>
            </div>
        </div>
    );
}
