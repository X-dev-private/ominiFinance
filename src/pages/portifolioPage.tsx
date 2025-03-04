import { useAccount, useChainId } from "wagmi";
import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import { useNetworkColor } from '../config/networkColorContext';
import { useTokenBalances } from "../utils/useTokenBalances";

export default function PortifolioPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const networkColor = useNetworkColor();
  const balances = useTokenBalances(address, chainId);

  return (
    <div className={`mx-auto ${networkColor} min-h-screen flex flex-col`}>
      <Header />
      
      <div className="flex flex-col items-center justify-center flex-grow space-y-8">
        <h2 className="text-3xl font-bold text-white drop-shadow-md">
          🏦 Saldos dos Tokens
        </h2>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 w-96 text-white">
          <p className="text-lg flex justify-between border-b border-white/20 pb-2">
            <span>AnJuX Token:</span>
            <span className="font-semibold">
              {balances.loading ? "Carregando..." : `${balances.anjux} ${balances.anjux === "N/D" ? "" : "tokens"}`}
            </span>
          </p>
          <p className="text-lg flex justify-between border-b border-white/20 py-2">
            <span>ETHoF Token:</span>
            <span className="font-semibold">
              {balances.loading ? "Carregando..." : `${balances.ethof} ${balances.ethof === "N/D" ? "" : "tokens"}`}
            </span>
          </p>
          <p className="text-lg flex justify-between pt-2">
            <span>USDCoF Token:</span>
            <span className="font-semibold">
              {balances.loading ? "Carregando..." : `${balances.usdcof} ${balances.usdcof === "N/D" ? "" : "tokens"}`}
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}