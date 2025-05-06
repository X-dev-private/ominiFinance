import React, { useState } from "react";
import { useChainId } from "wagmi";
import { TOKEN_ADDRESSES } from "../config/tokenAddresses";
import { ethers } from "ethers";
import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";

export default function CreateTokenPage() {
  const chainId = useChainId();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [formattedInitialSupply, setFormattedInitialSupply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  // Função para formatar o valor com separadores de milhar
  const formatNumberWithSeparators = (value: string) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Função para lidar com a mudança no campo initialSupply
  const handleInitialSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove todos os não dígitos
    const formattedValue = formatNumberWithSeparators(rawValue); // Formata o valor

    setInitialSupply(rawValue); // Armazena o valor bruto (sem formatação)
    setFormattedInitialSupply(formattedValue); // Armazena o valor formatado
  };

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenName || !tokenSymbol || !initialSupply) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Convertemos o supply para BigInt diretamente (sem multiplicar por decimais)
      const initialSupplyBigInt = BigInt(initialSupply);

      const TOKEN_FACTORY_ADDRESS = chainData.tokenFactory;
      const TOKEN_FACTORY_ABI = [
        "function createToken(string memory name, string memory symbol, uint256 initialSupply) external returns (address)",
      ];

      const tokenFactory = new ethers.Contract(TOKEN_FACTORY_ADDRESS, TOKEN_FACTORY_ABI, signer);

      // Passamos o valor diretamente sem multiplicar por decimais
      const tx = await tokenFactory.createToken(tokenName, tokenSymbol, initialSupplyBigInt);
      await tx.wait();

      setSuccess("Token criado com sucesso! Visite a página 'My Tokens' para ver seus tokens criados.");
      setTokenName("");
      setTokenSymbol("");
      setInitialSupply("");
      setFormattedInitialSupply("");
    } catch (err) {
      console.error("Erro ao criar o token:", err);
      setError("Erro ao criar o token: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-4 flex flex-col items-center`}>
      <Header />

      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Crie seu Token
        </h1>

        <div className="w-full p-8 rounded-2xl shadow-lg border border-green-100">
          <form className="space-y-6" onSubmit={handleCreateToken}>
            <div>
              <label htmlFor="tokenName" className="block text-sm font-medium text-white">
                Nome do Token
              </label>
              <input
                type="text"
                id="tokenName"
                name="tokenName"
                placeholder="Ex: MeuToken"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className={`mt-1 block w-full px-4 py-2 border bg-white ${
                  tokenName ? "opacity-100" : "opacity-50"
                } border-green-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none`}
              />
            </div>

            <div>
              <label htmlFor="tokenSymbol" className="block text-sm font-medium text-white">
                Símbolo do Token
              </label>
              <input
                type="text"
                id="tokenSymbol"
                name="tokenSymbol"
                placeholder="Ex: MTK"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                className={`mt-1 block w-full px-4 py-2 border bg-white ${
                  tokenSymbol ? "opacity-100" : "opacity-50"
                } border-green-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none`}
              />
            </div>

            <div>
              <label htmlFor="initialSupply" className="block text-sm font-medium text-white">
                Supply Inicial (unidades inteiras)
              </label>
              <input
                type="text"
                id="initialSupply"
                name="initialSupply"
                placeholder="Ex: 100000000"
                value={formattedInitialSupply}
                onChange={handleInitialSupplyChange}
                className={`mt-1 block w-full px-4 py-2 border bg-white ${
                  initialSupply ? "opacity-100" : "opacity-50"
                } border-green-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none`}
              />
              <p className="mt-1 text-sm text-gray-300">
                Digite apenas números inteiros (sem casas decimais)
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Criando Token..." : "Criar Token"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <p>{success}</p>
            </div>
          )}
        </div>

        <p className="text-center text-white">
          Crie seu próprio token de forma rápida e fácil. Preencha os campos acima e clique em "Criar Token".
        </p>
      </div>
      <Footer />
    </div>
  );
}