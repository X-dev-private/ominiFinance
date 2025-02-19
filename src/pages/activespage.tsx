import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css"
import LiquidityPoolTable from "../components/pool";
import TokenSwap from "../components/swap";

export default function Actives() {
  return (
    <div className="mx-auto bg-gradient-to-b from-white to-green-500 p-4 rounded-b-2xl shadow-lg flex flex-col items-center h-full space-y-32">
      <Header />
      <LiquidityPoolTable />
      <TokenSwap />
      <Footer />
    </div>
  )
}
