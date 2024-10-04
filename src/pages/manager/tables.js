import React, { useState, useRef, useCallback, useEffect } from "react";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ManagerNavbar from "@/components/ManagerNavbar";
import apiClient from "/utils/apiClient";
import Cookies from "js-cookie";
import Table from "@/components/Table";
import RectTable from "@/components/RectTable"; // Import RectTable
import { FaTrash, FaPlus } from "react-icons/fa";
import { useRouter } from "next/router";

const Tables = () => {
    const [tables, setTables] = useState([]);
    const [newTableNumber, setNewTableNumber] = useState("");
    const [newTableCapacity, setNewTableCapacity] = useState("");
    const [newTableBookable, setNewTableBookable] = useState(true);
    const [newTableType, setNewTableType] = useState("round"); // New state for table type
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedTable, setSelectedTable] = useState(null);

    const gridSizeX = 17;
    const gridSizeY = 7;
    const cellSize = 60;
    const tableSize = 50;
    const containerRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const { branch } = router.query;
        if (branch) {
            setSelectedBranch(branch);
        }
        const fetchBranches = async () => {
            const restaurantId = Cookies.get("user_restaurant_id");
            try {
                const response = await apiClient.get(
                    `/branches/${restaurantId}`
                );
                setBranches(response.data);
                if (response.data.length > 0) {
                    console.log('data', response.data)
                    setSelectedBranch(response.data[0].id);
                }
            } catch (error) {
                console.error("Error fetching branches:", error);
            }
        };

        fetchBranches();
    }, [router.query]);

    useEffect(() => {
        if (selectedBranch) {
            fetchTables(selectedBranch);
        }
    }, [selectedBranch]);

    const fetchTables = async (branchId) => {
        try {
            const response = await apiClient.get(`/branch/${branchId}/tables`);
            const tablesWithPositions = response.data.map((table) => ({
                ...table,
                position: { x: table.position_x, y: table.position_y },
            }));
            console.log('tables', tablesWithPositions);
            setTables(tablesWithPositions);
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    };

    const addTable = async () => {
        const newTable = {
            number: parseInt(newTableNumber),
            capacity: parseInt(newTableCapacity),
            bookable: newTableBookable,
            position_x: 0, 
            position_y: 0, 
            branch: selectedBranch,
            type: newTableType, // Pass the table type
        };

        try {
            const findEmptyPosition = () => {
                for (let x = 0; x < gridSizeX; x++) {
                    for (let y = 0; y < gridSizeY; y++) {
                        const position = { 
                            x: 5 + x * cellSize,
                            y: 5 + y * cellSize 
                        };
                        const isOccupied = tables.some(
                            (table) =>
                                table.position.x === position.x &&
                                table.position.y === position.y
                        );
                        if (!isOccupied) {
                            return position; 
                        }
                    }
                }
                return null; 
            };

            const emptyPosition = findEmptyPosition();
            if (!emptyPosition) {
                console.error("No hay posiciones vacías disponibles.");
                return; 
            }

            newTable.position_x = emptyPosition.x;
            newTable.position_y = emptyPosition.y;

            const response = await apiClient.post("/table/create", newTable);
            const createdTable = response.data;
            setTables((prevTables) => [
                ...prevTables,
                {
                    ...createdTable,
                    position: {
                        x: createdTable.position_x,
                        y: createdTable.position_y,
                    },
                },
            ]);
            setNewTableNumber("");
            setNewTableCapacity("");
            setNewTableBookable(true);
            setNewTableType("round"); // Reset the type to default
        } catch (error) {
            console.error("Error creating table:", error);
        }
    };

    const moveTable = useCallback(
        async (id, left, top, originalPosition) => {
            const gridX = Math.round(left / cellSize);
            const gridY = Math.round(top / cellSize);
            const centerOffset = (cellSize - tableSize) / 2;
            const newPosition = {
                x: gridX * cellSize + centerOffset,
                y: gridY * cellSize + centerOffset,
            };

            setTables((prevTables) =>
                prevTables.map((table) =>
                    table.id === id
                        ? { ...table, position: newPosition }
                        : table
                )
            );

            try {
                await apiClient.patch(`/table/${id}`, {
                    position_x: newPosition.x,
                    position_y: newPosition.y,
                });
            } catch (error) {
                console.error("Error updating table position:", error);
                setTables((prevTables) =>
                    prevTables.map((table) =>
                        table.id === id
                            ? { ...table, position: originalPosition }
                            : table
                    )
                );
            }
        },
        [cellSize]
    );

    const deleteTable = async (id) => {
        try {
            await apiClient.delete(`/table/${id}`);
            setTables((prevTables) =>
                prevTables.filter((table) => table.id !== id)
            );
            setSelectedTable(null);
        } catch (error) {
            console.error("Error deleting table:", error);
        }
    };

    const DraggableTable = ({ id, number, position, type }) => {
        const [{ isDragging }, drag] = useDrag({
            type: "TABLE",
            item: { id, left: position.x, top: position.y },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
            end: (item, monitor) => {
                const delta = monitor.getDifferenceFromInitialOffset();
                const containerRect =
                    containerRef.current.getBoundingClientRect();

                if (delta && containerRect) {
                    const left = item.left + delta.x;
                    const top = item.top + delta.y;

                    const boundedLeft = Math.max(
                        0,
                        Math.min(left, containerRect.width - tableSize)
                    );
                    const boundedTop = Math.max(
                        0,
                        Math.min(top, containerRect.height - tableSize)
                    );

                    const gridX = Math.round(boundedLeft / cellSize);
                    const gridY = Math.round(boundedTop / cellSize);
                    const originalPosition = { ...position };
                    moveTable(item.id, gridX * cellSize, gridY * cellSize, originalPosition);
                }
            },
        });
        const color = selectedTable == id ? "red" : "blue";

        return (
            <div onClick={() => setSelectedTable(id)}>
                {type === "rectangular" ? (
                    <RectTable
                        number={number}
                        position={position}
                        isDragging={isDragging}
                        drag={drag}
                        color={color}
                    />
                ) : (
                    <Table
                        number={number}
                        position={position}
                        isDragging={isDragging}
                        drag={drag}
                        color={color}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <ManagerNavbar />
            <div className="container mx-auto mt-20">
                <div className="flex flex-wrap items-center justify-between mb-4">
                    <h1 className="text-4xl font-bold mb-4 text-gray-800">
                        Table Layout
                    </h1>
                    <button
                        onClick={addTable}
                        className="bg-secondary text-white px-6 py-3 rounded-full hover:bg-secondaryDark transition duration-300 flex items-center shadow-lg"
                    >
                        <FaPlus className="mr-2" />
                        Add New Table
                    </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                    <DndProvider backend={HTML5Backend}>
                        <div
                            ref={containerRef}
                            className="relative border-2 border-gray-300 bg-white col-span-4"
                            style={{
                                width: `${gridSizeX * cellSize}px`,
                                height: `${gridSizeY * cellSize}px`,
                                backgroundImage:
                                    "linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)",
                                backgroundSize: `${cellSize}px ${cellSize}px`,
                            }}
                        >
                            {tables.map((table) => (
                                <DraggableTable
                                    key={table.id}
                                    id={table.id}
                                    number={table.number}
                                    position={table.position}
                                    type={table.type} // Pass type to DraggableTable
                                />
                            ))}
                        </div>
                    </DndProvider>
                    <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Table Number
                            </label>
                            <input
                                type="number"
                                value={newTableNumber}
                                onChange={(e) =>
                                    setNewTableNumber(e.target.value)
                                }
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Capacity
                            </label>
                            <input
                                type="number"
                                value={newTableCapacity}
                                onChange={(e) =>
                                    setNewTableCapacity(e.target.value)
                                }
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Bookable
                            </label>
                            <select
                                value={newTableBookable}
                                onChange={(e) =>
                                    setNewTableBookable(
                                        e.target.value === "true"
                                    )
                                }
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Table Type
                            </label>
                            <select
                                value={newTableType}
                                onChange={(e) => setNewTableType(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                            >
                                <option value="round">Round</option>
                                <option value="rectangular">Rectangular</option>
                            </select>
                        </div>
                        {selectedTable && (
                    <button
                    onClick={() => deleteTable(selectedTable)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold h-10 rounded-full w-full flex justify-center items-center"
                    >
                    <FaTrash />
                    </button>
                    
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tables;
