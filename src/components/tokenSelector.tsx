import React, { useState } from 'react';

interface TokenSelectorProps {
  tokens: {
    symbol: string;
    logo?: string;
    balance?: string;
  }[];
  selectedToken: string;
  onSelect: (token: string) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ tokens, selectedToken, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTokenData = tokens.find(token => token.symbol === selectedToken) || tokens[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-white border border-green-500 rounded-lg hover:bg-green-50 transition-colors"
      >
        <div className="flex items-center">
          {selectedTokenData.logo && (
            <img 
              src={selectedTokenData.logo} 
              alt={selectedTokenData.symbol} 
              className="w-6 h-6 mr-2 rounded-full"
            />
          )}
          <span className="text-gray-800 font-medium">{selectedTokenData.symbol}</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-green-500 rounded-lg shadow-lg">
          <div className="p-2 max-h-60 overflow-y-auto">
            {tokens.map((token) => (
              <div
                key={token.symbol}
                onClick={() => {
                  onSelect(token.symbol);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer rounded-md hover:bg-green-50 ${
                  selectedToken === token.symbol ? 'bg-green-100' : ''
                }`}
              >
                <div className="flex items-center">
                  {token.logo && (
                    <img 
                      src={token.logo} 
                      alt={token.symbol} 
                      className="w-5 h-5 mr-2 rounded-full"
                    />
                  )}
                  <span className="text-gray-800">{token.symbol}</span>
                </div>
                {token.balance && (
                  <span className="text-gray-500 text-sm">{token.balance}</span>
                )}
              </div>
            ))}
          </div>
          <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200">
            BALANCE: 0 ~ 0 USD
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenSelector;