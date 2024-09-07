import React from 'react';

export default function SubscriptionItem({ title, price, features }) {
    return (
        <div className="flex flex-col bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="p-8 text-center">
                <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
                <div className="text-5xl font-extrabold text-white">
                    ${price}<span className="text-xl font-normal">/mes</span>
                </div>
            </div>
            <div className="bg-white p-8">
                <ul className="space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                        </li>
                    ))}
                </ul>
                <button className="mt-8 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                    Elegir este plan
                </button>
            </div>
        </div>
    );
}