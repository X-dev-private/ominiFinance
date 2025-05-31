import React, { createContext, useContext, useEffect, useState } from 'react';
import { SigningStargateClient } from '@cosmjs/stargate';
import { Window as KeplrWindow } from '@keplr-wallet/types';

declare global {
  interface Window extends KeplrWindow {}
}

interface WalletContextType {
  address: string;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  signClient: SigningStargateClient | null;
}

const WalletContext = createContext<WalletContextType>({
  address: '',
  isConnected: false,
  connectWallet: async () => {},
  signClient: null,
});

export const WalletProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [address, setAddress] = useState('');
  const [signClient, setSignClient] = useState<SigningStargateClient | null>(null);

  const connectWallet = async () => {
    if (!window.keplr) {
      throw new Error('Please install Keplr extension');
    }

    await window.keplr.enable('cosmoshub-4');
    const offlineSigner = window.keplr.getOfflineSigner('cosmoshub-4');
    const accounts = await offlineSigner.getAccounts();
    const client = await SigningStargateClient.connectWithSigner(
      'https://rpc.cosmos.network',
      offlineSigner
    );

    setAddress(accounts[0].address);
    setSignClient(client);
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        connectWallet,
        signClient,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);