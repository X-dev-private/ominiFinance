import "../App.css";
import Logo from '../assets/Logo.png';
import CapaA from '../assets/Bitcoin-amico.png';
import CapaB from '../assets/Manage money-pana.png';
import ImageCarousel from "../components/Carrosel";

export default function Home() {
  return (
    <div className="App">
      {/* Header */}
      <section
        title="header"
        className="text-green-900 flex justify-between items-center py-2 px-4 mb-30"
      >
        <section className="flex items-center space-x-6">
          <img src={Logo} alt="Logo" className="h-12 object-contain mt-[-1px]" />
          <a href="/" className="text-base font-semibold hover:text-green-700">Home</a>
          <a
            href="https://omini-finance-docs.vercel.app/"
            className="text-base font-semibold hover:text-green-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
          <a
            href="https://omini-finance-docs.vercel.app/blog"
            className="text-base font-semibold hover:text-green-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </a>
          <a href="/roadmap" className="text-base font-semibold hover:text-green-700">RoadMap</a>
        </section>
        <section>
          <a
            href="/app/Dashboard"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-green-500/50"
          >
            Launcher Testnet
          </a>
        </section>
      </section>

      {/* Container para as imagens */}
      <section title="body" className="relative w-full mb-10 bg-gradient-to-b from-white to-green-500">
        <section className="max-w-6xl mx-auto flex justify-center gap-6">
          <img 
            src={CapaA} 
            alt="Bitcoin Illustration"
            className="w-1/2 h-[450px] object-cover rounded-xl"
          />
          <img 
            src={CapaB} 
            alt="Money Management Illustration"
            className="w-1/2 h-[450px] object-cover rounded-xl"
          />
        </section>
        <a
          href="/app/Dashboard"
          className="absolute left-1/2 bottom-[-25px] transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
        >
          Launcher Testnet
        </a>
      </section>

      {/* Texto adicional sobre a DAO OminiFinance */}
      <section className="max-w-6xl mx-auto py-6 text-green-900 text-lg mb-16">
        <p className="mx-auto rounded-xl p-4 text-lg leading-relaxed">
          The OminiFinance DAO prioritizes integrating the economies of major blockchains, promoting interoperability between platforms like Bitcoin, Ethereum, Binance Smart Chain, and Solana. We believe collaboration between these networks can create a more efficient, agile, and accessible financial ecosystem, driving innovation and new business models. By joining forces, we aim to provide enhanced security, scalability, and diversification opportunities for our members, while developing solutions that facilitate asset and data exchange between blockchains. OminiFinance is committed to leading this transformation.
        </p>
      </section>

      {/* Seção de Blockchains Suportadas */}
      <section className="max-w-6xl mx-auto py-24 text-center">
        <h2 className="text-6xl font-bold text-green-900 mb-4">
          Supported Blockchains
        </h2>
        <p className="text-lg text-green-800 mb-6">
          OminiFinance promotes integration among various leading market blockchains, enabling greater interoperability and innovation in the decentralized financial ecosystem.
        </p>
        <ImageCarousel />
      </section>

      {/* Footer */}
      <section
        title="footer"
        className="bg-green-100/30 text-green-900 py-6 px-6 flex justify-between items-center"
      >
        <div className="text-sm">
          <p>&copy; 2025 OmniFinance. All rights reserved.</p>
          <p>Powered by ZeroElevenTeam</p>
        </div>
        <div className="flex space-x-6">
          <a href="/" className="text-base font-semibold hover:text-green-700">Home</a>
          <a
            href="https://omini-finance-docs.vercel.app/"
            className="text-base font-semibold hover:text-green-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
          <a
            href="https://omini-finance-docs.vercel.app/blog"
            className="text-base font-semibold hover:text-green-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </a>
          <a href="/roadmap" className="text-base font-semibold hover:text-green-700">RoadMap</a>
        </div>
      </section>
    </div>
  );
}