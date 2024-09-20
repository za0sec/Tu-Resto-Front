import { useEffect, useState, Fragment } from 'react';
import { Popover, Transition, Dialog, Menu, Button } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Cookies from "js-cookie";
import { useRouter } from 'next/router';
import LogOut from './LogOut'


const navigation = [
    { name: 'Ordenes', href: '/branchstaff/dashboard' },
    { name: 'Mesas & Ordenes', href: '/branchstaff/tables' },
];

export default function AdminNavbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleLogout = () => {
        const allCookies = Cookies.get();

        Object.keys(allCookies).forEach(cookieName => {
            Cookies.remove(cookieName);
        });

        window.location.href = '/';
    };

    const fetchUserName = () => {
        const first_name = Cookies.get('user_first_name');
        const last_name = Cookies.get('user_last_name');
        if (first_name) {
            try {
                setFirstName(first_name);
                setLastName(last_name);
            } catch (error) {
                console.error('Error al analizar el nombre de usuario:', error);
            }
        }
    };

    useEffect(() => {
        fetchUserName();
    }, []);


    const handlePassword = async () => {
        window.location.href = `/change-password`;
    };

    return (
        <>
            <Popover>

                <div className="relative pt-6 px-4 sm:px-6 lg:px-8 shadow-lg py-4">
                    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between sm:h-10 lg:justify-start bg-white shadow-md px-10 py-10" aria-label="Global">
                        <div className="flex items-center justify-start space-x-4 lg:flex-grow">
                            <Link href="/branchstaff/dashboard">
                                <div className="bg-blue-500 p-2 rounded-full mr-10 cursor-pointer">
                                    <img className="h-8 w-8" src="/svg/fork.svg" alt="Icono" />
                                </div>
                            </Link>
                            <div className="hidden md:flex md:space-x-8">
                                {navigation.map((item) => (
                                    <Link key={item.name} href={item.href}>
                                        <span className={`relative font-medium ${router.pathname.startsWith(item.href) ? 'text-secondary' : 'text-gray-700'} hover:text-secondary`}>
                                            {item.name}
                                            <span
                                                className={`absolute -bottom-2.5 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 ease-out origin-left ${router.pathname.startsWith(item.href) ? 'scale-x-100' : 'hover:scale-x-100'
                                                    }`}
                                            ></span>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="hidden md:flex md:items-center md:space-x-4 ml-auto">
                            {/* Menú desplegable */}
                            <Menu as="div" className="relative">
                                <div>
                                    <Menu.Button
                                        className="flex items-center text-gray-800 bg-white px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300">
                                        <span>{`${firstName} ${lastName}`}</span>
                                        <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link href="/profile">
                                                        <span className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}>
                                                            Mi Perfil
                                                        </span>
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Button onClick={handlePassword}>
                                                        <span className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}>
                                                            Cambiar Contraseña
                                                        </span>
                                                    </Button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                                                        onClick={openModal}
                                                    >
                                                        Cerrar Sesión
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
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
                                    <img className="h-8 w-auto" src="/images/logo-arrow.png" alt="" />
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

            <LogOut isOpen={isModalOpen} onClose={closeModal} onLogout={handleLogout} />
        </>
    );
}