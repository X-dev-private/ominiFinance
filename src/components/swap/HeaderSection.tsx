    export default function HeaderSection() {

    return ( 
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Token Swap</h1>
          <div className="flex space-x-4 border-b border-gray-200 pb-1">
            <button className="px-6 py-3 text-green-600 font-medium border-b-2 border-green-600 text-lg">
              Swap
            </button>
          </div>
        </div>
        );
    }