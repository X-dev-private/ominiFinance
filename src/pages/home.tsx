import "../App.css";
import Logo from '../assets/Logo.png';
import CapaA from '../assets/Bitcoin-amico.png';
import CapaB from '../assets/Manage money-pana.png';
import ImageCarousel from "../components/Carrosel";
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="App bg-gray-50">
      {/* Header Simplificado */}
      <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 text-gray-800 flex justify-between items-center py-4 px-6 sm:px-8 shadow-sm">
        <div className="flex items-center space-x-6 sm:space-x-10">
          <img src={Logo} alt="OminiFinance Logo" className="h-8 sm:h-10" />
          <nav className="hidden md:flex space-x-6 sm:space-x-8">
            <a href="/" className="font-medium hover:text-green-600 transition-colors">
              {t('header.home')}
            </a>
            <a
              href="https://omini-finance-docs.vercel.app/"
              className="font-medium hover:text-green-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('header.docs')}
            </a>
            <a href="/roadmap" className="font-medium hover:text-green-600 transition-colors">
              {t('header.roadmap')}
            </a>
          </nav>
        </div>
        <a
          href="/app/Dashboard"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-green-500/30 text-sm sm:text-base"
        >
          {t('header.launchTestnet')}
        </a>
      </header>

      {/* Hero Section - Mais Simples e Explicativa */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-12 sm:py-20">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                {t('hero.title')}
              </span><br />
              {t('hero.subtitle')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              {t('hero.description')}
            </p>
            
            {/* Explicação simplificada para iniciantes */}
            <div className="bg-green-50 p-4 rounded-lg mb-6 sm:mb-8 border border-green-100">
              <h3 className="font-semibold text-green-700 mb-2">{t('deFiExplanation.title')}</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                {t('deFiExplanation.content')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href="/app/Dashboard"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/30 text-center"
              >
                {t('hero.launchApp')}
              </a>
              <a
                href="/learn"
                className="border border-gray-300 text-gray-700 px-6 py-3 sm:px-8 sm:py-3.5 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                {t('learnAboutDeFi')}
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/10 rounded-2xl -rotate-3"></div>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 relative">
              <img 
                src={CapaA} 
                alt={t('crossChainSwaps')}
                className="h-full object-cover rounded-xl shadow-lg"
              />
              <img 
                src={CapaB} 
                alt={t('yieldAggregation')}
                className="h-full object-cover rounded-xl shadow-lg mt-6 sm:mt-8"
              />
            </div>
          </div>
        </section>

        {/* Seção "Como Funciona" - Passo a Passo Simples */}
        <section className="my-16 sm:my-28 bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('howItWorks.title')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t('howItWorks.step1')}</h3>
              <p className="text-gray-600 text-center">
                {t('howItWorks.step1Desc')}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t('howItWorks.step2')}</h3>
              <p className="text-gray-600 text-center">
                {t('howItWorks.step2Desc')}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t('howItWorks.step3')}</h3>
              <p className="text-gray-600 text-center">
                {t('howItWorks.step3Desc')}
              </p>
            </div>
          </div>
        </section>

        {/* Benefícios - Focado no Usuário Iniciante */}
        <section className="my-16 sm:my-28">
          <div className="text-center mb-8 sm:mb-16">
            <span className="inline-block bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              {t('benefits.forBeginners')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('benefits.title')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              {t('benefits.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('benefits.security.title')}</h3>
              <p className="text-gray-600">
                {t('benefits.security.content')}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('benefits.interface.title')}</h3>
              <p className="text-gray-600">
                {t('benefits.interface.content')}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('benefits.support.title')}</h3>
              <p className="text-gray-600">
                {t('benefits.support.content')}
              </p>
            </div>
          </div>
        </section>

        {/* Comparativo Tradicional vs DeFi - Visual Simples */}
        <section className="my-16 sm:my-28 bg-gray-50 rounded-2xl p-6 sm:p-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('comparison.title')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              {t('comparison.subtitle')}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200">
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{t('comparison.traditional.title')}</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span className="text-gray-700">{t('comparison.traditional.point1')}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span className="text-gray-700">{t('comparison.traditional.point2')}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span className="text-gray-700">{t('comparison.traditional.point3')}</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{t('comparison.defi.title')}</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">{t('comparison.defi.point1')}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">{t('comparison.defi.point2')}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">{t('comparison.defi.point3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Mais Acessível */}
        <section className="my-16 sm:my-28 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">{t('cta.title')}</h2>
          <p className="text-green-100 text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a
              href="/app/Dashboard"
              className="inline-block bg-white text-green-600 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-lg text-sm sm:text-base"
            >
              {t('cta.primary')}
            </a>
            <a
              href="/demo"
              className="inline-block bg-transparent border border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              {t('cta.secondary')}
            </a>
          </div>
        </section>

        {/* Perguntas Frequentes - Linguagem Simples */}
        <section className="my-16 sm:my-28">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('faq.title')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm divide-y divide-gray-200">
            <div className="p-6">
              <button className="flex justify-between items-center w-full text-left">
                <h3 className="text-lg sm:text-xl font-medium text-gray-900">{t('faq.q1')}</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="mt-3 text-gray-600">
                <p>{t('faq.a1')}</p>
              </div>
            </div>
            <div className="p-6">
              <button className="flex justify-between items-center w-full text-left">
                <h3 className="text-lg sm:text-xl font-medium text-gray-900">{t('faq.q2')}</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="mt-3 text-gray-600">
                <p>{t('faq.a2')}</p>
              </div>
            </div>
            <div className="p-6">
              <button className="flex justify-between items-center w-full text-left">
                <h3 className="text-lg sm:text-xl font-medium text-gray-900">{t('faq.q3')}</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="mt-3 text-gray-600">
                <p>{t('faq.a3')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Simplificado */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <img src={Logo} alt="OminiFinance Logo" className="h-8 sm:h-10 mb-4" />
            <p className="text-gray-400 text-sm sm:text-base">
              {t('footer.tagline')}
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">{t('footer.product.title')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="/app/Dashboard" className="hover:text-white transition-colors text-sm sm:text-base">{t('footer.product.app')}</a></li>
              <li><a href="/roadmap" className="hover:text-white transition-colors text-sm sm:text-base">{t('footer.product.roadmap')}</a></li>
              <li><a href="/features" className="hover:text-white transition-colors text-sm sm:text-base">{t('footer.product.features')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">{t('footer.resources.title')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="https://omini-finance-docs.vercel.app/" className="hover:text-white transition-colors text-sm sm:text-base">{t('footer.resources.docs')}</a></li>
              <li><a href="/learn" className="hover:text-white transition-colors text-sm sm:text-base">{t('footer.resources.learn')}</a></li>
              <li><a href="/tutorials" className="hover:text-white transition-colors text-sm sm:text-base">{t('footer.resources.tutorials')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">{t('footer.support.title')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="/faq" className="hover:text-white transition-colors text-sm sm:text-base">{t('footer.support.faq')}</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors text-sm sm:text-base">{t('footer.support.contact')}</a></li>
              <li><a href="/community" className="hover:text-white transition-colors text-sm sm:text-base">{t('footer.support.community')}</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-8 sm:mt-12 pt-8 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}