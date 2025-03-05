import React, { useState, useEffect } from 'react';
import { useTokenBalances } from '../utils/useTokenBalances';
import { useAccount, useChainId } from 'wagmi';

interface TokenSwapProps {
  amount: string;
  setAmount: (amount: string) => void;
  setFromToken: (tokenSymbol: string) => void;
  setToToken: (tokenSymbol: string) => void;
}

const TokenSwap: React.FC<TokenSwapProps> = ({ amount, setAmount, setFromToken, setToToken }) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { anjux, ethof, usdcof, loading } = useTokenBalances(address, chainId);

  const [tokens, setTokens] = useState([
    { symbol: 'ANJUX', balance: anjux },
    { symbol: 'ETHOF', balance: ethof },
    { symbol: 'USDCOF', balance: usdcof },
  ]);

  useEffect(() => {
    setTokens([
      { symbol: 'ANJUX', balance: anjux },
      { symbol: 'ETHOF', balance: ethof },
      { symbol: 'USDCOF', balance: usdcof },
    ]);
  }, [anjux, ethof, usdcof]);

  // Inicializa os tokens padrão
  const [fromToken, setLocalFromToken] = useState(tokens[0]);
  const [toToken, setLocalToToken] = useState(tokens[1]);

  useEffect(() => {
    setLocalFromToken(tokens[0]);
    setLocalToToken(tokens[1]);
    setFromToken(tokens[0].symbol);
    setToToken(tokens[1].symbol);
  }, [tokens]);

  const handleFromTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedToken = tokens.find(token => token.symbol === e.target.value);
    if (selectedToken) {
      setLocalFromToken(selectedToken);
      setFromToken(selectedToken.symbol);
    }
  };

  const handleToTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedToken = tokens.find(token => token.symbol === e.target.value);
    if (selectedToken) {
      setLocalToToken(selectedToken);
      setToToken(selectedToken.symbol);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center p-8 rounded-lg">
      <section className="w-xl p-6 rounded-lg relative">
        <div className="relative z-10 mb-12">
          <label className="block text-white font-semibold">From</label>
          <div className="flex items-center justify-between border border-green-600 rounded-2xl p-2 bg-white">
            <select
              className="bg-white text-green-800 font-semibold px-2 py-1 rounded-2xl border border-green-600 focus:outline-none"
              onChange={handleFromTokenChange}
              value={fromToken.symbol}
            >
              {tokens.map((token, index) => (
                <option key={index} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input
              className="w-full text-right focus:outline-none"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="flex items-center text-green-600">
              Balance: {loading ? "Carregando..." : `${fromToken.balance} tokens`}
            </span>
          </div>
        </div>
        
        <div className="relative z-10 mt-12">
          <label className="block text-white font-semibold">To</label>
          <div className="flex items-center justify-between border border-green-600 rounded-2xl p-2 bg-white">
            <select
              className="bg-white text-green-800 font-semibold px-2 py-1 rounded-2xl border border-green-600 focus:outline-none"
              onChange={handleToTokenChange}
              value={toToken.symbol}
            >
              {tokens.map((token, index) => (
                <option key={index} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input 
              className="w-full text-right focus:outline-none" 
              type="number" 
              value="0" 
              readOnly 
            />
            <span className="flex items-center text-green-600">
              Balance: {loading ? "Carregando..." : `${toToken.balance} tokens`}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TokenSwap;
