import React from 'react';

const RectTable = ({ number, position, isDragging, drag, color }) => {
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
                borderRadius: '',
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

export default RectTable;
