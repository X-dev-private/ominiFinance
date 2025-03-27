import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useAccount, useChainId } from "wagmi";
import { TOKEN_ADDRESSES } from "../config/tokenAddresses";
import Footer from "../libs/footer";
import Header from "../libs/header";
import { useNetworkColor } from '../config/networkColorContext';
import ManagerPool from "../components/managerPool";

interface TokenInfo {
  name: string;
  symbol: string;
  totalSupply: string;
  owner: string;
  isValid: boolean;
  address: string;
  decimals: number;
}

export default function TokenConfigPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const networkColor = useNetworkColor();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tokenAddress = location.state?.tokenAddress;
  const chainData = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES];

  useEffect(() => {
    if (!tokenAddress || !chainData?.tokenFactory) {
      setError("Token address not found or unsupported network");
      setLoading(false);
      return;
    }

    const fetchTokenData = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        
        const tokenFactory = new Contract(
          chainData.tokenFactory,
          [
            `function getTokenByAddress(address) view returns (
              string, string, uint256, address, bool
            )`
          ],
          provider
        );

        const [name, symbol, totalSupply, owner, isValid] = 
          await tokenFactory.getTokenByAddress(tokenAddress);

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
          totalSupply: formatUnits(totalSupply, decimals),
          owner,
          isValid,
          address: tokenAddress,
          decimals
        });

      } catch (err) {
        console.error("Error fetching token data:", err);
        setError("Failed to load token data");
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();

    const handleChainChanged = () => {
      setLoading(true);
      fetchTokenData();
    };

    window.ethereum?.on('chainChanged', handleChainChanged);
    
    return () => {
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [tokenAddress, chainData]);

  const handleCreatePool = () => {
    navigate("/app/create-pool", { state: { tokenAddress } });
  };

  if (!tokenAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600">Token not selected</h2>
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-green-600">Loading token data...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tokenInfo) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-b from-white to-green-50 ${networkColor} p-4 flex flex-col items-center`}>
      <Header />

      <div className="flex-grow w-full max-w-4xl space-y-8 py-8">
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
                : `Owned by: ${tokenInfo.owner.slice(0, 6)}...${tokenInfo.owner.slice(-4)}`}
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
              <p className={`font-medium ${
                tokenInfo.isValid ? "text-green-600" : "text-red-600"
              }`}>
                {tokenInfo.isValid ? "Valid Token" : "Invalid"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              Liquidity Pools
            </h3>
            {tokenInfo.isValid && (
              <button
                onClick={handleCreatePool}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>+</span>
                <span>Create New Pool</span>
              </button>
            )}
          </div>

          {!tokenInfo.isValid ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800">
                Cannot manage pools for an invalid token
              </p>
            </div>
          ) : (
            <ManagerPool 
              tokenAddress={tokenInfo.address}
              tokenSymbol={tokenInfo.symbol}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}