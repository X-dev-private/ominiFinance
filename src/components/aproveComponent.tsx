import React, { useState } from "react";
import { useChainId } from "wagmi";
import { TOKEN_ADDRESSES } from "../config/tokenAddresses";
import { ethers } from "ethers";

interface AproveComponentProps {
  amount: string;
  tokenSymbol: string;
}

const AproveComponent: React.FC<AproveComponentProps> = ({ amount, tokenSymbol }) => {
  const chainId = useChainId();
  const [loading, setLoading] = useState(false);

  // Verifica se os dados do chainId estão disponíveis
  const tokenData = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES];

  if (!tokenData) {
    console.error(`Nenhuma configuração encontrada para chainId: ${chainId}`);
  }

  // Obtém o endereço do token e da liquidityPool de forma segura
  const tokenAddress = tokenData ? tokenData[tokenSymbol.toLowerCase() as keyof typeof tokenData] : undefined;
  const liquidityPoolAddress = tokenData?.liquidityPool;

  console.log("Chain ID:", chainId);
  console.log("Token Symbol:", tokenSymbol);
  console.log("Token Address:", tokenAddress);
  console.log("Liquidity Pool Address:", liquidityPoolAddress);

  const handleApprove = async () => {
    if (!window.ethereum) {
      alert("MetaMask não detectado!");
      return;
    }

    if (!tokenAddress) {
      alert("Endereço do token não encontrado! Verifique o símbolo do token.");
      return;
    }

    if (!liquidityPoolAddress) {
      alert("Endereço da Liquidity Pool não encontrado!");
      return;
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
      const tx = await contract.approve(liquidityPoolAddress, amountInWei);
      await tx.wait();

      alert("Aprovação realizada com sucesso!");
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      alert("Erro ao aprovar tokens!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Token Approval Card */}
        <section className="bg-white rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <svg 
                className="w-6 h-6 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">Approve Token</h3>
              <p className="text-sm text-gray-600 mt-1">
                Allow the Liquidity Pool to access your tokens
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-gray-500">Amount: {amount}</span>
                <span className="text-gray-500">Token: {tokenSymbol || "N/A"}</span>
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  {loading ? "Approving..." : "Approve"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AproveComponent;
