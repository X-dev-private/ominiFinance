import React, { useEffect, useState } from 'react';
import { useTokenSwapEVM } from '../utils/useTokenSwap';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import TokenSelector from '../components/tokenSelector';

const TokenSwap = () => {
  const [isCosmosActive, setIsCosmosActive] = useState(false);

  useEffect(() => {
    const checkCosmosWallet = async () => {
      if (window.getOfflineSigner) {
        try {
          const signer: OfflineSigner = window.getOfflineSigner('cosmoshub-4');
          await SigningCosmWasmClient.connectWithSigner(
            'https://rpc.cosmos.network', 
            signer
          );
          setIsCosmosActive(true);
        } catch (error) {
          setIsCosmosActive(false);
        }
      }
    };

    checkCosmosWallet();
  }, []);

  const {
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
    handleSwapAction
  } = useTokenSwapEVM();

  const renderTokenBalance = (symbol: string) => {
    if (loading) return 'Loading balance...';
    const token = tokens.find(t => t.symbol === symbol);
    const balance = token ? formatNumber(token.balance) : '0,00';
    return `Balance: ${balance} ${symbol}`;
  };

  const ActionButton = () => {
    if (approveLoading && !isCosmosActive) {
      return (
        <div className="flex items-center justify-center">
          <Spinner />
          <span className="ml-2">Approving...</span>
        </div>
      );
    }
    
    if (swapLoading) {
      return (
        <div className="flex items-center justify-center">
          <Spinner />
          <span className="ml-2">Swapping...</span>
        </div>
      );
    }
    
    return (!isCosmosActive && !isApproved) ? 'Approve Token' : 'Confirm Swap';
  };

  const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const NetworkIndicator = () => (
    <div className="mb-2 text-sm text-right">
      {isCosmosActive ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <svg className="mr-1.5 h-2 w-2 text-purple-800" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          Cosmos Network
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <svg className="mr-1.5 h-2 w-2 text-blue-800" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          EVM Network
        </span>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl border border-green-100">
        <HeaderSection />
        <NetworkIndicator />
        <div className="space-y-6">
          <TokenInput
            label="From"
            token={fromToken}
            balance={renderTokenBalance(fromToken)}
            tokens={tokens}
            onTokenChange={handleFromTokenChange}
            amount={formatNumber(amount)}
            onAmountChange={handleAmountChange}
            readOnly={false}
          />
          <SwapArrow />
          <TokenInput
            label="To"
            token={toToken}
            balance={renderTokenBalance(toToken)}
            tokens={tokens}
            onTokenChange={handleToTokenChange}
            amount={amount ? formatNumber(amount) : "0,00"}
            readOnly={true}
          />
        </div>
        <TransactionDetails isCosmosActive={isCosmosActive} />
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <button
          onClick={handleSwapAction}
          disabled={approveLoading || swapLoading || loading}
          className={`w-full mt-8 py-4 text-white font-bold rounded-xl shadow-md transition-colors duration-200 text-lg ${
            (!isCosmosActive && !isApproved) ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <ActionButton />
        </button>
      </div>
    </div>
  );
};

const HeaderSection = () => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Token Swap</h1>
    <div className="flex space-x-4 border-b border-gray-200 pb-1">
      <button className="px-6 py-3 text-green-600 font-medium border-b-2 border-green-600 text-lg">
        Swap
      </button>
      <button className="px-6 py-3 text-gray-500 font-medium hover:text-green-600 transition-colors text-lg">
        Limit
      </button>
      <button className="px-6 py-3 text-gray-500 font-medium hover:text-green-600 transition-colors text-lg">
        DCA
      </button>
    </div>
  </div>
);

interface TokenInputProps {
  label: string;
  token: string;
  balance: string;
  tokens: Array<{ symbol: string; balance: string }>;
  onTokenChange: (token: string) => void;
  amount: string;
  onAmountChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly: boolean;
}

const TokenInput = ({
  label,
  token,
  balance,
  tokens,
  onTokenChange,
  amount,
  onAmountChange,
  readOnly
}: TokenInputProps) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-gray-600 text-base font-medium">{label}</span>
      <span className="text-gray-600 text-base">{balance}</span>
    </div>
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-400 transition-colors">
      <div className="w-2/5 min-w-[160px]"> 
        <TokenSelector 
          tokens={tokens}
          selectedToken={token}
          onSelect={onTokenChange}
        />
      </div>
      <input
        className="w-3/5 bg-transparent text-gray-800 text-right text-3xl font-medium focus:outline-none placeholder-gray-400"
        type="text"
        placeholder="0,00"
        value={amount}
        onChange={onAmountChange}
        readOnly={readOnly}
      />
    </div>
  </div>
);

const SwapArrow = () => (
  <div className="flex justify-center my-2">
    <button className="p-3 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-green-50 hover:border-green-400 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
);

interface TransactionDetailsProps {
  isCosmosActive: boolean;
}

const TransactionDetails = ({ isCosmosActive }: TransactionDetailsProps) => (
  <div className="mt-8 space-y-6">
    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Exchange Rate</span>
            <span className="text-gray-800 font-medium">-</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Network Fee</span>
            <span className="text-gray-800 font-medium">-</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Price Impact</span>
            <span className="text-gray-800 font-medium">-</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Minimum Received</span>
            <span className="text-gray-800 font-medium">-</span>
          </div>
        </div>
      </div>
    </div>
    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-gray-600 text-base mb-2">Network</h4>
          <span className="text-gray-800 font-medium">
            {isCosmosActive ? 'Cosmos' : 'Ethereum'}
          </span>
        </div>
        <div>
          <h4 className="text-gray-600 text-base mb-2">Slippage Tolerance</h4>
          <span className="text-gray-800 font-medium">0.5%</span>
        </div>
      </div>
    </div>
  </div>
);

export default TokenSwap;