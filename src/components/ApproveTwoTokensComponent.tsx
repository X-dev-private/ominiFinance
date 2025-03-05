import React, { useState } from "react";
import { useChainId } from "wagmi";
import { TOKEN_ADDRESSES, getTokenAndPoolAddresses, TokenType } from "../config/tokenAddresses";
import { ethers } from "ethers";

interface ApproveTwoTokensComponentProps {
  amount: string;
  fromToken: string;
  toToken: string;
}

const ApproveTwoTokensComponent: React.FC<ApproveTwoTokensComponentProps> = ({ amount, fromToken, toToken }) => {
  const chainId = useChainId();
  const [loading, setLoading] = useState(false);
  const [fromTokenApproved, setFromTokenApproved] = useState(false);
  const [toTokenApproved, setToTokenApproved] = useState(false);

  // Obtém os dados da chain
  const chainData = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES];

  if (!chainData) {
    console.error(`Nenhuma configuração encontrada para chainId: ${chainId}`);
  }

  // Converte os tokens para lowercase para garantir compatibilidade
  const fromTokenKey = fromToken.toLowerCase() as TokenType<typeof chainId>;
  const toTokenKey = toToken.toLowerCase() as TokenType<typeof chainId>;

  // Obtém os endereços dos tokens e da pool
  const { fromAddress, toAddress, poolAddress } = getTokenAndPoolAddresses(
    chainId as keyof typeof TOKEN_ADDRESSES,
    fromTokenKey,
    toTokenKey
  );

  console.log("Chain ID:", chainId);
  console.log("From Token:", fromToken, "Address:", fromAddress);
  console.log("To Token:", toToken, "Address:", toAddress);
  console.log("Liquidity Pool Address:", poolAddress);

  const handleApprove = async (tokenAddress: string, tokenSymbol: string) => {
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

  const handleApproveFromToken = async () => {
    if (!fromAddress) {
      alert("Endereço do token de origem não encontrado!");
      return;
    }

    const success = await handleApprove(fromAddress, fromToken);
    if (success) {
      setFromTokenApproved(true);
    }
  };

  const handleApproveToToken = async () => {
    if (!toAddress) {
      alert("Endereço do token de destino não encontrado!");
      return;
    }

    const success = await handleApprove(toAddress, toToken);
    if (success) {
      setToTokenApproved(true);
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
              <h3 className="text-lg font-semibold text-gray-800">Approve Tokens</h3>
              <p className="text-sm text-gray-600 mt-1">
                Allow the Liquidity Pool to access your tokens
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-gray-500">Amount: {amount}</span>
                <span className="text-gray-500">From Token: {fromToken || "N/A"}</span>
                <span className="text-gray-500">To Token: {toToken || "N/A"}</span>

                {/* Botão para aprovar o fromToken */}
                <div className="mt-2">
                  <button
                    onClick={handleApproveFromToken}
                    disabled={loading || fromTokenApproved}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity w-full"
                  >
                    {loading ? "Approving..." : fromTokenApproved ? "From Token Approved ✅" : "Approve From Token"}
                  </button>
                </div>

                {/* Botão para aprovar o toToken (só é habilitado após a aprovação do fromToken) */}
                <div>
                  <button
                    onClick={handleApproveToToken}
                    disabled={loading || !fromTokenApproved || toTokenApproved}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity w-full"
                  >
                    {loading ? "Approving..." : toTokenApproved ? "To Token Approved ✅" : "Approve To Token"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApproveTwoTokensComponent;