import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const getCryptoPrices = async () => {
  const response = await axios.get(
    `${COINGECKO_API}/simple/price?ids=bitcoin,ethereum,cosmos,osmosis,solana,binancecoin,cardano,ripple,polkadot,dogecoin,avalanche-2,polygon-pos,usd-coin,` +
    `fetch-ai,injective-protocol,thorchain,terra-luna-2,akash-network,persistence,kava,secret,stargaze,comdex,evmos,agoric,juno-network,umee,axelar,` +
    `stafi,regen,desmos,likecoin,bitcanna,cheqd,konstellation,rizon,medibloc,sentinel,vidulum,dig-chain,gravity-bridge,assetmantle,` +
    `decentr,band-protocol,cerberus-2,chihuahua-chain,iris-network,ki-chain,lum-network,provenance,quicksilver,sifchain,` +
    `starname,teritori,odin-protocol,planq,shareledger,stride,terp-network,tgrade,white-whale&vs_currencies=usd&include_24hr_change=true`
  );
  return response.data;
};