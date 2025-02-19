import "../App.css";
import Capa from "../assets/Flux_Dev_Create_a_visually_striking_digital_artwork_featuring__3.jpeg";

export default function Home() {
  return (
    <div className="App">
      <section
        title="header"
        className="bg-green-100/30 text-green-900 flex justify-between items-center py-6 px-6 mb-10"
      >
        <section className="flex space-x-6">
          <a href="#" className="text-base font-semibold hover:text-green-700">Home</a>
          <a href="#" className="text-base font-semibold hover:text-green-700">Documentation</a>
          <a href="#" className="text-base font-semibold hover:text-green-700">Career</a>
        </section>
        <section>
          <a
            href="/actives"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
          >
            Launcher Testnet
          </a>
        </section>
      </section>

      {/* Container para a imagem */}
      <section title="body" className="relative w-full mb-10">
        <section className="max-w-6xl mx-auto">
          <img 
            src={Capa} 
            alt="Descrição da imagem"
            className="w-full h-[450px] object-cover rounded-xl"
          />
          
          {/* Botão posicionado metade dentro e metade fora da imagem */}
          <a
            href="/actives"
            className="absolute left-1/2 bottom-[-25px] transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-lg"
          >
            Launcher Testnet
          </a>
        </section>
      </section>

      {/* Texto adicional sobre a DAO OminiFinance */}
      <section className="max-w-6xl mx-auto py-6 text-green-900 text-lg">
        <p>
          A DAO OminiFinance prioriza a integração das economias das maiores blockchains, promovendo a interoperabilidade entre plataformas como Bitcoin, Ethereum, Binance Smart Chain e Solana. Acreditamos que a colaboração entre essas redes pode criar um ecossistema financeiro mais eficiente, ágil e acessível, impulsionando inovações e novos modelos de negócios. Ao unir forças, buscamos oferecer maior segurança, escalabilidade e oportunidades de diversificação para nossos membros, enquanto trabalhamos no desenvolvimento de soluções que facilitam a troca de ativos e dados entre as blockchains. A OminiFinance está comprometida em liderar essa transformação.
        </p>
      </section>

      {/* Section para o Footer */}
      <section
        title="footer"
        className="bg-green-100/30 text-green-900 py-6 px-6 flex justify-between items-center"
      >
        <div className="text-sm">
          <p>&copy; 2025 OmniFinance. Todos os direitos reservados.</p>
          <p>Powered by ZeroElevenTeam</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-base font-semibold hover:text-green-700">Home</a>
          <a href="#" className="text-base font-semibold hover:text-green-700">Documentation</a>
          <a href="#" className="text-base font-semibold hover:text-green-700">Career</a>
        </div>
      </section>
    </div>
  );
}
