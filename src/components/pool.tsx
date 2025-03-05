import React, { useState } from 'react';
import { getTokenAndPoolAddresses } from '../config/tokenAddresses';
import ApproveModal from './ApproveModal'; // Importando o modal

const LiquidityPoolTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);

  // Dados das pools de liquidez
  const pools = [
    {
      name: 'usdcof/ethof',
      type: 'Basic Stable',
      fee: '0.05%',
      volume: '~$519,614.83',
      fees: '~$259.8',
      TVL: '~$5,263,647.92',
      apr: '16.67%',
      tokens: ['usdcof', 'ethof'], // Tokens que compõem a pool
    },
    {
      name: 'usdcof/anjux',
      type: 'Basic Stable',
      fee: '0.07%',
      volume: '~$750,125.30',
      fees: '~$525.09',
      TVL: '~$6,120,456.89',
      apr: '18.32%',
      tokens: ['usdcof', 'anjux'], // Tokens que compõem a pool
    },
    {
      name: 'ethof/anjux',
      type: 'Basic Volatile',
      fee: '0.9%',
      volume: '~$1,266,365.43',
      fees: '~$11,397.28',
      TVL: '~$4,940,968.56',
      apr: '46.77%',
      tokens: ['ethof', 'anjux'], // Tokens que compõem a pool
    },
  ];

  // Função para lidar com o clique no botão "Deposit"
  const handleDepositClick = (pool) => {
    const chainId = 57054; // Defina a chainId desejada
    const [token1, token2] = pool.tokens;

    try {
      // Obtém os endereços dos tokens e da pool de liquidez
      const { fromAddress, toAddress, poolAddress } = getTokenAndPoolAddresses(
        chainId,
        token1,
        token2
      );

      // Atualiza o estado com os dados da pool selecionada
      setSelectedPool({
        name: pool.name,
        fromAddress,
        toAddress,
        poolAddress,
        fromToken: token1,
        toToken: token2,
      });

      // Abre o modal
      setIsModalOpen(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="px-10 py-12 w-9/10 mx-auto">
      <div className="space-y-6">
        {pools.map((pool, index) => (
          <div key={index} className="rounded-2xl border border-green-300 shadow-md p-6 bg-white">
            <div className="flex items-center mb-4">
              <span className="mr-2">🟩</span>
              <span className="font-bold text-green-700">{pool.name}</span>
              <span className="text-green-500 ml-2">({pool.type})</span>
            </div>
            <div className="grid grid-cols-5 gap-4 text-center">
              <div>
                <span className="block text-gray-600">Volume</span>
                <span className="font-semibold">{pool.volume}</span>
              </div>
              <div>
                <span className="block text-gray-600">Fees</span>
                <span className="font-semibold">{pool.fees}</span>
              </div>
              <div>
                <span className="block text-gray-600">TVL</span>
                <span className="font-semibold">{pool.TVL}</span>
              </div>
              <div>
                <span className="block text-gray-600">APR</span>
                <span className="font-semibold">{pool.apr}</span>
              </div>
              <div>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => handleDepositClick(pool)}
                >
                  Deposit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedPool && (
        <ApproveModal
          selectedPool={selectedPool}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default LiquidityPoolTable;