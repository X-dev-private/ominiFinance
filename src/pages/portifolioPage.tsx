import { useAccount, useContractRead } from "wagmi";
import Footer from "../libs/footer";
import Header from "../libs/header";
import "../App.css";

// Endereços dos contratos dos tokens
const ANJUX_TOKEN_ADDRESS = "0x6c3aaaA93CC59f5A4288465F073C2B94DDBD3a05";
const ETHOF_TOKEN_ADDRESS = "0x1429c6F2Be05EFF1fB07F52D9D4880a108153dD4";
const USDCOF_TOKEN_ADDRESS = "0x32c00bD194B3ea78B9799394984DF8dB7397B834";

// ABI dos contratos ERC20 para interagir com a função balanceOf
const ERC20_ABI = [
  "function balanceOf(address account) view returns (uint256)"
];

export default function PortifolioPage() {
  const { address } = useAccount();

  // Usando wagmi para ler os saldos dos tokens
  const { data: anjuxBalance, isLoading: anjuxLoading } = useContractRead({
    address: ANJUX_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  const { data: ethofBalance, isLoading: ethofLoading } = useContractRead({
    address: ETHOF_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  const { data: usdcofBalance, isLoading: usdcofLoading } = useContractRead({
    address: USDCOF_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  // Formatar os saldos para exibição (com até 3 casas decimais)
  const formattedAnjuxBalance = anjuxBalance ? parseFloat(ethers.utils.formatUnits(anjuxBalance, 18)).toFixed(3) : "0.000";
  const formattedEthofBalance = ethofBalance ? parseFloat(ethers.utils.formatUnits(ethofBalance, 18)).toFixed(3) : "0.000";
  const formattedUsdcofBalance = usdcofBalance ? parseFloat(ethers.utils.formatUnits(usdcofBalance, 18)).toFixed(3) : "0.000";

  return (
    <div className="mx-auto bg-gradient-to-b from-white to-green-500 p-4 rounded-b-2xl shadow-lg flex flex-col items-center h-full space-y-32">
      <Header />
      <div className="text-white text-xl">
        <h2>Saldos dos Tokens</h2>
        <div className="mt-4">
          <p>
            AnJuX Token: {anjuxLoading ? "Carregando..." : `${formattedAnjuxBalance} tokens`}
          </p>
          <p>
            ETHoF Token: {ethofLoading ? "Carregando..." : `${formattedEthofBalance} tokens`}
          </p>
          <p>
            USDCoF Token: {usdcofLoading ? "Carregando..." : `${formattedUsdcofBalance} tokens`}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
