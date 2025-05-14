import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useChainId, useAccount } from 'wagmi';
import StarBackground from './StarBackground'; // Ajuste o caminho conforme necessário

// Definindo o tipo para o valor do contexto
type NetworkColorContextType = string | null;

// Criando o contexto com valor padrão null
const NetworkColorContext = createContext<NetworkColorContextType>(null);

// Provedor de contexto para gerenciar a cor da rede
interface NetworkColorProviderProps {
  children: ReactNode;
}

export const NetworkColorProvider: React.FC<NetworkColorProviderProps> = ({ children }) => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [networkColor, setNetworkColor] = useState<string>("");

  useEffect(() => {
    if (!isConnected) {
      setNetworkColor("bg-green-400");
    } else {
      if (chainId === 11155111) {
        setNetworkColor("bg-gradient-to-b from-white via-blue-300 to-white");
      } else if (chainId === 5) {
        setNetworkColor("bg-gradient-to-b from-white via-purple-300 to-white");
      } else if (chainId === 1) {
        setNetworkColor("bg-gradient-to-b from-white via-gray-400 to-white");
      } else if (chainId === 42161) {
        setNetworkColor("bg-gradient-to-b from-white via-blue-500 to-white");
      } else if (chainId === 421614) {
        setNetworkColor("bg-gradient-to-b from-white via-blue-600 to-white");
      } else if (chainId === 146) {
        setNetworkColor("bg-gradient-to-b from-white via-gray-800 to-white");
      } else if (chainId === 57054) {
        setNetworkColor("bg-gradient-to-b from-white via-gray-700 to-white");
      } else if (chainId === 4201) {
        setNetworkColor("bg-gradient-to-b from-white via-pink-400 to-white");
      } else {
        setNetworkColor("bg-gradient-to-b from-white via-green-300 to-white");
      }
    }
  }, [chainId, isConnected]);

  return (
    <NetworkColorContext.Provider value={networkColor}>
      <div className={`fixed inset-0 -z-20 ${networkColor}`} />
      <StarBackground />
      {children}
    </NetworkColorContext.Provider>
  );
};

export const useNetworkColor = (): NetworkColorContextType => {
  return useContext(NetworkColorContext);
};