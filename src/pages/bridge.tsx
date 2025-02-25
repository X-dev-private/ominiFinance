import React, { useState } from 'react';
import { ethers } from 'ethers';
import { evm } from "@debridge-finance/desdk";
import Header from '../libs/header';
import Footer from '../libs/footer';

const DebridgeExample = () => {
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/'import.meta.env.VITE_INFURA_API_KEY);
      const wallet = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY, provider);

      const evmContext: evm.Context = {
        provider: provider,
        deBridgeGateAddress: '0x...DEBRIDGE_GATE_ADDRESS...', // Substitua pelo endereço do gate da deBridge
        signatureStorage: new evm.DummySignatureStorage() // Armazenamento de assinaturas para ambiente local
      };

      const tokenAddress = '0x...TOKEN_ADDRESS...'; // Substitua pelo endereço do token ERC20
      const tokenDecimals = 18; // Decimais do token

      const message = new evm.Message({
        toChainId: 137, // Por exemplo, Polygon
        toAddress: '0x...RECEIVER_ADDRESS...', // Endereço do destinatário na blockchain de destino
        data: ethers.utils.defaultAbiCoder.encode(['address', 'uint256'], [tokenAddress, ethers.utils.parseUnits('1', tokenDecimals)]), // Dados do token
      }, evmContext);

      const submission = await message.send(evmContext);
      console.log('Mensagem enviada:', submission.transactionHash);

      // Rastrear e reivindicar a mensagem
      const submissions = await evm.Submission.findAll(submission.transactionHash, evmContext);
      const claim = await submission.toEVMClaim(evmContext);
      console.log('Mensagem reivindicada:', claim.transactionHash);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
    setLoading(false);
  };

  return (
    <div>
    <Header />
      <button
        onClick={handleSend}
        className="bg-green-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Enviando...' : 'Enviar Mensagem'}
      </button>
      <Footer />
    </div>
  );
};

export default DebridgeExample;
