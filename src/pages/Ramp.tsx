import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import CryptoList from "../components/CryptoList";

export default function Ramp() {

  return (
    <div className={`mx-auto min-h-screen flex flex-col`}>
      <Header />     
      <div className="flex flex-col items-center justify-center flex-grow w-full px-6 mt-30 mb-20">
      <CryptoList />
      </div>
      <Footer />
    </div>
  );
}