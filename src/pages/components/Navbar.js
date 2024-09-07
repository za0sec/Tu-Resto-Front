import { Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Fragment } from 'react';

const navigation = [
    { name: 'Funcionalidades', href: '#' },
    { name: 'Dispositivos', href: '#' },
    { name: 'Suscripciones', href: '#' },
    { name: 'Contacto', href: '#' },
];

export default function Navbar({ openModal }) {
    return (
        <Popover>
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
                    {/* Logo a la izquierda */}
                    <div className="flex items-center justify-start space-x-4 lg:flex-grow">
                        <div className="bg-blue-500 p-2 rounded-full">
                            <img className="h-8 w-8" src="/svg/fork.svg" alt="Icono" />
                        </div>
                        <span className="font-bold text-gray-900">Tu Resto</span>
                    </div>

                    {/* Links del menú */}
                    <div className="hidden md:flex md:space-x-8 ml-auto">
                        {navigation.map((item) => (
                            <Link key={item.name} href={item.href}>
                                <span className="font-medium text-gray-700 hover:text-secondary">{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Botón "Ingresar" */}
                    <div className="hidden pl-10 md:flex md:items-center md:space-x-4">
                        <button
                            onClick={openModal}
                            className="bg-blue-500 text-white font-medium px-4 py-2 rounded-full hover:bg-blue-600"
                        >
                            Ingresar
                        </button>
                    </div>

                    {/* Botón del menú móvil */}
                    <div className="-mr-2 flex items-center md:hidden">
                        <Popover.Button className="bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                    </div>
                </nav>
            </div>

            {/* Menú móvil */}
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
                    <div className="rounded-lg shadow-md bg-gray-800 ring-1 ring-black ring-opacity-5 overflow-hidden">
                        <div className="px-5 pt-4 flex items-center justify-between">
                            <div>
                                <img className="h-8 w-auto" src="/images/logo-arrow.png" alt="Icono" />
                            </div>
                            <div className="-mr-2">
                                <Popover.Button className="bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Close main menu</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </Popover.Button>
                            </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link key={item.name} href={item.href}>
                                    <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">
                                        {item.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
}
