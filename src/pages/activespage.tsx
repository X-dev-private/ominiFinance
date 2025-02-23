import React from 'react';
import Footer from "../libs/footer";
import Header from "../libs/header";
import MintButtonU from "../components/mintButtonUsdc";
import MintButtonE from "../components/minButtonEth";
import MintButtonA from "../components/mintButtonAnjuX";
import { useNetworkColor } from '../config/networkColorContext';

const Actives: React.FC = () => {
  const networkColor = useNetworkColor();  // Obtendo a cor da rede do contexto

  return (
    <div className={`mx-auto ${networkColor} p-6 rounded-b-2xl shadow-lg flex flex-col items-center h-full space-y-16`}>
      <Header />
      <div className="w-full max-w-3xl space-y-8 pt-16 pb-16 shadow-2xl rounded-3xl">
        <h1 className="text-3xl font-bold text-white text-center">
          Tokens de Faucet
        </h1>

        <div className="flex justify-center space-x-6 pt-16 pb-16">
          <MintButtonU />
          <MintButtonE />
          <MintButtonA />
        </div>

        <p className="text-center text-white max-w-lg mx-auto border-2 border-white rounded-xl p-4" 
           style={{ backgroundColor: "rgba(0, 0, 0, 0.20)" }}>
          Tokens de faucet são ativos distribuídos gratuitamente em redes de teste para que desenvolvedores e usuários possam testar funcionalidades sem gastar tokens reais. 
          Esses tokens não possuem valor real e servem apenas para experimentação em ambientes de desenvolvimento.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Actives;
