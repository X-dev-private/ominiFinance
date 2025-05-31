import React, { useState, useEffect } from 'react';
import { TokenInfo } from '../../services/assetsService';
import { useQuery } from '@tanstack/react-query';
import { getCryptoPrices } from '../../services/cryptoService';

interface TokenInputProps {
  label: string;
  token: TokenInfo | null;
  balance: string;
  tokens: TokenInfo[];
  onTokenChange: (token: TokenInfo) => void;
  amount: string;
  onAmountChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUsdValueChange?: (usdValue: number) => void;
  readOnly: boolean;
  isFromInput?: boolean;
  price?: number;
}

const OSMOSIS_TOKEN_IDS: Record<string, string> = {
  'ATOM': 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
  'OSMO': 'uosmo',
  'JUNO': 'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED',
  'SCRT': 'ibc/0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
  'AKT': 'ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4',
  'STARS': 'ibc/987C17B11ABC2B20019178ACE62929FE9840202CE79498E29FE8E5CB02B7C0A4',
  'INJ': 'ibc/64BA6E31FE887D66C6F8F31C7B1A80C7CA179239677B3938EBDF541A82CF0F21',
  'LUNA': 'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0',
  'USTC': 'ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC',
  'EVMOS': 'ibc/16618B7F7AC551F48C057A13F4CA5503693FBFF507719A85BC6876B8BD75F821',
  'CRO': 'ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1',
  'DVPN': 'ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84',
  'XPRT': 'ibc/A0CC0CF735BFB30E730C70019D4218A1244FF383503FF7579C9201AB93CA9293',
  'REGEN': 'ibc/1DCC8A6CB5689018431323953344A9F6CC4D0BFB261E88C9F7777372C10CD076',
  'GRAV': 'ibc/E97634A40119F1898989C2A23224ED83FDD0A57EA46B3A094E287288D1672B44',
  'ION': 'uion',
  'BOOT': 'ibc/01D29D2F6C510E0A5F30AD8A4037273B2F6FC042C4A4E3BD2A070F0935A8C1E2',
};

export default function TokenInput({
  label,
  token,
  balance,
  tokens,
  onTokenChange,
  amount,
  onAmountChange,
  onUsdValueChange,
  readOnly,
  isFromInput = false,
  price
}: TokenInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tokenPriceData, setTokenPriceData] = useState<{usd: number; usd_24h_change: number} | null>(null);
  
  const { data: prices } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: getCryptoPrices,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (token?.symbol) {
      // Usa o ID do Osmosis para buscar o preço (se existir)
      const osmosisId = OSMOSIS_TOKEN_IDS[token.symbol] || token.id;
      if (prices?.[osmosisId]) {
        setTokenPriceData(prices[osmosisId]);
      } else if (price) {
        // Fallback para o price prop se não encontrar nos preços da API
        setTokenPriceData({ usd: price, usd_24h_change: 0 });
      }
    }
  }, [token, prices, price]);

  // Calcula o valor em USD
  const usdValue = tokenPriceData?.usd && amount ? (parseFloat(amount) * tokenPriceData.usd) : 0;
  const formattedUsdValue = usdValue.toFixed(2);
  const isPositiveChange = tokenPriceData?.usd_24h_change ? tokenPriceData.usd_24h_change >= 0 : false;

  // Notifica a mudança no valor em USD quando é o input de origem
  useEffect(() => {
    if (isFromInput && onUsdValueChange) {
      onUsdValueChange(usdValue);
    }
  }, [usdValue, isFromInput, onUsdValueChange]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onAmountChange) {
      onAmountChange(e);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-base font-medium">{label}</span>
        <span className="text-gray-600 text-base">{balance}</span>
      </div>
      
      <div className="relative flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-400 transition-colors">
        {/* Seletor de Token - Lado Esquerdo */}
        <div className="relative w-2/5 min-w-[160px]">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-3 focus:outline-none w-full"
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
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Menu Suspenso Moderno */}
          {isOpen && (
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
                  // Usa o ID do Osmosis para buscar o preço (se existir)
                  const osmosisId = OSMOSIS_TOKEN_IDS[t.symbol] || t.id;
                  const priceData = prices?.[osmosisId];
                  const isTokenPositive = priceData?.usd_24h_change >= 0;
                  
                  return (
                    <button
                      key={`${t.id}-${t.symbol}`}
                      className={`flex items-center justify-between w-full p-3 hover:bg-gray-50 transition-colors ${
                        token?.id === t.id ? 'bg-green-50' : ''
                      }`}
                      onClick={() => {
                        onTokenChange(t); // Passa o objeto TokenInfo completo
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
                      
                      {priceData && (
                        <div className="text-right">
                          <span className="block font-medium text-gray-800">
                            ${priceData.usd < 1 ? priceData.usd.toFixed(4) : priceData.usd.toFixed(2)}
                          </span>
                          <span className={`text-xs ${isTokenPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isTokenPositive ? '↗' : '↘'} {Math.abs(priceData.usd_24h_change).toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Input de Valor - Lado Direito */}
        <div className="w-3/5 flex flex-col items-end">
          <input
            className="w-full bg-transparent text-gray-800 text-right text-3xl font-medium focus:outline-none placeholder-gray-400"
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={handleAmountChange}
            readOnly={readOnly}
          />
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-500">
              ${formattedUsdValue}
            </span>
            {tokenPriceData && (
              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                isPositiveChange ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isPositiveChange ? '↗' : '↘'} {Math.abs(tokenPriceData.usd_24h_change).toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}