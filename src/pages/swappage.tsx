import React, { useState } from 'react';
import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import TokenSwap from "../libs/swapLib";
import { useNetworkColor } from '../config/networkColorContext';

export default function SwapPage() {
  const networkColor = useNetworkColor();

  // Estado para armazenar o valor selecionado (amount)
  const [amount, setAmount] = useState<string>("0");

  // Estado para armazenar os tokens selecionados
  const [fromToken, setFromToken] = useState<string>("ANJUX");
  const [toToken, setToToken] = useState<string>("ETHOF"); // Defina um token padrão ou deixe dinâmico

  return (
    <div className={`mx-auto ${networkColor} p-4 rounded-b-2xl shadow-lg flex flex-col items-center h-full space-y-32`}>
      <Header />
      
      <div className="flex flex-row">
        {/* Passa os estados e funções de atualização para o TokenSwap */}
        <TokenSwap 
          amount={amount} 
          setAmount={setAmount} 
          setFromToken={setFromToken} 
          setToToken={setToToken} 
        />
      </div>

      <Footer />
    </div>
  );
}
