import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";
import { useNetworkColor } from '../config/networkColorContext';
import { useState } from "react";
import { MoonPayBuyWidget, MoonPaySellWidget } from "@moonpay/moonpay-react";

export default function Ramp() {
  const networkColor = useNetworkColor();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [widgetVisible, setWidgetVisible] = useState(false);

  // Classe condicional para centralização
  const widgetContainerClass = `bg-black/20 p-6 rounded-xl border border-white/10 ${
    widgetVisible ? 'flex flex-col items-center' : ''
  }`;

  return (
    <div className={`mx-auto ${networkColor} min-h-screen flex flex-col`}>
      <Header />
      
      <div className="flex flex-col items-center justify-center flex-grow w-full px-6 mt-30 mb-20">
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl text-white space-y-8">
          <h1 className="text-4xl font-bold text-center drop-shadow-md">Crypto On-Ramp</h1>
          
          <div className="max-w-lg mx-auto border border-white/20 rounded-xl p-4 bg-black/30 text-lg leading-relaxed text-center">
            MoonPay is a regulated payment service that allows you to buy and sell cryptocurrencies 
            using credit cards, debit cards, or bank transfers.
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('buy')}
              className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'buy' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Buy Crypto
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'sell' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Sell Crypto
            </button>
          </div>
          
          <div className={widgetContainerClass}>
            {activeTab === 'buy' ? (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-center">Buy Cryptocurrency</h2>
                <p className="mb-4 text-center">Purchase crypto directly with your credit card or bank account.</p>
                <MoonPayBuyWidget
                  variant="embedded"
                  baseCurrencyCode="usd"
                  baseCurrencyAmount="100"
                  defaultCurrencyCode="eth"
                  visible={widgetVisible}
                />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-center">Sell Cryptocurrency</h2>
                <p className="mb-4 text-center">Convert your crypto to fiat currency and withdraw to your bank account.</p>
                <MoonPaySellWidget
                  variant="embedded"
                  baseCurrencyCode="eth"
                  baseCurrencyAmount="0.1"
                  quoteCurrencyCode="usd"
                  visible={widgetVisible}
                />
              </>
            )}
            
            <div className="flex justify-center mt-6">
              <button 
                onClick={() => setWidgetVisible(!widgetVisible)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {widgetVisible ? 'Hide Widget' : 'Show Widget'}
              </button>
            </div>
          </div>
          
          <div className="bg-black/30 p-4 rounded-lg border border-white/20">
            <h3 className="text-lg font-semibold mb-2">Why use MoonPay?</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>Instant purchases with credit/debit cards</li>
              <li>Secure and regulated service</li>
              <li>Supports multiple cryptocurrencies</li>
              <li>Available in many countries worldwide</li>
              <li>User-friendly interface</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}