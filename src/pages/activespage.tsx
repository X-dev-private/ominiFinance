import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css"
import MintButtonU from "../components/mintButtonUsdc";
import MintButtonE from "../components/minButtonEth";
import MintButtonA from "../components/mintButtonAnjuX";

export default function Actives() {
  return (
    <div className="mx-auto bg-gradient-to-b from-white to-green-500 p-6 rounded-b-2xl shadow-lg flex flex-col items-center h-full space-y-16">
      <Header />
      <div title="1" className="w-full max-w-3xl space-y-8 pt-16 pb-16 shadow-2xl rounded-3xl">
        {/* Título explicativo */}
        <h1 className="text-3xl font-bold text-green-700 text-center">
          Tokens de Faucet
        </h1>

        {/* Contêiner para alinhar os botões horizontalmente */}
        <div className="flex justify-center space-x-6 pt-16 pb-16">
          <MintButtonU />
          <MintButtonE />
          <MintButtonA />
        </div>

        {/* Explicação sobre Tokens de Faucet */}
        <p className="text-center text-white max-w-lg mx-auto border-2 border-white rounded-xl p-4" 
           style={{ backgroundColor: "rgba(0, 0, 0, 0.20)" }}>
          Tokens de faucet são ativos distribuídos gratuitamente em redes de teste para que desenvolvedores e usuários possam testar funcionalidades sem gastar tokens reais. 
          Esses tokens não possuem valor real e servem apenas para experimentação em ambientes de desenvolvimento.
        </p>
      </div>
      <Footer />
    </div>
  )
}
