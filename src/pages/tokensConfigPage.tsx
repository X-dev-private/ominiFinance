import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useAccount, useChainId } from "wagmi";
import { TOKEN_ADDRESSES } from "../config/tokenAddresses";
import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import { useNetworkColor } from '../config/networkColorContext';

interface TokenInfo {
  name: string;
  symbol: string;
  totalSupply: string;
  owner: string;
  isValid: boolean;
  address: string;
  decimals: number;
  loading: boolean;
}

interface PoolInfo {
  address: string;
  token0: string;
  token1: string;
  reserves: [string, string];
  loading: boolean;
}

export default function TokenConfigPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const networkColor = useNetworkColor();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [pools, setPools] = useState<PoolInfo[]>([]);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    name: "",
    symbol: "",
    totalSupply: "0.000",
    owner: "",
    isValid: false,
    address: "",
    decimals: 18,
    loading: true
  });
  const [error, setError] = useState("");

  const tokenAddress = location.state?.tokenAddress;
  const chainData = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES];

  const formatTokenValue = (value: bigint, decimals: number): string => {
    try {
      // Converte para string sem notação científica
      const formatted = formatUnits(value, decimals);
      const numberValue = Number(formatted);
      
      // Formata com 3 casas decimais, evitando notação científica
      if (numberValue >= 1e6) {
        // Para números muito grandes, mostra inteiro
        return numberValue.toLocaleString('fullwide', { maximumFractionDigits: 0 });
      } else {
        // Para números menores, mostra com 3 casas decimais
        return numberValue.toLocaleString('fullwide', { 
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        });
      }
    } catch {
      return "0.000";
    }
  };

  useEffect(() => {
    if (!tokenAddress || !chainData?.tokenFactory) {
      setError("Token address not found or unsupported network");
      setTokenInfo(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchTokenData = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        
        // 1. Busca informações completas do token
        const TOKEN_FACTORY_ABI = [
          `function getTokenByAddress(address tokenAddress) external view returns (
            string memory name,
            string memory symbol,
            uint256 totalSupply,
            address owner,
            bool isValid
          )`
        ];

        const tokenFactory = new Contract(
          chainData.tokenFactory,
          TOKEN_FACTORY_ABI,
          provider
        );

        const [name, symbol, totalSupply, owner, isValid] = 
          await tokenFactory.getTokenByAddress(tokenAddress);

        // Busca decimais
        let decimals = 18;
        try {
          const tokenContract = new Contract(
            tokenAddress,
            ["function decimals() view returns (uint8)"],
            provider
          );
          decimals = await tokenContract.decimals();
        } catch {
          console.log("Using default decimals (18)");
        }

        setTokenInfo({
          name,
          symbol,
          totalSupply: formatTokenValue(totalSupply, decimals),
          owner,
          isValid,
          address: tokenAddress,
          decimals,
          loading: false
        });

        // 2. Busca os pools associados
        if (chainData.dexFactory) {
          const DEX_FACTORY_ABI = [
            "function getPoolsByToken(address token) external view returns (address[] memory)",
          ];

          const dexFactory = new Contract(
            chainData.dexFactory,
            DEX_FACTORY_ABI,
            provider
          );

          const poolAddresses = await dexFactory.getPoolsByToken(tokenAddress);

          const poolDetails = await Promise.all(
            poolAddresses.map(async (poolAddress) => {
              const poolContract = new Contract(
                poolAddress,
                [
                  "function token0() view returns (address)",
                  "function token1() view returns (address)",
                  "function getReserves() view returns (uint112, uint112, uint32)",
                ],
                provider
              );

              const [token0, token1, reserves] = await Promise.all([
                poolContract.token0(),
                poolContract.token1(),
                poolContract.getReserves(),
              ]);

              return {
                address: poolAddress,
                token0,
                token1,
                reserves: [
                  formatTokenValue(reserves[0], token0 === tokenAddress ? decimals : 18),
                  formatTokenValue(reserves[1], token1 === tokenAddress ? decimals : 18)
                ] as [string, string],
                loading: false
              };
            })
          );

          setPools(poolDetails);
        }
      } catch (err) {
        console.error("Error fetching token data:", err);
        setError("Failed to load token data. Please try again.");
        setTokenInfo(prev => ({ ...prev, loading: false }));
      }
    };

    fetchTokenData();

    const handleChainChanged = () => {
      setTokenInfo(prev => ({ ...prev, loading: true }));
      fetchTokenData();
    };

    window.ethereum?.on('chainChanged', handleChainChanged);
    
    return () => {
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [tokenAddress, chainData]);

  if (!tokenAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600">Token not selected</h2>
          <p className="mt-2">Please select a token from the My Tokens page.</p>
          <button 
            onClick={() => navigate("/app/my-tokens")}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Back to My Tokens
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-white to-green-50 ${networkColor} p-4 flex flex-col items-center`}>
      <Header />

      <div className="flex-grow w-full max-w-4xl space-y-8 py-8">
        {tokenInfo.loading ? (
          <div className="text-center text-green-600">Loading token data...</div>
        ) : error ? (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        ) : !tokenInfo.isValid ? (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
            This token was not created by our factory or is invalid
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-green-800 mb-1">
                    {tokenInfo.name} ({tokenInfo.symbol})
                  </h2>
                  <p className="text-sm text-gray-600 break-all">
                    Contract: {tokenInfo.address}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tokenInfo.owner.toLowerCase() === address?.toLowerCase() 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {tokenInfo.owner.toLowerCase() === address?.toLowerCase() 
                    ? "You own this token" 
                    : "Owned by: " + tokenInfo.owner.slice(0, 6) + '...' + tokenInfo.owner.slice(-4)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Total Supply</p>
                  <p className="font-medium">
                    {tokenInfo.totalSupply} {tokenInfo.symbol}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Decimals</p>
                  <p className="font-medium">{tokenInfo.decimals}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium text-green-600">
                    {tokenInfo.isValid ? "Valid Token" : "Invalid"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Liquidity Pools ({pools.length})
              </h3>

              {pools.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-yellow-800">No liquidity pools found for this token</p>
                  <button 
                    onClick={() => navigate("/app/create-pool", { state: { tokenAddress } })}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    Create First Pool
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pools.map((pool, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-800">Pool #{index + 1}</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {pool.token0 === tokenAddress ? 
                            `${tokenInfo.symbol}/${'OTHER'}` : 
                            `OTHER/${tokenInfo.symbol}`}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 break-all mt-1">
                        {pool.address}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Reserve 0</p>
                          <p>{pool.reserves[0]}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Reserve 1</p>
                          <p>{pool.reserves[1]}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/app/pool/${pool.address}`)}
                        className="mt-3 w-full py-1 bg-green-50 text-green-700 rounded text-sm hover:bg-green-100"
                      >
                        View Pool Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}