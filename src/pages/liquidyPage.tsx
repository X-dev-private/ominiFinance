import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css"
import LiquidityPoolTable from "../components/pool";

export default function LiquidityPage() {
  return (
    <div className="mx-auto bg-gradient-to-b from-white to-green-500 p-4 rounded-b-2xl shadow-lg flex flex-col items-center h-full space-y-32">
      <Header />
      <h2 className="text-2xl font-bold mb-4 text-green-600">LIQUIDITY POOL</h2>
      <LiquidityPoolTable />
      <Footer />
    </div>
  )
}
