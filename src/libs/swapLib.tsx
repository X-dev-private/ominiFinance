import React, { useState, useEffect } from 'react';
import TokenSelector from '../components/tokenSelector';
import { AssetsService, TokenInfo } from '../services/assetsService';

const HeaderSection = () => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Token Swap</h1>
    <div className="flex space-x-4 border-b border-gray-200 pb-1">
      <button className="px-6 py-3 text-green-600 font-medium border-b-2 border-green-600 text-lg">
        Swap
      </button>
      <button className="px-6 py-3 text-gray-500 font-medium hover:text-green-600 transition-colors text-lg">
        Limit
      </button>
      <button className="px-6 py-3 text-gray-500 font-medium hover:text-green-600 transition-colors text-lg">
        DCA
      </button>
    </div>
  </div>
);

const SwapArrow = () => (
  <div className="flex justify-center my-2">
    <button className="p-3 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-green-50 hover:border-green-400 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
);

interface TokenInputProps {
  label: string;
  token: string;
  balance: string;
  tokens: TokenInfo[];
  onTokenChange: (token: string) => void;
  amount: string;
  onAmountChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly: boolean;
  isCosmosActive: boolean;
}

const TokenInput: React.FC<TokenInputProps> = ({
  label,
  token,
  balance,
  tokens,
  onTokenChange,
  amount,
  onAmountChange,
  readOnly,
  isCosmosActive
}) => {
  const selectedToken = tokens.find(t => t.symbol === token);
  const tokenPrice = selectedToken ? AssetsService.getPrice(selectedToken.id)?.usd : 0;
  const usdValue = tokenPrice && amount ? (parseFloat(amount) * tokenPrice).toFixed(2) : '0.00';
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-base font-medium">{label}</span>
        <span className="text-gray-600 text-base">{balance}</span>
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-400 transition-colors">
        <div className="w-2/5 min-w-[160px]"> 
          <TokenSelector 
            tokens={tokens}
            selectedToken={token}
            onSelect={onTokenChange}
            isCosmosActive={isCosmosActive}
          />
        </div>
        <div className="w-3/5 flex flex-col items-end">
          <input
            className="w-full bg-transparent text-gray-800 text-right text-3xl font-medium focus:outline-none placeholder-gray-400"
            type="text"
            placeholder="0,00"
            value={amount}
            onChange={onAmountChange}
            readOnly={readOnly}
          />
          <span className="text-sm text-gray-500 mt-1">
            ${usdValue}
          </span>
        </div>
      </div>
    </div>
  );
};

const TransactionDetails = () => (
  <div className="mt-8 space-y-6">
    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Exchange Rate</span>
            <span className="text-gray-800 font-medium">-</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Network Fee</span>
            <span className="text-gray-800 font-medium">-</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Price Impact</span>
            <span className="text-gray-800 font-medium">-</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Minimum Received</span>
            <span className="text-gray-800 font-medium">-</span>
          </div>
        </div>
      </div>
    </div>
    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-gray-600 text-base mb-2">Network</h4>
          <span className="text-gray-800 font-medium">Cosmos</span>
        </div>
        <div>
          <h4 className="text-gray-600 text-base mb-2">Slippage Tolerance</h4>
          <span className="text-gray-800 font-medium">0.5%</span>
        </div>
      </div>
    </div>
  </div>
);

const TokenSwap = () => {
  const [fromToken, setFromToken] = useState<string>('ATOM');
  const [toToken, setToToken] = useState<string>('OSMO');
  const [fromAmount, setFromAmount] = useState<string>('1.00');
  const [toAmount, setToAmount] = useState<string>('8.50');
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [isCosmosActive, setIsCosmosActive] = useState<boolean>(true);

  // Carrega os tokens disponíveis
  useEffect(() => {
    const availableTokens = AssetsService.getAllTokenMetadata();
    setTokens(availableTokens);
    
    // Simula carregamento de preços (em uma aplicação real, isso viria de uma API)
    const mockPrices = {
      'cosmos': { usd: 9.85, usd_24h_change: 2.5 },
      'osmosis': { usd: 0.50, usd_24h_change: -1.2 },
      'juno-network': { usd: 0.25, usd_24h_change: 5.7 },
      // Adicione outros preços conforme necessário
    };
    AssetsService.updatePrices(mockPrices);
  }, []);

  // Simula saldos do usuário
  useEffect(() => {
    const mockBalances = [
      { denom: 'uatom', amount: '10000000' }, // 10 ATOM
      { denom: 'uosmo', amount: '0' }, // 0 OSMO
      { denom: 'ujuno', amount: '5000000' } // 5 JUNO
    ];
    AssetsService.setBalances('cosmoshub-4', mockBalances);
  }, []);

  const handleFromTokenChange = (tokenSymbol: string) => {
    setFromToken(tokenSymbol);
    // Aqui você adicionaria a lógica para recalcular o valor de saída
  };

  const handleToTokenChange = (tokenSymbol: string) => {
    setToToken(tokenSymbol);
    // Aqui você adicionaria a lógica para recalcular o valor de saída
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    // Aqui você adicionaria a lógica para recalcular o valor de saída
    // Exemplo simplificado:
    if (fromToken === 'ATOM' && toToken === 'OSMO') {
      setToAmount((parseFloat(value || '0') * 8.5).toFixed(2));
    }
  };

  // Obtém o saldo formatado para exibição
  const getFormattedBalance = (tokenSymbol: string): string => {
    const token = tokens.find(t => t.symbol === tokenSymbol);
    if (!token) return 'Balance: 0.00';
    
    const balanceInfo = AssetsService.getFormattedBalance(token.id, token.chain);
    return `Balance: ${balanceInfo.amount} ${balanceInfo.denom}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl border border-green-100">
        <HeaderSection />
        
        <div className="mb-2 text-sm text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <svg className="mr-1.5 h-2 w-2 text-purple-800" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Cosmos Network
          </span>
        </div>

        <div className="space-y-6">
          <TokenInput
            label="From"
            token={fromToken}
            balance={getFormattedBalance(fromToken)}
            tokens={tokens}
            onTokenChange={handleFromTokenChange}
            amount={fromAmount}
            onAmountChange={handleFromAmountChange}
            readOnly={false}
            isCosmosActive={isCosmosActive}
          />
          
          <SwapArrow />
          
          <TokenInput
            label="To"
            token={toToken}
            balance={getFormattedBalance(toToken)}
            tokens={tokens}
            onTokenChange={handleToTokenChange}
            amount={toAmount}
            readOnly={true}
            isCosmosActive={isCosmosActive}
          />
        </div>

        <TransactionDetails />

        <button
          className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors duration-200 text-lg"
        >
          Confirm Swap
        </button>
      </div>
    </div>
  );
};

export default TokenSwap;