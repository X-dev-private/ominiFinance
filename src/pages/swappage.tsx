import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import TokenSwap from "../libs/swapLib";

export default function SwapPage() {
  return (
    <div className="min-h-screen flex flex-col" >
      <Header />
      <div className={`mx-auto p-4 rounded-b-2xl flex flex-col items-center h-full space-y-32`}>
        <div className="flex flex-row">
          <TokenSwap />
        </div>
      </div>
      <Footer />
    </div>
  );
}
