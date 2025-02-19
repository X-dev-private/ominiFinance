export default function Header() {
    return (
        <div className="flex flex-row items-center justify-between w-auto h-16 bg-green-100 bg-opacity-50 p-6 rounded-2xl">
            <div className="flex gap-6">
                <a className="px-8 py-2 bg-green-500 border-2 border-green-500 text-white rounded-2xl hover:bg-white hover:text-green-500 transition-all duration-300">
                    dashbord
                </a>
                <a className="px-8 py-2 bg-green-500 border-2 border-green-500 text-white rounded-2xl hover:bg-white hover:text-green-500 transition-all duration-300">
                    portifolio
                </a>
                <a className="px-8 py-2 bg-green-500 border-2 border-green-500 text-white rounded-2xl hover:bg-white hover:text-green-500 transition-all duration-300">
                    swap
                </a>
                <a className="px-8 py-2 bg-green-500 border-2 border-green-500 text-white rounded-2xl hover:bg-white hover:text-green-500 transition-all duration-300">
                    point & rewards
                </a>
            </div>
            <div className="ml-96"> {/* Div criada para o appkit-button com margem maior */}
                <appkit-button />
            </div>
        </div>
    )
}
