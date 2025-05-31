import React, { useState, useEffect } from 'react';
import Footer from "../libs/footer";
import Header from "../libs/header";
import { StargateClient } from "@cosmjs/stargate";
import { 
  AssetsService, 
  SUPPORTED_CHAINS,
  TokenInfo
} from "../services/assetsService";
import { WalletHistoryService } from "../services/WalletHistoryService";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import UserCryptoBalance from '../components/UserCryptoBalance';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

declare global {
  interface Window {
    keplr?: any;
    getOfflineSigner?: any;
  }
}

interface HistoricalBalance {
  date: string;
  value: number;
}

const Actives: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeChain, setActiveChain] = useState<string>("cosmoshub-4");
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const fetchHistoricalData = async () => {
    if (!window.keplr) return;

    setIsLoading(true);
    try {
      const chainInfo = SUPPORTED_CHAINS.find(c => c.id === activeChain);
      if (!chainInfo) throw new Error("Chain não suportada");
      
      await window.keplr.enable(activeChain);
      const offlineSigner = window.keplr.getOfflineSigner(activeChain);
      const accounts = await offlineSigner.getAccounts();
      const userAddress = accounts[0].address;

      // Substitui os dados mockados pela chamada real ao serviço
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const data = await WalletHistoryService.getHistoricalBalances(
        userAddress,
        'cosmos', // Asset padrão (ATOM)
        days
      );

      setHistoricalData(data);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      // Fallback para dados mockados em caso de erro
      setHistoricalData(getFallbackData(timeRange));
    } finally {
      setIsLoading(false);
    }
  };

  // Função de fallback caso a API falhe
  const getFallbackData = (range: string): HistoricalBalance[] => {
    const allData = [
      { date: '2023-10-01', value: 1500 },
    ];
    
    return range === '7d' 
      ? allData.slice(-2) 
      : range === '30d' 
        ? allData.slice(-4) 
        : allData;
  };

  useEffect(() => {
    if (window.keplr) {
      fetchHistoricalData();
    }
  }, [activeChain, timeRange]);

  const chartData = {
    labels: historicalData.map(item => item.date),
    datasets: [
      {
        label: 'Valor Patrimonial (USD)',
        data: historicalData.map(item => item.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 font-sans">Histórico Patrimonial</h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Evolução do valor da sua carteira na rede {SUPPORTED_CHAINS.find(c => c.id === activeChain)?.name}
            </p>
          </div>

          {/* Controles */}
          <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                  Rede
                </label>
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
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                  Período
                </label>
                <div className="flex space-x-2">
                  {['7d', '30d', '90d'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        timeRange === range 
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={fetchHistoricalData}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 self-end md:self-auto flex items-center justify-center min-w-[180px]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Atualizando...
                  </>
                ) : (
                  'Atualizar Dados'
                )}
              </button>
            </div>
          </div>

          {/* Gráfico */}
          <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800 shadow-xl">
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : historicalData.length > 0 ? (
              <div className="h-96">
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                        labels: {
                          color: '#fff'
                        }
                      },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                          label: (context) => {
                            return ` $${context.parsed.y.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#fff'
                        }
                      },
                      y: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#fff',
                          callback: (value) => `$${value}`
                        }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="mx-auto h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-xl font-medium text-gray-300">Nenhum dado histórico disponível</h3>
                <p className="mt-2 text-gray-500">Conecte sua carteira para visualizar o histórico</p>
              </div>
            )}
          </div>
            <UserCryptoBalance />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Actives;