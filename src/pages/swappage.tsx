import React, { useState } from 'react';
import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import TokenSwap from "../libs/swapLib";
import { useNetworkColor } from '../config/networkColorContext';
import AproveComponent from "../components/aproveComponent";

export default function SwapPage() {
  const networkColor = useNetworkColor();

  // Estado para armazenar o valor selecionado (amount)
  const [amount, setAmount] = useState<string>("0");

  // Estado para armazenar o símbolo do token selecionado no campo "From"
  const [tokenSymbol, setTokenSymbol] = useState<string>("ANJUX");

  return (
    <div className={`mx-auto ${networkColor} p-4 rounded-b-2xl shadow-lg flex flex-col items-center h-full space-y-32`}>
      <Header />
      
      <div className="flex flex-row gap-8 w-full max-w-6xl">
        {/* Passa o estado e a função de atualização para o TokenSwap */}
        <TokenSwap 
          amount={amount} 
          setAmount={setAmount} 
          setTokenSymbol={setTokenSymbol} // Passa a função para atualizar o tokenSymbol
        />

        {/* Passa o valor selecionado e o tokenSymbol para o AproveComponent */}
        <AproveComponent amount={amount} tokenSymbol={tokenSymbol} />
      </div>

      <Footer />
    </div>
  );
}