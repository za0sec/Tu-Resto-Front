import { useState, Fragment } from 'react';
import { Popover, Transition, Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const navigation = [
    { name: 'Restaurantes', href: '/restaurants' },
    { name: 'Dispositivos', href: '#' },
    { name: 'Suscripciones', href: '/components/subscription' },
    { name: 'Contacto', href: '/components/contact' },
];

export default function Navbar({ openModal }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModalConfirm = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <Popover>
                <div className="relative pt-6 px-4 sm:px-6 lg:px-8 shadow-lg py-4">
                    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between sm:h-10 lg:justify-start bg-white shadow-md px-10 py-10" aria-label="Global">
                        <div className="flex items-center justify-start space-x-4 lg:flex-grow">
                            <Link href="/">
                                <div className="flex items-center space-x-2 cursor-pointer">
                                    <div className="bg-blue-500 p-2 rounded-full">
                                        <img className="h-8 w-8" src="/svg/fork.svg" alt="Icono" />
                                    </div>
                                    <span className="font-bold text-gray-900">Tu Resto</span>
                                </div>
                            </Link>
                        </div>

                        <div className="hidden md:flex md:space-x-8 ml-auto">
                            {navigation.map((item) => (
                                <Link key={item.name} href={item.href}>
                                    <span className="relative font-medium text-gray-700 hover:text-secondary">
                                        {item.name}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        <div className="hidden pl-10 md:flex md:items-center md:space-x-4">
                            <button
                                onClick={openModal}
                                className="bg-blue-500 text-white font-medium px-4 py-2 rounded-full hover:bg-blue-600"
                            >
                                Ingresar
                            </button>
                        </div>

                        <div className="-mr-2 flex items-center md:hidden">
                            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300">
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </Popover.Button>
                        </div>
                    </nav>
                </div>

                <Transition
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-100 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Popover.Panel focus className="fixed inset-0 z-50 p-2 transition transform origin-top-right md:hidden">
                        <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                            <div className="px-5 pt-4 flex items-center justify-between">
                                <div>
                                    <img className="h-8 w-auto" src="/images/logo-arrow.png" alt="Icono" />
                                </div>
                                <div className="-mr-2">
                                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300">
                                        <span className="sr-only">Close main menu</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </Popover.Button>
                                </div>
                            </div>
                            <div className="mt-3 px-2 space-y-1">
                                {navigation.map((item) => (
                                    <Link key={item.name} href={item.href}>
                                        <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                                            {item.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </Popover.Panel>
                </Transition>
            </Popover>
        </>
    );
}