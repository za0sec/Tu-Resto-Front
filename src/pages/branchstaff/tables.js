import React, { useState, useRef, useEffect } from "react";
import apiClient from "/utils/apiClient";
import Cookies from "js-cookie";
import Table from "@/components/Table";
import EmployeeNavbar from "@/components/EmployeeNavbar";
import OrderItemsList from "@/components/OrderItemsList";

const Tables = () => {
    const [tables, setTables] = useState([]);
    const gridSizeX = 20;
    const gridSizeY = 7;
    const cellSize = 60;
    const tableSize = 50;
    const containerRef = useRef(null);
    const [selectedTable, setSelectedTable] = useState(null);
    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const branchId = Cookies.get("user_branch_id");
            const response = await apiClient.get(`/branch/${branchId}/tables`);
            const tablesWithPositions = response.data.map((table) => ({
                ...table,
                position: { x: table.position_x, y: table.position_y },
            }));
            setTables(tablesWithPositions);
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    };

    const fetchOrder = async () => {
        try {
            const response = await apiClient.get(
                `/order/table/${selectedTable.id}`
            );
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching order:", error);
        }
    };

    useEffect(() => {
        if (selectedTable) {
            // fetchOrder(selectedTable);
        }
    }, [selectedTable]);

    return (
        <div className="min-h-screen bg-gray-100">
            <EmployeeNavbar />
            <div className="container mx-auto mb-3 mt-20">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    Table Layout
                </h1>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div
                        ref={containerRef}
                        className="relative border-2 border-gray-300 bg-white"
                        style={{
                            width: `${gridSizeX * cellSize}px`,
                            height: `${gridSizeY * cellSize}px`,
                            backgroundImage:
                                "linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)",
                            backgroundSize: `${cellSize}px ${cellSize}px`,
                        }}>
                        {tables.map((table) => (
                            <div
                                key={table.id}
                                onClick={() => setSelectedTable(table.id)}>
                                <Table
                                    number={table.number}
                                    position={table.position}
                                    tableSize={50}
                                    isDragging={null}
                                    drag={null}
                                />
                            </div>
                        ))}
                    </div>
                    {/* <OrderItemsList
                        selectedOrder={selectedOrder}
                        handleUpdateOrder={handleUpdateOrder}
                        openDeleteDialog={openDeleteDialog}
                    /> */}
                </div>
            </div>
        </div>
    );
};

export default Tables;
