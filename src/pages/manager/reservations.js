import React from 'react';
import Reservation from '../components/Reservation';

const ReservationList = ({ reservations }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reservaciones de Hoy</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hora
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Personas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reservations.map((reservation, index) => (
                            <Reservation
                                key={index}
                                name={reservation.name}
                                time={reservation.time}
                                people={reservation.people}
                                status={reservation.status}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReservationList;
