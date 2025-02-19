export default function Footer() {
    return (
        <div className="flex flex-col items-center justify-between w-full h-auto p-6">
            <div className="flex flex-row gap-12 mb-4"> {/* Aumentei o gap para 12 */}
                <a href="" className="px-8 py-2 bg-white border-2 border-green-700 text-green-700 rounded-lg hover:bg-green-700 hover:text-white transition-all duration-300">
                    Home
                </a>
                <a href="" className="px-8 py-2 bg-white border-2 border-green-700 text-green-700 rounded-lg hover:bg-green-700 hover:text-white transition-all duration-300">
                    About
                </a>
                <a href="" className="px-8 py-2 bg-white border-2 border-green-700 text-green-700 rounded-lg hover:bg-green-700 hover:text-white transition-all duration-300">
                    Contact
                </a>
            </div>
            <div className="text-center text-sm text-green-700">
                <p className="px-8 py-2 bg-white border-2 border-green-700 text-green-700 rounded-lg">
                    &copy; {new Date().getFullYear()} OminiFinance. All rights reserved.
                </p>
                <p className="text-black">Powered by ZeroElevenTeam</p>
            </div>
        </div>
    )
}
