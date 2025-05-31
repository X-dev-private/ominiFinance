import axios, { AxiosResponse } from 'axios';

export interface HistoricalBalance {
  date: string;       
  value: number;     
}

// Configuração da API CoinStats
const COINSTATS_API_KEY = '/ELAG80PkEla0pvLX+B5k3AU4ooow9NSHZNUP6WkUKc=';
const COINSTATS_BASE_URL = 'https://api.coinstats.app/public/v1';

export class WalletHistoryService {
  /**
   * Busca histórico formatado para o componente
   * @param walletAddress Endereço da carteira (ex: cosmos1...)
   * @param asset Ativo principal (ex: "cosmos" para ATOM)
   * @param days Número de dias (7, 30 ou 90)
   */
  static async getHistoricalBalances(
    walletAddress: string,
    asset: string = 'cosmos',
    days: number = 30
  ): Promise<HistoricalBalance[]> {
    try {
      const priceResponse = await this.fetchPriceHistory(asset, days);
      const transactions = await this.fetchWalletTransactions(walletAddress);
      
      return priceResponse.data.map((dayData: any) => ({
        date: new Date(dayData[0]).toISOString().split('T')[0],
        value: this.calculatePortfolioValue(dayData, transactions)
      }));
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw new Error('Falha ao carregar dados históricos');
    }
  }

  private static async fetchPriceHistory(
    asset: string,
    days: number
  ): Promise<AxiosResponse> {
    return axios.get(`${COINSTATS_BASE_URL}/coins/${asset}/charts`, {
      params: {
        period: days,
        currency: 'USD'
      },
      headers: {
        'X-API-KEY': COINSTATS_API_KEY
      }
    });
  }

  private static calculatePortfolioValue(
    dayData: [number, number],
    transactions: { date: Date; amount: number }[]
  ): number {
    const dayTimestamp = dayData[0];
    const dayPrice = dayData[1];
    
    return transactions
      .filter(tx => tx.date.getTime() <= dayTimestamp)
      .reduce((sum, tx) => sum + tx.amount, 0) * dayPrice;
  }

  private static async fetchWalletTransactions(
    walletAddress: string
  ): Promise<{ date: Date; amount: number }[]> {
    return [
      { date: new Date('2024-01-01'), amount: 100 },
      { date: new Date('2024-01-15'), amount: 50 },
    ];
  }
}