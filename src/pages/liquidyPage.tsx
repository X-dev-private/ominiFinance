import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import LiquidityPoolTable from "../components/pool";
import CommunityPoolTable from "../components/communityPool";

export default function LiquidityPage() {

  return (
    <div className={`mx-auto p-4 rounded-b-2xl shadow-lg flex flex-col items-center h-full space-y-32`}>
      <Headr />
      <h2 className="text-2xl font-bold mb-4 text-white">LIQUIDITY POOL</h2>
      <LiquidityPoolTable />
      <h2 className="text-2xl font-bold mb-4 text-white">LIQUIDITY POOL COMMUNITY</h2>
      <CommunityPoolTable />
      <Footer />
    </div>
  );
}
