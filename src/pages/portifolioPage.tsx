import { useAccount, useChainId } from "wagmi"; // Adicionei useChainId aqui
import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import { useNetworkColor } from '../config/networkColorContext';
import { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";

const TOKEN_ADDRESSES = {
  anjux: "0x6c3aaaA93CC59f5A4288465F073C2B94DDBD3a05",
  ethof: "0x1429c6F2Be05EFF1fB07F52D9D4880a108153dD4",
  usdcof: "0x32c00bD194B3ea78B9799394984DF8dB7397B834",
};

const ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)"
];

export default function PortifolioPage() {
  const { address } = useAccount();
  const chainId = useChainId(); // Hook para obter o chainId atual
  const networkColor = useNetworkColor();
  const [balances, setBalances] = useState({
    anjux: "0.000",
    ethof: "0.000",
    usdcof: "0.000",
    loading: true,
  });

  useEffect(() => {
    if (!address) {
      console.log("Nenhum endereço conectado.");
      return;
    }

    if (!window.ethereum) {
      console.error("Carteira não detectada!");
      return;
    }

    const fetchBalances = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        
        // Verificação adicional com chainId
        const currentChainId = await provider.getNetwork().then(network => network.chainId);
        if (currentChainId !== chainId) {
          console.log("Mudança de rede detectada, atualizando...");
        }

        const anjuxContract = new Contract(TOKEN_ADDRESSES.anjux, ERC20_ABI, provider);
        const ethofContract = new Contract(TOKEN_ADDRESSES.ethof, ERC20_ABI, provider);
        const usdcofContract = new Contract(TOKEN_ADDRESSES.usdcof, ERC20_ABI, provider);

        const [anjuxBalance, ethofBalance, usdcofBalance] = await Promise.all([
          anjuxContract.balanceOf(address),
          ethofContract.balanceOf(address),
          usdcofContract.balanceOf(address)
        ]);

        const formattedBalances = {
          anjux: Number(formatUnits(anjuxBalance, 18)).toFixed(3),
          ethof: Number(formatUnits(ethofBalance, 18)).toFixed(3),
          usdcof: Number(formatUnits(usdcofBalance, 18)).toFixed(3),
          loading: false,
        };

        setBalances(formattedBalances);
      } catch (error) {
        console.error("Erro ao buscar saldos:", error);
        setBalances(prev => ({ ...prev, loading: false }));
      }
    };

    fetchBalances();

    // Listener para atualizar quando a rede mudar
    const handleChainChanged = () => {
      fetchBalances();
    };

    window.ethereum.on('chainChanged', handleChainChanged);
    return () => window.ethereum.removeListener('chainChanged', handleChainChanged);
  }, [address, chainId]); // Adicionei chainId nas dependências

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