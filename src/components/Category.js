import React from 'react';
import Image from 'next/image';

const Category = ({ id, name, description, photo, identifier_color, identifier_icon, onClick, isSelected }) => {
    return (
        <div
            onClick={() => onClick({ id, name, description, photo })}
            className={`${identifier_color} p-2 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'border-2 border-blue-500' : ''} flex flex-col items-center justify-center aspect-square w-10 h-10`}
        >
            {identifier_icon && (
                <div className="text-2xl mb-2">
                    {React.createElement(identifier_icon)}
                </div>
            )}
            <h2 className="text-xs font-semibold text-center">{name}</h2>
            {description && (
                <p className="text-xs text-center mt-1 overflow-hidden text-ellipsis">{description}</p>
            )}
            {photo && (
                <div className="mt-2">
                    <Image src={photo} alt={name} width={50} height={50} objectFit="cover" />
                </div>
            )}
        </div>
    );
};

export default Category;
