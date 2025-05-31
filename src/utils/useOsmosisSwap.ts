import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SigningStargateClient } from '@cosmjs/stargate';
import { Decimal } from '@cosmjs/math';
import { AssetsService, TokenInfo } from '../services/assetsService';

class OsmosisClient {
  constructor(private endpoints: { rpcEndpoint: string; restEndpoint: string }) {}

  async getTokenPrices() {
    const response = await fetch('https://api-osmosis.imperator.co/tokens/v2/all');
    if (!response.ok) throw new Error('Failed to fetch token prices');
    return await response.json();
  }

  async getBestRoute(params: { inputDenom: string; outputDenom: string; amount: string }) {
    const response = await fetch(
      `https://api-osmosis.imperator.co/swap/v1/quote?` +
      `from=${params.inputDenom}&to=${params.outputDenom}&amount=${params.amount}`
    );
    if (!response.ok) throw new Error('Failed to fetch swap route');
    return await response.json();
  }

  async executeSwap(params: {
    signer: any;
    inputDenom: string;
    outputDenom: string;
    amount: string;
    slippage: string;
    gasPrice: { amount: any; denom: string };
  }) {
    const client = await SigningStargateClient.connectWithSigner(
      this.endpoints.rpcEndpoint,
      params.signer,
      { gasPrice: params.gasPrice }
    );

    const sender = (await params.signer.getAccounts())[0].address;
    const minOutput = (parseFloat(params.amount) * (100 - parseFloat(params.slippage))) / 100;

    const msg = {
      typeUrl: '/osmosis.gamm.v1beta1.MsgSwapExactAmountIn',
      value: {
        sender,
        routes: [{ poolId: 1, tokenOutDenom: params.outputDenom }],
        tokenIn: {
          denom: params.inputDenom,
          amount: Decimal.fromUserInput(params.amount, 6).atomics
        },
        tokenOutMinAmount: minOutput.toString()
      }
    };

    return await client.signAndBroadcast(sender, [msg], 'auto');
  }
}

export const useOsmosisSwap = () => {
  const [fromToken, setFromToken] = useState<TokenInfo | null>(null);
  const [toToken, setToToken] = useState<TokenInfo | null>(null);
  const [fromAmount, setFromAmount] = useState<string>('1.00');
  const [toAmount, setToAmount] = useState<string>('');
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [swapRate, setSwapRate] = useState<number>(0);
  const [fromUsdValue, setFromUsdValue] = useState<number>(0);
  const [showChainWarning, setShowChainWarning] = useState(false);
  const [slippage, setSlippage] = useState<number>(1);
  const [minimumReceived, setMinimumReceived] = useState<string>('');

  const osmosisClient = new OsmosisClient({
    rpcEndpoint: 'https://rpc.osmosis.zone',
    restEndpoint: 'https://lcd.osmosis.zone'
  });

  // Fetch token prices using Osmosis API - Sintaxe corrigida para React Query v5
  const { data: prices, error: priceError } = useQuery({ 
    queryKey: ['osmosisPrices'], 
    queryFn: async () => {
      const prices = await osmosisClient.getTokenPrices();
      return prices.reduce((acc: Record<string, number>, token: any) => {
        if (token.symbol && token.price) acc[token.symbol] = token.price;
        if (token.denom && token.price) acc[token.denom] = token.price;
        return acc;
      }, {});
    },
    staleTime: 1000 * 60,
    onError: (error) => console.error('Error fetching token prices:', error)
  });

  // Initialize tokens
  useEffect(() => {
    const availableTokens = AssetsService.getAllTokenMetadata();
    setTokens(availableTokens);
    if (availableTokens.length > 1) {
      setFromToken(availableTokens[0]);
      setToToken(availableTokens[1]);
    }
  }, []);

  // Fetch swap data when inputs change
  useEffect(() => {
    const fetchSwapData = async () => {
      if (!fromToken || !toToken) return;

      try {
        const route = await osmosisClient.getBestRoute({
          inputDenom: fromToken.id,
          outputDenom: toToken.id,
          amount: fromAmount
        });

        setSwapRate(route.price || 0);
        setToAmount(route.amount || '0');
        
        const minReceived = (parseFloat(route.amount || '0') * (100 - slippage)) / 100;
        setMinimumReceived(`${minReceived.toFixed(6)} ${toToken.symbol}`);

        if (prices?.[fromToken.symbol]) {
          setFromUsdValue(parseFloat(fromAmount) * prices[fromToken.symbol]);
        }
      } catch (error) {
        console.error('Error fetching swap data:', error);
      }
    };

    fetchSwapData();
  }, [fromToken, toToken, fromAmount, slippage, prices]);

  // Execute swap
  const executeSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      alert('Please select valid tokens and amount');
      return;
    }

    if (!window.keplr) {
      setShowChainWarning(true);
      alert('Keplr wallet not detected');
      return;
    }

    setIsLoading(true);
    try {
      await window.keplr.enable('osmosis-1');
      const signer = window.keplr.getOfflineSigner('osmosis-1');

      const result = await osmosisClient.executeSwap({
        signer,
        inputDenom: fromToken.id,
        outputDenom: toToken.id,
        amount: fromAmount,
        slippage: slippage.toString(),
        gasPrice: { amount: Decimal.fromUserInput("0.0025", 6), denom: "uosmo" }
      });

      console.log('Swap successful:', result);
      alert('Swap executed successfully!');
    } catch (error) {
      console.error('Swap failed:', error);
      alert(`Swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    tokens,
    isLoading,
    swapRate,
    showChainWarning,
    prices,
    priceError,
    minimumReceived,
    setFromToken,
    setToToken,
    setFromAmount,
    setFromUsdValue,
    setSlippage,
    executeSwap,
    getFormattedBalance: (token: TokenInfo) => {
      const balance = AssetsService.getFormattedBalance(token.id, token.chain);
      return `Balance: ${balance.amount} ${balance.denom}`;
    },
    handleFromAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d*\.?\d*$/.test(value)) setFromAmount(value);
    }
  };
};