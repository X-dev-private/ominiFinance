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

  // Estilo base para todos os botões
  const buttonStyle = "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg";

  return (
    <div className="flex flex-row items-center justify-between w-full h-20 bg-opacity-50 px-6 py-8 rounded-2xl">
      <div className="w-1/5 text-left">
        <img src={Logo} alt="Logo" className="h-16 object-contain" />
      </div>

      <div className="w-3/5 flex gap-4 items-center justify-center">
        {/* Botão Dashboard */}
        <a
          href="/app/dashboard"
          className={buttonStyle}
        >
          Dashboard
        </a>

        {/* Botão Add Funds */}
        <a
          href="/app/ramp"
          className={buttonStyle}
        >
          Add Funds
        </a>

        {/* Botão Portfolio */}
        <a
          href="/app/portfolio"
          className={buttonStyle}
        >
          Portfolio
        </a>

        {/* Menu Suspenso para DeFi */}
        <div className="relative group">
          <button
            onClick={toggleDeFiMenu}
            onMouseEnter={() => setIsDeFiOpen(true)}
            onMouseLeave={() => !isDeFiOpen && setIsDeFiOpen(false)}
            className={buttonStyle}
          >
            DeFi
          </button>
          {isDeFiOpen && (
            <div
              className="absolute top-full mt-2 left-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
              onMouseEnter={() => setIsDeFiOpen(true)}
              onMouseLeave={() => setIsDeFiOpen(false)}
            >
              {['Swap', 'Liquidity'].map((item, index) => (
                <a
                  key={index}
                  href={`/app/${item.toLowerCase()}`}
                  className="block px-6 py-3 text-sm font-medium text-gray-800 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Menu Suspenso para Tokens */}
        <div className="relative group">
          <button
            onClick={toggleTokensMenu}
            onMouseEnter={() => setIsTokensOpen(true)}
            onMouseLeave={() => !isTokensOpen && setIsTokensOpen(false)}
            className={buttonStyle}
          >
            Tokens
          </button>
          {isTokensOpen && (
            <div
              className="absolute top-full mt-2 left-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20"
              onMouseEnter={() => setIsTokensOpen(true)}
              onMouseLeave={() => setIsTokensOpen(false)}
            >
              {['Create Token', 'My Tokens'].map((item, index) => (
                <a
                  key={index}
                  href={`/app/${item.toLowerCase().replace(' ', '-')}`}
                  className="block px-6 py-3 text-sm font-medium text-gray-800 hover:bg-green-50 hover:text-green-600 rounded-lg transition-all duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Botão Point & Rewards (Desabilitado) */}
        <div className="relative flex flex-col items-center group">
          <button
            disabled
            className={`${buttonStyle} opacity-50 cursor-not-allowed`}
          >
            Point & Rewards
          </button>
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-green-600 text-xs font-semibold px-3 py-1 rounded-md shadow-md border border-green-500">
            Coming Soon
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-green-500"></div>
          </div>
        </div>
      </div>

      <div className="w-1/5 flex justify-end items-center">
        {selectedChain === 'EVM' && <appkit-button />}
        {selectedChain === 'COSMOS' && <WalletConnector />}
        {!selectedChain && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className={buttonStyle}
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Modal de Seleção de Rede */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="bg-white/90 p-8 rounded-2xl shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Choose Network</h3>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleChainSelection('EVM')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                EVM
              </button>
              <button
                onClick={() => handleChainSelection('COSMOS')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                COSMOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}