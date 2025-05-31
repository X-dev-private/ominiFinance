// src/components/tokenSelector.tsx
import React from 'react';
import { TokenInfo } from '../services/assetsService';

interface TokenSelectorProps {
  tokens: TokenInfo[];
  selectedToken: string;
  onSelect: (tokenSymbol: string) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokens,
  selectedToken,
  onSelect
}) => {
  const selectedTokenData = tokens.find(t => t.symbol === selectedToken);

  return (
    <div className="flex items-center space-x-3">
      {selectedTokenData ? (
        <div className="flex items-center">
          <img 
            src={selectedTokenData.icon} 
            alt={selectedTokenData.symbol}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png';
            }}
          />
          <span className="ml-2 font-medium text-gray-800">
            {selectedTokenData.symbol}
          </span>
        </div>
      ) : (
        <div className="text-gray-500">Select token</div>
      )}
      <select
        className="bg-transparent border-none focus:outline-none focus:ring-0"
        value={selectedToken}
        onChange={(e) => onSelect(e.target.value)}
      >
        {tokens.map((token) => (
          <option key={token.symbol} value={token.symbol}>
            {token.symbol}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TokenSelector;