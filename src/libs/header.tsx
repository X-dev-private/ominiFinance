import Logo from '../assets/Logo.png';

export default function Header() {
    return (
        <div className="flex flex-row items-center justify-between w-full h-20 bg-opacity-50 px-6 py-8 rounded-2xl">
            <div className="w-1/5 text-left">
                <img src={Logo} alt="Logo" className="h-16 object-contain" />
            </div>
            
            <div className="w-3/5 flex gap-4 items-center justify-center">
                <a 
                    href="/app" 
                    className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-green-400 to-green-600 border border-green-500 text-white rounded-lg hover:bg-gradient-to-r hover:from-white hover:to-white hover:text-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50">
                    Dashboard
                </a>
                <a 
                    href='/app/portifolio' 
                    className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-green-400 to-green-600 border border-green-500 text-white rounded-lg hover:bg-gradient-to-r hover:from-white hover:to-white hover:text-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50">
                    Portifolio
                </a>
                <a 
                    href="/app/swap" 
                    className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-green-400 to-green-600 border border-green-500 text-white rounded-lg hover:bg-gradient-to-r hover:from-white hover:to-white hover:text-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50">
                    Swap
                </a>
                <a 
                    href="/app/liquidity" 
                    className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-green-400 to-green-600 border border-green-500 text-white rounded-lg hover:bg-gradient-to-r hover:from-white hover:to-white hover:text-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50">
                    Liquidity
                </a>
                <div className="relative flex flex-col items-center group">
                    <a 
                        href="/app/liquidity" 
                        className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-green-400 to-green-600 border border-green-500 text-white rounded-lg cursor-not-allowed opacity-50 transition-all duration-300 hover:bg-gradient-to-r hover:from-red-400 hover:to-red-600 hover:border-red-500">
                        Bridge
                    </a>
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-green-600 text-xs font-semibold px-3 py-1 rounded-md shadow-md border border-green-500">
                        Coming Soon
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-green-500"></div>
                    </div>
                </div>
                <div className="relative flex flex-col items-center group">
                    <a 
                        className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-green-400 to-green-600 border border-green-500 text-white rounded-lg cursor-not-allowed opacity-50 transition-all duration-300 hover:bg-gradient-to-r hover:from-red-400 hover:to-red-600 hover:border-red-500">
                        Point & Rewards
                    </a>
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-green-600 text-xs font-semibold px-3 py-1 rounded-md shadow-md border border-green-500">
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