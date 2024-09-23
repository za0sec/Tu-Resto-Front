import React from 'react';

const Table = ({ number, position, isDragging, drag, color }) => {
    return (
        <div
            ref={drag}
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                width: `50px`,
                height: `50px`,
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
