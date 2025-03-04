import { useState, useEffect } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { TOKEN_ADDRESSES } from "../config/tokenAddresses";

const ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)"
];

export interface TokenBalances {
  anjux: string;
  ethof: string;
  usdcof: string;
  loading: boolean;
}

export const useTokenBalances = (address?: string, chainId?: number) => {
  const [balances, setBalances] = useState<TokenBalances>({
    anjux: "0.000",
    ethof: "0.000",
    usdcof: "0.000",
    loading: true,
  });

  useEffect(() => {
    if (!address || !chainId || !window.ethereum) {
      setBalances(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchBalances = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const currentChainId = network.chainId.toString();

        if (!TOKEN_ADDRESSES[currentChainId]) {
          setBalances({
            anjux: "N/D",
            ethof: "N/D",
            usdcof: "N/D",
            loading: false
          });
          return;
        }

        const tokens = TOKEN_ADDRESSES[currentChainId];
        const contracts = {
          anjux: new Contract(tokens.anjux, ERC20_ABI, provider),
          ethof: new Contract(tokens.ethof, ERC20_ABI, provider),
          usdcof: new Contract(tokens.usdcof, ERC20_ABI, provider)
        };

        const [anjuxBalance, ethofBalance, usdcofBalance] = await Promise.all([
          contracts.anjux.balanceOf(address),
          contracts.ethof.balanceOf(address),
          contracts.usdcof.balanceOf(address)
        ]);

        setBalances({
          anjux: Number(formatUnits(anjuxBalance, 18)).toFixed(3),
          ethof: Number(formatUnits(ethofBalance, 18)).toFixed(3),
          usdcof: Number(formatUnits(usdcofBalance, 18)).toFixed(3),
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