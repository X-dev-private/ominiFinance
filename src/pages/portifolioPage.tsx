import { useAccount, useChainId } from "wagmi";
import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import { useNetworkColor } from '../config/networkColorContext';
import { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";

const TOKEN_ADDRESSES = {
  11155111: {
    anjux: "0x6c3aaaA93CC59f5A4288465F073C2B94DDBD3a05",
    ethof: "0x1429c6F2Be05EFF1fB07F52D9D4880a108153dD4",
    usdcof: "0x32c00bD194B3ea78B9799394984DF8dB7397B834",
  },
  57054: {
    anjux: "0x0c5aAE3d2166F20995f63F48b897E425a804CaDD",
    ethof: "0x15F3DF98AC835D5661F791D8877C2cD7f6A4B876",
    usdcof: "0x911aE2B3C1D6Fe71C6B19938922faa8AbDdc035c"
  }
};

const ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)"
];

export default function PortifolioPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const networkColor = useNetworkColor();
  const [balances, setBalances] = useState({
    anjux: "0.000",
    ethof: "0.000",
    usdcof: "0.000",
    loading: true,
  });

  useEffect(() => {
    if (!address || !chainId) {
      console.log("Nenhum endereço conectado ou rede não detectada.");
      setBalances(prev => ({ ...prev, loading: false }));
      return;
    }

    if (!window.ethereum) {
      console.error("Carteira não detectada!");
      return;
    }

    const fetchBalances = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const currentChainId = (await provider.getNetwork()).chainId.toString();
        
        // Verifica se a rede é suportada
        if (!TOKEN_ADDRESSES[currentChainId]) {
          console.error("Rede não suportada");
          setBalances({
            anjux: "N/D",
            ethof: "N/D",
            usdcof: "N/D",
            loading: false
          });
          return;
        }

        const tokens = TOKEN_ADDRESSES[currentChainId];
        
        const contracts = {
          anjux: new Contract(tokens.anjux, ERC20_ABI, provider),
          ethof: new Contract(tokens.ethof, ERC20_ABI, provider),
          usdcof: new Contract(tokens.usdcof, ERC20_ABI, provider)
        };

        const [anjuxBalance, ethofBalance, usdcofBalance] = await Promise.all([
          contracts.anjux.balanceOf(address),
          contracts.ethof.balanceOf(address),
          contracts.usdcof.balanceOf(address)
        ]);

        setBalances({
          anjux: Number(formatUnits(anjuxBalance, 18)).toFixed(3),
          ethof: Number(formatUnits(ethofBalance, 18)).toFixed(3),
          usdcof: Number(formatUnits(usdcofBalance, 18)).toFixed(3),
          loading: false,
        });
      } catch (error) {
        console.error("Erro ao buscar saldos:", error);
        setBalances(prev => ({ ...prev, loading: false }));
      }
    };

    fetchBalances();

    const handleChainChanged = () => {
      fetchBalances();
    };

    window.ethereum.on('chainChanged', handleChainChanged);
    return () => window.ethereum.removeListener('chainChanged', handleChainChanged);
  }, [address, chainId]);

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