import React from 'react';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 py-2 px-4 shadow-lg">
      <div className="flex justify-around items-center">
        <a href="#" className="flex flex-col items-center text-orange-600">
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Início</span>
        </a>
        <a href="#servicos" className="flex flex-col items-center text-gray-500 hover:text-gray-900">
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Buscar</span>
        </a>
        <a href="#publicar" className="flex flex-col items-center text-gray-500 hover:text-gray-900">
          <PlusCircle className="w-5 h-5 text-orange-600" />
          <span className="text-[10px] mt-1 font-medium">Publicar</span>
        </a>
        <a href="#mensagens" className="flex flex-col items-center text-gray-500 hover:text-gray-900">
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Mensagens</span>
        </a>
        <a href="#perfil" className="flex flex-col items-center text-gray-500 hover:text-gray-900">
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Perfil</span>
        </a>
      </div>
    </div>
  );
};
