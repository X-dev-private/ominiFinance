import React, { useState, useEffect } from 'react';
import Footer from "../libs/footer";
import Header from "../libs/header";
import { StargateClient } from "@cosmjs/stargate";
import { 
  AssetsService, 
  SUPPORTED_CHAINS,
  TokenInfo,
  Balance
} from "../services/assetsService";

declare global {
  interface Window {
    keplr?: any;
    getOfflineSigner?: any;
  }
}

const Actives: React.FC = () => {
  const [keplrBalances, setKeplrBalances] = useState<Balance[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [activeChain, setActiveChain] = useState<string>("cosmoshub-4");
  const [tokenMetadata, setTokenMetadata] = useState<TokenInfo[]>([]);

  useEffect(() => {
    setTokenMetadata(AssetsService.getAllTokenMetadata());
  }, []);

  const fetchKeplrBalances = async () => {
    if (!window.keplr) return;

    setIsLoadingBalances(true);
    try {
      const chainInfo = SUPPORTED_CHAINS.find(c => c.id === activeChain);
      if (!chainInfo) throw new Error("Chain não suportada");
      
      await window.keplr.enable(activeChain);
      const offlineSigner = window.keplr.getOfflineSigner(activeChain);
      const accounts = await offlineSigner.getAccounts();
      const userAddress = accounts[0].address;

      const client = await StargateClient.connect(chainInfo.rpc);
      const balances = await client.getAllBalances(userAddress);

      AssetsService.setBalances(activeChain, balances);
      setKeplrBalances(balances);
    } catch (error) {
      console.error("Erro ao buscar saldos:", error);
    } finally {
      setIsLoadingBalances(false);
    }
  };

  const findTokenInfo = (denom: string): TokenInfo | undefined => {
    return AssetsService.findTokenInfo(denom, activeChain);
  };

  useEffect(() => {
    if (window.keplr) {
      fetchKeplrBalances();
    }
  }, [activeChain]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 font-sans">Seus Ativos</h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Visualização completa dos seus tokens na rede {SUPPORTED_CHAINS.find(c => c.id === activeChain)?.name}
            </p>
          </div>

          {/* Seletor de Rede */}
          <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                  Selecione a Rede
                </label>
                <div className="relative">
                  <select
                    value={activeChain}
                    onChange={(e) => setActiveChain(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-3.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base appearance-none"
                  >
                    {SUPPORTED_CHAINS.map((chain) => (
                      <option key={chain.id} value={chain.id} className="bg-gray-800">
                        {chain.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <button
                onClick={fetchKeplrBalances}
                disabled={isLoadingBalances}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 self-end md:self-auto flex items-center justify-center min-w-[180px]"
              >
                {isLoadingBalances ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Atualizando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Atualizar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lista de Tokens */}
          <div className="space-y-6">
            {isLoadingBalances ? (
              <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800 shadow-lg">
                <div className="inline-flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="text-gray-300">Carregando seus ativos...</span>
                </div>
              </div>
            ) : keplrBalances.length > 0 ? (
              <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-lg">
                <div className="grid grid-cols-12 bg-gray-800 p-5 font-medium text-gray-300 text-sm uppercase tracking-wider">
                  <div className="col-span-6">Ativo</div>
                  <div className="col-span-3 text-right">Saldo</div>
                  <div className="col-span-3 text-right">Ações</div>
                </div>
                <div className="divide-y divide-gray-800">
                  {keplrBalances.map((balance, index) => {
                    const { amount, denom } = AssetsService.formatBalance(balance.amount, balance.denom);
                    const token = findTokenInfo(balance.denom);
                    const hasBalance = parseFloat(amount) > 0;
                    
                    return (
                      <div 
                        key={index} 
                        className={`grid grid-cols-12 items-center p-5 hover:bg-gray-850 transition-colors duration-200 ${
                          hasBalance ? 'bg-gray-850' : ''
                        }`}
                      >
                        <div className="col-span-6 flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center ${
                            hasBalance ? 'ring-2 ring-blue-500/30' : 'opacity-70'
                          }`}>
                            <img 
                              src={token.icon} 
                              alt={token.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png';
                              }}
                            />
                          </div>
                          <div>
                            <h3 className={`text-lg font-medium ${hasBalance ? 'text-white' : 'text-gray-400'}`}>
                              {token.name}
                            </h3>
                            <span className={`text-sm ${hasBalance ? 'text-gray-300' : 'text-gray-500'}`}>
                              {token.symbol}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-3 text-right">
                          <p className={`text-lg font-mono ${hasBalance ? 'text-white' : 'text-gray-500'}`}>
                            {amount}
                          </p>
                          <p className="text-xs text-gray-500">{denom}</p>
                        </div>
                        <div className="col-span-3 flex justify-end space-x-2">
                          <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              hasBalance 
                                ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                            }`}
                            disabled={!hasBalance}
                          >
                            Enviar
                          </button>
                          <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              hasBalance 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={!hasBalance}
                          >
                            Receber
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800 shadow-lg">
                <svg className="mx-auto h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-medium text-gray-300">Nenhum ativo encontrado</h3>
                <p className="mt-2 text-gray-500">Sua carteira não possui tokens nesta rede</p>
              </div>
            )}
          </div>

          {/* Tokens Principais */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Tokens Principais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {AssetsService.getTokensByChain(activeChain).map((token) => {
                const userBalance = keplrBalances.find(b => {
                  const denom = b.denom.startsWith('u') ? b.denom.slice(1).toUpperCase() : b.denom;
                  return denom === token.symbol;
                });
                
                const formattedBalance = userBalance 
                  ? AssetsService.formatBalance(userBalance.amount, userBalance.denom)
                  : { amount: '0', denom: token.symbol };

                const hasBalance = parseFloat(formattedBalance.amount) > 0;

                return (
                  <div 
                    key={token.id} 
                    className={`bg-gray-900 rounded-2xl p-5 hover:bg-gray-850 transition-all duration-200 border border-gray-800 shadow-lg hover:shadow-xl ${
                      hasBalance ? 'ring-1 ring-blue-500/30' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center ${
                        hasBalance ? 'ring-2 ring-blue-500/30' : 'opacity-70'
                      }`}>
                        <img 
                          src={token.icon} 
                          alt={token.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-lg">{token.name}</h3>
                        <p className="text-sm text-gray-400">{token.symbol}</p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <p className="text-sm text-gray-500">Saldo disponível</p>
                      <p className={`font-mono text-xl mt-1 ${
                        hasBalance ? 'text-white' : 'text-gray-500'
                      }`}>
                        {formattedBalance.amount} {formattedBalance.denom}
                      </p>
                    </div>
                    {hasBalance && (
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded-lg border border-gray-700 transition-colors duration-200">
                          Enviar
                        </button>
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg transition-colors duration-200">
                          Receber
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Actives;