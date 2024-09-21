import React, { useState, useRef, useEffect } from 'react';
import apiClient from '/utils/apiClient';
import Cookies from 'js-cookie';
import Table from '@/components/Table';
import EmployeeNavbar from '@/components/EmployeeNavbar';

const Tables = () => {
    const [tables, setTables] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');

    const gridSizeX = 20;
    const gridSizeY = 7; 
    const cellSize = 60; 
    const tableSize = 50; 
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchBranches = async () => {
            const restaurantId = Cookies.get('user_restaurant_id');
            try {
                const response = await apiClient.get(`/branches/${restaurantId}`);
                setBranches(response.data);
                if (response.data.length > 0) {
                    setSelectedBranch(response.data[0].id);
                }
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };

        fetchBranches();
    }, []);

    useEffect(() => {
        if (selectedBranch) {
            fetchTables(selectedBranch);
        }
    }, [selectedBranch]);

    const fetchTables = async (branchId) => {
        try {
            const response = await apiClient.get(`/branch/${branchId}/tables`);
            const tablesWithParsedPositions = response.data.map(table => ({
                ...table,
                position: JSON.parse(table.position)
            }));
            setTables(tablesWithParsedPositions);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <EmployeeNavbar />
            <div className="container mx-auto p-4 mt-10">
                <h1 className="text-2xl font-bold mb-4">Table Layout</h1>
                <div className="flex flex-wrap items-center mb-4">
                    <select
                        value={selectedBranch}
                        onChange={(e) => {
                            setSelectedBranch(e.target.value);
                        }}
                        className="mr-2 mb-2 p-2 border rounded"
                    >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                </div>
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
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tables;
