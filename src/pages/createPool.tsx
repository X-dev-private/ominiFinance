import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import { useAccount, useChainId } from "wagmi";
import { TOKEN_ADDRESSES } from "../config/tokenAddresses";
import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import { useNetworkColor } from '../config/networkColorContext';

export default function CreatePool() {
  const { address } = useAccount();
  const chainId = useChainId(); // Usando hook do wagmi para chainId
  const networkColor = useNetworkColor();
  const location = useLocation();
  const navigate = useNavigate();
  
  const tokenAddress = location.state?.tokenAddress;
  const [pairTokenAddress, setPairTokenAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const createPool = async () => {
    if (!tokenAddress || !pairTokenAddress) {
      setError("Both token addresses are required");
      return;
    }

    if (tokenAddress === pairTokenAddress) {
      setError("Cannot create pool with the same token");
      return;
    }

    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Usando chainId do wagmi em vez de obter do signer
      const chainData = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES];

      if (!chainData?.dexFactory) {
        throw new Error("Unsupported network");
      }

      const DEX_FACTORY_ABI = [
        "function createPool(address tokenA, address tokenB) external returns (address poolAddress)",
      ];

      const dexFactory = new Contract(
        chainData.dexFactory,
        DEX_FACTORY_ABI,
        signer
      );

      const tx = await dexFactory.createPool(tokenAddress, pairTokenAddress);
      await tx.wait();

      setSuccess("Pool created successfully!");
      setTimeout(() => {
        navigate(`/app/token-config`, { state: { tokenAddress } });
      }, 2000);
    } catch (err) {
      console.error("Error creating pool:", err);
      setError(err.message || "Failed to create pool");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-white to-green-50 ${networkColor} p-4 flex flex-col items-center`}>
      <Header />

      <div className="flex-grow w-full max-w-2xl space-y-8 py-8 flex flex-col items-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 w-full">
          <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
            Create New Liquidity Pool
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Token Address
              </label>
              <input
                type="text"
                value={tokenAddress}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is the token you're creating a pool for
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pair Token Address
              </label>
              <input
                type="text"
                value={pairTokenAddress}
                onChange={(e) => setPairTokenAddress(e.target.value)}
                placeholder="0x..."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the address of the token you want to pair with
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            <div className="flex justify-center mt-6">
              <button
                onClick={createPool}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white transition-colors`}
              >
                {loading ? "Creating Pool..." : "Create Liquidity Pool"}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          ← Back to Token Page
        </button>
      </div>

      <Footer />
    </div>
  );
}