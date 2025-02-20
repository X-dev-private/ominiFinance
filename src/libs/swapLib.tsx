import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ethers } from 'ethers';

import { handleSwap as externalSwapHandler } from '../utils/swap';  // Renomeado para evitar conflito
import { tokenAddresses, UNISWAP_ROUTER_ADDRESS } from '../config/tokens';

const TokenSwap = () => {
    const [amount, setAmount] = useState<string>('0');
    const [fromToken, setFromToken] = useState<string>('ETH');
    const [toToken, setToToken] = useState<string>('DAI');

    const { address } = useAccount();
    const { data: fromBalance } = useBalance({ address });
    const { data: toBalance } = useBalance({ address });

    const formatBalance = (balance?: string) => {
        return balance ? parseFloat(balance).toFixed(8) : '0.00000000';
    };

    const handleSwap = async () => {
        if (!address || parseFloat(amount) <= 0) {
            console.log("Erro: Endereço inválido ou quantidade inválida.");
            return;
        }

        if (!tokenAddresses[fromToken] || !tokenAddresses[toToken]) {
            console.log("Erro: Token inválido.");
            return;
        }

        // Verifica se a carteira está disponível
        const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;
        if (!provider) {
            console.log("Erro: Nenhuma carteira encontrada.");
            return;
        }

        try {
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                UNISWAP_ROUTER_ADDRESS,
                ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable'],
                signer
            );

            const path = [tokenAddresses[fromToken], tokenAddresses[toToken]];
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutos

            const tx = await contract.swapExactETHForTokens(
                0, // Aceitar qualquer quantidade mínima
                path,
                address,
                deadline,
                { value: ethers.parseEther(amount) }
            );

            await tx.wait();
            console.log("Swap realizado com sucesso!");
        } catch (error) {
            console.error("Erro ao realizar swap:", error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-center items-center p-8 rounded-lg shadow-lg">
            <section className="w-xl p-6 rounded-lg relative">
                <div className="relative z-10 mb-12">
                    <label className="block text-green-800 font-semibold">From</label>
                    <div className="flex items-center justify-between border border-green-600 rounded-2xl p-2 bg-white">
                        <select
                            className="bg-white text-green-800 font-semibold px-2 py-1 rounded-2xl border border-green-600 focus:outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:rounded-3xl"
                            value={fromToken}
                            onChange={(e) => setFromToken(e.target.value)}
                        >
                            {Object.keys(tokenAddresses).map((token) => (
                                <option key={token} value={token} className="bg-white text-green-800">
                                    {token}
                                </option>
                            ))}
                        </select>
                        <input
                            className="w-full text-right focus:outline-none"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <span className="flex items-center text-green-600">Balance: {formatBalance(fromBalance?.formatted)} {fromToken}</span>
                    </div>
                </div>
                <div className="relative z-10 mt-12">
                    <label className="block text-green-800 font-semibold">To</label>
                    <div className="flex items-center justify-between border border-green-600 rounded-2xl p-2 bg-white">
                        <select
                            className="bg-white text-green-800 font-semibold px-2 py-1 rounded-2xl border border-green-600 focus:outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:rounded-3xl"
                            value={toToken}
                            onChange={(e) => setToToken(e.target.value)}
                        >
                            {Object.keys(tokenAddresses).map((token) => (
                                <option key={token} value={token} className="bg-white text-green-800">
                                    {token}
                                </option>
                            ))}
                        </select>
                        <input className="w-full text-right focus:outline-none" type="number" value="0" readOnly />
                        <span className="flex items-center text-green-600">Balance: {formatBalance(toBalance?.formatted)} {toToken}</span>
                    </div>
                </div>
            </section>
            <div className="bg-white md:w-1/3 p-6 rounded-lg shadow-md md:ml-8">
                <h2 className="text-lg font-semibold">Swap</h2>
                <ol className="list-decimal list-inside mt-4">
                    <li>Escolha o token que deseja trocar</li>
                    <li>Selecione o token que deseja receber</li>
                    <li>A cotação estará pronta em instantes!</li>
                </ol>
                <button
                    className="mt-8 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    onClick={handleSwap}
                >
                    Swap Tokens
                </button>
            </div>
        </div>
    );
};

export default TokenSwap;
