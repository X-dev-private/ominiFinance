import { useAccount, useChainId } from "wagmi";
import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import { useTokenBalances } from "../utils/useTokenBalances";
import { formatUnits } from "ethers";

const formatTokenValue = (value: bigint, decimals: number): string => {
  try {
    const formatted = formatUnits(value, decimals);
    const numberValue = Number(formatted);
    
    if (numberValue >= 1e6) {
      return numberValue.toLocaleString('fullwide', { maximumFractionDigits: 0 });
    } else {
      return numberValue.toLocaleString('fullwide', { 
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      });
    }
  } catch {
    return "0.000";
  }
};

export default function PortfolioPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const balances = useTokenBalances(address, chainId);

  const formatBalance = (balance: string) => {
    try {
      if (balance === "N/A" || !balance) return balance;
      const numberValue = Number(balance);
      if (numberValue >= 1e6) {
        return numberValue.toLocaleString('fullwide', { maximumFractionDigits: 0 });
      } else {
        return numberValue.toLocaleString('fullwide', { 
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        });
      }
    } catch {
      return balance;
    }
  };

  return (
    <div className={`mx-auto min-h-screen flex flex-col`}>
      <Header />
      
      <main className="flex flex-col items-center justify-center flex-grow pt-24 pb-8 px-4 space-y-12">
        <h2 className="text-3xl font-bold text-white drop-shadow-md">
          🏦 Token Balances
        </h2>

        {/* Project Tokens */}
        <div className="w-full max-w-md">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            Project Tokens
          </h3>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 text-white">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-lg">AnJuX Token:</span>
                <span className="font-semibold text-lg text-right break-words ml-4">
                  {balances.loading ? "Loading..." : `${formatBalance(balances.anjux)} ${balances.anjux === "N/A" ? "" : "tokens"}`}
                </span>
              </div>
              <div className="border-t border-white/20 pt-4 flex justify-between items-start">
                <span className="text-lg">ETHoF Token:</span>
                <span className="font-semibold text-lg text-right break-words ml-4">
                  {balances.loading ? "Loading..." : `${formatBalance(balances.ethof)} ${balances.ethof === "N/A" ? "" : "tokens"}`}
                </span>
              </div>
              <div className="border-t border-white/20 pt-4 flex justify-between items-start">
                <span className="text-lg">USDCoF Token:</span>
                <span className="font-semibold text-lg text-right break-words ml-4">
                  {balances.loading ? "Loading..." : `${formatBalance(balances.usdcof)} ${balances.usdcof === "N/A" ? "" : "tokens"}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Tokens from Factory */}
        {balances.customTokens && Object.keys(balances.customTokens).length > 0 && (
          <div className="w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">
              Your Custom Tokens
            </h3>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 text-white">
              <div className="space-y-4">
                {Object.entries(balances.customTokens).map(([address, token], index) => (
                  <div 
                    key={address}
                    className={`flex justify-between items-start ${index > 0 ? 'border-t border-white/20 pt-4' : ''}`}
                  >
                    <span className="text-lg">{token.symbol}:</span>
                    <span className="font-semibold text-lg text-right break-words ml-4">
                      {formatBalance(token.balance)} tokens
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}