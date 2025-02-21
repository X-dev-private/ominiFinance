import { useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const contractAddress = "0x6c3aaaA93CC59f5A4288465F073C2B94DDBD3a05";

const contractABI = [
  {
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const MintButtonA: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCooldownMessage, setShowCooldownMessage] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const mintToken = async () => {
    if (!isConnected) {
      setError("Conecte sua carteira primeiro");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setShowCooldownMessage(false);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

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
        setError(err.message || "Erro ao mintar token");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 relative">
      <button
        onClick={mintToken}
        disabled={!isConnected || loading}
        className="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? "Mintando..." : "Mint AnJuX Token"}
      </button>

      {!isConnected && <p className="text-red-500">Conecte sua carteira</p>}
      {success && <p className="text-green-500">Token mintado com sucesso!</p>}
      {error && <p className="text-red-500">Erro: {error}</p>}

      {showCooldownMessage && (
        <div
          className="absolute top-12 bg-green-800 text-white text-sm p-2 rounded-lg shadow-lg w-60 text-center transition-opacity duration-1000"
          style={{ opacity: opacity / 100 }}
        >
          ⏳ Você já mintou recentemente. Tente novamente em 24 horas.
        </div>
      )}
    </div>
  );
};

export default MintButtonA;
