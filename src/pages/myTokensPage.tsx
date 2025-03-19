import React, { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { ethers } from "ethers";
import { TOKEN_ADDRESSES } from "../config/tokenAddresses";
import Header from "../libs/header";
import Footer from "../libs/footer";
import "../App.css";
import { useNetworkColor } from '../config/networkColorContext'; // Importe o hook

export default function MyTokensPage() {
  const { address } = useAccount(); // Obtém o endereço da carteira conectada
  const chainId = useChainId(); // Obtém o ID da rede conectada
  const networkColor = useNetworkColor(); // Obtém a cor da rede
  const [tokens, setTokens] = useState([]); // Armazena os tokens criados pelo usuário
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(""); // Mensagem de erro

  // Verifica se a rede conectada é suportada
  const chainData = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES];

  useEffect(() => {
    if (!address || !chainData?.tokenFactory) return;

    const fetchTokens = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Endereço e ABI do contrato TokenFactory
        const TOKEN_FACTORY_ADDRESS = chainData.tokenFactory;
        const TOKEN_FACTORY_ABI = [
          "function getTokensByOwner(address owner) external view returns (address[] memory)",
        ];

        const tokenFactory = new ethers.Contract(TOKEN_FACTORY_ADDRESS, TOKEN_FACTORY_ABI, signer);

        // Obtém os tokens criados pelo usuário
        const tokenAddresses = await tokenFactory.getTokensByOwner(address);

        // Obtém os símbolos dos tokens
        const tokenDetails = await Promise.all(
          tokenAddresses.map(async (tokenAddress) => {
            const tokenContract = new ethers.Contract(tokenAddress, ["function symbol() view returns (string)"], provider);
            const symbol = await tokenContract.symbol();
            return { address: tokenAddress, symbol };
          })
        );

        setTokens(tokenDetails);
      } catch (err) {
        console.error("Erro ao buscar tokens:", err);
        setError("Erro ao carregar tokens. Verifique sua conexão com a rede.");
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [address, chainData]);

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

  return (
    <div className={`min-h-screen bg-gradient-to-b from-white to-green-50 ${networkColor} p-4 flex flex-col items-center`}>
      <Header />

      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Meus Tokens
        </h1>

        {loading ? (
          <div className="text-center text-green-600">Carregando tokens...</div>
        ) : error ? (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center text-green-600">Nenhum token criado ainda.</div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map((token, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-green-800">{token.symbol}</h3>
                <p className="text-sm text-gray-600 mt-2 break-all">
                  Endereço: {token.address}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}