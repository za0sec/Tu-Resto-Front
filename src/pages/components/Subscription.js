

import React from 'react';
import SubscriptionItem from './SubscriptionItem';

export default function Subscription() {
    //TODO: Bring this from db...
    const subscriptions = [
        {
            title: 'Plan Básico',
            price: '19.99',
            features: ['Gestión de pedidos', 'Control de mesas', 'Soporte por correo'],
        },
        {
            title: 'Plan Estándar',
            price: '39.99',
            features: ['Todo del Plan Básico', 'Reservas en línea', 'Análisis de ventas', 'Soporte telefónico'],
        },
        {
            title: 'Plan Premium',
            price: '59.99',
            features: ['Todo del Plan Estándar', 'Integración con POS', 'Marketing automatizado', 'Soporte 24/7'],
        },
    ];

    return (
        <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Nuestros Planes de Suscripción</h2>
                <div className="mt-10 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                    {subscriptions.map((subscription, index) => (
                        <SubscriptionItem key={index} {...subscription} />
                    ))}
                </div>
            </div>
        </div>
    );
}