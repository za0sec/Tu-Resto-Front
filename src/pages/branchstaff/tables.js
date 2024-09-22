import React, { useState, useRef, useEffect } from 'react';
import apiClient from '/utils/apiClient';
import Cookies from 'js-cookie';
import Table from '@/components/Table';
import EmployeeNavbar from '@/components/EmployeeNavbar';

const Tables = () => {
    const [tables, setTables] = useState([]);
    const gridSizeX = 20;
    const gridSizeY = 7; 
    const cellSize = 60; 
    const tableSize = 50; 
    const containerRef = useRef(null);

    useEffect(() => {
        fetchTables();
    }, []);

    
    const fetchTables = async () => {
        try {
            const branchId = Cookies.get('user_branch_id');
            const response = await apiClient.get(`/branch/${branchId}/tables`);
            const tablesWithPositions = response.data.map(table => ({
                ...table,
                position: { x: table.position_x, y: table.position_y }
            }));
            setTables(tablesWithPositions);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <EmployeeNavbar />
            <div className="container mx-auto p-4 mt-10">
                <h1 className="text-2xl font-bold mb-4">Table Layout</h1>
                <div 
                    ref={containerRef}
                    className="relative border-2 border-gray-300 bg-white"
                    style={{
                        width: `${gridSizeX * cellSize}px`,
                        height: `${gridSizeY * cellSize}px`,
                        backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
                        backgroundSize: `${cellSize}px ${cellSize}px`
                    }}
                >
                    {tables.map(table => (
                        <Table
                            key={table.id}
                            number={table.number}
                            position={table.position}
                            tableSize={50}
                            isDragging={null}
                            drag={null}
                        />                      
                    ))}
                </div>
            </div>
        </div>
    );
};
2
export default Tables;
