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
      {/* Bottom Navigation Bar - Premium Design */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 rounded-t-[16px] shadow-2xl z-40 sm:hidden backdrop-blur-sm">
        <nav className="flex justify-around items-center h-[68px] px-1">
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
                className={`flex flex-col items-center justify-center w-full h-full rounded-[12px] relative transition-all duration-200 ease-out ${
                  isActive 
                    ? 'text-[#3578d4]' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon size={26} className={isActive ? 'stroke-[1.5]' : 'stroke-[1.5]'} />
                  {item.id === 'menu' && notificacoesCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                    >
                      {notificacoesCount > 9 ? '9+' : notificacoesCount}
                    </motion.span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold mt-1.5 transition-colors duration-200 ${isActive ? 'text-[#3578d4]' : 'text-gray-600'}`}>{item.label}</span>

                {/* Active indicator - Premium style */}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-[#3578d4] to-[#60a5fa] rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Dropdown Menu para outras opções - Premium Design */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute bottom-[68px] left-2 right-2 bg-white rounded-[16px] shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="divide-y divide-gray-100">
                {/* Notificações */}
                <motion.button
                  whileHover={{ backgroundColor: '#f8f9fa' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onViewChange('notificacoes');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-4 flex items-center space-x-3 transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-[10px]">
                    <Bell size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-[14px] font-semibold text-gray-800">Notificações</span>
                    {notificacoesCount > 0 && (
                      <span className="text-[12px] text-gray-500 ml-2">
                        ({notificacoesCount} nova{notificacoesCount > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                  {notificacoesCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                    >
                      {notificacoesCount > 9 ? '9+' : notificacoesCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* Relatório */}
                <motion.button
                  whileHover={{ backgroundColor: '#f8f9fa' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMenuItemClick('relatorio')}
                  className="w-full px-4 py-4 flex items-center space-x-3 transition-colors"
                >
                  <div className="p-2 bg-amber-100 rounded-[10px]">
                    <FileText size={20} className="text-amber-600" />
                  </div>
                  <span className="text-[14px] font-semibold text-gray-800">Relatório de Execução</span>
                </motion.button>

                {/* Configurações */}
                <motion.button
                  whileHover={{ backgroundColor: '#f8f9fa' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMenuItemClick('configuracoes')}
                  className="w-full px-4 py-4 flex items-center space-x-3 transition-colors"
                >
                  <div className="p-2 bg-gray-100 rounded-[10px]">
                    <Settings size={20} className="text-gray-600" />
                  </div>
                  <span className="text-[14px] font-semibold text-gray-800">Configurações</span>
                </motion.button>

                {/* Administrador */}
                <motion.button
                  whileHover={{ backgroundColor: '#f8f9fa' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMenuItemClick('administracao')}
                  className="w-full px-4 py-4 flex items-center space-x-3 transition-colors"
                >
                  <div className="p-2 bg-purple-100 rounded-[10px]">
                    <ShieldCheck size={20} className="text-purple-600" />
                  </div>
                  <span className="text-[14px] font-semibold text-gray-800">Administrador</span>
                </motion.button>

                {/* Logout */}
                <motion.button
                  whileHover={{ backgroundColor: '#fef2f2' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onLogout?.();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-4 flex items-center space-x-3 transition-colors"
                >
                  <div className="p-2 bg-red-100 rounded-[10px]">
                    <LogOut size={20} className="text-red-600" />
                  </div>
                  <span className="text-[14px] font-semibold text-red-600">Sair</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spacer para evitar que conteúdo fique atrás do bottom nav */}
      <div className="h-[68px] sm:hidden" />
    </>
  );
};
