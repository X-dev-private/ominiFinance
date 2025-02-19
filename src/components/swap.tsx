const TokenSwap = () => {
    return (
        <div className="flex flex-col md:flex-row justify-center items-center p-8 rounded-lg shadow-lg">
            <div className="bg-white w-full md:w-1/2 p-6 rounded-lg shadow-md">
                <div className="mb-6">
                    <label className="block text-gray-700">From</label>
                    <div className="flex items-center justify-between border rounded-md border-gray-300 p-2">
                        <select className="bg-transparent focus:outline-none cursor-pointer">
                            <option value="ETH">ETH</option>
                        </select>
                        
                        <input className="w-full text-right" type="number" value="0" readOnly />
                        <span>Balance: 0.00001 ETH</span>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700">To</label>
                    <div className="flex items-center justify-between border rounded-md border-gray-300 p-2">
                        <select className="bg-transparent focus:outline-none cursor-pointer">
                            <option value="VELO">VELO</option>

                        </select>
                        <input className="w-full text-right" type="number" value="0" readOnly />
                        <span>Balance: 0.0 VELO</span>
                    </div>
                </div>
            </div>

            <div className="bg-white md:w-1/3 p-6 rounded-lg shadow-md md:ml-8">
                <h2 className="text-lg font-semibold">Swap</h2>
                <ol className="list-decimal list-inside mt-4">
                    <li>Choose the token you want to swap</li>
                    <li>Select the token you want to receive</li>
                    <li>The quote will be ready in a moment!</li>
                </ol>
            </div>
        </div>
    );
};

export default TokenSwap;
