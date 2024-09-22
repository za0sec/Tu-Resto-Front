import React, { useState, useRef, useCallback, useEffect } from "react";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ManagerNavbar from "@/components/ManagerNavbar";
import apiClient from "/utils/apiClient";
import Cookies from "js-cookie";
import Table from "@/components/Table";
import { FaTrash } from "react-icons/fa";
const Tables = () => {
    const [tables, setTables] = useState([]);
    const [newTableNumber, setNewTableNumber] = useState("");
    const [newTableCapacity, setNewTableCapacity] = useState("");
    const [newTableBookable, setNewTableBookable] = useState(true);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedTable, setSelectedTable] = useState(null);

    const gridSizeX = 20;
    const gridSizeY = 7;
    const cellSize = 60;
    const tableSize = 50;
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchBranches = async () => {
            const restaurantId = Cookies.get("user_restaurant_id");
            try {
                const response = await apiClient.get(
                    `/branches/${restaurantId}`
                );
                setBranches(response.data);
                if (response.data.length > 0) {
                    setSelectedBranch(response.data[0].id);
                }
            } catch (error) {
                console.error("Error fetching branches:", error);
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
            const tablesWithPositions = response.data.map((table) => ({
                ...table,
                position: { x: table.position_x, y: table.position_y },
            }));
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
        };

        try {
            const response = await apiClient.post("/table/create", newTable);
            const createdTable = response.data;
            setTables([
                ...tables,
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
        } catch (error) {
            console.error("Error creating table:", error);
        }
    };

    const moveTable = useCallback(
        async (id, left, top) => {
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

    const DraggableTable = ({ id, number, position }) => {
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

                    moveTable(item.id, gridX * cellSize, gridY * cellSize);
                }
            },
        });

        return (
            <div onClick={() => setSelectedTable(id)}>
                <Table
                    number={number}
                    position={position}
                    tableSize={tableSize}
                    isDragging={isDragging}
                    drag={drag}
                />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <ManagerNavbar />
            <div className="container mx-auto p-4 mt-10">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    Table Layout
                </h1>
                <div className="flex flex-wrap items-center mb-4">
                    <select
                        value={selectedBranch}
                        onChange={(e) => {
                            setSelectedBranch(e.target.value);
                        }}
                        className="mr-2 mb-2 p-2 border rounded">
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={newTableNumber}
                        onChange={(e) => setNewTableNumber(e.target.value)}
                        placeholder="Table Number"
                        className="mr-2 mb-2 p-2 border rounded"
                    />
                    <input
                        type="number"
                        value={newTableCapacity}
                        onChange={(e) => setNewTableCapacity(e.target.value)}
                        placeholder="Capacity"
                        className="mr-2 mb-2 p-2 border rounded"
                    />
                    <label className="mr-2 mb-2 flex items-center">
                        <input
                            type="checkbox"
                            checked={newTableBookable}
                            onChange={(e) =>
                                setNewTableBookable(e.target.checked)
                            }
                            className="mr-1"
                        />
                        Bookable
                    </label>
                    <button
                        onClick={addTable}
                        className="bg-secondary hover:bg-secondaryDark text-white font-bold px-4 h-10 rounded-full mb-2">
                        Add New Table
                    </button>
                    {selectedTable && (
                        <button
                            onClick={() => deleteTable(selectedTable)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold px-4 h-10 rounded-full mb-2 ml-2">
                            <FaTrash />
                        </button>
                    )}
                </div>
                <DndProvider backend={HTML5Backend}>
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
                            <DraggableTable
                                key={table.id}
                                id={table.id}
                                number={table.number}
                                position={table.position}
                            />
                        ))}
                    </div>
                </DndProvider>
            </div>
        </div>
    );
};

export default Tables;
