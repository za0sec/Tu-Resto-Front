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
        <div className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
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
            </div>
        </div>
    );
}