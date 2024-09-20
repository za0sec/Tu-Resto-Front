import { FaMapMarkerAlt, FaPhone, FaTrash, FaUsers } from 'react-icons/fa';

function BranchCard({
    data,
    onCardClick,
    onDeleteClick,
    isBranch = true, // Por defecto es una sucursal
}) {
    return (
        <div
            key={data.id}
            className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition duration-300 border-t-4 border-primary transform hover:-translate-y-1"
            onClick={() => onCardClick(data)}
        >
            {data.banner && (
                <img
                    src={data.banner}
                    alt={data.name}
                    className="w-full h-48 object-cover mb-4 rounded-md"
                />
            )}
            <h2 className="text-2xl font-semibold mb-3 text-primary">{data.name}</h2>

            {isBranch ? (
                <>
                    <p className="text-gray-600 mb-2 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-secondary" /> {data.address}
                    </p>
                    <p className="text-gray-600 mb-4 flex items-center">
                        <FaPhone className="mr-2 text-secondary" /> {data.phone}
                    </p>
                </>
            ) : (
                <>
                    <p className="text-gray-600 mb-4">{data.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                            <FaMapMarkerAlt className="mr-2" />
                            {data.branches || 0} sucursales
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                            <FaUsers className="mr-2" />
                            {data.employees || 0} empleados
                        </span>
                    </div>
                </>
            )}

            <div className="flex justify-end mt-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(data);
                    }}
                    className="text-red-500 hover:text-red-700 bg-red-100 p-2 rounded-full transition duration-300"
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
}

export default BranchCard;
