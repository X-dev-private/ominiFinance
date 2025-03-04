import { ethers } from "ethers";
import { TOKEN_ADDRESSES } from "./useTokenBalances";

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address recipient, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

export const executeSwap = async (
  fromToken: string,
  toToken: string,
  amount: string,
  signer: ethers.Signer,
  chainId: number
) => {
  const tokenAddress = TOKEN_ADDRESSES[chainId][fromToken as keyof typeof TOKEN_ADDRESSES[number]];
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

  // 1. Aprovar o gasto
  const approveTx = await tokenContract.approve(
    TOKEN_ADDRESSES[chainId].usdcof, // Endereço do contrato de swap
    ethers.parseUnits(amount, 18)
  );
  await approveTx.wait();

  // 2. Executar a transferência com taxa
  const swapTx = await tokenContract.transfer(
    await signer.getAddress(),
    ethers.parseUnits(amount, 18)
  );
  await swapTx.wait();
};