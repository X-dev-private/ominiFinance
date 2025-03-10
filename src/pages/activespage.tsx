import React from 'react';
import Footer from "../libs/footer";
import Header from "../libs/header";
import MintButtonU from "../components/mintButtonUsdc";
import MintButtonE from "../components/minButtonEth";
import MintButtonA from "../components/mintButtonAnjuX";
import { useNetworkColor } from '../config/networkColorContext';
import { ethers } from 'ethers';

const Actives: React.FC = () => {
  const networkColor = useNetworkColor(); // Obtendo a cor da rede do contexto

  // Função para conectar à rede Sonic Blaze Testnet
  const connectToSonicBlaze = async () => {
    if (!window.ethereum) {
      alert('MetaMask não detectado. Por favor, instale o MetaMask para continuar.');
      return;
    }

    const chainId = ethers.utils.hexlify(57054); // Chain ID da Sonic Blaze Testnet

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: chainId,
          chainName: 'Sonic Blaze Testnet',
          nativeCurrency: {
            name: 'Sonic',
            symbol: 'S',
            decimals: 18,
          },
          rpcUrls: ['https://rpc.blaze.soniclabs.com'], // RPC da Sonic Blaze Testnet
          blockExplorerUrls: ['https://testnet.sonicscan.org'], // Block Explorer da Sonic Blaze Testnet
        }],
      });
      alert('Conectado à rede Sonic Blaze Testnet com sucesso!');
    } catch (error) {
      console.error('Erro ao conectar à rede Sonic Blaze Testnet:', error);
      alert('Falha ao conectar à rede Sonic Blaze Testnet. Por favor, verifique o console para detalhes.');
    }
  };

  // Função para conectar à rede Arbitrum Sepolia
  const connectToArbitrumSepolia = async () => {
    if (!window.ethereum) {
      alert('MetaMask não detectado. Por favor, instale o MetaMask para continuar.');
      return;
    }

    const chainId = ethers.utils.hexlify(421614); // Chain ID da Arbitrum Sepolia

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: chainId,
          chainName: 'Arbitrum Sepolia',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'], // RPC da Arbitrum Sepolia
          blockExplorerUrls: ['https://sepolia-explorer.arbitrum.io/'], // Block Explorer da Arbitrum Sepolia
        }],
      });
      alert('Conectado à rede Arbitrum Sepolia com sucesso!');
    } catch (error) {
      console.error('Erro ao conectar à rede Arbitrum Sepolia:', error);
      alert('Falha ao conectar à rede Arbitrum Sepolia. Por favor, verifique o console para detalhes.');
    }
  };

  return (
    <div className={`mx-auto ${networkColor} min-h-screen flex flex-col`}>
      <Header />

      {/* Conteúdo centralizado e espaçado */}
      <div className="flex flex-col items-center justify-center flex-grow w-full px-6 mt-20 mb-20">
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl text-white text-center space-y-8">
          <h1 className="text-4xl font-bold drop-shadow-md">Faucet Tokens</h1>

          <div className="flex flex-wrap justify-center gap-6">
            <MintButtonU />
            <MintButtonE />
            <MintButtonA />
          </div>

          <p className="max-w-lg mx-auto border border-white/20 rounded-xl p-4 bg-black/30 text-lg leading-relaxed">
            Faucet tokens são ativos distribuídos gratuitamente em redes de teste para permitir que desenvolvedores e usuários testem funcionalidades sem gastar tokens reais. 
            Esses tokens não possuem valor real e são destinados exclusivamente para experimentação em ambientes de desenvolvimento.
          </p>

          {/* Botões para conectar às redes */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={connectToSonicBlaze}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Conectar à Sonic Blaze Testnet
            </button>
            <button
              onClick={connectToArbitrumSepolia}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Conectar à Arbitrum Sepolia
            </button>
          </div>

          {/* Texto explicativo */}
          <p className="max-w-lg mx-auto border border-white/20 rounded-xl p-4 bg-black/30 text-lg leading-relaxed">
            Para testar este aplicativo, você precisa conectar sua carteira a uma das redes suportadas. Clique nos botões acima para adicionar as redes Sonic Blaze Testnet ou Arbitrum Sepolia ao seu MetaMask. 
            Certifique-se de que o MetaMask esteja instalado e que a rede desejada esteja configurada corretamente.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Actives;