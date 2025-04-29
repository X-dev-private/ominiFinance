import { useState, useEffect } from 'react';
import { useTokenBalances } from '../utils/useTokenBalances';
import { useAccount, useChainId } from 'wagmi';
import { TOKEN_ADDRESSES, getTokenAndPoolAddresses, TokenType } from '../config/tokenAddresses';
import { ethers } from 'ethers';

export const useTokenSwapEVM = () => {
  const { address: evmAddress } = useAccount();
  const chainId = useChainId();
  const { anjux, ethof, usdcof, loading } = useTokenBalances(evmAddress, chainId);

  // Estados
  const [amount, setAmount] = useState('');
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [approveLoading, setApproveLoading] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState('');

  // Tokens disponíveis
  const [tokens, setTokens] = useState([
    { symbol: 'ANJUX', balance: anjux },
    { symbol: 'ETHOF', balance: ethof },
    { symbol: 'USDCOF', balance: usdcof },
  ]);

  // Atualiza tokens quando os saldos mudam
  useEffect(() => {
    setTokens([
      { symbol: 'ANJUX', balance: anjux },
      { symbol: 'ETHOF', balance: ethof },
      { symbol: 'USDCOF', balance: usdcof },
    ]);
  }, [anjux, ethof, usdcof]);

  // Formatação de números
  const formatNumber = (value: string | number): string => {
    if (!value) return "0,00";
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : value;
    return isNaN(numValue) ? "0,00" : numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const parseFormattedNumber = (formattedValue: string): string => {
    return formattedValue.replace(/\./g, '').replace(',', '.');
  };

  // Manipuladores
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d,]/g, '');
    setAmount(rawValue);
  };

  const handleFromTokenChange = (tokenSymbol: string) => {
    setFromToken(tokenSymbol);
    setIsApproved(false);
  };

  const handleToTokenChange = (tokenSymbol: string) => {
    setToToken(tokenSymbol);
  };

  const handleEvmApprove = async () => {
    if (!window.ethereum || !chainId) {
      setError(!window.ethereum ? "MetaMask não detectado!" : "Rede não conectada!");
      return;
    }

    try {
      setApproveLoading(true);
      setError('');
      
      const fromTokenKey = fromToken.toLowerCase() as TokenType<typeof chainId>;
      const toTokenKey = toToken.toLowerCase() as TokenType<typeof chainId>;
      
      const { fromAddress, poolAddress } = getTokenAndPoolAddresses(
        chainId as keyof typeof TOKEN_ADDRESSES,
        fromTokenKey,
        toTokenKey
      );

      if (!fromAddress || !poolAddress) {
        throw new Error("Endereços não encontrados!");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(fromAddress, [
        "function approve(address spender, uint256 amount) public returns (bool)",
      ], signer);

      const amountInWei = ethers.parseUnits(parseFormattedNumber(amount), 18);
      const tx = await contract.approve(poolAddress, amountInWei);
      await tx.wait();

      setIsApproved(true);
    } catch (error) {
      setError("Erro ao aprovar: " + (error as Error).message);
    } finally {
      setApproveLoading(false);
    }
  };

  const handleEvmSwap = async () => {
    if (!window.ethereum || !chainId) {
      setError(!window.ethereum ? "MetaMask não detectado!" : "Rede não conectada!");
      return;
    }

    try {
      setSwapLoading(true);
      setError('');
      
      const fromTokenKey = fromToken.toLowerCase() as TokenType<typeof chainId>;
      const toTokenKey = toToken.toLowerCase() as TokenType<typeof chainId>;
      
      const { fromAddress, poolAddress } = getTokenAndPoolAddresses(
        chainId as keyof typeof TOKEN_ADDRESSES,
        fromTokenKey,
        toTokenKey
      );

      if (!poolAddress || !fromAddress) {
        throw new Error("Endereços não configurados!");
      }

      if (!amount || Number(parseFormattedNumber(amount)) <= 0) {
        throw new Error("Quantidade inválida!");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const poolContract = new ethers.Contract(poolAddress, [
        "function swap(address fromToken, uint256 amountIn) external returns (uint256 amountOut)"
      ], signer);

      const amountInWei = ethers.parseUnits(parseFormattedNumber(amount), 18);
      const tx = await poolContract.swap(fromAddress, amountInWei);
      await tx.wait();

      // Atualizar saldos após o swap
    } catch (error) {
      setError("Erro no swap: " + (error as Error).message);
    } finally {
      setSwapLoading(false);
    }
  };

  const handleEvmSwapAction = () => {
    if (!isApproved) {
      handleEvmApprove();
    } else {
      handleEvmSwap();
    }
  };

  return {
    amount,
    tokens,
    fromToken,
    toToken,
    loading,
    approveLoading,
    swapLoading,
    isApproved,
    error,
    formatNumber,
    handleAmountChange,
    handleFromTokenChange,
    handleToTokenChange,
    handleSwapAction: handleEvmSwapAction
  };
};