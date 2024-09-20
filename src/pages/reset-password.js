import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { uidb64, token } = router.query;


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uidb64,
                    token,
                    password,
                    confirm_password: confirmPassword
                })
            });
            if (response.ok) {
                setSuccess(true);
                setError('');
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            setError('Error al restablecer la contraseña. Por favor, inténtelo de nuevo.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Restablecer Contraseña</h2>
                {success ? (
                    <div className="text-green-600 text-center mb-4">
                        Contraseña restablecida con éxito. Puede iniciar sesión ahora.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirmar Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Restablecer Contraseña
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
