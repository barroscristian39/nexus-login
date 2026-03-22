import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  Briefcase, 
  FileText, 
  MoreVertical,
  Bell,
  Settings,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface BottomNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  notificacoesCount?: number;
  onLogout?: () => void;
  onOpenNotificacoes?: () => void;
}

const bottomNavItems: BottomNavItem[] = [
  { id: 'painel', label: 'Painel', icon: LayoutDashboard },
  { id: 'demandas', label: 'Demandas', icon: ListTodo },
  { id: 'projetos', label: 'Projetos', icon: Briefcase },
  { id: 'evidencias', label: 'Evidências', icon: FileText },
  { id: 'menu', label: 'Menu', icon: MoreVertical },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentView,
  onViewChange,
  notificacoesCount = 0,
  onLogout,
  onOpenNotificacoes,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (view: string) => {
    onViewChange(view);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-[12px] shadow-lg z-40 sm:hidden">
        <nav className="flex justify-around items-center h-[64px]">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'menu') {
                    handleMenuToggle();
                  } else {
                    onViewChange(item.id);
                    setIsMenuOpen(false);
                  }
                }}
                className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
                  isActive ? 'text-[#3578d4]' : 'text-gray-500'
                }`}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon size={24} />
                  {item.id === 'menu' && notificacoesCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {notificacoesCount > 9 ? '9+' : notificacoesCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium mt-1">{item.label}</span>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 left-0 right-0 h-[3px] bg-[#3578d4]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Dropdown Menu para outras opções */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-[64px] left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
            >
              <div className="divide-y divide-gray-100">
                {/* Notificações */}
                <button
                  onClick={() => {
                    onViewChange('notificacoes');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                >
                  <Bell size={20} className="text-gray-600" />
                  <div className="flex-1 text-left">
                    <span className="text-[13px] font-medium text-gray-800">Notificações</span>
                    {notificacoesCount > 0 && (
                      <span className="text-[12px] text-gray-500 ml-2">
                        ({notificacoesCount} nova{notificacoesCount > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                  {notificacoesCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {notificacoesCount > 9 ? '9+' : notificacoesCount}
                    </span>
                  )}
                </button>

                {/* Relatório */}
                <button
                  onClick={() => handleMenuItemClick('relatorio')}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                >
                  <FileText size={20} className="text-gray-600" />
                  <span className="text-[13px] font-medium text-gray-800">Relatório</span>
                </button>

                {/* Configurações */}
                <button
                  onClick={() => handleMenuItemClick('configuracoes')}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={20} className="text-gray-600" />
                  <span className="text-[13px] font-medium text-gray-800">Configurações</span>
                </button>

                {/* Administrador */}
                <button
                  onClick={() => handleMenuItemClick('administracao')}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                >
                  <ShieldCheck size={20} className="text-gray-600" />
                  <span className="text-[13px] font-medium text-gray-800">Administrador</span>
                </button>

                {/* Logout */}
                <button
                  onClick={() => {
                    onLogout?.();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 transition-colors border-t border-gray-200"
                >
                  <LogOut size={20} className="text-red-500" />
                  <span className="text-[13px] font-medium text-red-500">Sair</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spacer para evitar que conteúdo fique atrás do bottom nav */}
      <div className="h-[64px] sm:hidden" />
    </>
  );
};
