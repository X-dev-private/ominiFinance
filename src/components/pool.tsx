const LiquidityPoolTable = () => {
    const pools = [
      {
        name: 'AMOs-AnaJu/sUSD',
        type: 'Basic Stable',
        fee: '0.05%',
        volume: '~$519,614.83',
        fees: '~$259.8',
        TVL: '~$5,263,647.92',
        apr: '16.67%',
      },
      {
        name: 'aAMM-USDC/VELO',
        type: 'Basic Volatile',
        fee: '0.9%',
        volume: '~$1,266,365.43',
        fees: '~$11,397.28',
        TVL: '~$4,940,968.56',
        apr: '46.77%',
      },
      {
        name: 'sAMM-ETH/USDC',
        type: 'Basic Stable',
        fee: '0.07%',
        volume: '~$750,125.30',
        fees: '~$525.09',
        TVL: '~$6,120,456.89',
        apr: '18.32%',
      },
      {
        name: 'aAMM-BTC/VELO',
        type: 'Basic Volatile',
        fee: '1.1%',
        volume: '~$1,890,743.21',
        fees: '~$20,798.17',
        TVL: '~$5,678,903.22',
        apr: '52.14%',
      },
      {
        name: 'sAMM-DAI/USDC',
        type: 'Basic Stable',
        fee: '0.03%',
        volume: '~$620,890.47',
        fees: '~$186.27',
        TVL: '~$4,389,234.12',
        apr: '14.75%',
      }
    ];
  
    return (
      <div className="px-10 py-12 w-9/10 mx-auto">
        <div className="space-y-6">
          {pools.map((pool, index) => (
            <div key={index} className="rounded-2xl border border-green-300 shadow-md p-6 bg-white">
              <div className="flex items-center mb-4">
                <span className="mr-2">🟩</span>
                <span className="font-bold text-green-700">{pool.name}</span>
                <span className="text-green-500 ml-2">({pool.type})</span>
              </div>
              <div className="grid grid-cols-5 gap-4 text-center">
                <div>
                  <span className="block text-gray-600">Volume</span>
                  <span className="font-semibold">{pool.volume}</span>
                </div>
                <div>
                  <span className="block text-gray-600">Fees</span>
                  <span className="font-semibold">{pool.fees}</span>
                </div>
                <div>
                  <span className="block text-gray-600">TVL</span>
                  <span className="font-semibold">{pool.TVL}</span>
                </div>
                <div>
                  <span className="block text-gray-600">APR</span>
                  <span className="font-semibold">{pool.apr}</span>
                </div>
                <div>
                  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Deposit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default LiquidityPoolTable;
  