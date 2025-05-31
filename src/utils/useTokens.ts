// hooks/useTokens.ts
import { useState, useEffect } from 'react';
import { TokenInfo } from '../services/assetsService';
import { useWallet } from '../contexts/WalletContext';

export const useTokens = () => {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { address, isConnected, connectWallet } = useWallet();

  useEffect(() => {
    const loadTokens = async () => {
      setLoading(true);
      try {
        if (!isConnected) await connectWallet();
        const availableTokens = await AssetsService.getAllTokenMetadata();
        setTokens(availableTokens);
        await AssetsService.loadUserBalances(address);
      } finally {
        setLoading(false);
      }
    };

    loadTokens();
  }, [address, isConnected]);

  return { tokens, loading };
};