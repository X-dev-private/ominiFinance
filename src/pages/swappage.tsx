import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import TokenSwap from "../libs/swapLib";
import { useNetworkColor } from '../config/networkColorContext';

export default function SwapPage() {
  const networkColor = useNetworkColor();

  return (
    <div className={`mx-auto ${networkColor} p-4 rounded-b-2xl shadow-lg flex flex-col items-center h-full space-y-32`}>
      <Header />
      <TokenSwap />
      <Footer />
    </div>
  );
}
