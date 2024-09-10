import React from 'react';
import Image from 'next/image';

const ProductExtra = ({ name, photo, description, price, product, category }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{name}</h3>
            {photo && (
                <div className="w-full h-40 relative mb-2">
                    <Image
                        src={photo}
                        alt={name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                    />
                </div>
            )}
            {description && <p className="text-sm text-gray-600 mb-2">{description}</p>}
            <p className="text-md font-bold">${price.toFixed(2)}</p>
            {category && <p className="text-sm text-gray-500">Categoría: {category.name}</p>}
        </div>
    );
};

export default ProductExtra;
