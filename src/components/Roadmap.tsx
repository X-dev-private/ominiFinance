import React from "react";
import RoadmapItem from "./RoadmapItem";
import { RoadmapItemType } from "../utils/RoadmapItemType";

const Roadmap: React.FC = () => {
  const roadmapItems: RoadmapItemType[] = [
    {
      id: 1,
      title: "Concepção do Projeto",
      description: "Definição da ideia, objetivos e requisitos do DEX.",
      status: "completed",
    },
    {
      id: 2,
      title: "Desenvolvimento do Smart Contract",
      description: "Criação e testes dos contratos inteligentes para operações do DEX.",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Interface do Usuário",
      description: "Desenvolvimento da interface gráfica para interação com o DEX.",
      status: "planned",
    },
    {
      id: 4,
      title: "Integração com Carteiras",
      description: "Conexão com MetaMask, WalletConnect e outras carteiras compatíveis.",
      status: "completed",
    },
    {
      id: 5,
      title: "Lançamento da Versão Beta",
      description: "Lançamento inicial do DEX para testes públicos e feedback.",
      status: "planned",
    },
    {
      id: 6,
      title: "Bridge",
      description: "Implementação de funcionalidade de bridge para transferência de ativos entre blockchains.",
      status: "planned",
    },
    {
      id: 7,
      title: "Swap e Liquidity Pool",
      description: "Desenvolvimento e integração das funcionalidades de swap e pools de liquidez.",
      status: "in-progress",
    },
    {
      id: 8,
      title: "Integração com Redes Sociais e Comunidade",
      description: "Implementação de funcionalidades para compartilhamento e interação nas redes sociais, aumentando a visibilidade e engajamento do DEX.",
      status: "in-progress",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-700">
        RoadMap to Omini Finance
      </h2>
      <div className="space-y-6">
        {roadmapItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 transition-all duration-300 hover:shadow-xl"
            style={{
              borderLeftColor:
                item.status === "completed"
                  ? "#10B981" // Verde para concluído
                  : item.status === "in-progress"
                  ? "#FBBF24" // Amarelo para em progresso
                  : "#6B7280", // Cinza para planejado
            }}
          >
            <RoadmapItem item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;