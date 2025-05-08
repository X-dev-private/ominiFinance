import "../App.css";
import Logo from '../assets/Logo.png';
import CapaA from '../assets/Bitcoin-amico.png';
import CapaB from '../assets/Manage money-pana.png';
import ImageCarousel from "../components/Carrosel";

export default function Home() {
  return (
    <div className="App bg-gray-50">
      {/* Header Moderno */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 text-gray-800 flex justify-between items-center py-4 px-8 shadow-sm">
        <div className="flex items-center space-x-10">
          <img src={Logo} alt="OminiFinance Logo" className="h-10" />
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="font-medium hover:text-green-600 transition-colors">Home</a>
            <a
              href="https://omini-finance-docs.vercel.app/"
              className="font-medium hover:text-green-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </a>
            <a href="/roadmap" className="font-medium hover:text-green-600 transition-colors">Roadmap</a>
          </nav>
        </div>
        <a
          href="/app/Dashboard"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-green-500/30"
        >
          Launch Testnet
        </a>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-20">
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">OminiFinance</span><br />
              Cross-Chain DeFi Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The ultimate interoperability solution built on Cosmos, connecting all major blockchain ecosystems through advanced IBC technology.
            </p>
            <div className="flex space-x-4">
              <a
                href="/app/Dashboard"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
              >
                Launch App
              </a>
              <a
                href="https://omini-finance-docs.vercel.app/"
                className="border border-green-500 text-green-600 px-8 py-3.5 rounded-lg hover:bg-green-50 transition-colors"
              >
                Documentation
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/10 rounded-2xl -rotate-3"></div>
            <div className="grid grid-cols-2 gap-5 relative">
              <img 
                src={CapaA} 
                alt="Cross-chain transactions"
                className="h-full object-cover rounded-xl shadow-lg"
              />
              <img 
                src={CapaB} 
                alt="Multi-chain asset management"
                className="h-full object-cover rounded-xl shadow-lg mt-8"
              />
            </div>
          </div>
        </section>

        {/* About OminiFinance */}
        <section className="my-28">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              THE OMNI FINANCE PLATFORM
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Unified Multi-Chain Finance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              OminiFinance revolutionizes DeFi by creating seamless connections between isolated blockchain ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cross-Chain Swaps</h3>
              <p className="text-gray-600">
                Trade assets across different blockchains without wrapping or intermediaries.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Yield Aggregation</h3>
              <p className="text-gray-600">
                Access the best yields across multiple chains from a single interface.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">IBC Native</h3>
              <p className="text-gray-600">
                Built on Cosmos SDK with native Inter-Blockchain Communication support.
              </p>
            </div>
          </div>
        </section>

        {/* Cosmos Integration */}
        <section className="my-28 bg-gradient-to-br from-green-50 to-white rounded-3xl p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                POWERED BY COSMOS
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The Most Advanced Blockchain Interoperability
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                OminiFinance leverages Cosmos SDK and Tendermint consensus to deliver enterprise-grade performance and unmatched cross-chain capabilities.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Instant transaction finality with Tendermint BFT</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Native IBC protocol for seamless chain communication</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Modular architecture for easy upgrades and customization</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Cosmos?</h3>
              <p className="text-gray-600 mb-6">
                Cosmos is the Internet of Blockchains - an ecosystem of interconnected, sovereign chains that can exchange value and data through IBC.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">For Developers</h4>
                  <p className="text-gray-600">
                    Cosmos SDK provides the most flexible framework for building application-specific blockchains.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">For Users</h4>
                  <p className="text-gray-600">
                    Experience true interoperability without wrapped assets or centralized bridges.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">For the Ecosystem</h4>
                  <p className="text-gray-600">
                    Shared security model and growing network of interconnected chains.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Chains */}
        <section className="my-28">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Connected Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Native support for 50+ IBC-enabled chains and secure bridges to major networks.
            </p>
          </div>
          <ImageCarousel />
        </section>

        {/* CTA Section */}
        <section className="my-28 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience Cross-Chain DeFi?</h2>
          <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users managing assets across multiple blockchains with OminiFinance.
          </p>
          <a
            href="/app/Dashboard"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-lg"
          >
            Launch App Now
          </a>
        </section>
      </main>

      {/* Footer Moderno */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <img src={Logo} alt="OminiFinance Logo" className="h-10 mb-4" />
            <p className="text-gray-400">
              The ultimate cross-chain DeFi platform built on Cosmos.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="/app/Dashboard" className="hover:text-white transition-colors">App</a></li>
              <li><a href="/roadmap" className="hover:text-white transition-colors">Roadmap</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="https://omini-finance-docs.vercel.app/" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Whitepaper</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; 2025 OminiFinance. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Discord</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}