import Roadmap from "../components/Roadmap";

export default function RoadMapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Botão "Voltar" estilizado */}
      <div className="container mx-auto px-4 py-6">
        <a
          href="/"
          className="inline-flex items-center text-green-600 hover:text-green-800 font-semibold transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Voltar
        </a>
      </div>

      {/* Componente Roadmap */}
      <div className="container mx-auto px-4 py-12">
        <Roadmap />
      </div>
    </div>
  );
}