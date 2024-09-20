import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const LogOut = ({ isOpen, onClose, onLogout }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    Confirmación de Cierre de Sesión
                                </Dialog.Title>
                                <div className="mt-4">
                                    <p className="text-gray-600">¿Estás seguro de que deseas cerrar sesión?</p>
                                </div>
                                <div className="mt-6 flex justify-end space-x-4">
                                    <button
                                        className="bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-md hover:bg-gray-300"
                                        onClick={onClose}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="bg-red-500 text-white font-medium px-4 py-2 rounded-md hover:bg-red-600"
                                        onClick={onLogout}
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default LogOut;
