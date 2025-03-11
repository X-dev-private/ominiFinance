export default function Footer() {
    return (
        <div className="flex flex-col items-center justify-between w-full h-auto p-8 bg-opacity-50 rounded-2xl">
            <div className="flex flex-row gap-6 mb-6">
                <a 
                    href="" 
                    className="px-6 py-2 text-sm font-medium bg-white border border-green-500 text-green-600 rounded-lg hover:bg-gradient-to-r hover:from-green-400 hover:to-green-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-green-500/50">
                    Home
                </a>
                <a 
                    href="" 
                    className="px-6 py-2 text-sm font-medium bg-white border border-green-500 text-green-600 rounded-lg hover:bg-gradient-to-r hover:from-green-400 hover:to-green-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-green-500/50">
                    About
                </a>
                <a 
                    href="" 
                    className="px-6 py-2 text-sm font-medium bg-white border border-green-500 text-green-600 rounded-lg hover:bg-gradient-to-r hover:from-green-400 hover:to-green-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-green-500/50">
                    Contact
                </a>
            </div>
            <div className="text-center text-sm text-green-700">
                <p 
                    className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-green-400 to-green-600 border border-green-500 text-white rounded-lg mb-4 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-green-500/50">
                    &copy; {new Date().getFullYear()} OminiFinance. All rights reserved.
                </p>
                <p className="text-black font-medium">
                    Powered by ZeroElevenTeam
                </p>
            </div>
        </div>
    );
}