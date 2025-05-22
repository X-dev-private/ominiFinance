import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import TokenSwap from "../libs/swapLib";

export default function SwapPage() {
  return (
    <div className={`mx-auto p-4 rounded-b-2xl shadow-lg flex flex-col items-center h-full space-y-32`}>
      <Header />
      <div className="flex flex-row">
        <TokenSwap />
      </div>
      <Footer />
    </div>
  );
}
