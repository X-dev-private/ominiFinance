import React, { useState } from 'react';
import { ethers } from 'ethers';

interface SelectedPool {
  name: string;
  fromAddress: string;
  toAddress: string;
  poolAddress: string;
  fromToken: string;
  toToken: string;
}

interface ApproveModalProps {
  selectedPool: SelectedPool | null;
  onClose: () => void;
}

const ApproveModal: React.FC<ApproveModalProps> = ({ selectedPool, onClose }) => {
  const [fromTokenAmount, setFromTokenAmount] = useState('');
  const [toTokenAmount, setToTokenAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [fromTokenApproved, setFromTokenApproved] = useState(false);
  const [toTokenApproved, setToTokenApproved] = useState(false);

  const handleApprove = async (tokenAddress: string, tokenSymbol: string, amount: string, poolAddress: string) => {
    if (!window.ethereum) {
      alert("MetaMask não detectado!");
      return false;
    }

    if (!tokenAddress) {
      alert(`Endereço do token ${tokenSymbol} não encontrado! Verifique o símbolo do token.`);
      return false;
    }

    if (!poolAddress) {
      alert("Endereço da Liquidity Pool não encontrado!");
      return false;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const erc20Abi = ["function approve(address spender, uint256 amount) public returns (bool)"];
      const contract = new ethers.Contract(tokenAddress, erc20Abi, signer);
      const amountInWei = ethers.parseUnits(amount, 18);
      const tx = await contract.approve(poolAddress, amountInWei);
      await tx.wait();
      alert(`Aprovação do token ${tokenSymbol} realizada com sucesso!`);
      return true;
    } catch (error) {
      console.error(`Erro ao aprovar ${tokenSymbol}:`, error);
      alert(`Erro ao aprovar tokens ${tokenSymbol}!`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleApproveFromToken = async () => {
    if (!selectedPool?.fromAddress || !selectedPool?.poolAddress) {
      alert("Endereço do token de origem ou da pool não encontrado!");
      return;
    }

    const success = await handleApprove(
      selectedPool.fromAddress,
      selectedPool.fromToken,
      fromTokenAmount,
      selectedPool.poolAddress
    );
    if (success) {
      setFromTokenApproved(true);
    }
  };

  const handleApproveToToken = async () => {
    if (!selectedPool?.toAddress || !selectedPool?.poolAddress) {
      alert("Endereço do token de destino ou da pool não encontrado!");
      return;
    }

    const success = await handleApprove(
      selectedPool.toAddress,
      selectedPool.toToken,
      toTokenAmount,
      selectedPool.poolAddress
    );
    if (success) {
      setToTokenApproved(true);
    }
  };

  const handleAddLiquidity = async () => {
    if (!window.ethereum) {
      alert("MetaMask não detectado!");
      return;
    }

    if (!selectedPool?.poolAddress) {
      alert("Endereço da pool não encontrado!");
      return;
    }

    if (!fromTokenApproved || !toTokenApproved) {
      alert("Aprove ambos os tokens antes de adicionar liquidez!");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const poolAbi = ["function addLiquidity(uint256 amountA, uint256 amountB) external returns (uint256 shares)"];
      const poolContract = new ethers.Contract(selectedPool.poolAddress, poolAbi, signer);
      const amountAInWei = ethers.parseUnits(fromTokenAmount, 18);
      const amountBInWei = ethers.parseUnits(toTokenAmount, 18);
      const tx = await poolContract.addLiquidity(amountAInWei, amountBInWei);
      await tx.wait();
      alert("Liquidez adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar liquidez:", error);
      alert("Erro ao adicionar liquidez!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[500px] relative">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Deposit Liquidity</h2>
        <div className="space-y-6">
          <p className="text-lg font-semibold text-gray-700">
            Pool: <span className="text-green-600">{selectedPool?.name}</span>
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade de {selectedPool?.fromToken}:
            </label>
            <input
              type="text"
              value={fromTokenAmount}
              onChange={(e) => setFromTokenAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              placeholder="Digite a quantidade"
            />
          </div>

          <button
            onClick={handleApproveFromToken}
            disabled={loading || fromTokenApproved}
            className={`w-full px-4 py-2 rounded-lg text-white font-semibold ${
              fromTokenApproved
                ? "bg-green-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            } transition-all transform hover:scale-105`}
          >
            {loading ? "Aprovando..." : fromTokenApproved ? "From Token Approved ✅" : "Approve From Token"}
          </button>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade de {selectedPool?.toToken}:
            </label>
            <input
              type="text"
              value={toTokenAmount}
              onChange={(e) => setToTokenAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              placeholder="Digite a quantidade"
            />
          </div>

          <button
            onClick={handleApproveToToken}
            disabled={loading || toTokenApproved}
            className={`w-full px-4 py-2 rounded-lg text-white font-semibold ${
              toTokenApproved
                ? "bg-green-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            } transition-all transform hover:scale-105`}
          >
            {loading ? "Aprovando..." : toTokenApproved ? "To Token Approved ✅" : "Approve To Token"}
          </button>

          <button
            onClick={handleAddLiquidity}
            disabled={loading || !fromTokenApproved || !toTokenApproved}
            className={`w-full px-4 py-2 rounded-lg text-white font-semibold ${
              !fromTokenApproved || !toTokenApproved
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            } transition-all transform hover:scale-105`}
          >
            {loading ? "Adicionando..." : "Add Liquidity"}
          </button>
        </div>

        <button
          className="mt-6 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ApproveModal;