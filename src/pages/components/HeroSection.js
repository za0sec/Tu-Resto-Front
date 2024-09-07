export default function HeroSection({ openModal }) {
    return (
        <main
            className="mt-10 mx-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28 lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 text-left">
                <h1 className="text-3xl tracking-tight font-extrabold text-gray-600 sm:text-5xl md:text-6xl leading-relaxed tracking-wide">
                    <span className="block xl:inline">Impulsa la Gestión de tu Restaurante con<br /></span>{' '}
                    <span className="block text-primary xl:inline mt-2">Tu Resto</span>
                </h1>

                {/* Línea decorativa debajo del título */}
                <div className="mt-2 w-20 h-1 bg-gray-900"></div>

                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl lg:max-w-full lg:mx-0">
                    Con TuResto, vas a poder centralizar la gestión de tus pedidos, mesas y reservas de forma eficiente, brindando una experiencia inigualable a tus clientes.
                </p>

                <div className="mt-8 sm:mt-10">
                    <button
                        onClick={openModal}
                        className="bg-primary text-white text-lg px-8 py-3 rounded-full shadow-lg hover:bg-primaryDark transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                    >
                        Ingresar Ahora
                    </button>
                </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2 flex justify-center lg:justify-end">
                <img src="/jpg/turesto.png" alt="Imagen moderna"
                    className="w-full h-auto max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl" />
            </div>
        </main>
    );
}
