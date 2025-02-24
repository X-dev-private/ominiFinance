import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { executeSwap } from '../utils/swap';

const tokenAddresses = {
  TOKENA: '0x1429c6F2Be05EFF1fB07F52D9D4880a108153dD4',
  TOKENB: '0x32c00bD194B3ea78B9799394984DF8dB7397B834',
  TOKENC: '0x6c3aaaA93CC59f5A4288465F073C2B94DDBD3a05',
};

const TokenSwap: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [fromToken, setFromToken] = useState<string>("TOKENA");
  const [toToken, setToToken] = useState<string>("TOKENC");
  const [loading, setLoading] = useState(false);

  const { address } = useAccount();
  const { data: fromBalance } = useBalance({ address });
  const { data: toBalance } = useBalance({ address });

  const formatBalance = (balance?: string): string => {
    return balance ? parseFloat(balance).toFixed(8) : "0.00000000";
  };

  const handleSwap = async () => {
    if (!address || parseFloat(amount) <= 0) {
      console.error("Erro: Endereço inválido ou quantidade inválida.");
      return;
    }

    setLoading(true);
    try {
      // Adaptar executeSwap para aceitar os tokens selecionados
      await executeSwap(fromToken, toToken, amount);
      alert('Swap realizado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao realizar swap.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center p-8 rounded-lg shadow-lg">
      <section className="w-xl p-6 rounded-lg relative">
        <div className="relative z-10 mb-12">
          <label className="block text-green-800 font-semibold">From</label>
          <div className="flex items-center justify-between border border-green-600 rounded-2xl p-2 bg-white">
            <select
              className="bg-white text-green-800 font-semibold px-2 py-1 rounded-2xl border border-green-600 focus:outline-none"
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
            >
              {Object.keys(tokenAddresses).map((token) => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
            <input
              className="w-full text-right focus:outline-none"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="flex items-center text-green-600">
              Balance: {formatBalance(fromBalance?.formatted)} {fromToken}
            </span>
          </div>
        </div>
        <div className="relative z-10 mt-12">
          <label className="block text-green-800 font-semibold">To</label>
          <div className="flex items-center justify-between border border-green-600 rounded-2xl p-2 bg-white">
            <select
              className="bg-white text-green-800 font-semibold px-2 py-1 rounded-2xl border border-green-600 focus:outline-none"
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
            >
              {Object.keys(tokenAddresses).map((token) => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
            <input className="w-full text-right focus:outline-none" type="number" value="0" readOnly />
            <span className="flex items-center text-green-600">
              Balance: {formatBalance(toBalance?.formatted)} {toToken}
            </span>
          </div>
        </div>
        <button
          onClick={handleSwap}
          className="bg-green-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Realizando Swap...' : 'Fazer Swap'}
        </button>
      </section>
    </div>
  );
};

export default TokenSwap;
