import { ethers } from 'ethers';
import { tokenAddresses, UNISWAP_ROUTER_ADDRESS } from '../config/tokens';

export const handleSwap = async (
    address: string | undefined,
    amount: string,
    fromToken: string,
    toToken: string,
    signer: ethers.Signer
) => {
    if (!address || parseFloat(amount) <= 0) {
        console.log("Erro: Endereço inválido ou quantidade inválida.");
        return;
    }

    try {
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
