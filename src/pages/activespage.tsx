import React from 'react';
import Footer from "../libs/footer";
import Header from "../libs/header";
import MintButtonU from "../components/mintButtonUsdc";
import MintButtonE from "../components/minButtonEth";
import MintButtonA from "../components/mintButtonAnjuX";
import { useNetworkColor } from '../config/networkColorContext';

const Actives: React.FC = () => {
  const networkColor = useNetworkColor(); // Obtendo a cor da rede do contexto

  return (
    <div className={`mx-auto ${networkColor} min-h-screen flex flex-col`}>
      <Header />

      {/* Conteúdo centralizado e espaçado */}
      <div className="flex flex-col items-center justify-center flex-grow w-full px-6 mt-20 mb-20 ">
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl text-white text-center space-y-8">
          <h1 className="text-4xl font-bold drop-shadow-md">Tokens de Faucet</h1>

          <div className="flex flex-wrap justify-center gap-6">
            <MintButtonU />
            <MintButtonE />
            <MintButtonA />
          </div>

          <p className="max-w-lg mx-auto border border-white/20 rounded-xl p-4 bg-black/30 text-lg leading-relaxed">
            Tokens de faucet são ativos distribuídos gratuitamente em redes de teste para que desenvolvedores e usuários possam testar funcionalidades sem gastar tokens reais. 
            Esses tokens não possuem valor real e servem apenas para experimentação em ambientes de desenvolvimento.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Actives;
