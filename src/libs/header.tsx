export default function Header() {
    return (
        <div className="flex flex-row items-center justify-between w-full h-12">
            <div className="flex gap-4">
                <a className="px-16 py-2 bg-green-500 border-2 border-green-500 text-white rounded-full hover:bg-white hover:text-green-500 transition-all duration-300">
                    Home
                </a>
                <a className="px-16 py-2 bg-green-500 border-2 border-green-500 text-white rounded-full hover:bg-white hover:text-green-500 transition-all duration-300">
                    About
                </a>
                <a className="px-16 py-2 bg-green-500 border-2 border-green-500 text-white rounded-full hover:bg-white hover:text-green-500 transition-all duration-300">
                    Contact
                </a>
            </div>
            <appkit-button />
        </div>
    )
}
