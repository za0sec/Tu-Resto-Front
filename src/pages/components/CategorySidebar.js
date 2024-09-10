import React from 'react';
import { FaPlus } from 'react-icons/fa';

const CategorySidebar = ({ categories, selectedCategory, onCategoryClick }) => {
    return (
        <div className="w-64 bg-white shadow-md h-screen overflow-y-auto">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold py-5">Categorías</h2>
                </div>
                <ul className="h-full">
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            className={`cursor-pointer p-2 rounded ${selectedCategory?.id === category.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                                }`}
                            onClick={() => onCategoryClick(category)}
                        >
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategorySidebar;