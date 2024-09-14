import React, { useState } from 'react';
import { FaUser, FaPhone, FaBuilding, FaCalendar, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeePreview = ({ employee, branches, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing(!isEditing);

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedEmployee = {
            user: {
                id: employee.user.id,
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                email: formData.get('email'),
            },
            phone: formData.get('phone'),
            branch: { id: formData.get('branch') },
        };
        onUpdate(updatedEmployee);
        setIsEditing(false);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(employee);
    };

    return (
        <React.Fragment>
            <tr
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                onClick={toggleEdit}
            >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                        <FaUser className="mr-2" />
                        <span>{employee.user.username}</span>
                    </div>
                </td>
                <td className="py-3 px-6 text-left">
                    <span>{employee.user.email}</span>
                </td>
                <td className="py-3 px-6 text-left">
                    <div className="flex items-center">
                        <FaPhone className="mr-2" />
                        <span>{employee.phone}</span>
                    </div>
                </td>
                <td className="py-3 px-6 text-left">
                    <div className="flex items-center">
                        <FaBuilding className="mr-2" />
                        <span>{employee.branch.name}</span>
                    </div>
                </td>
                <td className="py-3 px-6 text-left">
                    <div className="flex items-center">
                        <FaCalendar className="mr-2" />
                        <span>{new Date(employee.branch.branch_employees[0].started_at).toLocaleDateString()}</span>
                    </div>
                </td>
                <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                        <button
                            className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                            onClick={handleDeleteClick}
                        >
                            <FaTrash />
                        </button>
                    </div>
                </td>
            </tr>
            <AnimatePresence>
                {isEditing && (
                    <motion.tr
                        className="bg-gray-50"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <td colSpan="6" className="py-3 px-6">
                            <form onSubmit={handleUpdate}>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="first_name"
                                        defaultValue={employee.user.first_name}
                                        className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="last_name"
                                        defaultValue={employee.user.last_name}
                                        className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        defaultValue={employee.user.email}
                                        className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="phone"
                                        defaultValue={employee.phone}
                                        className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                    <select
                                        name="branch"
                                        defaultValue={employee.branch.id}
                                        className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    >
                                        {branches.map((branch) => (
                                            <option key={branch.id} value={branch.id}>
                                                {branch.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                                        Guardar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={toggleEdit}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </td>
                    </motion.tr>
                )}
            </AnimatePresence>
        </React.Fragment>
    );
};

export default EmployeePreview;
