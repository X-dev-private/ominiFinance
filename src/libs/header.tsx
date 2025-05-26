import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWallet } from '@sei-js/react';
import Logo from '../assets/Logo.png';
import { WalletConnector } from '../components/WalletConnector';

export default function Header() {
  const { isConnected } = useAccount();
  const { connectedWallet } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [isDeFiOpen, setIsDeFiOpen] = useState(false);
  const [isTokensOpen, setIsTokensOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isConnected) {
      setSelectedChain('EVM');
    } else if (connectedWallet) {
      setSelectedChain('COSMOS');
    } else {
      setSelectedChain(null);
    }
  }, [isConnected, connectedWallet]);

  const handleChainSelection = (chain: string) => {
    setSelectedChain(chain);
    setIsModalOpen(false);
  };

  const toggleDeFiMenu = () => {
    setIsDeFiOpen(!isDeFiOpen);
    setIsTokensOpen(false);
  };

  const toggleTokensMenu = () => {
    setIsTokensOpen(!isTokensOpen);
    setIsDeFiOpen(false);
  };

  const handleMouseEnterMenu = (menu: 'defi' | 'tokens') => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    if (menu === 'defi') {
      setIsDeFiOpen(true);
    } else {
      setIsTokensOpen(true);
    }
  };

  const handleMouseLeaveMenu = (menu: 'defi' | 'tokens') => {
    const timeout = setTimeout(() => {
      if (menu === 'defi') {
        setIsDeFiOpen(false);
      } else {
        setIsTokensOpen(false);
      }
    }, 500);
    setHoverTimeout(timeout);
  };

  return (
    <header className="w-full bg-gray-900/80 backdrop-blur-lg border-b border-emerald-500/20 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="h-10 mr-2" />
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            OminiFinance
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {/* Dashboard */}
          <a
            href="/app/dashboard"
            className="px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors font-medium rounded-lg hover:bg-gray-800/50"
          >
            Dashboard
          </a>

          {/* Add Funds */}
          <a
            href="/app/ramp"
            className="px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors font-medium rounded-lg hover:bg-gray-800/50"
          >
            Add Funds
          </a>

          {/* Portfolio */}
          <a
            href="/app/portfolio"
            className="px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors font-medium rounded-lg hover:bg-gray-800/50"
          >
            Portfolio
          </a>

          {/* DeFi Dropdown */}
          <div className="relative group">
            <button
              onClick={toggleDeFiMenu}
              onMouseEnter={() => handleMouseEnterMenu('defi')}
              onMouseLeave={() => handleMouseLeaveMenu('defi')}
              className="px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors font-medium rounded-lg hover:bg-gray-800/50 flex items-center"
            >
              DeFi
              <svg
                className={`ml-1 h-4 w-4 transition-transform ${isDeFiOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDeFiOpen && (
              <div
                className="absolute left-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700 py-1 z-10"
                onMouseEnter={() => handleMouseEnterMenu('defi')}
                onMouseLeave={() => handleMouseLeaveMenu('defi')}
              >
                {['Swap', 'Liquidity'].map((item) => (
                  <a
                    key={item}
                    href={`/app/${item.toLowerCase()}`}
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Tokens Dropdown */}
          <div className="relative group">
            <button
              onClick={toggleTokensMenu}
              onMouseEnter={() => handleMouseEnterMenu('tokens')}
              onMouseLeave={() => handleMouseLeaveMenu('tokens')}
              className="px-4 py-2 text-gray-300 hover:text-emerald-400 transition-colors font-medium rounded-lg hover:bg-gray-800/50 flex items-center"
            >
              Tokens
              <svg
                className={`ml-1 h-4 w-4 transition-transform ${isTokensOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isTokensOpen && (
              <div
                className="absolute left-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700 py-1 z-10"
                onMouseEnter={() => handleMouseEnterMenu('tokens')}
                onMouseLeave={() => handleMouseLeaveMenu('tokens')}
              >
                {['Create Token', 'My Tokens'].map((item) => (
                  <a
                    key={item}
                    href={`/app/${item.toLowerCase().replace(' ', '-')}`}
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Coming Soon Badge */}
          <div className="relative group">
            <button
              disabled
              className="px-4 py-2 text-gray-500 font-medium rounded-lg flex items-center cursor-not-allowed"
            >
              Point & Rewards
              <span className="ml-1 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                SOON
              </span>
            </button>
          </div>
        </nav>

        {/* Wallet Connection */}
        <div className="flex items-center space-x-4">
          {selectedChain && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex items-center space-x-2 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className={`h-2 w-2 rounded-full ${selectedChain === 'EVM' ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
              <span className="text-xs font-medium text-gray-300">
                {selectedChain === 'EVM' ? 'EVM Chain' : 'Cosmos Chain'}
              </span>
              <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          
          {selectedChain === 'EVM' && <appkit-button />}
          {selectedChain === 'COSMOS' && <WalletConnector />}
          {!selectedChain && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Network Selection Modal - Reposicionado mais para baixo */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center pt-32 bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-gray-800/95 border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Select Network</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleChainSelection('EVM')}
                className="w-full flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">EVM Chains</h4>
                    <p className="text-xs text-gray-400">Ethereum, Polygon, BSC, etc.</p>
                  </div>
                </div>
                <svg className="h-5 w-5 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button
                onClick={() => handleChainSelection('COSMOS')}
                className="w-full flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
                    <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Cosmos Chains</h4>
                    <p className="text-xs text-gray-400">Sei, Osmosis, Juno, etc.</p>
                  </div>
                </div>
                <svg className="h-5 w-5 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}