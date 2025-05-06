import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const getCryptoPrices = async () => {
  const response = await axios.get(
    `${COINGECKO_API}/simple/price?ids=bitcoin,ethereum,cosmos,osmosis,solana,binancecoin,cardano,ripple,polkadot,dogecoin,avalanche-2,polygon-pos,usd-coin&vs_currencies=usd&include_24hr_change=true`
  );
  return response.data;
};