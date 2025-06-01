import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const getCryptoPrices = async () => {
  const response = await axios.get(
    `${COINGECKO_API}/simple/price?ids=osmosis,cosmos,usd-coin,tether,sei-network,kujira,terra-luna,picasso,stride,stargaze&vs_currencies=usd&include_24hr_change=true`
  );
  return response.data;
};