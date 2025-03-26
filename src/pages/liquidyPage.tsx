import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import LiquidityPoolTable from "../components/pool";
import { useNetworkColor } from '../config/networkColorContext';
import CommunityPoolTable from "../components/communityPool";

export default function LiquidityPage() {
  const networkColor = useNetworkColor(); // Obtendo a cor da rede do contexto

  return (
    <div className={`mx-auto ${networkColor} p-4 rounded-b-2xl shadow-lg flex flex-col items-center h-full space-y-32`}>
      <Header />
      <h2 className="text-2xl font-bold mb-4 text-white">LIQUIDITY POOL</h2>
      <LiquidityPoolTable />
      <h2 className="text-2xl font-bold mb-4 text-white">LIQUIDITY POOL COMMUNITY</h2>
      <CommunityPoolTable />
      <Footer />
    </div>
  );
}
