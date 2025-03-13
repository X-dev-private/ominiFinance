import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useChainId, useAccount } from 'wagmi';

// Definindo o tipo para o valor do contexto
type NetworkColorContextType = string | null;

// Criando o contexto com valor padrão null
const NetworkColorContext = createContext<NetworkColorContextType>(null);

// Provedor de contexto para gerenciar a cor da rede
interface NetworkColorProviderProps {
  children: ReactNode;
}

export const NetworkColorProvider: React.FC<NetworkColorProviderProps> = ({ children }) => {
  const { isConnected } = useAccount(); // Verificando se a carteira está conectada
  const chainId = useChainId();
  const [networkColor, setNetworkColor] = useState<string>("");

  useEffect(() => {
    if (!isConnected) {
      setNetworkColor("bg-gradient-to-b from-white to-green-500"); // Sem carteira conectada
    } else {
      // Atualizando a cor com base no chainId quando a carteira estiver conectada
      if (chainId === 11155111) {
        setNetworkColor("bg-gradient-to-b from-white via-blue-300 to-white"); // Sepolia
      } else if (chainId === 5) {
        setNetworkColor("bg-gradient-to-b from-white via-purple-300 to-white"); // Goerli
      } else if (chainId === 1) {
        setNetworkColor("bg-gradient-to-b from-white via-gray-400 to-white"); // Ethereum Mainnet
      } else if (chainId === 42161) {
        setNetworkColor("bg-gradient-to-b from-white via-blue-500 to-white"); // Arbitrum
      } else if (chainId === 421614) {
        setNetworkColor("bg-gradient-to-b from-white via-blue-600 to-white"); // Arbitrum Sepolia
      } else if (chainId === 146) {
        setNetworkColor("bg-gradient-to-b from-white via-gray-800 to-white "); // Sonic (Tema escuro)
      } else if (chainId === 57054) {
        setNetworkColor("bg-gradient-to-b from-white via-gray-700 to-white"); // Blaze Sonic Testnet (Tema escuro)
      } else if (chainId === 4201) { // LUKSO Testnet
        setNetworkColor("bg-gradient-to-b from-white via-pink-400 to-white"); // Gradiente rosa
      } else {
        setNetworkColor("bg-gradient-to-b from-white via-green-300 to-white"); // Padrão suave
      }
    }
  }, [chainId, isConnected]);

  return (
    <NetworkColorContext.Provider value={networkColor}>
      {children}
    </NetworkColorContext.Provider>
  );
};

// Hook para acessar a cor da rede
export const useNetworkColor = (): NetworkColorContextType => {
  return useContext(NetworkColorContext);
};
