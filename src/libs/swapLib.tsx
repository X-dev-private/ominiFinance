import React, { useEffect } from 'react';
import { useOsmosisSwap } from '../utils/useOsmosisSwap';
import HeaderSection from '../components/swap/HeaderSection';
import SwapArrow from '../components/swap/SwapArrow';
import TokenInput from '../components/swap/TokenInput';
import TransactionDetails from '../components/swap/TransactionDetails';

// IDs fixos para ATOM e OSMO
const ATOM_ID = 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2';
const OSMO_ID = 'uosmo';

const TokenSwap = () => {
  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    tokens,
    isLoading,
    showChainWarning,
    prices,
    swapRate,
    minimumReceived,
    setFromToken,
    setToToken,
    setFromAmount,
    setFromUsdValue,
    setSlippage,
    executeSwap,
    getFormattedBalance,
    handleFromAmountChange
  } = useOsmosisSwap();

  // Gambiarra: Força ATOM e OSMO como tokens padrão
  useEffect(() => {
    if (tokens.length > 0) {
      const atomToken = tokens.find(t => t.id === ATOM_ID);
      const osmoToken = tokens.find(t => t.id === OSMO_ID);
      
      if (atomToken && osmoToken) {
        setFromToken(atomToken);
        setToToken(osmoToken);
      }
    }
  }, [tokens, setFromToken, setToToken]);

  // Gambiarra: Força pool 1 para ATOM/OSMO
  const hackedExecuteSwap = async () => {
    if (!fromToken || !toToken) return;
    
    // Verifica se é swap entre ATOM e OSMO
    const isAtomOsmoSwap = 
      (fromToken.id === ATOM_ID && toToken.id === OSMO_ID) ||
      (fromToken.id === OSMO_ID && toToken.id === ATOM_ID);
    
    if (isAtomOsmoSwap) {
      try {
        const response = await fetch(
          `https://api-osmosis.imperator.co/swap/v1/quote?` +
          `from=${fromToken.id}&to=${toToken.id}&amount=${fromAmount}&poolId=1`
        );
        const quote = await response.json();
        
        // Atualiza o valor de saída com a cotação da pool 1
        setToAmount(quote.amount.toString());
      } catch (error) {
        console.error('Error fetching pool 1 quote:', error);
      }
    }
    
    // Executa o swap normalmente
    return executeSwap();
  };

  const calculatePriceImpact = () => {
    if (!fromToken || !toToken || !fromAmount || !toAmount || !prices) return "0.3%";
    
    try {
      const fromValue = parseFloat(fromAmount) * (prices[fromToken.symbol] || 0);
      const toValue = parseFloat(toAmount) * (prices[toToken.symbol] || 0);
      
      if (fromValue === 0 || toValue === 0) return "0.3%";
      
      const impact = ((fromValue - toValue) / fromValue) * 100;
      return `${Math.abs(impact).toFixed(2)}%`;
    } catch {
      return "0.3%";
    }
  };

  const transactionDetails = {
    swapRate: swapRate || 0,
    slippage: 1.5,
    networkFee: "0.0025 OSMO",
    priceImpact: calculatePriceImpact(),
    minimumReceived: minimumReceived || (toToken 
      ? `≈ ${(parseFloat(toAmount || '0') * 0.985).toFixed(6)} ${toToken.symbol}`
      : '0.0')
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl border border-green-100">
        <HeaderSection />
        
        <div className="mb-2 text-sm text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Osmosis Network
          </span>
          {showChainWarning && (
            <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded-md">
              ⚠️ Please switch to Osmosis chain in Keplr to use this swap
            </div>
          )}
        </div>

        <div className="space-y-6">
          <TokenInput
            label="From"
            token={fromToken}
            balance={fromToken ? getFormattedBalance(fromToken) : 'Balance: 0'}
            tokens={tokens}
            onTokenChange={setFromToken}
            amount={fromAmount}
            onAmountChange={handleFromAmountChange}
            onUsdValueChange={setFromUsdValue}
            isFromInput={true}
            readOnly={false}
            price={fromToken?.symbol ? prices?.[fromToken.symbol] : undefined}
          />
          
          <SwapArrow />
          
          <TokenInput
            label="To"
            token={toToken}
            balance={toToken ? getFormattedBalance(toToken) : 'Balance: 0'}
            tokens={tokens}
            onTokenChange={setToToken}
            amount={toAmount}
            onAmountChange={undefined}
            readOnly={true}
            price={toToken?.symbol ? prices?.[toToken.symbol] : undefined}
          />
        </div>

        <TransactionDetails 
          swapRate={transactionDetails.swapRate}
          slippage={transactionDetails.slippage}
          onSlippageChange={setSlippage}
          networkFee={transactionDetails.networkFee}
          priceImpact={transactionDetails.priceImpact}
          minimumReceived={transactionDetails.minimumReceived}
        />

        <button
          onClick={hackedExecuteSwap}
          disabled={isLoading || !fromAmount || parseFloat(fromAmount) <= 0 || !fromToken || !toToken}
          className={`w-full mt-8 py-4 text-white font-bold rounded-xl shadow-md transition-colors duration-200 text-lg ${
            isLoading || !fromAmount || parseFloat(fromAmount) <= 0 || !fromToken || !toToken
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Processing...' : 'Swap on Osmosis'}
        </button>

        <div className="mt-4 text-sm text-gray-500 text-center">
          {fromToken && toToken && (
            <div className="mt-1 text-xs opacity-70">
              {fromToken.id === ATOM_ID && toToken.id === OSMO_ID ? (
                <span className="text-green-600">Using ATOM/OSMO Pool #1 (Most liquid)</span>
              ) : (
                `Token IDs: ${fromToken.id.substring(0, 12)}... → ${toToken.id.substring(0, 12)}...`
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenSwap;