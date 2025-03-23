import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { BrowserProvider, Contract } from 'ethers';
import { getTokenAndPoolAddresses } from '../config/tokenAddresses';
import ApproveModal from './ApproveModal';

// ABI da função withdrawFees
const withdrawFeesABI = [
  {
    "inputs": [],
    "name": "withdrawFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Definindo tipos para as pools de liquidez
interface Pool {
  name: string;
  type: string;
  fee: string;
  volume: string;
  fees: string;
  TVL: string;
  apr: string;
  tokens: [string, string];
}

// Dados das pools de liquidez
const pools: Pool[] = [
  {
    name: 'usdcof/ethof',
    type: 'Basic Stable',
    fee: '0.05%',
    volume: '~$519,614.83',
    fees: '~$259.8',
    TVL: '~$5,263,647.92',
    apr: '16.67%',
    tokens: ['usdcof', 'ethof'],
  },
  {
    name: 'usdcof/anjux',
    type: 'Basic Stable',
    fee: '0.07%',
    volume: '~$750,125.30',
    fees: '~$525.09',
    TVL: '~$6,120,456.89',
    apr: '18.32%',
    tokens: ['usdcof', 'anjux'],
  },
  {
    name: 'ethof/anjux',
    type: 'Basic Volatile',
    fee: '0.9%',
    volume: '~$1,266,365.43',
    fees: '~$11,397.28',
    TVL: '~$4,940,968.56',
    apr: '46.77%',
    tokens: ['ethof', 'anjux'],
  },
];

// Componente para cada linha da tabela de pools
const PoolRow: React.FC<{ pool: Pool; onDepositClick: (pool: Pool) => void; onWithdrawFees: (pool: Pool) => void }> = ({ pool, onDepositClick, onWithdrawFees }) => {
  return (
    <div className="rounded-2xl border border-green-300 shadow-lg p-6 bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <span className="mr-2 text-2xl">🟩</span>
        <span className="font-bold text-green-700 text-xl">{pool.name}</span>
        <span className="text-green-500 ml-2 text-sm">({pool.type})</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
        <div className="p-3 bg-green-50 rounded-lg">
          <span className="block text-gray-600 text-sm">Volume</span>
          <span className="font-semibold text-green-700">{pool.volume}</span>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <span className="block text-gray-600 text-sm">Fees</span>
          <span className="font-semibold text-green-700">{pool.fees}</span>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <span className="block text-gray-600 text-sm">TVL</span>
          <span className="font-semibold text-green-700">{pool.TVL}</span>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <span className="block text-gray-600 text-sm">APR</span>
          <span className="font-semibold text-green-700">{pool.apr}</span>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            onClick={() => onDepositClick(pool)}
          >
            <span className="mr-2">💰</span>
            Deposit
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            onClick={() => onWithdrawFees(pool)}
          >
            <span className="mr-2">💸</span>
            Withdraw Fees
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principal da tabela de pools
const LiquidityPoolTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<{
    name: string;
    fromAddress: string;
    toAddress: string;
    poolAddress: string;
    fromToken: string;
    toToken: string;
  } | null>(null);
  const { address } = useAccount(); // Obtém o endereço do usuário

  // Função para lidar com o clique no botão "Deposit"
  const handleDepositClick = (pool: Pool) => {
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

  // Função para lidar com o clique no botão "Withdraw Fees"
  const handleWithdrawFees = async (pool: Pool) => {
    if (!address || !window.ethereum) {
      alert('Please connect your wallet.');
      return;
    }

    const chainId = 57054; // Defina a chainId desejada
    const [token1, token2] = pool.tokens;

    try {
      const { poolAddress } = getTokenAndPoolAddresses(chainId, token1, token2);

      // Conecta ao contrato usando o BrowserProvider
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(poolAddress, withdrawFeesABI, signer);

      // Chama a função withdrawFees
      const tx = await contract.withdrawFees();
      await tx.wait();
      alert('Fees withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing fees:', error);
      alert('Failed to withdraw fees.');
    }
  };

  return (
    <div className="px-4 md:px-10 py-12 w-full mx-auto">
      <div className="space-y-6">
        {pools.map((pool, index) => (
          <PoolRow
            key={index}
            pool={pool}
            onDepositClick={handleDepositClick}
            onWithdrawFees={handleWithdrawFees}
          />
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