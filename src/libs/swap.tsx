import { useState } from 'react';
import { useAccount, useBalance, useToken } from 'wagmi';
import { ethers } from 'ethers';

const TokenSwap = () => {
    const [amount, setAmount] = useState<string>('0');
    const [fromToken, setFromToken] = useState<string>('ETH');
    const [toToken, setToToken] = useState<string>('ETH');
    
    const { address } = useAccount();
    const { data: fromBalance } = useBalance({ address });
    const { data: toBalance } = useBalance({ address });

    // Função para formatar o saldo com 8 casas decimais
    const formatBalance = (balance?: string) => {
        return balance ? parseFloat(balance).toFixed(8) : '0.00000000';
    };

    // Aqui, você integraria uma lógica de swap usando um contrato de swap, como Uniswap, se necessário
    const handleSwap = async () => {
        // Lógica de swap usando o contrato da exchange (por exemplo, Uniswap)
        console.log(`Swap ${amount} ${fromToken} to ${toToken}`);
        // Exemplo de chamada à função de swap do contrato (substitua com o contrato real)
    };

    return (
        <div className="flex flex-col md:flex-row justify-center items-center p-8 rounded-lg shadow-lg">
            <section className=" w-xl p-6 rounded-lg relative">
                <div className="relative z-10 mb-12">
                    <label className="block text-green-800">From</label>
                    <div className="flex items-center justify-between border rounded-md border-gray-300 p-2 bg-white">
                        <select
                            className="bg-transparent focus:outline-none cursor-pointer"
                            value={fromToken}
                            onChange={(e) => setFromToken(e.target.value)}
                        >
                            <option value="ETH">ETH</option>
                            <option value="DAI">DAI</option> {/* Adicione mais tokens aqui */}
                        </select>
                        <input
                            className="w-full text-right"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <span className="flex items-center">Balance: {formatBalance(fromBalance?.formatted)} ETH</span>
                    </div>
                </div>
                <div className="relative z-10 mt-12">
                    <label className="block text-green-800">To</label>
                    <div className="flex items-center justify-between border rounded-md border-gray-300 p-2 bg-white">
                        <select
                            className="bg-transparent focus:outline-none cursor-pointer"
                            value={toToken}
                            onChange={(e) => setToToken(e.target.value)}
                        >
                            <option value="ETH">ETH</option>
                            <option value="DAI">DAI</option> {/* Adicione mais tokens aqui */}
                        </select>
                        <input className="w-full text-right" type="number" value="0" readOnly />
                        <span className="flex items-center">Balance: {formatBalance(toBalance?.formatted)} ETH</span>
                    </div>
                </div>
            </section>
            <div className="bg-white md:w-1/3 p-6 rounded-lg shadow-md md:ml-8">
                <h2 className="text-lg font-semibold">Swap</h2>
                <ol className="list-decimal list-inside mt-4">
                    <li>Choose the token you want to swap</li>
                    <li>Select the token you want to receive</li>
                    <li>The quote will be ready in a moment!</li>
                </ol>
                <button
                    className="mt-8 w-full bg-green-600 text-white px-4 py-2 rounded-md"
                    onClick={handleSwap}
                >
                    Swap Tokens
                </button>
            </div>
        </div>
    );
};

export default TokenSwap;
