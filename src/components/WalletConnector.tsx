import { useState, useEffect } from 'react';
import { useWallet, WalletConnectButton } from '@sei-js/react';
import { SigningStargateClient } from '@cosmjs/stargate';

export const WalletConnector = () => {
  const { connectedWallet } = useWallet();
  const [balance, setBalance] = useState('0.00');
  const [chainInfo, setChainInfo] = useState({
    name: 'Cosmos Hub',
    symbol: 'ATOM',
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png',
  });

  const CHAIN_RPC = 'https://rpc.cosmos.network'; // RPC oficial do Cosmos Hub
  const DENOM = 'uatom'; // Denominação base do token ATOM
  const DECIMALS = 6; // Casas decimais do ATOM

  const address = connectedWallet?.accounts?.[0]?.address;

  const shortenAddress = (addr) => 
    addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : '';

  const fetchBalance = async () => {
    if (!address) return;

    try {
      // Conectar ao nó RPC do Cosmos Hub
      const client = await SigningStargateClient.connect(CHAIN_RPC);
      const balanceResponse = await client.getBalance(address, DENOM);

      const formattedBalance = (Number(balanceResponse.amount) / 10 ** DECIMALS).toFixed(2);
      setBalance(formattedBalance);
    } catch (error) {
      console.error('Erro ao buscar saldo:', error);
      setBalance('0.00');
    }
  };

  useEffect(() => {
    if (connectedWallet) fetchBalance();
  }, [connectedWallet, address]);

  return (
    <div className="font-sans p-3 bg-white/95 backdrop-blur-md rounded-lg shadow-sm border border-gray-100 mt-4">
      {!connectedWallet ? (
        <WalletConnectButton 
          buttonClassName="w-full py-2.5 px-5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg 
            hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-indigo-200"
        />
      ) : (
        <div className="flex items-center justify-between gap-3">
          {/* Left Side - Logo e Saldo */}
          <div className="flex items-center gap-2 flex-1">
            <img 
              src={chainInfo.icon} 
              alt={chainInfo.name} 
              className="w-5 h-5 rounded-full object-contain"
            />
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold text-gray-900">
                {balance}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {chainInfo.symbol}
              </span>
            </div>
          </div>
  
          {/* Right Side - Endereço Reduzido */}
          <WalletConnectButton 
            buttonClassName="py-1 px-2.5 text-xs text-gray-500 font-medium bg-gray-100/50 hover:bg-gray-200/60 
              rounded-md transition-colors duration-150 border border-gray-200/60 font-mono tracking-tight"
            label={address ? `${address.slice(0, 3)}...${address.slice(-2)}` : '...'}
          />
        </div>
      )}
    </div>
  );
};
