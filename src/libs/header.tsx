import Logo from '../assets/Logo.png'

export default function Header() {
    return (
        <div className="flex flex-row items-center justify-between w-full h-16 bg-opacity-50 px-4 py-6 rounded-2xl">
            <div className="w-1/5 text-left">
                <img src={Logo} alt="Logo" className="h-16 object-contain" />
            </div>
            
            <div className="w-3/5 flex gap-3 items-center justify-center">
                <a href="/app" className="px-4 py-1.5 text-sm bg-green-500 border border-green-500 text-white rounded-xl hover:bg-white hover:text-green-500 transition-all duration-300">
                    Dashboard
                </a>
                <a href='/app/portifolio' className="px-4 py-1.5 text-sm bg-green-500 border border-green-500 text-white rounded-xl hover:bg-white hover:text-green-500 transition-all duration-300">
                    Portifolio
                </a>
                <a 
                    href="/app/swap" 
                    className="px-4 py-1.5 text-sm bg-green-500 border border-green-500 text-white rounded-xl hover:bg-white hover:text-green-500 transition-all duration-300"
                >
                    Swap
                </a>
                <a 
                    href="/app/liquidity" 
                    className="px-4 py-1.5 text-sm bg-green-500 border border-green-500 text-white rounded-xl hover:bg-white hover:text-green-500 transition-all duration-300"
                >
                    Liquidity
                </a>
                <div className="relative flex flex-col items-center group">
                    <a 
                        href="/app/liquidity" 
                        className="px-4 py-1.5 text-sm bg-green-500 border border-green-500 text-white rounded-xl cursor-not-allowed opacity-50 transition-all duration-300 hover:bg-red-500 hover:border-red-500"
                    >
                        Bridge
                    </a>
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-green-500 text-xs font-semibold px-3 py-1 rounded-md shadow-md border border-green-500">
                        Coming Soon
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-green-500"></div>
                    </div>
                </div>
                <div className="relative flex flex-col items-center group">
                    <a 
                        className="px-4 py-1.5 text-sm bg-green-500 border border-green-500 text-white rounded-xl cursor-not-allowed opacity-50 transition-all duration-300
                                   hover:bg-red-500 hover:border-red-500"
                    >
                        Point & Rewards
                    </a>
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-green-500 text-xs font-semibold px-3 py-1 rounded-md shadow-md border border-green-500">
                        Coming Soon
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-green-500"></div>
                    </div>
                </div>
            </div>

            <div title="3" className="w-1/5 flex justify-end">
                <appkit-button />
            </div>
        </div>
    );
}