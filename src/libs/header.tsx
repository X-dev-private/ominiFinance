import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWallet } from '@sei-js/react';
import Logo from '../assets/Logo.png';
import { WalletConnector } from '../components/WalletConnector';

export default function Header() {
  const { isConnected } = useAccount();
  const { connectedWallet } = useWallet();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isDeFiOpen, setIsDeFiOpen] = useState(false);
  const [isTokensOpen, setIsTokensOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected) {
      setSelectedChain('EVM');
    } else if (connectedWallet) {
      setSelectedChain('COSMOS');
    } else {
      setSelectedChain(null);
    }
  }, [isConnected, connectedWallet]);

  const toggleAccountMenu = () => {
    setIsAccountOpen(!isAccountOpen);
    setIsDeFiOpen(false);
    setIsTokensOpen(false);
  };

  const toggleDeFiMenu = () => {
    setIsDeFiOpen(!isDeFiOpen);
    setIsTokensOpen(false);
    setIsAccountOpen(false);
  };

  const toggleTokensMenu = () => {
    setIsTokensOpen(!isTokensOpen);
    setIsDeFiOpen(false);
    setIsAccountOpen(false);
  };

  return (
    <div className="flex flex-row items-center justify-between w-full h-20 bg-opacity-50 px-6 py-8 rounded-2xl">
      <div className="w-1/5 text-left">
        <img src={Logo} alt="Logo" className="h-16 object-contain" />
      </div>

      <div className="w-3/5 flex gap-4 items-center justify-center">
        {/* Dashboard Button */}
        <a
          href="/app/dashboard"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Dashboard
        </a>

        {/* Add Funds Button */}
        <a
          href="/app/ramp"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          buy tokens
        </a>

        {/* Portfolio Button */}
        <a
          href="/app/portfolio"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Portfolio
        </a>

        {/* DeFi Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDeFiMenu}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            DeFi
          </button>
          {isDeFiOpen && (
            <div className="absolute top-full mt-2 left-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 py-1 z-10">
              {['Swap', 'Liquidity'].map((item) => (
                <a
                  key={item}
                  href={`/app/${item.toLowerCase()}`}
                  className="block px-6 py-3 text-sm font-medium text-gray-800 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Tokens Dropdown */}
        <div className="relative">
          <button
            onClick={toggleTokensMenu}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Tokens
          </button>
          {isTokensOpen && (
            <div className="absolute top-full mt-2 left-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 py-1 z-10">
              {['Create Token', 'My Tokens'].map((item) => (
                <a
                  key={item}
                  href={`/app/${item.toLowerCase().replace(' ', '-')}`}
                  className="block px-6 py-3 text-sm font-medium text-gray-800 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Point & Rewards Button */}
        <div className="relative group">
          <button
            disabled
            className="bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 shadow-lg cursor-not-allowed opacity-80"
          >
            Point & Rewards
          </button>
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-green-600 text-xs font-semibold px-3 py-1 rounded-md shadow-md border border-green-500">
            Coming Soon
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-green-500"></div>
          </div>
        </div>
      </div>

      {/* My Account Dropdown */}
      <div className="w-1/5 flex justify-end">
        <div className="relative">
          <button
            onClick={toggleAccountMenu}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            My Account
          </button>
          
          {isAccountOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 py-2 z-50">
              {!selectedChain ? (
                <button 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg mx-2 my-1"
                >
                  Connect Wallet
                </button>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">Connected to {selectedChain}</p>
                  </div>
                  <a
                    href="/app/profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-all duration-200"
                  >
                    Profile Settings
                  </a>
                  <a
                    href="/app/security"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-all duration-200"
                  >
                    Security
                  </a>
                  <button 
                    className="w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 text-left transition-all duration-200"
                  >
                    Disconnect Wallet
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}