import React from 'react';

const Reservation = ({ name, time, people, status }) => {
    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">{name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{time}</td>
            <td className="px-6 py-4 whitespace-nowrap">{people}</td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status === 'Confirmada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {status}
                </span>
            </td>
        </tr>
    );
};

export default Reservation;
