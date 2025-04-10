// src/hooks/useTokenBalances.ts
import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { TOKEN_ADDRESSES, ChainId } from "../config/tokenAddresses";

const ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)"
];

const TOKEN_FACTORY_ABI = [
  "function getTokenByOwner(address owner) external view returns (address[] memory)",
  "function getTokenByAddress(address tokenAddress) external view returns (string memory, string memory, uint256, address, bool)"
];

export interface TokenBalance {
  symbol: string;
  balance: string;
}

export interface TokenBalances {
  [tokenKey: string]: string;
  loading: boolean;
  customTokens?: {
    [address: string]: TokenBalance;
  };
}

const SUPPORTED_TOKENS = ['anjux', 'ethof', 'usdcof'] as const;

export const useTokenBalances = (address?: string, chainId?: number): TokenBalances => {
  const [balances, setBalances] = useState<TokenBalances>(() => {
    const initialState = SUPPORTED_TOKENS.reduce((acc, token) => {
      acc[token] = "0.000";
      return acc;
    }, {} as Record<string, string>);
    
    return {
      ...initialState,
      loading: true
    };
  });

  const fetchBalances = useCallback(async () => {
    if (!address || !chainId || !window.ethereum) {
      setBalances(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId) as ChainId;

      if (!TOKEN_ADDRESSES[currentChainId]) {
        const notAvailableState = SUPPORTED_TOKENS.reduce((acc, token) => {
          acc[token] = "N/A";
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

      // 1. Get user's custom tokens
      const userTokenAddresses = await tokenFactory.getTokenByOwner(address);
      
      // 2. Get custom tokens info
      const customTokensInfo = await Promise.all(
        userTokenAddresses.map(async (tokenAddress: string) => {
          try {
            const [, symbol, , , isValid] = await tokenFactory.getTokenByAddress(tokenAddress);
            if (!isValid) {
              return null;
            }
            const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);
            const balance = await tokenContract.balanceOf(address);
            return {
              address: tokenAddress,
              symbol,
              balance: formatUnits(balance, 18)
            };
          } catch (error) {
            console.error(`Error fetching token ${tokenAddress}:`, error);
            return null;
          }
        })
      );

      // 3. Format custom tokens (filter out null values)
      const customTokens = customTokensInfo.reduce((acc, token) => {
        if (token) {
          acc[token.address] = {
            symbol: token.symbol,
            balance: parseFloat(token.balance).toFixed(3)
          };
        }
        return acc;
      }, {} as Record<string, TokenBalance>);

      // 4. Get standard token balances
      const standardTokenContracts = SUPPORTED_TOKENS.reduce((acc, tokenKey) => {
        const tokenAddress = tokens[tokenKey as keyof typeof tokens];
        if (tokenAddress) {
          acc[tokenKey] = new Contract(
            tokenAddress,
            ERC20_ABI,
            provider
          );
        }
        return acc;
      }, {} as Record<string, Contract>);

      const standardBalanceResults = await Promise.all(
        SUPPORTED_TOKENS.map(tokenKey => 
          standardTokenContracts[tokenKey]?.balanceOf(address).catch(() => "0") ?? Promise.resolve("0")
        )
      );

      const standardBalances = SUPPORTED_TOKENS.reduce((acc, tokenKey, index) => {
        acc[tokenKey] = parseFloat(formatUnits(standardBalanceResults[index], 18)).toFixed(3);
        return acc;
      }, {} as Record<string, string>);

      setBalances({
        ...standardBalances,
        customTokens,
        loading: false,
      });

    } catch (error) {
      console.error("Error fetching balances:", error);
      setBalances(prev => ({ 
        ...prev, 
        loading: false 
      }));
    }
  }, [address, chainId]);

  useEffect(() => {
    fetchBalances();

    const handleChainChanged = () => fetchBalances();
    const ethereum = window.ethereum;
    
    if (ethereum) {
      ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [fetchBalances]);

  return balances;
};