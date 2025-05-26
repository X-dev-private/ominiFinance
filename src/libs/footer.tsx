export default function Footer() {
    return (
        <footer className="w-full bg-gradient-to-br from-gray-900 to-gray-800 border-t border-emerald-500/20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Logo/Company */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                                OminiFinance
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Decentralized finance solutions for the modern world.
                        </p>
                        <div className="flex space-x-4">
                            {['twitter', 'discord', 'github', 'telegram'].map((social) => (
                                <a key={social} href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                    <span className="sr-only">{social}</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        {/* Social icons would go here */}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    {/* Navigation Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Navigation</h3>
                        <nav className="space-y-2">
                            {['Home', 'Dashboard', 'Markets', 'Staking', 'Governance'].map((item) => (
                                <a key={item} href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                                    {item}
                                </a>
                            ))}
                        </nav>
                    </div>
                    
                    {/* Products */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Products</h3>
                        <nav className="space-y-2">
                            {['Swap', 'Lending', 'Yield Farming', 'Liquidity Pools', 'NFT Marketplace'].map((item) => (
                                <a key={item} href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                                    {item}
                                </a>
                            ))}
                        </nav>
                    </div>
                    
                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Stay Updated</h3>
                        <p className="text-gray-400 text-sm">
                            Subscribe to our newsletter for the latest updates.
                        </p>
                        <form className="flex space-x-2">
                            <input 
                                type="email" 
                                placeholder="Your email" 
                                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button 
                                type="submit" 
                                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
                
                {/* Bottom Footer */}
                <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} OminiFinance. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm">Terms</a>
                        <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm">Privacy</a>
                        <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm">Cookies</a>
                        <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm">Security</a>
                    </div>
                    <p className="text-gray-500 text-sm mt-4 md:mt-0">
                        Powered by <span className="text-emerald-400">ZeroElevenTeam</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}