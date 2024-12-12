import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import apiClient from "/utils/apiClient";
import { Toaster, toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from "framer-motion";

export default function ReservationPage() {
    const router = useRouter();
    const { restaurantId, branchId } = router.query;
    
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [restaurant, setRestaurant] = useState(null);
    const [branch, setBranch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Paso 1: Fecha
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableDates, setAvailableDates] = useState({});
    
    // Paso 2: Hora
    const [selectedTime, setSelectedTime] = useState('');
    
    // Paso 3: Comensales
    const [guests, setGuests] = useState(2);
    
    // Paso 4: Mesa
    const [availableTables, setAvailableTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);

    // Paso 5: Información del cliente
    const [reservationData, setReservationData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const timeSlots = [
        '12:00', '13:30',
        '20:00', '22:00', 
    ];

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    useEffect(() => {
        if (restaurantId && branchId) {
            fetchInitialData();
            fetchNextWeekAvailability();
        }
    }, [restaurantId, branchId]);

    const fetchNextWeekAvailability = async () => {
        const dates = {};
        const today = new Date();
        
        // Fetch availability for next 7 days
        for(let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const formattedDate = format(date, 'yyyy-MM-dd');
            
            try {
                const response = await apiClient.get(
                    `/branch/${branchId}/tables/available/${formattedDate}`
                );
                dates[formattedDate] = response.data.length > 0;
            } catch (error) {
                console.error(`Error fetching availability for ${formattedDate}:`, error);
                dates[formattedDate] = false;
            }
        }
        
        setAvailableDates(dates);
    };

    const fetchInitialData = async () => {
        try {
            const [restaurantRes, branchRes] = await Promise.all([
                apiClient.get(`/restaurant/${restaurantId}`),
                apiClient.get(`/branch/${branchId}`)
            ]);
            
            setRestaurant(restaurantRes.data);
            setBranch(branchRes.data);
        } catch (error) {
            setError("Error al cargar los datos. Por favor, intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableTables = async () => {
        try {
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            const response = await apiClient.get(
                `/branch/${branchId}/tables/available?date=${formattedDate}&time=${selectedTime}&guests=${guests}`
            );
            setAvailableTables(response.data);
        } catch (error) {
            toast.error("Error al obtener mesas disponibles");
        }
    };

    const handleNextStep = async () => {
        if (step === 1) {
            if (!selectedDate) {
                toast.error("Por favor selecciona una fecha");
                return;
            }
            setDirection(1);
            setStep(2);
        } else if (step === 2) {
            if (!selectedTime) {
                toast.error("Por favor selecciona un horario");
                return;
            }
            setDirection(1);
            setStep(3);
        } else if (step === 3) {
            if (!guests) {
                toast.error("Por favor selecciona el número de comensales");
                return;
            }
            await fetchAvailableTables();
            setDirection(1);
            setStep(4);
        } else if (step === 4) {
            if (!selectedTable) {
                toast.error("Por favor selecciona una mesa");
                return;
            }
            setDirection(1);
            setStep(5);
        }
    };

    const handlePreviousStep = () => {
        setDirection(-1);
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        try {
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            const reservation = {
                ...reservationData,
                date: formattedDate,
                time: selectedTime,
                guests,
                table: selectedTable.id,
                branch: parseInt(branchId)
            };

            const response = await apiClient.post('/reservations/', reservation);
            if (response.status === 201) {
                toast.success("¡Reserva confirmada!");
                router.push('/reservation-confirmation');
            }
        } catch (error) {
            toast.error("Error al crear la reserva");
        }
    };

    const tileDisabled = ({ date }) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        return !availableDates[formattedDate];
    };

    const tileClassName = ({ date }) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        return availableDates[formattedDate] ? 'available-date' : 'unavailable-date';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Toaster position="top-center" />
            
            <main className="container mx-auto px-4 py-8">
                {/* Encabezado */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {restaurant?.name} - {branch?.name}
                    </h1>
                    <div className="mt-4 flex justify-center">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((stepNumber) => (
                                <div key={stepNumber} className="flex items-center">
                                    <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                                        step === stepNumber ? 'bg-blue-500 text-white' : 'bg-gray-300'
                                    }`}>
                                        {stepNumber}
                                    </div>
                                    {stepNumber < 5 && (
                                        <div className="h-1 w-12 bg-gray-300 mx-2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contenido según el paso */}
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 relative"
                    >
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold">Selecciona la fecha</h2>
                                <div className="flex justify-center">
                                    <Calendar
                                        onChange={setSelectedDate}
                                        value={selectedDate}
                                        locale={es}
                                        minDate={new Date()}
                                        tileDisabled={tileDisabled}
                                        tileClassName={tileClassName}
                                        className="w-full"
                                    />
                                </div>
                                <style jsx global>{`
                                    .available-date {
                                        background-color: #e8f5e9 !important;
                                    }
                                    .unavailable-date {
                                        background-color: #e0e0e0 !important;
                                        cursor: not-allowed !important;
                                    }
                                    .react-calendar__tile--active {
                                        background-color: #2196f3 !important;
                                        color: white !important;
                                    }
                                `}</style>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold">Selecciona el horario</h2>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`p-2 text-sm rounded ${
                                                selectedTime === time
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold">Selecciona el número de comensales</h2>
                                <div className="grid grid-cols-4 gap-4">
                                    {[...Array(8)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setGuests(i + 1)}
                                            className={`p-4 rounded-lg border ${
                                                guests === i + 1
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="text-lg font-medium">{i + 1}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold">Selecciona una mesa</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {availableTables.map((table) => (
                                        <button
                                            key={table.id}
                                            onClick={() => setSelectedTable(table)}
                                            className={`p-4 rounded-lg border ${
                                                selectedTable?.id === table.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="text-lg font-medium">Mesa {table.number}</div>
                                            <div className="text-sm text-gray-500">
                                                {table.capacity} personas
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold">Completa tus datos</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nombre completo
                                        </label>
                                        <input
                                            type="text"
                                            value={reservationData.name}
                                            onChange={(e) => setReservationData({
                                                ...reservationData,
                                                name: e.target.value
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={reservationData.email}
                                            onChange={(e) => setReservationData({
                                                ...reservationData,
                                                email: e.target.value
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            value={reservationData.phone}
                                            onChange={(e) => setReservationData({
                                                ...reservationData,
                                                phone: e.target.value
                                            })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Mensaje (opcional)
                                        </label>
                                        <textarea
                                            value={reservationData.message}
                                            onChange={(e) => setReservationData({
                                                ...reservationData,
                                                message: e.target.value
                                            })}
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Botones de navegación */}
                        <div className="mt-8 flex justify-between">
                            {step > 1 && (
                                <button
                                    onClick={handlePreviousStep}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Anterior
                                </button>
                            )}
                            <button
                                onClick={step === 5 ? handleSubmit : handleNextStep}
                                className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                {step === 5 ? 'Confirmar reserva' : 'Siguiente'}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}