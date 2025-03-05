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
    liquidityPool: "0x48b7Fd2EbF4b5697BD7EC66Ae676b6C14150E91e",
  }
} as const;

// Obtém os possíveis ChainIds dinamicamente
export type ChainId = keyof typeof TOKEN_ADDRESSES;

// Obtém os possíveis símbolos de tokens dinamicamente
export type TokenType<T extends ChainId> = keyof typeof TOKEN_ADDRESSES[T];
