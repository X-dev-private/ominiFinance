import React from 'react';

interface TransactionDetailsProps {
  swapRate?: number;
  slippage?: number;
  onSlippageChange?: (value: number) => void;
  networkFee?: string;
  priceImpact?: string;
  minimumReceived?: string;
}

export default function TransactionDetails({
  swapRate = 0,
  slippage = 1.0, // 1% é um valor padrão razoável para slippage
  onSlippageChange = () => {},
  networkFee = '0.0025 OSMO', // Taxa média em Osmosis
  priceImpact = '0.5%', // Impacto de preço moderado
  minimumReceived = '0.0' // Valor mínimo inicial
}: TransactionDetailsProps) {

  const handleSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0.1 && value <= 5) {
      onSlippageChange(value);
    }
  };

  return ( 
    <div className="mt-8 space-y-6">
      <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Exchange Rate</span>
              <span className="text-gray-800 font-medium">
                {swapRate > 0 ? `1 ≈ ${swapRate.toFixed(6)}` : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Network Fee</span>
              <span className="text-gray-800 font-medium">{networkFee}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Price Impact</span>
              <span className="text-gray-800 font-medium">{priceImpact}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Minimum Received</span>
              <span className="text-gray-800 font-medium">{minimumReceived}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-gray-600 text-base mb-2">Network</h4>
            <span className="text-gray-800 font-medium">Osmosis</span>
          </div>
          <div>
            <h4 className="text-gray-600 text-base mb-2">Slippage Tolerance</h4>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0.1"
                max="5"
                step="0.1"
                value={slippage}
                onChange={handleSlippageChange}
                className="w-16 p-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-800 font-medium">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}