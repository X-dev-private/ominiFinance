import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const getCryptoPrices = async () => {
  const response = await axios.get(
    `${COINGECKO_API}/simple/price?ids=cosmos,osmosis,injective-protocol,thorchain,kava,fetch-ai,secret,akash-network,persistence,axelar,neutron-3&vs_currencies=usd&include_24hr_change=true`
  );
  return response.data;
};