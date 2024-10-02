import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';

const ProductPreview = ({ product, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = React.useState(false);

    const toggleEdit = () => setIsEditing(!isEditing);
    const handleSubmit = (e) => {
        e.preventDefault();
        onEdit(product.id, {
            name: e.target.name.value,
            description: e.target.description.value,
            price: parseFloat(e.target.price.value),
            discount: parseInt(e.target.discount.value),
        });
        setIsEditing(false);
    };

    return (
        <React.Fragment>
            <motion.tr
                layout
                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                onClick={toggleEdit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                    <span>{product?.name}</span>
                </td>
                <td className="py-3 px-6 text-left">
                    <span>{product?.description}</span>
                </td>
                <td className="py-3 px-6 text-left">
                    <span>${product?.price}</span>
                </td>
                <td className="py-3 px-6 text-left">
                    <span>{product?.discount}%</span>
                </td>
                <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center">
                        <button
                            className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                            onClick={(e) => {
                                //e.stopPropagation(); // Prevent triggering row click
                                onDelete(e, product); // Call the onDelete function with the product
                            }}
                        >
                            <FaTrash />
                        </button>
                    </div>
                </td>
            </motion.tr>
            <AnimatePresence>
                {isEditing && (
                    <motion.tr
                        className="bg-gray-50"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <td colSpan="5" className="py-3 px-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={product?.name}
                                        className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="description"
                                        defaultValue={product?.description}
                                        className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="number"
                                        name="price"
                                        defaultValue={product?.price}
                                        className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="number"
                                        name="discount"
                                        defaultValue={product?.discount}
                                        className="col-span-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                                        Guardar
                                    </button>
                                    <button type="button" onClick={toggleEdit} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
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

export default ProductPreview;
