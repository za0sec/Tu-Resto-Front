import React from 'react';

export default function SubscriptionItem({ title, price, features }) {
    return (
        <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="p-6 bg-gray-50">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h3>
                <div className="text-4xl font-bold text-primary">
                    ${price}<span className="text-lg font-normal text-gray-600">/mes</span>
                </div>
            </div>
            <div className="p-6">
                {features && (
                    <ul className="space-y-2 mb-6">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center text-gray-600">
                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                {feature}
                            </li>
                        ))}
                    </ul>
                )}
                <button className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-300">
                    Seleccionar Plan
                </button>
            </div>
        </div>
    );
}