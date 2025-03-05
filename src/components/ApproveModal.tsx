import React, { useState } from 'react';
import { ethers } from 'ethers';

const ApproveModal = ({ selectedPool, onClose }) => {
  const [fromTokenAmount, setFromTokenAmount] = useState('');
  const [toTokenAmount, setToTokenAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [fromTokenApproved, setFromTokenApproved] = useState(false);
  const [toTokenApproved, setToTokenApproved] = useState(false);

  // Função para aprovar um token
  const handleApprove = async (tokenAddress, tokenSymbol, amount, poolAddress) => {
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

      // ABI mínima do ERC-20 para chamar approve
      const erc20Abi = [
        "function approve(address spender, uint256 amount) public returns (bool)",
      ];
      const contract = new ethers.Contract(tokenAddress, erc20Abi, signer);

      // Converte o amount para Wei (18 casas decimais, ajuste se necessário)
      const amountInWei = ethers.parseUnits(amount, 18);

      // Chama approve passando a Liquidity Pool como spender
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

  // Função para aprovar o fromToken
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

  // Função para aprovar o toToken
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

  // Função para adicionar liquidez
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

      // ABI do contrato da pool
      const poolAbi = [
        "function addLiquidity(uint256 amountA, uint256 amountB) external returns (uint256 shares)",
      ];
      const poolContract = new ethers.Contract(selectedPool.poolAddress, poolAbi, signer);

      // Converte os valores para Wei (18 casas decimais, ajuste se necessário)
      const amountAInWei = ethers.parseUnits(fromTokenAmount, 18);
      const amountBInWei = ethers.parseUnits(toTokenAmount, 18);

      // Chama a função addLiquidity do contrato
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] relative">
        <h2 className="text-lg font-semibold mb-4">Deposit Liquidity</h2>
        <div className="space-y-4">
          <p><strong>Pool:</strong> {selectedPool.name}</p>

          {/* Exibir endereços dos tokens e da pool */}
          <div className="space-y-2">
            <p><strong>Endereço do {selectedPool.fromToken}:</strong> {selectedPool.fromAddress}</p>
            <p><strong>Endereço do {selectedPool.toToken}:</strong> {selectedPool.toAddress}</p>
            <p><strong>Endereço da Pool:</strong> {selectedPool.poolAddress}</p>
          </div>

          {/* Input para quantidade do fromToken */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantidade de {selectedPool.fromToken}:
            </label>
            <input
              type="text"
              value={fromTokenAmount}
              onChange={(e) => setFromTokenAmount(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Digite a quantidade"
            />
          </div>

          {/* Botão para aprovar o fromToken */}
          <button
            onClick={handleApproveFromToken}
            disabled={loading || fromTokenApproved}
            className="mt-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity w-full"
          >
            {loading ? "Aprovando..." : fromTokenApproved ? "From Token Approved ✅" : "Approve From Token"}
          </button>

          {/* Input para quantidade do toToken */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Quantidade de {selectedPool.toToken}:
            </label>
            <input
              type="text"
              value={toTokenAmount}
              onChange={(e) => setToTokenAmount(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Digite a quantidade"
            />
          </div>

          {/* Botão para aprovar o toToken */}
          <button
            onClick={handleApproveToToken}
            disabled={loading || toTokenApproved}
            className="mt-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity w-full"
          >
            {loading ? "Aprovando..." : toTokenApproved ? "To Token Approved ✅" : "Approve To Token"}
          </button>

          {/* Botão para adicionar liquidez */}
          <button
            onClick={handleAddLiquidity}
            disabled={loading || !fromTokenApproved || !toTokenApproved}
            className="mt-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity w-full"
          >
            {loading ? "Adicionando..." : "Add Liquidity"}
          </button>
        </div>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ApproveModal;