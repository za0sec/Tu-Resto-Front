import React, { useState, useRef, useEffect } from "react";
import apiClient from "/utils/apiClient";
import Cookies from "js-cookie";
import Table from "@/components/Table";
import EmployeeNavbar from "@/components/EmployeeNavbar";
import OrderItemsList from "@/components/OrderItemsList";
import { Toaster, toast } from 'react-hot-toast';
const Tables = () => {
    const [tables, setTables] = useState([]);
    const gridSizeX = 18;
    const gridSizeY = 7;
    const cellSize = 60;
    const containerRef = useRef(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
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
            toast.error("Error al obtener las mesas. Inténtalo de nuevo más tarde");
        }
    };
    const fetchOrder = async () => {
        try {
            const response = await apiClient.get(`/orders/table/${selectedTable}`);
            console.log('response', response.data)
            if (response.data.length === 0) {
                console.log('No hay órdenes disponibles para esta mesa.');
                setSelectedOrder(null); // O establece un valor predeterminado
                return; // Salir de la función si no hay órdenes
            }
            
            const orderDetails = await apiClient.get(`/order/${response.data[0].id}`);
            setSelectedOrder(orderDetails.data);
        } catch (error) {
            console.error("Error fetching order:", error);
            toast.error("Error al obtener los detalles de la orden")
        }
    };
    
    useEffect(() => {
        if (selectedTable) {
            fetchOrder(selectedTable);
        }
    }, [selectedTable]);
    

    const handleUpdateOrder = async (orderId) => {
        try {
            if (!selectedOrder) {
                console.error("No hay orden seleccionada para actualizar");
                return;
            }
            router.push(
                `/branchstaff/editorder?id=${orderId}&orderType=${orderType}`
            );
        } catch (error) {
            console.error(
                "Error al actualizar la orden:",
                error.response?.data || error.message
            );
            toast.error("Error al actualizar la orden. No se guardaron los cambios");
        }
    };

    const openDeleteDialog = (orderId) => {
        setOrderToDelete(orderId);
        setIsDeleteDialogOpen(true);
    };
    const handleTableClick = (table) => {
        setSelectedTable(prevSelectedId => (prevSelectedId === table.id ? null : table.id));
    };
    return (
        <div className="min-h-screen bg-gray-100">
             <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
            <EmployeeNavbar />
            <div className="container mx-auto mb-3 mt-20">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    Disposicion de mesas
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
                                onClick={() => handleTableClick(table)}>
                                <Table
                                    number={table.number}
                                    position={table.position}
                                    isDragging={null}
                                    drag={null}
                                    color={selectedTable === table.id ? 'red' : 'blue'} 
                                />
                            </div>
                        ))}
                    </div>
                    <div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
                    <OrderItemsList
                        selectedOrder={selectedOrder}
                        handleUpdateOrder={handleUpdateOrder}
                        openDeleteDialog={openDeleteDialog}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tables;
