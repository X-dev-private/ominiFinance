// src/hooks/useTokenBalances.ts
import { useState, useEffect } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { TOKEN_ADDRESSES, ChainId } from "../config/tokenAddresses";

const ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)"
];

const TOKEN_FACTORY_ABI = [
  "function getTokensByOwner(address owner) external view returns (address[] memory)",
  "function getTokenByAddress(address tokenAddress) external view returns (string, string, uint256, address, bool)"
];

export type TokenBalances = {
  [tokenKey: string]: string;
} & {
  loading: boolean;
  customTokens?: {
    [address: string]: {
      symbol: string;
      balance: string;
    }
  }
};

const SUPPORTED_TOKENS = ['anjux', 'ethof', 'usdcof'];

export const useTokenBalances = (address?: string, chainId?: number): TokenBalances => {
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
        const tokenFactoryAddress = tokens.tokenFactory;
        
        if (!tokenFactoryAddress) {
          throw new Error("Token factory address not found");
        }

        const tokenFactory = new Contract(
          tokenFactoryAddress,
          TOKEN_FACTORY_ABI,
          provider
        );

        // 1. Busca todos os tokens do usuário
        const userTokenAddresses = await tokenFactory.getTokensByOwner(address);
        
        // 2. Busca informações dos tokens customizados
        const customTokensInfo = await Promise.all(
          userTokenAddresses.map(async (tokenAddress: string) => {
            const [name, symbol] = await tokenFactory.getTokenByAddress(tokenAddress);
            const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);
            const balance = await tokenContract.balanceOf(address);
            return {
              address: tokenAddress,
              symbol,
              balance: formatUnits(balance, 18)
            };
          })
        );

        // 3. Converte para o formato de customTokens
        const customTokens = customTokensInfo.reduce((acc, token) => {
          acc[token.address] = {
            symbol: token.symbol,
            balance: Number(token.balance).toFixed(3)
          };
          return acc;
        }, {} as Record<string, { symbol: string; balance: string }>);

        // 4. Busca saldos dos tokens padrão (SUPPORTED_TOKENS)
        const standardTokenContracts = SUPPORTED_TOKENS.reduce((acc, tokenKey) => {
          if (tokens[tokenKey as keyof typeof tokens]) {
            acc[tokenKey] = new Contract(
              tokens[tokenKey as keyof typeof tokens],
              ERC20_ABI,
              provider
            );
          }
          return acc;
        }, {} as Record<string, Contract>);

        const standardBalancePromises = SUPPORTED_TOKENS.map(tokenKey => {
          return standardTokenContracts[tokenKey] 
            ? standardTokenContracts[tokenKey].balanceOf(address).catch(() => "0") 
            : Promise.resolve("0");
        });

        const standardBalanceResults = await Promise.all(standardBalancePromises);

        const standardBalances = SUPPORTED_TOKENS.reduce((acc, tokenKey, index) => {
          acc[tokenKey] = Number(formatUnits(standardBalanceResults[index], 18)).toFixed(3);
          return acc;
        }, {} as Record<string, string>);

        setBalances({
          ...standardBalances,
          customTokens,
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