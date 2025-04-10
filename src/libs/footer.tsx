export default function Footer() {
    return (
        <div className="flex flex-col items-center justify-between w-full h-auto p-8 bg-opacity-50 rounded-2xl">
            <div className="flex flex-row gap-4 mb-6">
                <a 
                    href="" 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    Home
                </a>
                <a 
                    href="" 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    About
                </a>
                <a 
                    href="" 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    Contact
                </a>
            </div>
            <div className="text-center">
                <p className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg mb-4">
                    &copy; {new Date().getFullYear()} OminiFinance. All rights reserved.
                </p>
                <p className="text-gray-700 font-medium">
                    Powered by ZeroElevenTeam
                </p>
            </div>
        </div>
    );
}