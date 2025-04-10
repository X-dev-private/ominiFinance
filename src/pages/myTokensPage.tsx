import React, { useEffect, useState, useCallback } from "react";
import { useAccount, useChainId } from "wagmi";
import { ethers } from "ethers";
import { TOKEN_ADDRESSES } from "../config/tokenAddresses";
import Header from "../libs/header";
import Footer from "../libs/footer";
import "../App.css";
import { useNetworkColor } from '../config/networkColorContext';
import { useNavigate } from "react-router-dom";

interface TokenDetails {
  address: string;
  name: string;
  symbol: string;
  totalSupply: string;
  owner: string;
  isValid: boolean;
  decimals: number;
}

export default function MyTokensPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const networkColor = useNetworkColor();
  const [tokens, setTokens] = useState<TokenDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const chainData = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES];

  // ABI do TokenFactory com a função getTokenByOwner
  const TOKEN_FACTORY_ABI = [
    "function getTokenByOwner(address owner) view returns (address[] memory)",
    "function getTokenByAddress(address tokenAddress) view returns (string memory, string memory, uint256, address, bool)"
  ];

  // ABI padrão ERC20 para buscar decimais
  const ERC20_ABI = [
    "function decimals() view returns (uint8)"
  ];

  const formatTokenSupply = useCallback((supply: bigint, decimals = 18): string => {
    try {
      const formatted = ethers.formatUnits(supply, decimals);
      return Number(formatted).toLocaleString('pt-BR', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      });
    } catch {
      return "0,000";
    }
  }, []);

  const fetchTokenDetails = useCallback(async (tokenAddress: string, provider: ethers.BrowserProvider): Promise<TokenDetails> => {
    try {
      if (!chainData?.tokenFactory) {
        throw new Error("Token factory address not defined");
      }

      const tokenFactory = new ethers.Contract(
        chainData.tokenFactory,
        TOKEN_FACTORY_ABI,
        provider
      );

      // Usa getTokenByAddress do factory para obter informações básicas
      const [name, symbol, totalSupply, owner, isValid] = 
        await tokenFactory.getTokenByAddress(tokenAddress);

      if (!isValid) {
        return {
          address: tokenAddress,
          name: "Invalid Token",
          symbol: "INV",
          totalSupply: "0,000",
          owner: ethers.ZeroAddress,
          isValid: false,
          decimals: 18
        };
      }

      // Busca decimais diretamente do token
      let decimals = 18;
      try {
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        decimals = await tokenContract.decimals();
      } catch {
        console.warn(`Using default decimals for ${tokenAddress}`);
      }

      return {
        address: tokenAddress,
        name,
        symbol,
        totalSupply: formatTokenSupply(totalSupply, decimals),
        owner,
        isValid,
        decimals
      };
    } catch (err) {
      console.error(`Error fetching details for token ${tokenAddress}:`, err);
      return {
        address: tokenAddress,
        name: "Error",
        symbol: "ERR",
        totalSupply: "0,000",
        owner: ethers.ZeroAddress,
        isValid: false,
        decimals: 18
      };
    }
  }, [chainData, formatTokenSupply]);

  const fetchTokens = useCallback(async () => {
    if (!address || !chainData?.tokenFactory) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Verifica se o contrato factory existe
      const code = await provider.getCode(chainData.tokenFactory);
      if (code === '0x') {
        throw new Error("Token factory contract not deployed");
      }

      const tokenFactory = new ethers.Contract(
        chainData.tokenFactory,
        TOKEN_FACTORY_ABI,
        provider
      );

      console.log("Fetching tokens for owner:", address);
      
      // Usa getTokenByOwner para obter os tokens do usuário
      const tokenAddresses = await tokenFactory.getTokenByOwner(address);
      console.log("Token addresses found:", tokenAddresses);

      if (!tokenAddresses || tokenAddresses.length === 0) {
        setTokens([]);
        return;
      }

      // Processa os detalhes dos tokens em paralelo
      const tokenDetails = await Promise.all(
        tokenAddresses.map(address => 
          fetchTokenDetails(address, provider))
      );

      // Filtra apenas tokens válidos
      const validTokens = tokenDetails.filter(token => token.isValid);
      console.log("Valid tokens:", validTokens);
      
      setTokens(validTokens);
    } catch (err) {
      console.error("Error fetching tokens:", err);
      setError("Erro ao carregar tokens. Verifique sua conexão com a rede.");
    } finally {
      setLoading(false);
    }
  }, [address, chainData, fetchTokenDetails]);

  useEffect(() => {
    fetchTokens();

    const handleAccountsChanged = () => {
      console.log("Account changed - refreshing tokens...");
      fetchTokens();
    };

    window.ethereum?.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [fetchTokens]);

  const handleTokenClick = (tokenAddress: string) => {
    navigate(`/app/TokenConfig`, { state: { tokenAddress } });
  };

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
                className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleTokenClick(token.address)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-green-800">{token.symbol}</h3>
                    <p className="text-sm text-gray-600">{token.name}</p>
                  </div>
                  {token.owner.toLowerCase() === address?.toLowerCase() && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Owner
                    </span>
                  )}
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Supply:</span> {token.totalSupply}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 break-all">
                    {token.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}