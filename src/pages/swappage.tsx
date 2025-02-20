import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css"
import TokenSwap from "../libs/swap";

export default function SwapPage() {
  return (
    <div className="mx-auto bg-gradient-to-b from-white to-green-500 p-4 rounded-b-2xl shadow-lg flex flex-col items-center h-full space-y-32">
      <Header />
      <TokenSwap />
      <Footer />
    </div>
  )
}
