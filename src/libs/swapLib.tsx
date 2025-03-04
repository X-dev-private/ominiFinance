import React, { useState, useEffect } from 'react';
import { useAccount, useChainId, useSigner } from "wagmi";
import { useTokenBalances, TokenType } from '../utils/useTokenBalances';
import { executeSwap } from '../utils/swap';

const TokenSwap: React.FC = () => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const chainId = useChainId();
  const balances = useTokenBalances(address, chainId);
  
  const [activeStep, setActiveStep] = useState(0);
  const [amount, setAmount] = useState("");
  const [fromToken, setFromToken] = useState<TokenType>("anjux");
  const [toToken, setToToken] = useState<TokenType>("usdcof");
  const [txHash, setTxHash] = useState("");

  const [steps, setSteps] = useState([
    { title: `Aprovar ${fromToken.toUpperCase()}`, completed: false },
    { title: 'Confirmar Swap', completed: false }
  ]);

  useEffect(() => {
    setSteps([
      { title: `Aprovar ${fromToken.toUpperCase()}`, completed: false },
      { title: 'Confirmar Swap', completed: false }
    ]);
    setActiveStep(0);
  }, [fromToken, toToken]);

  const getTokenBalance = (token: TokenType) => {
    if (balances.loading) return "Carregando...";
    if (balances[token] === "N/D") return "Não disponível";
    return `${balances[token]} ${token.toUpperCase()}`;
  };

  const handleAuthorization = async () => {
    if (!signer || !chainId) return;

    try {
      if (activeStep === 0) {
        // Executar aprovação
        await executeSwap(
          fromToken,
          toToken,
          amount,
          signer,
          chainId
        );
        setSteps(prev => prev.map((step, i) => 
          i === 0 ? {...step, completed: true} : step
        ));
      } else {
        // Executar swap
        const tx = await executeSwap(
          fromToken,
          toToken,
          amount,
          signer,
          chainId
        );
        setTxHash(tx.hash);
      }
      setActiveStep(prev => prev + 1);
    } catch (error) {
      console.error("Erro na transação:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center p-8 rounded-lg shadow-lg gap-8 max-w-6xl mx-auto">
      {/* Seção Esquerda - Seleção de Tokens */}
      <section className="w-full md:w-1/2 p-8 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
        {/* ... (mantido igual) ... */}
      </section>

      {/* Seção Direita - Passo a Passo de Aprovações */}
      <section className="w-full md:w-1/2 p-8 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
        {/* ... (mantido igual) ... */}
        {txHash && (
          <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <p className="text-green-500 text-sm">
              Transação confirmada: 
              <a 
                href={`https://etherscan.io/tx/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 underline"
              >
                Ver no Explorer
              </a>
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default TokenSwap;