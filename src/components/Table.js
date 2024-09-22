import React from 'react';

const Table = ({ number, position, tableSize, isDragging, drag, color }) => {
    return (
        <div
            ref={drag}
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                width: `${tableSize}px`,
                height: `${tableSize}px`,
                backgroundColor: color,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontWeight: 'bold',
            }}
        >
            {number}
        </div>
    );
};

export default Table;
