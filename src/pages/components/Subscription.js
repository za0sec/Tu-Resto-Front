import React, { useState, useEffect } from 'react';
import SubscriptionItem from './SubscriptionItem';
import config from "@/pages/utils/config";

export default function Subscription() {
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await fetch(`http://api.localhost:8000/plans`);
                const data = await response.json();
                setSubscriptions(data);
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            }
        };

        fetchSubscriptions();
    }, []);

    return (
        <div className="mx-20 py-20">
            <h2 className="text-4xl font-bold text-gray-600 text-center mb-12">Planes Diseñados para Tu Éxito</h2>
            <div className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-8 lg:max-w-6xl lg:mx-auto xl:max-w-none xl:mx-0">
                {subscriptions.map((subscription) => (
                    <SubscriptionItem
                        key={subscription.id}
                        title={subscription.name}
                        price={subscription.price}
                        features={subscription.features}
                    />
                ))}
            </div>
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Contáctanos</h2>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <form className="space-y-6">
                    <input type="text" placeholder="Nombre" className="w-full p-3 border border-gray-300 rounded-md" />
                    <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-md" />
                    <textarea placeholder="Mensaje" rows="4" className="w-full p-3 border border-gray-300 rounded-md"></textarea>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300">Enviar</button>
                </form>
            </div>
        </div>

    );
}