import React, { useState, useEffect } from 'react';
import SubscriptionItem from './SubscriptionItem';
import config from "@/pages/utils/config";
import Navbar from './Navbar';
import LoginModal from './LoginModal';
export default function Subscription() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }
    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/plans/`);
                if (response.ok) {
                    const data = await response.json();
                    setSubscriptions(data);
                } else {
                    throw new Error('Error al obtener las suscripciones');
                }

            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            }
        };

        fetchSubscriptions();
    }, []);

    return (
        <div >
            <Navbar openModal={openModal} />
            <h2 className="text-4xl font-bold text-gray-600 text-center mb-12 py-20">Planes Diseñados para Tu Éxito</h2>
            <div className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-8 lg:max-w-6xl lg:mx-auto xl:max-w-none xl:mx-0">
                {subscriptions?.length > 0 ? (
                    subscriptions.map((subscription) => (
                        <SubscriptionItem
                            key={subscription.id}
                            title={subscription.name}
                            price={subscription.price}
                        // features={subscription.features}
                        />
                    ))
                ) : (
                    <p>No hay planes de suscripción disponibles en este momento.</p>
                )}
            </div>
            <LoginModal isOpen={isModalOpen} closeModal={closeModal} />
        </div>
    );
}