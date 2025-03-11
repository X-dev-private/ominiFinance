import React, { useState } from "react";
import { useChainId } from "wagmi";
import { TOKEN_ADDRESSES, getTokenAndPoolAddresses, TokenType } from "../config/tokenAddresses";
import { ethers } from "ethers";

interface ApproveComponentProps {
  amount: string;
  fromToken: string;
  toToken: string;
}

const ApproveComponent: React.FC<ApproveComponentProps> = ({ amount, fromToken, toToken }) => {
  const chainId = useChainId();
  const [approveLoading, setApproveLoading] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  // Verifica se a rede conectada é suportada
  const chainData = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES];

  if (!chainData) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg 
                  className="w-6 h-6 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">Rede não suportada</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Conecte-se a uma rede suportada para continuar.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Converte os tokens para lowercase para garantir compatibilidade
  const fromTokenKey = fromToken.toLowerCase() as TokenType<typeof chainId>;
  const toTokenKey = toToken.toLowerCase() as TokenType<typeof chainId>;

  // Obtém os endereços dos tokens e da pool (somente se a rede for suportada)
  let fromAddress: string | undefined;
  let toAddress: string | undefined;
  let poolAddress: string | undefined;

  try {
    const addresses = getTokenAndPoolAddresses(
      chainId as keyof typeof TOKEN_ADDRESSES,
      fromTokenKey,
      toTokenKey
    );
    fromAddress = addresses.fromAddress;
    toAddress = addresses.toAddress;
    poolAddress = addresses.poolAddress;
  } catch (error) {
    console.error("Erro ao obter endereços dos tokens:", error);
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg 
                  className="w-6 h-6 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">Erro ao carregar tokens</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Verifique se os símbolos dos tokens estão corretos e se a rede é suportada.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    if (!window.ethereum) {
      alert("MetaMask não detectado!");
      return;
    }

    if (!fromAddress) {
      alert("Endereço do token de origem não encontrado! Verifique o símbolo do token.");
      return;
    }

    if (!poolAddress) {
      alert("Endereço da Liquidity Pool não encontrado!");
      return;
    }

    try {
      setApproveLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const erc20Abi = [
        "function approve(address spender, uint256 amount) public returns (bool)",
      ];
      const contract = new ethers.Contract(fromAddress, erc20Abi, signer);

      const amountInWei = ethers.parseUnits(amount, 18);
      const tx = await contract.approve(poolAddress, amountInWei);
      await tx.wait();

      setIsApproved(true);
      alert("Aprovação realizada com sucesso!");
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      alert("Erro ao aprovar tokens!");
    } finally {
      setApproveLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!window.ethereum) {
      alert("MetaMask não detectado!");
      return;
    }

    if (!poolAddress || !fromAddress) {
      alert("Endereços necessários não configurados!");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Quantidade inválida para swap!");
      return;
    }

    try {
      setSwapLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const poolAbi = [
        "function swap(address fromToken, uint256 amountIn) external returns (uint256 amountOut)"
      ];

      const amountInWei = ethers.parseUnits(amount, 18);
      const poolContract = new ethers.Contract(poolAddress, poolAbi, signer);

      const tx = await poolContract.swap(fromAddress, amountInWei);
      await tx.wait();

      alert("Swap realizado com sucesso!");
    } catch (error) {
      console.error("Erro no swap:", error);
      alert("Erro ao realizar swap!");
    } finally {
      setSwapLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
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
                <span className="text-gray-500">From Token: {fromToken || "N/A"}</span>
                <span className="text-gray-500">To Token: {toToken || "N/A"}</span>
                
                {!isApproved ? (
                  <button
                    onClick={handleApprove}
                    disabled={approveLoading}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {approveLoading ? "Approving..." : "Approve"}
                  </button>
                ) : (
                  <button
                    onClick={handleSwap}
                    disabled={swapLoading}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {swapLoading ? "Swapping..." : "Swap Tokens"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApproveComponent;