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
      {/* Header Moderno */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 text-gray-800 flex justify-between items-center py-4 px-8 shadow-sm">
        <div className="flex items-center space-x-10">
          <img src={Logo} alt="OminiFinance Logo" className="h-10" />
          <nav className="hidden md:flex space-x-8">
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
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-green-500/30"
        >
          {t('header.launchTestnet')}
        </a>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-20">
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                {t('hero.title')}
              </span><br />
              {t('hero.subtitle')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('hero.description')}
            </p>
            <div className="flex space-x-4">
              <a
                href="/app/Dashboard"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
              >
                {t('hero.launchApp')}
              </a>
              <a
                href="https://omini-finance-docs.vercel.app/"
                className="border border-green-500 text-green-600 px-8 py-3.5 rounded-lg hover:bg-green-50 transition-colors"
              >
                {t('hero.documentation')}
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/10 rounded-2xl -rotate-3"></div>
            <div className="grid grid-cols-2 gap-5 relative">
              <img 
                src={CapaA} 
                alt={t('crossChainSwaps')}
                className="h-full object-cover rounded-xl shadow-lg"
              />
              <img 
                src={CapaB} 
                alt={t('yieldAggregation')}
                className="h-full object-cover rounded-xl shadow-lg mt-8"
              />
            </div>
          </div>
        </section>

        {/* About OminiFinance */}
        <section className="my-28">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              {t('cosmosPower')}
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t('about.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('crossChainSwaps')}</h3>
              <p className="text-gray-600">
                {t('crossChainSwapsDescription')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('yieldAggregation')}</h3>
              <p className="text-gray-600">
                {t('yieldAggregationDescription')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('ibcNative')}</h3>
              <p className="text-gray-600">
                {t('ibcNativeDescription')}
              </p>
            </div>
          </div>
        </section>

        {/* Cosmos Integration */}
        <section className="my-28 bg-gradient-to-br from-green-50 to-white rounded-3xl p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                {t('cosmosPower')}
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t('cosmosTitle')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('cosmosDescription')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">{t('cosmosFeature1')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">{t('cosmosFeature2')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">{t('cosmosFeature3')}</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('cosmosWhyTitle')}</h3>
              <p className="text-gray-600 mb-6">
                {t('cosmosWhyDescription')}
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('cosmosForDevelopersTitle')}</h4>
                  <p className="text-gray-600">
                    {t('cosmosForDevelopers')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('cosmosForUsersTitle')}</h4>
                  <p className="text-gray-600">
                    {t('cosmosForUsers')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('cosmosForEcosystemTitle')}</h4>
                  <p className="text-gray-600">
                    {t('cosmosForEcosystem')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Chains */}
        <section className="my-28">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('connectedEcosystem')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('connectedEcosystemDescription')}
            </p>
          </div>
          <ImageCarousel />
        </section>

        {/* CTA Section */}
        <section className="my-28 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{t('ctaTitle')}</h2>
          <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto">
            {t('ctaDescription')}
          </p>
          <a
            href="/app/Dashboard"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-lg"
          >
            {t('launchAppNow')}
          </a>
        </section>
      </main>

      {/* Footer Moderno */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <img src={Logo} alt="OminiFinance Logo" className="h-10 mb-4" />
            <p className="text-gray-400">
              {t('footer.about')}
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">{t('footer.product')}</h3>
            <ul className="space-y-3">
              <li><a href="/app/Dashboard" className="hover:text-white transition-colors">{t('footer.app')}</a></li>
              <li><a href="/roadmap" className="hover:text-white transition-colors">{t('footer.roadmap')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.features')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-3">
              <li><a href="https://omini-finance-docs.vercel.app/" className="hover:text-white transition-colors">{t('footer.documentation')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.github')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.whitepaper')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">{t('footer.company')}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.aboutText')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.blog')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              {t('footer.allRightsReserved')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {/* Ícones sociais permanecem os mesmos */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}