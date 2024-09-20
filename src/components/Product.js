import React from 'react';

const Product = ({ id, name, description, price, discount, category, onClick, isSelected }) => {
    const discountedPrice = discount > 0 ? parseFloat(price) * (1 - parseFloat(discount) / 100) : parseFloat(price);

    const handleProductClick = () => {
        onClick({ id, name, description, price, discount, category });
    };

    return (
        <div
            onClick={handleProductClick}
            className={`bg-white p-2 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'border-2 border-blue-500' : ''} flex flex-row items-center justify-between w-50 h-35 relative`}
        >
            <div className="flex flex-col justify-center flex-grow mr-2 overflow-hidden">
                <h2 className="text-xs font-semibold truncate">{name}</h2>
                <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
                {category && (
                    <p className="text-xs text-gray-500 truncate">{category.name}</p>
                )}
            </div>
            <div className="flex flex-col items-end">
                <p className="text-xs font-bold text-primary">${discountedPrice.toFixed(2)}</p>
                {discount > 0 && (
                    <p className="text-xs font-semibold text-red-600">-{discount}%</p>
                )}
            </div>
        </div>
    );
};

export default Product;
