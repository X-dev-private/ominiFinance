import React, { useState, useEffect } from 'react';
import Footer from "../libs/footer";
import Header from "../libs/header";
import { StargateClient } from "@cosmjs/stargate";

declare global {
  interface Window {
    keplr?: any;
    getOfflineSigner?: any;
  }
}

interface Balance {
  denom: string;
  amount: string;
}

interface TokenInfo {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  chain: string;
}

const Actives: React.FC = () => {
  const [keplrBalances, setKeplrBalances] = useState<Balance[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [activeChain, setActiveChain] = useState<string>("cosmoshub-4");
  const [tokenMetadata, setTokenMetadata] = useState<TokenInfo[]>([]);

  // Chains suportadas
  const SUPPORTED_CHAINS = [
    { id: "cosmoshub-4", name: "Cosmos Hub", rpc: "https://rpc.cosmos.network" },
    { id: "osmosis-1", name: "Osmosis", rpc: "https://rpc.osmosis.zone" },
    { id: "juno-1", name: "Juno", rpc: "https://rpc-juno.itastakers.com" },
    { id: "secret-4", name: "Secret Network", rpc: "https://rpc.secret.express" }
  ];

  // Metadados dos tokens principais
  const CORE_TOKENS: TokenInfo[] = [
    {
      id: 'cosmos',
      name: 'Cosmos',
      symbol: 'ATOM',
      icon: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png?1555657960',
      chain: 'cosmoshub-4'
    },
    {
      id: 'osmosis',
      name: 'Osmosis',
      symbol: 'OSMO',
      icon: 'https://assets.coingecko.com/coins/images/16724/large/osmo.png?1632763885',
      chain: 'osmosis-1'
    },
    {
      id: 'juno-network',
      name: 'Juno',
      symbol: 'JUNO',
      icon: 'https://assets.coingecko.com/coins/images/19249/large/juno.png?1642838082',
      chain: 'juno-1'
    },
    {
      id: 'secret',
      name: 'Secret',
      symbol: 'SCRT',
      icon: 'https://assets.coingecko.com/coins/images/11871/large/Secret.png?1595520186',
      chain: 'secret-4'
    }
  ];

  // Carrega metadados dos tokens
  useEffect(() => {
    setTokenMetadata(CORE_TOKENS);
  }, []);

  // Função para obter saldos da Keplr
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

      setKeplrBalances(balances);
    } catch (error) {
      console.error("Erro ao buscar saldos:", error);
    } finally {
      setIsLoadingBalances(false);
    }
  };

  // Formata os saldos
  const formatBalance = (amount: string, denom: string) => {
    if (denom.startsWith("u")) {
      const displayDenom = denom.slice(1).toUpperCase();
      const displayAmount = (parseInt(amount) / 1e6).toFixed(6);
      return { amount: displayAmount, denom: displayDenom };
    }
    return { amount, denom };
  };

  // Encontra o token pelo denom
  const findTokenInfo = (denom: string): TokenInfo | undefined => {
    const symbol = denom.startsWith('u') ? denom.slice(1).toUpperCase() : denom;
    return tokenMetadata.find(token => 
      token.symbol === symbol && token.chain === activeChain
    ) || {
      id: denom,
      name: denom,
      symbol: denom,
      icon: 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png',
      chain: activeChain
    };
  };

  // Busca automaticamente os saldos quando a chain muda
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
            <h1 className="text-5xl font-bold text-white mb-4 font-sans">Seus Ativos</h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Visualização completa dos seus tokens na rede {SUPPORTED_CHAINS.find(c => c.id === activeChain)?.name}
            </p>
          </div>

          {/* Seletor de Rede */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  SELECIONE A REDE
                </label>
                <select
                  value={activeChain}
                  onChange={(e) => setActiveChain(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-white/30 focus:border-transparent text-lg"
                >
                  {SUPPORTED_CHAINS.map((chain) => (
                    <option key={chain.id} value={chain.id} className="bg-gray-800">
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={fetchKeplrBalances}
                disabled={isLoadingBalances}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 self-end md:self-auto flex items-center justify-center min-w-[180px]"
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
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  <span className="text-white/80">Carregando seus ativos...</span>
                </div>
              </div>
            ) : keplrBalances.length > 0 ? (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10">
                <div className="grid grid-cols-12 bg-white/10 p-5 font-medium text-white/80 text-sm">
                  <div className="col-span-6">ATIVO</div>
                  <div className="col-span-3 text-right">SALDO</div>
                  <div className="col-span-3 text-right">AÇÕES</div>
                </div>
                <div className="divide-y divide-white/10">
                  {keplrBalances.map((balance, index) => {
                    const { amount, denom } = formatBalance(balance.amount, balance.denom);
                    const token = findTokenInfo(balance.denom);
                    const hasBalance = parseFloat(amount) > 0;
                    
                    return (
                      <div 
                        key={index} 
                        className={`grid grid-cols-12 items-center p-5 hover:bg-white/5 transition-colors ${
                          hasBalance ? 'bg-gradient-to-r from-white/5 to-white/3' : ''
                        }`}
                      >
                        <div className="col-span-6 flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center ${
                            hasBalance ? 'ring-2 ring-white/30' : 'opacity-70'
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
                            <h3 className={`text-lg font-medium ${hasBalance ? 'text-white' : 'text-white/60'}`}>
                              {token.name}
                            </h3>
                            <span className={`text-sm ${hasBalance ? 'text-white/80' : 'text-white/40'}`}>
                              {token.symbol}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-3 text-right">
                          <p className={`text-lg font-mono ${hasBalance ? 'text-white' : 'text-white/50'}`}>
                            {amount}
                          </p>
                          <p className="text-xs text-white/40">{denom}</p>
                        </div>
                        <div className="col-span-3 flex justify-end space-x-3">
                          <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              hasBalance 
                                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                            }`}
                            disabled={!hasBalance}
                          >
                            Enviar
                          </button>
                          <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              hasBalance 
                                ? 'bg-white text-black hover:bg-white/90'
                                : 'bg-white/10 text-white/30 cursor-not-allowed'
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
              <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                <svg className="mx-auto h-16 w-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-medium text-white/80">Nenhum ativo encontrado</h3>
                <p className="mt-2 text-white/50">Sua carteira não possui tokens nesta rede</p>
              </div>
            )}
          </div>

          {/* Tokens Principais */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-6">Tokens Principais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {tokenMetadata
                .filter(token => token.chain === activeChain)
                .map((token) => {
                  const userBalance = keplrBalances.find(b => {
                    const denom = b.denom.startsWith('u') ? b.denom.slice(1).toUpperCase() : b.denom;
                    return denom === token.symbol;
                  });
                  
                  const formattedBalance = userBalance 
                    ? formatBalance(userBalance.amount, userBalance.denom)
                    : { amount: '0', denom: token.symbol };

                  const hasBalance = parseFloat(formattedBalance.amount) > 0;

                  return (
                    <div 
                      key={token.id} 
                      className={`bg-white/5 backdrop-blur-lg rounded-2xl p-5 hover:bg-white/10 transition-colors border border-white/10 ${
                        hasBalance ? 'ring-1 ring-white/20' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center ${
                          hasBalance ? 'ring-2 ring-white/30' : 'opacity-70'
                        }`}>
                          <img 
                            src={token.icon} 
                            alt={token.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-white text-lg">{token.name}</h3>
                          <p className="text-sm text-white/60">{token.symbol}</p>
                        </div>
                      </div>
                      <div className="mt-5">
                        <p className="text-sm text-white/50">Saldo disponível</p>
                        <p className={`font-mono text-xl mt-1 ${
                          hasBalance ? 'text-white' : 'text-white/40'
                        }`}>
                          {formattedBalance.amount} {formattedBalance.denom}
                        </p>
                      </div>
                      {hasBalance && (
                        <div className="mt-4 flex space-x-2">
                          <button className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg border border-white/20 transition-colors">
                            Enviar
                          </button>
                          <button className="flex-1 bg-white text-black hover:bg-white/90 text-sm py-2 px-3 rounded-lg transition-colors">
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