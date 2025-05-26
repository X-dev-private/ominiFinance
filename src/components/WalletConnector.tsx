import { useState } from 'react';
import { useWallet, WalletConnectButton } from '@sei-js/react';

export const WalletConnector = () => {
  const { connectedWallet } = useWallet();
  const [isHovered, setIsHovered] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const address = connectedWallet?.accounts?.[0]?.address;

  // Versão minimalista do endereço (2...3)
  const shortenAddress = (addr) => addr ? `${addr.slice(0, 2)}⋯${addr.slice(-3)}` : '';

  return (
    <div className="font-sans">
      {!connectedWallet ? (
        <WalletConnectButton 
          buttonClassName={`
            relative overflow-hidden
            px-5 py-2.5
            bg-gray-800 hover:bg-gray-700
            text-white
            rounded-xl
            transition-all duration-300
            text-sm font-medium
            border border-gray-700
            shadow-sm hover:shadow-md
            hover:scale-[1.02]
            active:scale-95
            flex items-center justify-center
            group
          `}
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Connect Wallet
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </WalletConnectButton>
      ) : (
        <div 
          className="relative"
          onMouseEnter={() => {
            setIsHovered(true);
            setTimeout(() => setIsTooltipVisible(true), 150);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsTooltipVisible(false);
          }}
        >
          {/* Botão principal conectado */}
          <div className={`
            flex items-center gap-3
            px-4 py-2.5
            rounded-xl
            bg-gray-800
            ${isHovered ? 'bg-gray-700' : 'bg-gray-800'}
            border ${isHovered ? 'border-gray-600' : 'border-gray-700'}
            cursor-pointer
            transition-all duration-300
            shadow-sm ${isHovered ? 'shadow-gray-900/50' : ''}
            hover:scale-[1.02]
            active:scale-95
          `}>
            {/* Ícone animado */}
            <div className={`
              w-5 h-5 rounded-full 
              bg-gradient-to-br from-cyan-400 to-indigo-500 
              flex items-center justify-center
              ${isHovered ? 'rotate-[360deg]' : ''}
              transition-transform duration-500
            `}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white"/>
              </svg>
            </div>
            
            {/* Endereço minimalista */}
            <span className="text-sm font-medium text-white tracking-tight">
              {shortenAddress(address)}
            </span>
          </div>

          {/* Tooltip no tom gray-800 */}
          {isTooltipVisible && (
            <div className={`
              absolute z-20 top-full right-0 mt-3
              w-72 p-4 
              bg-gray-800
              rounded-xl
              shadow-lg
              border border-gray-700
              transition-opacity duration-200
              ${isHovered ? 'opacity-100' : 'opacity-0'}
              before:absolute before:-top-1.5 before:right-4
              before:w-3 before:h-3 
              before:bg-gray-800
              before:border-t before:border-l before:border-gray-700
              before:rotate-45
            `}>
              <div className="space-y-3">
                {/* Cabeçalho */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-white">Cosmos Hub</div>
                    <div className="text-xs text-gray-400">Main Network</div>
                  </div>
                </div>
                
                {/* Endereço */}
                <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Connected address</div>
                  <div className="text-sm font-mono text-white break-all">{address}</div>
                </div>
                
                {/* Rodapé */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Connected to dApp</span>
                  <span className="flex items-center gap-1 text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};