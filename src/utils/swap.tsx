import { ethers } from 'ethers';
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core';
import { Pool, Route, Trade } from '@uniswap/v3-sdk';
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { abi as SwapRouterABI } from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json';

const INFURA_URL = `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`;
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY!;

const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const tokenAddresses = {
  // Adicione os endereços dos tokens aqui
  TOKENA: '0x1429c6F2Be05EFF1fB07F52D9D4880a108153dD4',
  TOKENB: '0x32c00bD194B3ea78B9799394984DF8dB7397B834',
  TOKENC: '0x6c3aaaA93CC59f5A4288465F073C2B94DDBD3a05',
};

const tokens = {
  TOKENA: new Token(1, tokenAddresses.TOKENA, 18, 'ETHoF', 'Etherium Test'),
  TOKENB: new Token(1, tokenAddresses.TOKENB, 18, 'USDCoF', 'USDC Test'),
  TOKENC: new Token(1, tokenAddresses.TOKENC, 18, 'AnJuX', 'AnJuX'),
};

const UNISWAP_ROUTER_ADDRESS = '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad';

export async function executeSwap(fromTokenName: string, toTokenName: string, amountIn: string) {
  try {
    const tokenIn = tokens[fromTokenName];
    const tokenOut = tokens[toTokenName];

    if (!tokenIn || !tokenOut) {
      throw new Error('Token inválido');
    }

    // Endereço do contrato do pool
    let poolAddress: string;
    if (tokenIn === tokens.TOKENA && tokenOut === tokens.TOKENC) {
      poolAddress = '0x7c6aB52B22deE1E5593600545104e4bD31381eaC';
    } else {
      throw new Error('Combinação de tokens não suportada');
    }

    const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider);

    // Obter dados do pool
    const state = await poolContract.slot0();
    const liquidity = await poolContract.liquidity();

    // Criar instância do pool
    const pool = new Pool(
      tokenIn,
      tokenOut,
      3000, // Fee do pool (verificar na Uniswap)
      state.sqrtPriceX96.toString(),
      liquidity.toString(),
      state.tick
    );

    // Definir quantidade a ser trocada
    const amountInCurrency = CurrencyAmount.fromRawAmount(tokenIn, amountIn);

    // Criar rota e trade
    const route = new Route([pool], tokenIn, tokenOut);
    const trade = new Trade(route, amountInCurrency, TradeType.EXACT_INPUT);

    // Definir slippage tolerance
    const slippageTolerance = new Percent('50', '10000'); // 0.50%
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).toExact();

    // Configurar os parâmetros da transação
    const swapRouterContract = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, SwapRouterABI, wallet);

    const params = {
      tokenIn: tokenIn.address,
      tokenOut: tokenOut.address,
      fee: 3000, // Fee do pool
      recipient: wallet.address,
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutos
      amountIn: amountIn,
      amountOutMinimum: ethers.utils.parseUnits(amountOutMin, tokenOut.decimals).toString(),
      sqrtPriceLimitX96: 0,
    };

    // Criar transação
    const tx = await swapRouterContract.connect(wallet).exactInputSingle(params);
    console.log('Transação enviada:', tx.hash);

    // Aguardar confirmação
    const receipt = await tx.wait();
    console.log('Transação confirmada:', receipt.transactionHash);
  } catch (error) {
    console.error('Erro ao realizar swap:', error);
    throw error;
  }
}
