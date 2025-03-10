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

  // Função para conectar à rede Blaze Sonic
  const connectToBlazeSonic = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: ethers.utils.hexValue(57054), // Chain ID da Blaze Sonic
            chainName: 'Blaze Sonic Testnet',
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://testnet.sonic.finance'], // RPC da Blaze Sonic
            blockExplorerUrls: ['https://testnet.sonic.finance'], // Block Explorer da Blaze Sonic
          }],
        });
        alert('Blaze Sonic network connected successfully!');
      } catch (error) {
        console.error('Error connecting to Blaze Sonic network:', error);
        alert('Failed to connect to Blaze Sonic network. Please check the console for details.');
      }
    } else {
      alert('MetaMask not detected. Please install MetaMask to continue.');
    }
  };

  // Função para conectar à rede Arbitrum Sepolia
  const connectToArbitrumSepolia = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: ethers.utils.hexValue(421614), // Chain ID da Arbitrum Sepolia
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
        alert('Arbitrum Sepolia network connected successfully!');
      } catch (error) {
        console.error('Error connecting to Arbitrum Sepolia network:', error);
        alert('Failed to connect to Arbitrum Sepolia network. Please check the console for details.');
      }
    } else {
      alert('MetaMask not detected. Please install MetaMask to continue.');
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
            Faucet tokens are assets freely distributed on test networks to enable developers and users to test functionalities without spending real tokens. 
            These tokens have no real value and are meant solely for experimentation in development environments.
          </p>

          {/* Botões para conectar às redes */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={connectToBlazeSonic}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Connect to Blaze Sonic
            </button>
            <button
              onClick={connectToArbitrumSepolia}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Connect to Arbitrum Sepolia
            </button>
          </div>

          {/* Texto explicativo */}
          <p className="max-w-lg mx-auto border border-white/20 rounded-xl p-4 bg-black/30 text-lg leading-relaxed">
            To test this application, you need to connect your wallet to one of the supported networks. Click the buttons above to add the Blaze Sonic or Arbitrum Sepolia networks to your MetaMask. 
            Make sure you have MetaMask installed and that the desired network is configured correctly.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Actives;