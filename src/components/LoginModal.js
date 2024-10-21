import { useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { Dialog, Transition } from '@headlessui/react';

import Cookies from 'js-cookie';
import apiClient from '/utils/apiClient';
import { jwtDecode } from 'jwt-decode';
import { Toaster, toast } from 'react-hot-toast';

export default function LoginModal({ isOpen, closeModal }) {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await apiClient.post('/auth/login', {
                username,
                password,
            });

            if (response.status === 200) {
                const { access, refresh } = response.data;


                Cookies.set('accessToken', access, { secure: true, sameSite: 'Strict' });
                Cookies.set('refreshToken', refresh, { secure: true, sameSite: 'Strict' });


                const decoded = jwtDecode(access);
                const userRole = decoded.role;

                console.log(userRole);

                Object.keys(decoded).forEach(key => {
                    Cookies.set(`user_${key}`, decoded[key], { secure: true, sameSite: 'Strict' });
                });

                setSuccess('Inicio de sesión exitoso, redirigiendo...');
                setTimeout(() => {
                    closeModal();
                    router.push(`/${userRole.toLowerCase()}/dashboard`);
                }, 500);
            } else {
                const errorData = response.data;
                setError(errorData.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            toast.error("Error al iniciar sesion.")
            setError('Error al iniciar sesion. Verifica que lo datos proporcionados sean correctos.');
        }
    };

    const handleForgotPassword = () => {
        router.push('/forgot-password');
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-1500"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-1500"
                    leaveFrom="opacity-100 scale-150"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-secondary"
                                >
                                    Inicio de Sesión
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} className="mt-4">
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            placeholder="Nombre de Usuario"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 focus:border-primary focus:ring-secondary focus:ring-1"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            type="password"
                                            placeholder="Contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-2 rounded-md bg-gray-100 text-gray-800 border border-gray-300 focus:border-primary focus:ring-primary focus:ring-1"
                                            required
                                        />
                                    </div>
                                    {error && <p className="text-red-500 mb-4">{error}</p>}
                                    {success && <p className="text-green-500 mb-4">{success}</p>}
                                    <button
                                        type="submit"
                                        className="w-full bg-secondary text-white font-medium px-4 py-2 rounded-md hover:bg-secondaryDark"
                                    >
                                        Iniciar Sesión
                                    </button>
                                </form>
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={handleForgotPassword}
                                        className="text-sm text-gray-600 hover:underline"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
