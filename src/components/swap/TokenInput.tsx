import React, { useState, useEffect } from 'react';
import { TokenInfo, AssetsService } from '../../services/assetsService';
import { useQuery } from '@tanstack/react-query';

interface TokenInputProps {
  label: string;
  token: TokenInfo | null;
  balance: string;
  tokens: TokenInfo[];
  onTokenChange: (token: TokenInfo) => void;
  amount: string;
  usdAmount?: string;
  onAmountChange?: (value: string) => void;
  onUsdAmountChange?: (usdAmount: string) => void;
  onUsdValueChange?: (usdValue: number) => void;
  readOnly: boolean;
  isFromInput?: boolean;
  pairedToken?: TokenInfo | null;
  fixedUsdValue?: string;
  allowTokenChange?: boolean;
}

export default function TokenInput({
  label,
  token,
  balance,
  tokens,
  onTokenChange,
  amount,
  usdAmount = '0',
  onAmountChange,
  onUsdAmountChange,
  onUsdValueChange,
  readOnly,
  isFromInput = false,
  pairedToken = null,
  fixedUsdValue,
  allowTokenChange = true
}: TokenInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tokenPriceData, setTokenPriceData] = useState<{usd: number; usd_24h_change: number} | null>(null);
  
  const { data: prices, isLoading } = useQuery({
    queryKey: ['cryptoPrices', token?.id],
    queryFn: async () => {
      const updatedPrices = await AssetsService.updatePrices();
      return updatedPrices;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Formatador de valores
  const formatValue = (value: string, isUsd = false) => {
    const num = parseFloat(value || '0');
    if (isUsd) {
      return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    if (num < 0.0001) return num.toExponential(4);
    if (num < 1) return num.toFixed(6);
    return num.toFixed(4);
  };

  useEffect(() => {
    if (token?.id && prices) {
      const priceData = prices[token.id] || AssetsService.getPrice(token.id);
      if (priceData) {
        setTokenPriceData(priceData);
        
        // Atualiza automaticamente o amount para o campo To
        if (!isFromInput && fixedUsdValue && onAmountChange) {
          const tokenAmount = parseFloat(fixedUsdValue) / priceData.usd;
          onAmountChange(isNaN(tokenAmount) ? '' : tokenAmount.toString());
        }
      }
    }
  }, [token, prices, fixedUsdValue, isFromInput, onAmountChange]);

  const usdValue = tokenPriceData?.usd && amount ? (parseFloat(amount) * tokenPriceData.usd) : 0;
  const isPositiveChange = tokenPriceData?.usd_24h_change ? tokenPriceData.usd_24h_change >= 0 : false;

  // Sincroniza valores USD para o campo From
  useEffect(() => {
    if (isFromInput && tokenPriceData?.usd && amount && onUsdAmountChange) {
      onUsdAmountChange((parseFloat(amount) * tokenPriceData.usd).toFixed(2));
    }
  }, [amount, tokenPriceData, onUsdAmountChange, isFromInput]);

  useEffect(() => {
    if (isFromInput && onUsdValueChange) {
      onUsdValueChange(usdValue);
    }
  }, [usdValue, isFromInput, onUsdValueChange]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validação para permitir apenas números e ponto decimal
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      onAmountChange?.(value);
    }
  };

  const handleUsdAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isFromInput || !onUsdAmountChange) return;
    
    const value = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      onUsdAmountChange(value);
      
      if (tokenPriceData?.usd && onAmountChange) {
        const tokenAmount = parseFloat(value) / tokenPriceData.usd;
        onAmountChange(isNaN(tokenAmount) ? '' : tokenAmount.toString());
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-base font-medium">{label}</span>
          <span className="text-gray-600 text-base">{balance}</span>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-base font-medium">{label}</span>
        <span className="text-gray-600 text-base">{balance}</span>
      </div>
      
      <div className="relative flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-400 transition-colors">
        {/* Seletor de Token */}
        <div className="relative w-2/5 min-w-[160px]">
          <button 
            onClick={() => allowTokenChange && setIsOpen(!isOpen)}
            className={`flex items-center space-x-3 focus:outline-none w-full ${!allowTokenChange ? 'cursor-default' : ''}`}
            disabled={!allowTokenChange}
          >
            {token ? (
              <>
                <img 
                  src={token.icon} 
                  alt={token.symbol}
                  className="w-9 h-9 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png';
                  }}
                />
                <div className="text-left flex-1">
                  <span className="font-medium text-gray-800 block">{token.symbol}</span>
                  <span className="text-xs text-gray-500">{token.name}</span>
                  {tokenPriceData && (
                    <span className={`text-xs ${isPositiveChange ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                      {isPositiveChange ? '↗' : '↘'} {Math.abs(tokenPriceData.usd_24h_change).toFixed(2)}%
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="text-gray-500">Select token</div>
            )}
            {allowTokenChange && (
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {isOpen && allowTokenChange && (
            <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-[320px] overflow-auto">
              <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search token..."
                  className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>
              
              <div className="divide-y divide-gray-100">
                {tokens.map((t) => {
                  const priceData = prices?.[t.id] || AssetsService.getPrice(t.id);
                  const isTokenPositive = priceData?.usd_24h_change >= 0;
                  
                  return (
                    <button
                      key={t.id}
                      className={`flex items-center justify-between w-full p-3 hover:bg-gray-50 transition-colors ${
                        token?.id === t.id ? 'bg-green-50' : ''
                      }`}
                      onClick={() => {
                        onTokenChange(t);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={t.icon} 
                          alt={t.symbol}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png';
                          }}
                        />
                        <div className="text-left">
                          <span className="font-medium text-gray-800 block">{t.symbol}</span>
                          <span className="text-xs text-gray-500">{t.name}</span>
                        </div>
                      </div>
                      
                      {priceData ? (
                        <div className="text-right">
                          <span className="block font-medium text-gray-800">
                            ${priceData.usd.toFixed(priceData.usd < 1 ? 4 : 2)}
                          </span>
                          <span className={`text-xs ${isTokenPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isTokenPositive ? '↗' : '↘'} {Math.abs(priceData.usd_24h_change).toFixed(2)}%
                          </span>
                        </div>
                      ) : (
                        <div className="text-right text-xs text-gray-400">Loading...</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Input de Valor */}
        <div className="w-3/5 flex flex-col items-end">
          {isFromInput ? (
            <>
              <input
                className="w-full bg-transparent text-gray-800 text-right text-3xl font-medium focus:outline-none placeholder-gray-400"
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                readOnly={readOnly}
                inputMode="decimal"
              />
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">
                  {formatValue(usdValue.toString(), true)}
                </span>
                {tokenPriceData && (
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    isPositiveChange ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isPositiveChange ? '↗' : '↘'} {Math.abs(tokenPriceData.usd_24h_change).toFixed(2)}%
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="text-right text-3xl font-medium text-gray-800">
                {formatValue(amount)} {token?.symbol}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">
                  {formatValue(fixedUsdValue || '0', true)}
                </span>
                {tokenPriceData && (
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    isPositiveChange ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isPositiveChange ? '↗' : '↘'} {Math.abs(tokenPriceData.usd_24h_change).toFixed(2)}%
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}