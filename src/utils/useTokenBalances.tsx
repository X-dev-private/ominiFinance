// src/hooks/useTokenBalances.ts
import { useState, useEffect } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { TOKEN_ADDRESSES, ChainId } from "../config/tokenAddresses";

const ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)"
];

// Tipo dinâmico para os saldos dos tokens
export type TokenBalances = {
  [tokenKey: string]: string;
} & {
  loading: boolean;
};

// Configuração dos tokens que queremos monitorar
const SUPPORTED_TOKENS = ['anjux', 'ethof', 'usdcof']; // Adicione outros tokens aqui

export const useTokenBalances = (address?: string, chainId?: number): TokenBalances => {
  // Estado inicial dinâmico baseado nos tokens suportados
  const initialState = SUPPORTED_TOKENS.reduce((acc, token) => {
    acc[token] = "0.000";
    return acc;
  }, {} as Record<string, string>);
  
  initialState.loading = true;

  const [balances, setBalances] = useState<TokenBalances>(initialState);

  useEffect(() => {
    if (!address || !chainId || !window.ethereum) {
      setBalances(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchBalances = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const currentChainId = Number(network.chainId.toString()) as ChainId;

        if (!TOKEN_ADDRESSES[currentChainId]) {
          // Retorna "N/D" para todos os tokens suportados
          const notAvailableState = SUPPORTED_TOKENS.reduce((acc, token) => {
            acc[token] = "N/D";
            return acc;
          }, {} as Record<string, string>);
          
          setBalances({
            ...notAvailableState,
            loading: false
          });
          return;
        }

        const tokens = TOKEN_ADDRESSES[currentChainId];
        
        // Cria contratos dinamicamente para todos os tokens suportados
        const contracts = SUPPORTED_TOKENS.reduce((acc, tokenKey) => {
          if (tokens[tokenKey as keyof typeof tokens]) {
            acc[tokenKey] = new Contract(
              tokens[tokenKey as keyof typeof tokens],
              ERC20_ABI,
              provider
            );
          }
          return acc;
        }, {} as Record<string, Contract>);

        // Busca todos os saldos em paralelo
        const balancePromises = SUPPORTED_TOKENS.map(tokenKey => {
          return contracts[tokenKey] 
            ? contracts[tokenKey].balanceOf(address).catch(() => "0") 
            : Promise.resolve("0");
        });

        const balanceResults = await Promise.all(balancePromises);

        // Formata os resultados
        const newBalances = SUPPORTED_TOKENS.reduce((acc, tokenKey, index) => {
          acc[tokenKey] = Number(formatUnits(balanceResults[index], 18)).toFixed(3);
          return acc;
        }, {} as Record<string, string>);

        setBalances({
          ...newBalances,
          loading: false,
        });
      } catch (error) {
        console.error("Erro ao buscar saldos:", error);
        setBalances(prev => ({ ...prev, loading: false }));
      }
    };

    fetchBalances();

    const handleChainChanged = () => fetchBalances();
    window.ethereum.on('chainChanged', handleChainChanged);
    
    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [address, chainId]);

  return balances;
};