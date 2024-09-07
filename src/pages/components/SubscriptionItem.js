import React from 'react';

export default function SubscriptionItem({ title, price, features }) {
    return (
        <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8 bg-gray-50 sm:p-10 sm:pb-6">
                <h3 className="text-2xl leading-8 font-extrabold text-gray-900 sm:text-3xl sm:leading-9">
                    {title}
                </h3>
                <div className="mt-4 flex items-baseline text-6xl leading-none font-extrabold">
                    ${price}
                    <span className="ml-1 text-2xl leading-8 font-medium text-gray-500">/mes</span>
                </div>
            </div>
            <div className="flex-1 px-6 pt-6 pb-8 sm:p-10 sm:pt-6">
                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="ml-3 text-base leading-6 text-gray-700">{feature}</p>
                        </li>
                    ))}
                </ul>
                <div className="mt-8">
                    <button className="w-full bg-primary text-white rounded-md px-4 py-2 hover:bg-primaryDark transition duration-150 ease-in-out">
                        Seleccionar plan
                    </button>
                </div>
            </div>
        </div>
    );
}