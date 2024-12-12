import Link from 'next/link';

export default function ReservationConfirmation() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    ¡Reserva confirmada!
                </h2>
                <p className="text-gray-600 mb-8">
                    Te hemos enviado un correo electrónico con los detalles de tu reserva.
                </p>
                <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
} 