import React, { useState, useEffect } from 'react';
import { useTokenBalances } from '../utils/useTokenBalances';
import { useAccount, useChainId } from 'wagmi';

interface TokenSwapProps {
  amount: string;
  setAmount: (amount: string) => void;
  setTokenSymbol: (tokenSymbol: string) => void; // Atualiza o token selecionado
}

const TokenSwap: React.FC<TokenSwapProps> = ({ amount, setAmount, setTokenSymbol }) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { anjux, ethof, usdcof, loading } = useTokenBalances(address, chainId);

  // Atualiza os tokens disponíveis conforme o saldo é atualizado
  const [tokens, setTokens] = useState([
    { symbol: 'ANJUX', balance: anjux },
    { symbol: 'ETHOF', balance: ethof },
    { symbol: 'USDCOF', balance: usdcof },
  ]);

  useEffect(() => {
    // Atualiza os tokens sempre que os saldos forem atualizados
    setTokens([
      { symbol: 'ANJUX', balance: anjux },
      { symbol: 'ETHOF', balance: ethof },
      { symbol: 'USDCOF', balance: usdcof },
    ]);
  }, [anjux, ethof, usdcof]);

  // Estados para tokens selecionados
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);

  useEffect(() => {
    // Atualiza o token padrão quando os tokens são carregados
    setFromToken(tokens[0]);
    setToToken(tokens[1]);
    setTokenSymbol(tokens[0].symbol);
  }, [tokens]);

  const handleFromTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedToken = tokens.find(token => token.symbol === e.target.value);
    if (selectedToken) {
      setFromToken(selectedToken);
      setTokenSymbol(selectedToken.symbol);
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
              onChange={(e) => {
                const selectedToken = tokens.find(token => token.symbol === e.target.value);
                if (selectedToken) setToToken(selectedToken);
              }}
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
