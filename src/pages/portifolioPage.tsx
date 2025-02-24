import { useAccount } from "wagmi";
import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import { useNetworkColor } from '../config/networkColorContext';
import { useEffect, useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";

const alchemy = new Alchemy({
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
});

const TOKEN_ADDRESSES = {
  anjux: "0x6c3aaaA93CC59f5A4288465F073C2B94DDBD3a05",
  ethof: "0x1429c6F2Be05EFF1fB07F52D9D4880a108153dD4",
  usdcof: "0x32c00bD194B3ea78B9799394984DF8dB7397B834",
};

export default function PortifolioPage() {
  const { address } = useAccount();
  const networkColor = useNetworkColor();
  const [balances, setBalances] = useState({
    anjux: "0.000",
    ethof: "0.000",
    usdcof: "0.000",
    loading: true,
  });

  useEffect(() => {
    if (!address) return;

    const fetchBalances = async () => {
      try {
        const response = await alchemy.core.getTokenBalances(address, [
          TOKEN_ADDRESSES.anjux,
          TOKEN_ADDRESSES.ethof,
          TOKEN_ADDRESSES.usdcof,
        ]);

        const formattedBalances = {
          anjux: (response.tokenBalances[0].tokenBalance / 10 ** 18).toFixed(3),
          ethof: (response.tokenBalances[1].tokenBalance / 10 ** 18).toFixed(3),
          usdcof: (response.tokenBalances[2].tokenBalance / 10 ** 18).toFixed(3),
          loading: false,
        };

        setBalances(formattedBalances);
      } catch (error) {
        console.error("Erro ao buscar saldos:", error);
        setBalances((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchBalances();
  }, [address]);

  return (
    <div className={`mx-auto ${networkColor} min-h-screen flex flex-col`}>
      <Header />
      
      {/* Conteúdo principal centralizado */}
      <div className="flex flex-col items-center justify-center flex-grow space-y-8">
        <h2 className="text-3xl font-bold text-white drop-shadow-md">
          🏦 Saldos dos Tokens
        </h2>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 w-96 text-white">
          <p className="text-lg flex justify-between border-b border-white/20 pb-2">
            <span>AnJuX Token:</span>
            <span className="font-semibold">
              {balances.loading ? "Carregando..." : `${balances.anjux} tokens`}
            </span>
          </p>
          <p className="text-lg flex justify-between border-b border-white/20 py-2">
            <span>ETHoF Token:</span>
            <span className="font-semibold">
              {balances.loading ? "Carregando..." : `${balances.ethof} tokens`}
            </span>
          </p>
          <p className="text-lg flex justify-between pt-2">
            <span>USDCoF Token:</span>
            <span className="font-semibold">
              {balances.loading ? "Carregando..." : `${balances.usdcof} tokens`}
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
