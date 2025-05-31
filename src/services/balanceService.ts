import { Wallet } from '@keplr-wallet/types';

export class BalanceService {
  static async getUserBalances(walletAddress: string): Promise<Array<{
    denom: string;
    amount: number;
  }>> {
    if (!window.keplr) {
      throw new Error('Keplr extension not found');
    }

    try {
      const keplr = window.keplr as Wallet;
      const balances = await keplr.getBalances(walletAddress);
      
      return balances.map(b => ({
        denom: b.denom,
        amount: parseFloat(b.amount),
      }));
    } catch (error) {
      console.error('Error fetching balances:', error);
      throw new Error('Failed to fetch balances');
    }
  }
}