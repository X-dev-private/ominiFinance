import React, { useState, useEffect } from 'react';
import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import TokenSwap from "../libs/swapLib";
import { useNetworkColor } from '../config/networkColorContext';
import ApproveComponent from "../components/approveComponent";
import { useChainId } from 'wagmi';

export default function SwapPage() {
  const networkColor = useNetworkColor();
  const chainId = useChainId();

  const [amount, setAmount] = useState<string>("0");
  const [fromToken, setFromToken] = useState<string>("ANJUX");
  const [toToken, setToToken] = useState<string>("ETHOF");

  const [networkWarning, setNetworkWarning] = useState<string>("");

  useEffect(() => {
    // Verifica se a rede é Blaze Sonic ou Arbitrum Sepolia
    if (chainId !== 57054 && chainId !== 421614) {  // Exemplo de Chain IDs, ajuste conforme necessário
      setNetworkWarning("Por favor, troque para Blaze Sonic ou Arbitrum Sepolia.");
    } else {
      setNetworkWarning("");
    }
  }, [chainId]);

  return (
    <div className={`mx-auto ${networkColor} p-4 rounded-b-2xl shadow-lg flex flex-col items-center h-full space-y-32`}>
      <Header />
      {networkWarning && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4">
          {networkWarning}
        </div>
      )}

      <div className="flex flex-row gap-8 w-full max-w-6xl">
        <TokenSwap 
          amount={amount} 
          setAmount={setAmount} 
          setFromToken={setFromToken} 
          setToToken={setToToken} 
        />
        <ApproveComponent 
          amount={amount} 
          fromToken={fromToken} 
          toToken={toToken} 
        />
      </div>
      <Footer />
    </div>
  );
}