export const TOKEN_ADDRESSES = {
  11155111: {
    anjux: "0x6c3aaaA93CC59f5A4288465F073C2B94DDBD3a05",
    ethof: "0x1429c6F2Be05EFF1fB07F52D9D4880a108153dD4",
    usdcof: "0x32c00bD194B3ea78B9799394984DF8dB7397B834",
  },
  57054: {
    anjux: "0x0c5aAE3d2166F20995f63F48b897E425a804CaDD",
    ethof: "0x15F3DF98AC835D5661F791D8877C2cD7f6A4B876",
    usdcof: "0x911aE2B3C1D6Fe71C6B19938922faa8AbDdc035c",
    liquidityPools: {
      "anjux-usdcof": "0x410A0f23D04d270580f14f6eF7c08849043255A1",
      "anjux-ethof": "0x884aE5072b53B06cfBE043a53D9bee5E43Cc38F1",
      "ethof-usdcof": "0x48b7Fd2EbF4b5697BD7EC66Ae676b6C14150E91e",
    },
  },
} as const;

// Obtém os possíveis ChainIds dinamicamente
export type ChainId = keyof typeof TOKEN_ADDRESSES;

// Obtém os possíveis símbolos de tokens dinamicamente
export type TokenType<T extends ChainId> = keyof Omit<typeof TOKEN_ADDRESSES[T], "liquidityPools">;

// Obtém os pares de pools dinamicamente
export type LiquidityPoolType<T extends ChainId> = keyof typeof TOKEN_ADDRESSES[T]["liquidityPools"];

/**
 * Obtém os endereços dos tokens com base nos parâmetros.
 * @param chainId O ID da rede
 * @param fromToken O token de origem
 * @param toToken O token de destino
 * @returns Um objeto contendo os endereços dos tokens e o endereço da pool (se existir)
 */
export function getTokenAndPoolAddresses<T extends ChainId>(
  chainId: T,
  fromToken: TokenType<T>,
  toToken: TokenType<T>
) {
  const chainData = TOKEN_ADDRESSES[chainId];
  if (!chainData) throw new Error(`ChainId ${chainId} não suportado.`);

  const fromAddress = chainData[fromToken];
  const toAddress = chainData[toToken];

  if (!fromAddress || !toAddress) {
    throw new Error(`Um dos tokens não foi encontrado na chain ${chainId}`);
  }

  // Criando a chave do pool ordenada para garantir consistência
  const poolKey1 = `${fromToken}-${toToken}`;
  const poolKey2 = `${toToken}-${fromToken}`;
  const poolAddress =
    chainData.liquidityPools[poolKey1] || chainData.liquidityPools[poolKey2] || null;

  return { fromAddress, toAddress, poolAddress };
}

// Exemplo de uso:
const chainId: ChainId = 57054;
const fromToken: TokenType<typeof chainId> = "anjux";
const toToken: TokenType<typeof chainId> = "usdcof";

const { fromAddress, toAddress, poolAddress } = getTokenAndPoolAddresses(chainId, fromToken, toToken);
console.log("From:", fromAddress);
console.log("To:", toAddress);
console.log("Pool:", poolAddress);
