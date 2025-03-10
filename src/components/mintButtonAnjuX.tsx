import { useState } from "react";
import { ethers } from "ethers";
import { useAccount, useChainId } from "wagmi";
import { TOKEN_ADDRESSES, ChainId } from "../config/tokenAddresses";

const MintButtonA: React.FC = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId() as ChainId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCooldownMessage, setShowCooldownMessage] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const isCorrectChain = chainId in TOKEN_ADDRESSES;
  const contractAddress = isCorrectChain ? TOKEN_ADDRESSES[chainId].anjux : null;

  const mintToken = async () => {
    if (!isConnected || !isCorrectChain || !contractAddress) {
      setError("Connect your wallet and switch to the correct chain");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setShowCooldownMessage(false);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, [
        {
          inputs: [{ internalType: "address", name: "to", type: "address" }],
          name: "mint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ], signer);

      const tx = await contract.mint(address);
      await tx.wait();

      setSuccess(true);
    } catch (err: any) {
      if (err.message.includes("You have already minted recently")) {
        setShowCooldownMessage(true);
        setOpacity(100);
        setTimeout(() => {
          setOpacity(0);
          setTimeout(() => setShowCooldownMessage(false), 1000);
        }, 4000);
      } else {
        setError(err.message || "Error minting token");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 relative">
      <button
        onClick={mintToken}
        disabled={!isConnected || loading || !isCorrectChain}
        className="px-6 py-3 text-white font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:hover:bg-gradient-to-r disabled:from-green-600 disabled:to-emerald-600 disabled:hover:scale-100"
      >
        {loading ? "Minting..." : "Mint AnJuX Token"}
      </button>

      {!isConnected && <p className="text-red-500">Connect your wallet</p>}
      {!isCorrectChain && <p className="text-red-500">Switch to the correct chain</p>}
      {success && <p className="text-green-500">Token minted successfully!</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {showCooldownMessage && (
        <div
          className="absolute top-12 bg-green-800 text-white text-sm p-2 rounded-lg shadow-lg w-60 text-center transition-opacity duration-1000"
          style={{ opacity: opacity / 100 }}
        >
          ⏳ You have already minted recently. Try again in 24 hours.
        </div>
      )}
    </div>
  );
};

export default MintButtonA;