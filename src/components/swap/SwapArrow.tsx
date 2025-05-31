import React, { useState } from 'react';

export default function SwapArrow() {
  const [isSwapping, setIsSwapping] = useState(false);

  const handleClick = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 500); // Tempo para completar a animação
  };

  return (
    <div className="flex justify-center my-2">
      <button 
        onClick={handleClick}
        className="p-3 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-green-50 hover:border-green-400 transition-colors group"
      >
        <div className="relative h-6 w-6">
          {/* Seta para cima - anima para baixo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-green-600 absolute top-0 left-0.5 transition-all duration-300 ${
              isSwapping ? 'translate-y-3 opacity-0' : 'group-hover:-translate-y-0.5'
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>

          {/* Seta para baixo - anima para cima */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-green-600 absolute bottom-0 left-0.5 transition-all duration-300 ${
              isSwapping ? '-translate-y-3 opacity-0' : 'group-hover:translate-y-0.5'
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>

          {/* Efeito de troca - aparece durante a animação */}
          {isSwapping && (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600 absolute top-0 left-0.5 animate-bounce-down"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600 absolute bottom-0 left-0.5 animate-bounce-up"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </>
          )}
        </div>
      </button>

      {/* Estilos para as animações personalizadas */}
      <style jsx>{`
        @keyframes bounce-down {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
        @keyframes bounce-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-down {
          animation: bounce-down 0.5s ease-in-out;
        }
        .animate-bounce-up {
          animation: bounce-up 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}