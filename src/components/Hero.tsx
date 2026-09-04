import React from 'react';
import { Search, PlusCircle, MapPin } from 'lucide-react';
import { SITE_IMAGES } from '../config/images';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden py-12 md:py-20 bg-gradient-to-b from-orange-50/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Texto e Chamada */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Conforto e Soluções em <span className="text-orange-600">Mato Grosso do Sul</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Conecte-se instantaneamente com profissionais qualificados locais ou publique sua demanda com direcionamento inteligente por região.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#servicos"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-medium rounded-xl text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition-all duration-200"
              >
                <Search className="w-5 h-5 mr-2" />
                Explorar Serviços
              </a>
              <a
                href="#publicar"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <PlusCircle className="w-5 h-5 mr-2 text-orange-600" />
                Publicar Pedido
              </a>
            </div>

            {/* Seletor de Região */}
            <div className="mt-8 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4 text-orange-600 mr-1.5" />
                Sua Região / Cidade Atual:
              </div>
              <div className="relative">
                <select className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5">
                  <option>Ponta Porã - MS (Detectado)</option>
                  <option>Campo Grande - MS</option>
                  <option>Dourados - MS</option>
                  <option>Três Lagoas - MS</option>
                  <option>Corumbá - MS</option>
                </select>
              </div>
            </div>
          </div>

          {/* Imagem em Destaque Ajustada */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 border border-gray-200/80">
              <img
                src={SITE_IMAGES.heroProfessional}
                alt="Profissional Real em Manutenção"
                className="w-full h-full object-contain object-center bg-gray-900/5 p-2"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
