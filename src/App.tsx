import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Clock, 
  FileBarChart, 
  Settings, 
  Search, 
  Bell, 
  User, 
  LogOut,
  CheckCircle2,
  AlertCircle,
  ListTodo,
  FileSpreadsheet,
  ChevronDown,
  ArrowUpDown,
  Filter,
  X,
  Calendar,
  FileEdit,
  Image as ImageIcon,
  Paperclip,
  Link as LinkIcon,
  Upload,
  ArrowLeft,
  Plus,
  MessageSquare,
  Users,
  CheckCircle,
  Edit,
  ShieldCheck,
  Building2,
  UserPlus,
  Lock,
  Key,
  Eye,
  Trash2,
  MoreVertical,
  XCircle,
  MoreHorizontal,
  Mail,
  Phone,
  Briefcase as BriefcaseIcon,
  EyeOff,
  Info,
  Check,
  Loader,
  UserCircle,
  Send,
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  Cell,
  BarChart, 
  Bar
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for Tailwind class merging
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * API Base URL - usando variável de ambiente ou caminho relativo
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nexus-api-nbna.onrender.com/api';

/**
 * Função auxiliar para fazer fetch com tratamento robusto de resposta JSON
 */
async function fetchAPI(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  
  const contentType = response.headers.get('content-type');
  let data: any = null;
  
  if (contentType?.includes('application/json')) {
    const textContent = await response.text();
    if (textContent && textContent.trim()) {
      try {
        data = JSON.parse(textContent);
      } catch (e) {
        console.error('[FETCH_API] JSON Parse Error:', e, 'Content:', textContent.substring(0, 200));
        throw new Error(`JSON inválido: ${(e as any).message}`);
      }
    }
  } else if (!response.ok) {
    const textContent = await response.text();
    throw new Error(`Erro HTTP ${response.status}: ${textContent}`);
  }
  
  if (!response.ok) {
    const errorMsg = data?.message || `Erro HTTP ${response.status}`;
    throw new Error(errorMsg);
  }
  
  return { response, data };
}

const perfisPermissoesData = [
  { perfil: 'Administrador principal', modulos: { painel: 'Gerenciar', demandas: 'Gerenciar', projetos: 'Gerenciar', evidencias: 'Gerenciar', relatorios: 'Gerenciar', configuracoes: 'Gerenciar', administracao: 'Gerenciar' } },
  { perfil: 'Administrador da empresa', modulos: { painel: 'Gerenciar', demandas: 'Gerenciar', projetos: 'Gerenciar', evidencias: 'Gerenciar', relatorios: 'Gerenciar', configuracoes: 'Visualizar', administracao: 'Visualizar' } },
  { perfil: 'Gestor', modulos: { painel: 'Visualizar', demandas: 'Aprovar', projetos: 'Editar', evidencias: 'Aprovar', relatorios: 'Visualizar', configuracoes: 'Nenhum', administracao: 'Nenhum' } },
  { perfil: 'Supervisor', modulos: { painel: 'Visualizar', demandas: 'Editar', projetos: 'Visualizar', evidencias: 'Editar', relatorios: 'Visualizar', configuracoes: 'Nenhum', administracao: 'Nenhum' } },
  { perfil: 'Operador', modulos: { painel: 'Visualizar', demandas: 'Criar', projetos: 'Visualizar', evidencias: 'Criar', relatorios: 'Nenhum', configuracoes: 'Nenhum', administracao: 'Nenhum' } },
  { perfil: 'Visualizador', modulos: { painel: 'Visualizar', demandas: 'Visualizar', projetos: 'Visualizar', evidencias: 'Visualizar', relatorios: 'Visualizar', configuracoes: 'Nenhum', administracao: 'Nenhum' } },
];

const LoginView = ({
  onLogin,
  authError,
  isLoading,
}: {
  onLogin: (email: string, senha: string) => void,
  authError?: string | null,
  isLoading?: boolean,
}) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin(email, senha);
  };

  return (
    <div className="h-screen overflow-hidden bg-[linear-gradient(180deg,_#243963_0%,_#274880_100%)] text-[#0f172a]">
      <div className="relative flex h-full items-center justify-center px-4 py-4">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px]" />

        <div className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-[16px] border border-white/12 bg-[#f7f7f8] shadow-[0_24px_70px_rgba(7,20,47,0.32)]">
          <div className="bg-[linear-gradient(180deg,_#315c9d_0%,_#3775d2_100%)] px-8 pb-6 pt-8 text-center text-white">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-1">
                <div className="h-3 w-3 rounded-[2px] bg-white" />
                <div className="h-3 w-3 rounded-[2px] bg-white/55" />
                <div className="h-3 w-3 rounded-[2px] bg-white/55" />
                <div className="h-3 w-3 rounded-[2px] bg-white/55" />
              </div>
            </div>
            <h1 className="mt-3 text-[18px] font-extrabold tracking-tight">NEXUS</h1>
            <p className="mt-2 text-[12px] text-blue-100/90">Sistema de Gestão de Demandas e Projetos</p>
          </div>

          <div className="px-8 pb-6 pt-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-[#243963]">E-mail / Usuário</span>
                <input
                  type="text"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com"
                  className="h-[36px] w-full rounded-[8px] border border-[#d1d8e5] bg-white px-4 text-[12px] text-[#1e315d] outline-none transition placeholder:text-[#98a4bb] focus:border-[#3775d2] focus:ring-2 focus:ring-[#3775d2]/15"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[13px] font-bold text-[#243963]">Senha</span>
                <div className="relative">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder="••••••••"
                    className="h-[36px] w-full rounded-[8px] border border-[#d1d8e5] bg-white px-4 pr-10 text-[12px] text-[#1e315d] outline-none transition placeholder:text-[#98a4bb] focus:border-[#3775d2] focus:ring-2 focus:ring-[#3775d2]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha((valorAtual) => !valorAtual)}
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-[#7d8aa3] transition hover:text-[#3775d2]"
                  >
                    {mostrarSenha ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between text-[12px] text-[#55637c]">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-[#c9d3e6] accent-[#3775d2]" />
                  Lembrar acesso
                </label>
                <button type="button" className="font-medium text-[#3775d2] hover:text-[#2d66b5]">
                  Esqueci a senha
                </button>
              </div>

              <button
                type="submit"
                disabled={Boolean(isLoading)}
                className="flex h-[42px] w-full items-center justify-center rounded-[8px] bg-[linear-gradient(180deg,_#3e83ea_0%,_#2e6ecc_100%)] text-[13px] font-bold text-white shadow-[0_12px_20px_rgba(46,110,204,0.18)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? 'Entrando...' : 'Entrar no sistema'}
              </button>

              {authError && (
                <div className="rounded-[8px] border border-red-100 bg-red-50 px-3 py-2 text-[12px] text-red-600">
                  {authError}
                </div>
              )}
            </form>

          </div>

          <div className="border-t border-[#e5e7eb] bg-[#f2f4f8] px-6 py-3 text-center text-[11px] text-[#a0aec0]">
            Nexus v2.4.1 • © 2026 Empresa Modelo S.A.
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
      "flex items-center px-4 py-2.5 cursor-pointer transition-all relative group",
      active ? "bg-[#253a6e] text-white" : "text-[#a0aec0] hover:text-white hover:bg-[#253a6e]/40"
    )}
  >
    {active && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#3578d4]" />}
    <Icon size={16} className="mr-3 opacity-80" />
    <span className="text-[13px] font-medium">{label}</span>
  </div>
);

const KPICard = ({ title, value, color, icon: Icon }: { title: string, value: string, color: string, icon: any }) => (
  <div className="bg-white rounded-[4px] shadow-sm border border-gray-100 overflow-hidden flex h-[72px]">
    <div className={cn("w-[52px] flex items-center justify-center shrink-0", color)}>
      <Icon size={18} className="text-white/90" />
    </div>
    <div className="flex flex-col justify-center px-3">
      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tight mb-0.5">{title}</span>
      <span className="text-xl font-bold text-[#1e315d] leading-none">{value}</span>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children, className }: { title: string, subtitle: string, children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white rounded-[6px] shadow-sm border border-gray-100 p-4 flex flex-col", className)}>
    <div className="mb-4">
      <h3 className="text-[14px] font-bold text-[#1e315d] leading-tight">{title}</h3>
      <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>
    </div>
    <div className="flex-1 min-h-0">
      {children}
    </div>
  </div>
);

const PriorityTag = ({ level }: { level: string }) => {
  const styles: Record<string, string> = {
    'Alta': 'bg-red-50 text-red-500',
    'Média': 'bg-yellow-50 text-yellow-600',
    'Baixa': 'bg-green-50 text-green-600',
  };
  return (
    <span className={cn("px-2 py-1 rounded-[6px] text-[10px] font-bold", styles[level])}>
      {level}
    </span>
  );
};

const StatusTag = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Em revisão': 'bg-purple-50 text-purple-500',
    'Em andamento': 'bg-yellow-50 text-yellow-600',
    'Bloqueada': 'bg-red-50 text-red-500',
    'Aberta': 'bg-blue-50 text-blue-500',
    'Concluída': 'bg-green-50 text-green-600',
  };
  return (
    <span className={cn("px-2 py-1 rounded-[6px] text-[10px] font-bold", styles[status])}>
      {status}
    </span>
  );
};

const NexusTooltip = ({ text, children }: { text: string, children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative flex items-center" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1e315d] text-white text-[10px] font-bold rounded shadow-lg whitespace-nowrap z-[110] pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1e315d]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProgressBar = ({ value, color }: { value: number, color: string }) => (
  <div className="w-full">
    <div className="flex items-center mb-1">
      <div className="flex-1 bg-gray-100 rounded-full h-[6px] overflow-hidden">
        <div 
          className="h-full transition-all duration-500" 
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
    <span className="text-[9px] text-gray-400 font-medium">{value}%</span>
  </div>
);

// --- Views ---

// Cores para os status
const statusColorMap: Record<string, string> = {
  'Aberta': '#ef4444',
  'Em andamento': '#f59e0b',
  'Em revisão': '#8b5cf6',
  'Bloqueada': '#3578d4',
  'Concluída': '#2fb15d'
};

const DashboardView = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('nexus_token');
        if (!token) {
          setError('Token não encontrado');
          return;
        }

        const { data } = await fetchAPI(`${API_BASE_URL}/dashboard/resumo`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!data?.data) {
          throw new Error('Dados inválidos do dashboard');
        }

        setDashboardData(data.data);
      } catch (err: any) {
        console.error('Erro ao carregar dashboard:', err.message);
        setError(err.message || 'Falha ao carregar dados do dashboard. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 space-y-3 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3578d4] mb-3"></div>
          <p className="text-gray-500 text-sm">Carregando dashboard...</p>
        </div>
      </main>
    );
  }

  if (error || !dashboardData) {
    return (
      <main className="flex-1 overflow-y-auto p-4 space-y-3 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={32} className="text-red-500 mb-3 mx-auto" />
          <p className="text-red-600 font-medium">{error || 'Erro ao carregar dashboard'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-[#3578d4] text-white rounded text-sm font-medium hover:bg-[#2d66b5]"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  const { kpis, fluxoDemandas, statusDemandas, progressoProjetos, demandasPorArea } = dashboardData;

  // Prepare status data with colors
  const statusDataWithColors = (statusDemandas || []).map((item: any) => ({
    ...item,
    color: statusColorMap[item.name] || '#3578d4'
  }));

  // Prepare project data with colors
  const projectDataFormatted = (progressoProjetos || []).map((item: any, idx: number) => ({
    name: item.nome,
    progress: item.progresso,
    color: ['#3578d4', '#f59e0b', '#ef4444', '#2fb15d', '#7c3aed', '#f59e0b'][idx % 6]
  }));

  // Prepare area data with colors
  const areaDataFormatted = (demandasPorArea || []).map((item: any, idx: number) => ({
    ...item,
    color: ['#3578d4', '#2fb15d', '#f59e0b', '#ef4444', '#7c3aed', '#2cb7a0'][idx % 6]
  }));

  return (
    <main className="flex-1 overflow-y-auto p-4 space-y-3">
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3">
        <KPICard title="Demandas Abertas" value={String(kpis?.demandasAbertas || 0)} color="bg-[#2fb15d]" icon={ListTodo} />
        <KPICard title="Em Execução" value={String(kpis?.emExecucao || 0)} color="bg-[#3578d4]" icon={CheckCircle2} />
        <KPICard title="Evidências Pendentes" value={String(kpis?.evidenciasPendentes || 0)} color="bg-[#f59e0b]" icon={Clock} />
        <KPICard title="Bloqueadas / Atrasadas" value={String(kpis?.bloqueadasAtrasadas || 0)} color="bg-[#ef4444]" icon={AlertCircle} />
      </div>

      {/* First Chart Row */}
      <div className="grid grid-cols-[1.8fr_1fr] gap-3">
        <ChartCard 
          title="Fluxo de Demandas — últimos 30 dias" 
          subtitle="Abertas vs Concluídas por semana"
          className="h-[380px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fluxoDemandas || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAbertas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3578d4" stopOpacity={0.08}/>
                  <stop offset="95%" stopColor="#3578d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConcluídas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2fb15d" stopOpacity={0.08}/>
                  <stop offset="95%" stopColor="#2fb15d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f1f1f1" />
              <XAxis 
                dataKey="semana" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: '#9ca3af' }} 
                dy={5}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: '#9ca3af' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '10px' }}
              />
              <Legend 
                verticalAlign="top" 
                align="center" 
                iconType="square"
                iconSize={10}
                wrapperStyle={{ paddingBottom: '15px', fontSize: '10px', fontWeight: 500 }}
              />
              <Area 
                type="monotone" 
                dataKey="abertas" 
                name="Abertas"
                stroke="#3578d4" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorAbertas)" 
                dot={{ r: 2.5, fill: '#3578d4' }}
                activeDot={{ r: 4 }}
              />
              <Area 
                type="monotone" 
                dataKey="concluidas" 
                name="Concluídas"
                stroke="#2fb15d" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#colorConcluídas)" 
                dot={{ r: 2.5, fill: '#2fb15d' }}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          title="Status das Demandas" 
          subtitle="Distribuição atual"
          className="h-[380px]"
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDataWithColors}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {statusDataWithColors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5 pb-2">
              {statusDataWithColors.map((item, idx) => (
                <div key={idx} className="flex items-center text-[10px]">
                  <div className="w-2.5 h-2.5 rounded-sm mr-2 shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-500 font-medium truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Second Chart Row */}
      <div className="grid grid-cols-2 gap-3">
        <ChartCard 
          title="Progresso dos Projetos" 
          subtitle="Andamento por projeto"
          className="h-[380px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={projectDataFormatted}
              margin={{ top: 5, right: 20, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f1f1f1" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: '#6b7280' }}
                width={115}
              />
              <Tooltip />
              <Bar 
                dataKey="progress" 
                radius={[0, 2, 2, 0]} 
                barSize={18}
              >
                {projectDataFormatted.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          title="Demandas por Área" 
          subtitle="Distribuição por departamento"
          className="h-[380px]"
        >
          <div className="flex h-full items-center">
            <div className="flex-1 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={areaDataFormatted}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={1}
                  >
                    {areaDataFormatted.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-28 space-y-1.5 shrink-0 pr-2">
              {areaDataFormatted.map((item, idx) => (
                <div key={idx} className="flex items-center text-[10px]">
                  <div className="w-2.5 h-2.5 rounded-sm mr-2 shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-500 font-medium truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
    </main>
  );
};

const DemandasView = ({ usuariosAdminList, currentUser, empresasData, authToken, projetosData, onSyncData }: { usuariosAdminList: any[], currentUser: any, empresasData: any[], authToken: string, projetosData: any[], onSyncData: () => Promise<void> }) => {
  const [demandas, setDemandas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDemanda, setSelectedDemanda] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [editFormData, setEditFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; id: number } | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmDeleteDemanda, setConfirmDeleteDemanda] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFormNew, setShowFormNew] = useState(false);
  const [novaDemandata, setNovaDemandata] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'MEDIA',
    vencimento: '',
    responsavelId: '',
    empresaId: empresasData?.[0]?.id || '',
    projetoId: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedDemandaForStatus, setSelectedDemandaForStatus] = useState<any>(null);

  const statusOptions = [
    { value: 'ABERTA', label: 'Aberta', color: '#ef4444' },
    { value: 'EM_ANDAMENTO', label: 'Em andamento', color: '#3578d4' },
    { value: 'EM_REVISAO', label: 'Em revisão', color: '#f59e0b' },
    { value: 'BLOQUEADA', label: 'Bloqueada', color: '#8b5cf6' },
    { value: 'CONCLUIDA', label: 'Concluída', color: '#2fb15d' },
    { value: 'ATRASADA', label: 'Atrasada', color: '#dc2626' }
  ];

  // Estados para comentários e anexos
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [evidencias, setEvidencias] = useState<any[]>([]);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loadDemandas = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('nexus_token');
        if (!token) {
          setError('Token não encontrado');
          return;
        }

        const { data } = await fetchAPI(`${API_BASE_URL}/demandas`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setDemandas(data?.data || []);
      } catch (err: any) {
        console.error('Erro ao carregar demandas:', err.message);
        setError(err.message || 'Falha ao carregar demandas. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDemandas();
  }, []);

  // Carregar comentários e evidências ao selecionar uma demanda
  useEffect(() => {
    if (selectedDemanda && showModal && modalMode === 'view') {
      const loadRelated = async () => {
        try {
          const token = localStorage.getItem('nexus_token');
          
          // Carregar comentários
          const commentsRes = await fetch(`${API_BASE_URL}/comentarios?demandaId=${selectedDemanda.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (commentsRes.ok) {
            const commentsData = await commentsRes.json();
            setComentarios(commentsData.data || []);
          }

          // Carregar evidências
          const evidenciasRes = await fetch(`${API_BASE_URL}/evidencias?demandaId=${selectedDemanda.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (evidenciasRes.ok) {
            const evidenciasData = await evidenciasRes.json();
            setEvidencias(evidenciasData.data || []);
          }
        } catch (err) {
          console.error('Erro ao carregar dados:', err);
        }
      };
      
      loadRelated();
    }
  }, [selectedDemanda, showModal, modalMode]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAction = async (acao: string, demanda: any) => {
    console.log('[DEMANDA ACTION]', acao, demanda.id);
    if (acao === 'Ver detalhes') {
      setSelectedDemanda(demanda);
      setModalMode('view');
      setShowModal(true);
      console.log('[DEMANDA] Abrindo detalhes modo view');
    } else if (acao === 'Editar') {
      console.log('[DEMANDA] Preparando edição:', { demanda});
      setSelectedDemanda(demanda);
      setEditFormData({ ...demanda });
      setModalMode('edit');
      setShowModal(true);
      console.log('[DEMANDA] Modal aberto em modo edit');
    } else if (acao === 'Alterar Status') {
      setSelectedDemandaForStatus(demanda);
      setShowStatusDropdown(true);
    } else if (acao === 'Excluir') {
      setConfirmDeleteDemanda(demanda);
      setShowConfirmDelete(true);
    }
  };

  const atualizarStatus = async (id: string, novoStatus: string) => {
    try {
      const token = localStorage.getItem('nexus_token');
      const response = await fetch(`${API_BASE_URL}/demandas/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: novoStatus })
      });

      if (!response.ok) throw new Error('Erro ao atualizar status');
      
      setDemandas(demandas.map(d => d.id === id ? { ...d, status: novoStatus } : d));
      showToast(`Status atualizado para ${formatStatus(novoStatus)}`, 'success');
    } catch (err) {
      console.error('Erro:', err);
      showToast('Erro ao atualizar demanda', 'error');
    }
  };

  const excluirDemanda = async (id: string) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('nexus_token');
      const response = await fetch(`${API_BASE_URL}/demandas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erro ao excluir');
      
      setDemandas(demandas.filter(d => d.id !== id));
      setShowConfirmDelete(false);
      setConfirmDeleteDemanda(null);
      showToast('Demanda excluída com sucesso', 'success');
    } catch (err) {
      console.error('Erro:', err);
      showToast('Erro ao excluir demanda', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const salvarEdicao = async () => {
    try {
      console.log('[SALVAR] Iniciando salva de demanda:', { editFormData });
      setIsSaving(true);
      const token = localStorage.getItem('nexus_token');
      
      if (!token) {
        console.error('[SALVAR] Token não encontrado');
        showToast('Erro: Token não encontrado. Faça login novamente.', 'error');
        return;
      }

      const payload = {
        titulo: editFormData.titulo,
        descricao: editFormData.descricao,
        prioridade: editFormData.prioridade,
        status: editFormData.status,
        progresso: editFormData.progresso,
        vencimento: editFormData.vencimento,
        responsavelId: editFormData.responsavelId || null,
        projetoId: editFormData.projetoId || null
      };
      
      console.log('[SALVAR] Payload:', payload);
      
      const response = await fetch(`${API_BASE_URL}/demandas/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();
      console.log('[SALVAR] Response:', { status: response.status, data: responseData });

      if (!response.ok) {
        throw new Error(responseData.message || 'Erro ao salvar demanda');
      }
      
      setDemandas(demandas.map(d => d.id === responseData.data.id ? responseData.data : d));
      setShowModal(false);
      showToast('Demanda atualizada com sucesso', 'success');
    } catch (err: any) {
      console.error('[SALVAR ERROR]', err);
      showToast(err.message || 'Erro ao atualizar demanda', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const criarNovaDemanda = async () => {
    if (!novaDemandata.titulo.trim() || !novaDemandata.descricao.trim()) {
      showToast('Preencha título e descrição', 'error');
      return;
    }

    if (!currentUser) {
      showToast('Erro: Usuário não autenticado', 'error');
      return;
    }

    try {
      setIsCreating(true);
      const token = localStorage.getItem('nexus_token');
      
      if (!token) {
        showToast('Token não encontrado. Faça login novamente.', 'error');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/demandas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: novaDemandata.titulo,
          descricao: novaDemandata.descricao,
          prioridade: novaDemandata.prioridade,
          vencimento: novaDemandata.vencimento ? new Date(novaDemandata.vencimento).toISOString() : null,
          empresaId: novaDemandata.empresaId,
          status: 'ABERTA',
          progresso: 0,
          responsavelId: novaDemandata.responsavelId || null,
          projetoId: novaDemandata.projetoId || null
        })
      });

      if (!response.ok) throw new Error('Erro ao criar demanda');
      
      const resultado = await response.json();
      setDemandas([resultado.data, ...demandas]);
      setShowFormNew(false);
      setNovaDemandata({
        titulo: '',
        descricao: '',
        prioridade: 'MEDIA',
        vencimento: '',
        responsavelId: '',
        empresaId: empresasData?.[0]?.id || '',
        projetoId: ''
      });
      showToast('Demanda criada com sucesso', 'success');
      await onSyncData();
    } catch (err) {
      console.error('Erro:', err);
      showToast('Erro ao criar demanda', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const adicionarComentario = async () => {
    if (!novoComentario.trim() || !selectedDemanda) return;

    try {
      setIsAddingComment(true);
      const token = localStorage.getItem('nexus_token');
      
      console.log('[COMENTARIO DEBUG]', {
        temToken: !!token,
        currentUser,
        selectedDemandaId: selectedDemanda?.id
      });

      if (!token) {
        showToast('Erro: Token não encontrado. Faça login novamente.', 'error');
        return;
      }

      if (!currentUser || !currentUser.id) {
        console.error('[COMENTARIO] Usuario não disponível:', currentUser);
        showToast('Erro: Dados de usuário não encontrados. Faça login novamente.', 'error');
        return;
      }

      console.log('[COMENTARIO] Adicionando com usuarioId:', currentUser.id);
      
      const response = await fetch(`${API_BASE_URL}/comentarios`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuarioId: currentUser.id,
          texto: novoComentario,
          demandaId: selectedDemanda.id
        })
      });

      const responseData = await response.json();
      console.log('[COMENTARIO] Resposta:', { status: response.status, data: responseData });

      if (!response.ok) {
        throw new Error(responseData.message || 'Erro ao adicionar comentário');
      }
      
      setComentarios([...comentarios, responseData.data]);
      setNovoComentario('');
      showToast('Comentário adicionado com sucesso', 'success');
    } catch (err: any) {
      console.error('[COMENTARIO ERROR]', err);
      showToast(err.message || 'Erro ao adicionar comentário', 'error');
    } finally {
      setIsAddingComment(false);
    }
  };

  const deletarComentario = async (comentarioId: string) => {
    try {
      const token = localStorage.getItem('nexus_token');
      if (!token) {
        showToast('Erro: Token não encontrado. Faça login novamente.', 'error');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/comentarios/${comentarioId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar comentário');
      }

      setComentarios(comentarios.filter(c => c.id !== comentarioId));
      showToast('Comentário deletado com sucesso', 'success');
    } catch (err: any) {
      console.error('[DELETE COMENTARIO ERROR]', err);
      showToast(err.message || 'Erro ao deletar comentário', 'error');
    }
  };

  const fazerUploadArquivo = async (file: File) => {
    if (!file || !selectedDemanda || !currentUser) return;

    try {
      setIsUploadingFile(true);
      const formData = new FormData();
      formData.append('arquivo', file);
      formData.append('demandaId', selectedDemanda.id);
      formData.append('empresaId', currentUser.empresaId || ''); // Campo obrigatório
      formData.append('nomeArquivo', file.name);
      formData.append('tipoArquivo', file.type);

      const token = localStorage.getItem('nexus_token');
      const response = await fetch(`${API_BASE_URL}/evidencias`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao enviar arquivo');
      }
      
      const novaEvidencia = await response.json();
      setEvidencias([...evidencias, novaEvidencia.data]);
      showToast('Arquivo enviado com sucesso', 'success');
    } catch (err: any) {
      console.error('[UPLOAD ERROR]', err);
      showToast(err.message || 'Erro ao enviar arquivo', 'error');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'ABERTA': '#ef4444',
      'EM_ANDAMENTO': '#f59e0b',
      'EM_REVISAO': '#8b5cf6',
      'BLOQUEADA': '#3578d4',
      'CONCLUIDA': '#2fb15d',
      'ATRASADA': '#dc2626'
    };
    return colors[status] || '#6b7280';
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'ABERTA': 'Aberta',
      'EM_ANDAMENTO': 'Em andamento',
      'EM_REVISAO': 'Em revisão',
      'BLOQUEADA': 'Bloqueada',
      'CONCLUIDA': 'Concluída',
      'ATRASADA': 'Atrasada'
    };
    return statusMap[status] || status;
  };

  const formatPrioridade = (prioridade: string) => {
    const prioridadeMap: Record<string, string> = {
      'ALTA': 'Alta',
      'MEDIA': 'Média',
      'BAIXA': 'Baixa'
    };
    return prioridadeMap[prioridade] || prioridade;
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-5 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3578d4] mb-3"></div>
          <p className="text-gray-500 text-sm">Carregando demandas...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto p-5 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={32} className="text-red-500 mb-3 mx-auto" />
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-[#3578d4] text-white rounded text-sm font-medium hover:bg-[#2d66b5]"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-5">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-[#1e315d]">Gestão de Demandas</h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowFormNew(true)}
            className="h-[34px] px-4 bg-[#3578d4] text-white text-[13px] font-bold rounded-[6px] flex items-center hover:bg-[#2d66b5] transition-colors"
          >
            + Inserir
          </button>
          <button className="h-[34px] px-3 bg-white border border-gray-200 text-gray-600 text-[12px] font-medium rounded-[6px] flex items-center hover:bg-gray-50 transition-colors">
            <FileSpreadsheet size={14} className="mr-2 text-green-600" />
            Excel
          </button>
          <button className="h-[34px] px-3 bg-white border border-gray-200 text-gray-600 text-[12px] font-medium rounded-[6px] flex items-center hover:bg-gray-50 transition-colors">
            <FileBarChart size={14} className="mr-2 text-blue-500" />
            Relatórios
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar demanda..." 
              className="h-[34px] w-[200px] bg-white border border-gray-200 rounded-[6px] pl-9 pr-3 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4]"
            />
          </div>
          <div className="relative">
            <select className="h-[34px] bg-white border border-gray-200 rounded-[6px] pl-3 pr-8 text-[12px] text-gray-600 outline-none appearance-none focus:ring-1 focus:ring-[#3578d4]">
              <option>Todas as áreas</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select className="h-[34px] bg-white border border-gray-200 rounded-[6px] pl-3 pr-8 text-[12px] text-gray-600 outline-none appearance-none focus:ring-1 focus:ring-[#3578d4]">
              <option>Todos os status</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select className="h-[34px] bg-white border border-gray-200 rounded-[6px] pl-3 pr-8 text-[12px] text-gray-600 outline-none appearance-none focus:ring-1 focus:ring-[#3578d4]">
              <option>Todas as prioridades</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button className="h-[34px] w-[34px] flex items-center justify-center bg-white border border-gray-200 rounded-[6px] text-blue-500">
            <Filter size={14} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[10px] shadow-sm border border-gray-100 overflow-hidden">
        {demandas.length === 0 ? (
          <div className="p-12 text-center">
            <ListTodo size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Nenhuma demanda cadastrada</p>
            <p className="text-gray-400 text-sm mt-1">As demandas aparecerão aqui quando forem criadas</p>
          </div>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-gray-100">
                  <th className="py-3 px-4 w-10">
                    <input type="checkbox" className="rounded border-gray-300 text-[#3578d4] focus:ring-[#3578d4]" />
                  </th>
                  <th className="py-3 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                    <div className="flex items-center cursor-pointer hover:text-gray-700">
                      Título <ArrowUpDown size={10} className="ml-1" />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                    <div className="flex items-center cursor-pointer hover:text-gray-700">
                      Vencimento <ArrowUpDown size={10} className="ml-1" />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                    <div className="flex items-center cursor-pointer hover:text-gray-700">
                      Descrição <ArrowUpDown size={10} className="ml-1" />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                    <div className="flex items-center cursor-pointer hover:text-gray-700">
                      Responsável <ArrowUpDown size={10} className="ml-1" />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight">Prioridade</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight">Status</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight">Progresso</th>
                  <th className="py-3 px-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight">Ação</th>
                </tr>
              </thead>
              <tbody>
                {demandas.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-2.5 px-4">
                      <input type="checkbox" className="rounded border-gray-300 text-[#3578d4] focus:ring-[#3578d4]" />
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[12px] font-medium text-[#1e315d]">{item.titulo}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[12px] text-gray-600">{formatDate(item.vencimento)}</span>
                    </td>
                    <td className="py-2.5 px-3 max-w-[240px]">
                      <span className="text-[12px] text-[#3578d4] font-medium cursor-pointer hover:underline truncate block">
                        {item.descricao}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[12px] text-gray-600">{item.responsavel?.nome || '-'}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <PriorityTag level={formatPrioridade(item.prioridade)} />
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusTag status={formatStatus(item.status)} />
                    </td>
                    <td className="py-2.5 px-3 w-[100px]">
                      <ProgressBar value={item.progresso || 0} color={getStatusColor(item.status)} />
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="relative">
                        <select 
                          className="bg-white border border-gray-200 rounded-[4px] px-2 py-1 text-[10px] text-gray-600 outline-none appearance-none pr-6 w-full cursor-pointer"
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAction(e.target.value, item);
                              e.target.value = '';
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="">— Ação —</option>
                          <option value="Ver detalhes">Ver detalhes</option>
                          <option value="Editar">Editar</option>
                          <option value="Alterar Status">Alterar Status</option>
                          <option value="Excluir">Excluir</option>
                        </select>
                        <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer / Pagination */}
            <div className="px-4 py-3 bg-white flex items-center justify-between border-t border-gray-100">
              <span className="text-[11px] text-gray-400 font-medium">Página 1 de 1 · {demandas.length} demanda{demandas.length !== 1 ? 's' : ''}</span>
              <div className="flex items-center space-x-1">
                <button className="px-2 py-1 text-[11px] text-gray-500 border border-gray-200 rounded hover:bg-gray-50">Ant</button>
                <button className="px-2.5 py-1 text-[11px] text-white bg-[#3578d4] rounded font-bold">1</button>
                <button className="px-2 py-1 text-[11px] text-gray-500 border border-gray-200 rounded hover:bg-gray-50">Seg</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de Detalhes/Edição */}
      {showModal && selectedDemanda && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-[1px]">
          <div className="bg-white rounded-[10px] shadow-2xl w-full max-w-[700px] overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-[16px] font-bold text-[#1e315d]">
                {modalMode === 'view' ? 'Detalhes da Demanda' : 'Editar Demanda'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {modalMode === 'view' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 uppercase">Título</label>
                      <p className="text-[14px] text-gray-800 font-medium mt-1">{selectedDemanda.titulo}</p>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 uppercase">Status</label>
                      <div className="mt-2">
                        <StatusTag status={formatStatus(selectedDemanda.status)} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 uppercase">Prioridade</label>
                      <p className="text-[14px] text-gray-800 font-medium mt-1">{formatPrioridade(selectedDemanda.prioridade)}</p>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 uppercase">Progresso</label>
                      <p className="text-[14px] text-gray-800 font-medium mt-1">{selectedDemanda.progresso || 0}%</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase">Descrição</label>
                    <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">{selectedDemanda.descricao}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 uppercase">Responsável</label>
                      <p className="text-[14px] text-gray-800 font-medium mt-1">{selectedDemanda.responsavel?.nome || '-'}</p>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 uppercase">Data Vencimento</label>
                      <p className="text-[14px] text-gray-800 font-medium mt-1">{formatDate(selectedDemanda.vencimento)}</p>
                    </div>
                  </div>

                  {/* Seção de Anexos */}
                  <div className="border-t border-gray-200 pt-4">
                    <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-2">
                      <Paperclip size={12} />
                      Anexos
                    </label>
                    <div className="mt-3">
                      <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-[6px] cursor-pointer hover:border-[#3578d4] hover:bg-blue-50 transition-colors">
                        <Upload size={16} className="text-gray-500" />
                        <span className="text-[12px] text-gray-600">Clique para enviar arquivo (fotos, documentos)</span>
                        <input 
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) fazerUploadArquivo(file);
                          }}
                          disabled={isUploadingFile}
                        />
                      </label>
                    </div>
                    {evidencias.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {evidencias.map((ev) => (
                          <div key={ev.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-[6px]">
                            <FileSpreadsheet size={14} className="text-gray-500" />
                            <a 
                              href={ev.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[12px] text-[#3578d4] hover:underline flex-1 truncate"
                            >
                              {ev.nomeArquivo || 'Arquivo'}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Seção de Comentários */}
                  <div className="border-t border-gray-200 pt-4">
                    <label className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-2">
                      <MessageSquare size={12} />
                      Comentários
                    </label>
                    
                    {/* Lista de Comentários */}
                    <div className="mt-3 max-h-[200px] overflow-y-auto space-y-2">
                      {comentarios.length > 0 ? (
                        comentarios.map((com) => (
                          <div key={com.id} className="p-3 bg-gray-50 rounded-[6px] group">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <UserCircle size={14} className="text-[#1e315d] flex-shrink-0" />
                                  <p className="text-[11px] font-bold text-[#1e315d]">
                                    {com.usuario?.nome || com.usuarioId || 'Usuário Anônimo'}
                                  </p>
                                </div>
                                <p className="text-[12px] text-gray-700 mt-2">{com.texto || com.conteudo}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <p className="text-[10px] text-gray-400 whitespace-nowrap">{com.createdAt ? new Date(com.createdAt).toLocaleDateString('pt-BR') : '-'}</p>
                                <select 
                                  onChange={(e) => {
                                    const action = e.target.value;
                                    if (action === 'editar') {
                                      // Implementar edição
                                      console.log('Editar comentário:', com.id);
                                    } else if (action === 'deletar') {
                                      setCommentToDeleteId(com.id);
                                      setShowDeleteCommentModal(true);
                                    }
                                    e.target.value = '';
                                  }}
                                  defaultValue=""
                                  className="h-[28px] px-2 bg-white border border-gray-300 rounded-[4px] text-[10px] text-gray-700 outline-none focus:ring-1 focus:ring-[#3578d4] cursor-pointer appearance-none pr-6 font-semibold"
                                  style={{
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%23666%22 d=%22M0 0l6 8 6-8z%22/%3E%3C/svg%3E")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 4px center',
                                    backgroundSize: '12px',
                                    paddingRight: '20px'
                                  }}
                                  title="Selecionar ação"
                                >
                                  <option value="">Ação</option>
                                  <option value="editar">Editar</option>
                                  <option value="deletar">Deletar</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[12px] text-gray-400 italic">Nenhum comentário ainda</p>
                      )}
                    </div>

                    {/* Adicionar Comentário */}
                    <div className="mt-3 flex gap-2">
                      <input 
                        type="text"
                        value={novoComentario}
                        onChange={(e) => setNovoComentario(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && adicionarComentario()}
                        placeholder="Digite seu comentário..."
                        className="flex-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                      />
                      <button 
                        onClick={adicionarComentario}
                        disabled={isAddingComment || !novoComentario.trim()}
                        className="px-3 py-2 bg-[#3578d4] text-white rounded-[6px] text-[12px] font-medium hover:bg-[#2d66b5] transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {isAddingComment ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600">Título</label>
                    <input 
                      type="text" 
                      value={editFormData.titulo}
                      onChange={(e) => setEditFormData({ ...editFormData, titulo: e.target.value })}
                      className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600">Descrição</label>
                    <textarea 
                      value={editFormData.descricao}
                      onChange={(e) => setEditFormData({ ...editFormData, descricao: e.target.value })}
                      className="w-full mt-1 h-[80px] bg-white border border-gray-200 rounded-[6px] px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-600">Status</label>
                      <select 
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                        className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-2 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                      >
                        <option value="ABERTA">Aberta</option>
                        <option value="EM_ANDAMENTO">Em andamento</option>
                        <option value="EM_REVISAO">Em revisão</option>
                        <option value="BLOQUEADA">Bloqueada</option>
                        <option value="CONCLUIDA">Concluída</option>
                        <option value="ATRASADA">Atrasada</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-600">Prioridade</label>
                      <select 
                        value={editFormData.prioridade}
                        onChange={(e) => setEditFormData({ ...editFormData, prioridade: e.target.value })}
                        className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-2 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                      >
                        <option value="ALTA">Alta</option>
                        <option value="MEDIA">Média</option>
                        <option value="BAIXA">Baixa</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-600">Progresso %</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="100"
                        value={editFormData.progresso || 0}
                        onChange={(e) => setEditFormData({ ...editFormData, progresso: parseInt(e.target.value) })}
                        className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600">Data Vencimento</label>
                    <input 
                      type="date" 
                      value={editFormData.vencimento ? (typeof editFormData.vencimento === 'string' ? (editFormData.vencimento || '').split('T')[0] : '') : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, vencimento: e.target.value })}
                      className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600">Responsável</label>
                    <select 
                      value={editFormData.responsavelId || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, responsavelId: e.target.value || null })}
                      className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-2 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                    >
                      <option value="">Sem responsável</option>
                      {usuariosAdminList && usuariosAdminList.length > 0 ? (
                        usuariosAdminList.map((usuario) => (
                          <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                        ))
                      ) : (
                        <option disabled>Nenhum técnico disponível</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600">Projeto (opcional)</label>
                    <select 
                      value={editFormData.projetoId || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, projetoId: e.target.value || null })}
                      className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-2 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                    >
                      <option value="">Nenhum projeto</option>
                      {projetosData && projetosData.length > 0 ? (
                        projetosData.map((projeto) => (
                          <option key={projeto.id} value={projeto.id}>{projeto.nome}</option>
                        ))
                      ) : (
                        <option disabled>Nenhum projeto disponível</option>
                      )}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-[6px] text-[13px] font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {modalMode === 'view' ? 'Fechar' : 'Cancelar'}
              </button>
              {modalMode === 'edit' && (
                <button 
                  onClick={salvarEdicao}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#3578d4] text-white rounded-[6px] text-[13px] font-medium hover:bg-[#2d66b5] transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação de Demanda */}
      {showFormNew && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-[1px]">
          <div className="bg-white rounded-[10px] shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 z-10">
              <h2 className="text-[16px] font-bold text-[#1e315d]">Nova Demanda</h2>
              <button 
                onClick={() => {
                  setShowFormNew(false);
                  setNovaDemandata({
                    titulo: '',
                    descricao: '',
                    prioridade: 'MEDIA',
                    vencimento: '',
                    responsavelId: '',
                    empresaId: empresasData?.[0]?.id || '',
                    projetoId: ''
                  });
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent p-6 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}>
              <div>
                <label className="text-[11px] font-bold text-gray-600">Empresa *</label>
                <select 
                  value={novaDemandata.empresaId}
                  onChange={(e) => setNovaDemandata({ ...novaDemandata, empresaId: e.target.value })}
                  className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-2 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                >
                  <option value="">Selecione uma empresa</option>
                  {empresasData && empresasData.length > 0 ? (
                    empresasData.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
                    ))
                  ) : (
                    <option disabled>Nenhuma empresa disponível</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600">Projeto (opcional)</label>
                <select 
                  value={novaDemandata.projetoId}
                  onChange={(e) => setNovaDemandata({ ...novaDemandata, projetoId: e.target.value })}
                  className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-2 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                >
                  <option value="">Nenhum projeto</option>
                  {projetosData && projetosData.length > 0 ? (
                    projetosData.map((projeto) => (
                      <option key={projeto.id} value={projeto.id}>{projeto.nome}</option>
                    ))
                  ) : (
                    <option disabled>Nenhum projeto disponível</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600">Título *</label>
                <input 
                  type="text" 
                  value={novaDemandata.titulo}
                  onChange={(e) => setNovaDemandata({ ...novaDemandata, titulo: e.target.value })}
                  placeholder="Digite o título da demanda"
                  className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600">Descrição *</label>
                <textarea 
                  value={novaDemandata.descricao}
                  onChange={(e) => setNovaDemandata({ ...novaDemandata, descricao: e.target.value })}
                  placeholder="Digite a descrição da demanda"
                  className="w-full mt-1 h-[100px] bg-white border border-gray-200 rounded-[6px] px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600">Prioridade</label>
                  <select 
                    value={novaDemandata.prioridade}
                    onChange={(e) => setNovaDemandata({ ...novaDemandata, prioridade: e.target.value })}
                    className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-2 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                  >
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Média</option>
                    <option value="BAIXA">Baixa</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600">Data Vencimento</label>
                  <input 
                    type="date" 
                    value={novaDemandata.vencimento}
                    onChange={(e) => setNovaDemandata({ ...novaDemandata, vencimento: e.target.value })}
                    className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600">Responsável</label>
                <select 
                  value={novaDemandata.responsavelId}
                  onChange={(e) => setNovaDemandata({ ...novaDemandata, responsavelId: e.target.value })}
                  className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-2 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                >
                  <option value="">Selecione um responsável</option>
                  {usuariosAdminList && usuariosAdminList.length > 0 ? (
                    usuariosAdminList.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                    ))
                  ) : (
                    <option disabled>Nenhum técnico disponível</option>
                  )}
                </select>
              </div>

              <div className="bg-blue-50 rounded-[10px] border border-blue-200/50 px-4 py-3 mt-4">
                <p className="text-[12px] text-blue-800 flex items-start gap-2">
                  <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    A demanda será criada com status "Aberta" e progresso 0%.
                  </span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 z-10">
              <button 
                onClick={() => {
                  setShowFormNew(false);
                  setNovaDemandata({
                    titulo: '',
                    descricao: '',
                    prioridade: 'MEDIA',
                    vencimento: '',
                    responsavelId: '',
                    empresaId: empresasData?.[0]?.id || '',
                    projetoId: ''
                  });
                }}
                disabled={isCreating}
                className="px-4 py-2 border border-gray-200 rounded-[6px] text-[13px] font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={criarNovaDemanda}
                disabled={isCreating}
                className="px-4 py-2 bg-[#3578d4] text-white rounded-[6px] text-[13px] font-medium hover:bg-[#2d66b5] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Criar Demanda
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação Elegante */}
      {showConfirmDelete && confirmDeleteDemanda && (
        <div className="fixed inset-0 bg-black/50 z-[150] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[450px] overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header com ícone */}
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 px-6 py-6 border-b border-red-200/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#1e315d]">Excluir demanda?</h3>
                <p className="text-[13px] text-gray-500 mt-1">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            {/* Body com contexto */}
            <div className="px-6 py-5">
              <div className="bg-gray-50 rounded-[10px] p-4 mb-4 border border-gray-200">
                <p className="text-[12px] text-gray-500 uppercase tracking-wide mb-2">Demanda a excluir</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-[13px] text-gray-600">
                      <span className="font-semibold text-[#1e315d]">{confirmDeleteDemanda.titulo}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-full font-medium">
                      {formatPrioridade(confirmDeleteDemanda.prioridade)}
                    </span>
                    <span className="text-gray-500">
                      Criada em {formatDate(confirmDeleteDemanda.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-[10px] border border-yellow-200/50 px-4 py-3">
                <p className="text-[12px] text-yellow-800 flex items-start gap-2">
                  <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Todas as evidências e comentários vinculados à demanda também serão removidos.
                  </span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => {
                  setShowConfirmDelete(false);
                  setConfirmDeleteDemanda(null);
                }}
                disabled={isDeleting}
                className="px-5 py-2.5 border border-gray-300 rounded-[8px] text-[13px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={() => excluirDemanda(confirmDeleteDemanda.id)}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-600 text-white rounded-[8px] text-[13px] font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Excluir demanda
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alteração de Status */}
      {showStatusDropdown && selectedDemandaForStatus && (
        <div className="fixed inset-0 bg-black/40 z-[150] flex items-center justify-center p-4 backdrop-blur-[1px]">
          <div className="bg-white rounded-[10px] shadow-2xl w-full max-w-[400px] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[16px] font-bold text-[#1e315d]">Alterar Status</h2>
              <button 
                onClick={() => {
                  setShowStatusDropdown(false);
                  setSelectedDemandaForStatus(null);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-[13px] text-gray-600 mb-4">
                <span className="font-semibold text-[#1e315d]">{selectedDemandaForStatus.titulo}</span>
              </p>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={async () => {
                      await atualizarStatus(selectedDemandaForStatus.id, status.value);
                      setShowStatusDropdown(false);
                      setSelectedDemandaForStatus(null);
                    }}
                    className={`w-full px-4 py-3 rounded-[6px] text-left text-[13px] font-medium transition-colors flex items-center gap-2 ${
                      selectedDemandaForStatus.status === status.value
                        ? 'bg-blue-50 text-[#3578d4] border-2 border-[#3578d4]'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: status.color }}
                    />
                    {status.label}
                    {selectedDemandaForStatus.status === status.value && (
                      <Check size={16} className="ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
              <button 
                onClick={() => {
                  setShowStatusDropdown(false);
                  setSelectedDemandaForStatus(null);
                }}
                className="px-4 py-2 border border-gray-200 rounded-[6px] text-[13px] font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exclusão de Comentário */}
      {showDeleteCommentModal && commentToDeleteId && (
        <div className="fixed inset-0 bg-black/50 z-[150] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[420px] overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header com ícone */}
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 px-6 py-6 border-b border-red-200/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#1e315d]">Excluir comentário?</h3>
                <p className="text-[13px] text-gray-500 mt-1">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <div className="bg-gray-50 rounded-[10px] p-4 mb-4 border border-gray-200">
                <p className="text-[12px] text-gray-500 uppercase tracking-wide mb-2 font-semibold">Comentário a excluir</p>
                {comentarios.find(c => c.id === commentToDeleteId) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserCircle size={14} className="text-[#1e315d] flex-shrink-0" />
                      <p className="text-[13px] font-semibold text-[#1e315d]">
                        {comentarios.find(c => c.id === commentToDeleteId)?.usuario?.nome || 'Usuário'}
                      </p>
                    </div>
                    <p className="text-[12px] text-gray-600 bg-white rounded-[6px] p-2 border border-gray-200">
                      {comentarios.find(c => c.id === commentToDeleteId)?.texto || 'Sem texto'}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 rounded-[10px] border border-yellow-200/50 px-4 py-3">
                <p className="text-[12px] text-yellow-800 flex items-start gap-2">
                  <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Você tem certeza que deseja excluir este comentário?
                  </span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => {
                  setShowDeleteCommentModal(false);
                  setCommentToDeleteId(null);
                }}
                disabled={isAddingComment}
                className="px-5 py-2.5 border border-gray-300 rounded-[8px] text-[13px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (commentToDeleteId) {
                    deletarComentario(commentToDeleteId);
                    setShowDeleteCommentModal(false);
                    setCommentToDeleteId(null);
                  }
                }}
                disabled={isAddingComment}
                className="px-5 py-2.5 bg-red-600 text-white rounded-[8px] text-[13px] font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isAddingComment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Excluir comentário
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-[10px] shadow-2xl backdrop-blur-sm animation-in fade-in slide-in-from-bottom-5 duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-500/95 text-white' 
            : 'bg-red-500/95 text-white'
        }`}>
          <div className="flex items-center gap-3 flex-1">
            {toast.type === 'success' ? (
              <div className="flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <span className="text-[14px] font-medium">{toast.message}</span>
          </div>
          <div className="flex-shrink-0 h-1 w-16 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/80 animate-pulse"
              style={{
                width: '100%',
                animation: 'shrink 4s linear forwards'
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </main>
  );
};

const ProjetosView = ({ onEdit, onViewDetail, currentUser, empresasData, authToken, onSyncData }: { onEdit: (project: any) => void, onViewDetail: (project: any) => void, currentUser: any, empresasData: any[], authToken: string, onSyncData: () => Promise<void> }) => {
  const [projetos, setProjetos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjeto, setSelectedProjeto] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; id: number } | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmDeleteProjeto, setConfirmDeleteProjeto] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFormNew, setShowFormNew] = useState(false);
  const [novoProjeto, setNovoProjeto] = useState({
    nome: '',
    descricao: '',
    status: 'PLANEJAMENTO',
    dataInicio: '',
    dataPrevista: '',
    empresaId: empresasData?.[0]?.id || ''
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const loadProjetos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('nexus_token');
        if (!token) {
          setError('Token não encontrado');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/projetos`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setProjetos(data.data || []);
      } catch (err) {
        console.error('Erro ao carregar projetos:', err);
        setError('Falha ao carregar projetos. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProjetos();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => setToast(null), 4000);
  };

  const salvarEdicao = async () => {
    if (!editFormData) return;
    try {
      setIsSaving(true);
      const token = localStorage.getItem('nexus_token');
      const response = await fetch(`${API_BASE_URL}/projetos/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: editFormData.nome,
          descricao: editFormData.descricao,
          status: editFormData.status,
          progresso: editFormData.progresso,
          dataInicio: editFormData.dataInicio,
          dataPrevista: editFormData.dataPrevista,
          responsavelId: editFormData.responsavelId || null
        })
      });

      if (!response.ok) throw new Error('Erro ao salvar');
      
      const resultado = await response.json();
      setShowEditModal(false);
      showToast('Projeto atualizado com sucesso', 'success');
      await onSyncData();
    } catch (err) {
      console.error('Erro:', err);
      showToast('Erro ao atualizar projeto', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const excluirProjeto = async (id: string) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('nexus_token');
      const response = await fetch(`${API_BASE_URL}/projetos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erro ao excluir');
      
      setProjetos(projetos.filter(p => p.id !== id));
      setShowConfirmDelete(false);
      setConfirmDeleteProjeto(null);
      showToast('Projeto excluído com sucesso', 'success');
    } catch (err) {
      console.error('Erro:', err);
      showToast('Erro ao excluir projeto', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const criarNovoProjeto = async () => {
    if (!novoProjeto.nome.trim() || !novoProjeto.descricao.trim()) {
      showToast('Preencha nome e descrição', 'error');
      return;
    }

    try {
      setIsCreating(true);
      const token = localStorage.getItem('nexus_token');
      
      const response = await fetch(`${API_BASE_URL}/projetos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: novoProjeto.nome,
          descricao: novoProjeto.descricao,
          status: novoProjeto.status,
          dataInicio: novoProjeto.dataInicio ? new Date(novoProjeto.dataInicio).toISOString() : null,
          dataPrevista: novoProjeto.dataPrevista ? new Date(novoProjeto.dataPrevista).toISOString() : null,
          empresaId: novoProjeto.empresaId,
          progresso: 0
        })
      });

      if (!response.ok) throw new Error('Erro ao criar projeto');
      
      const resultado = await response.json();
      setProjetos([resultado.data, ...projetos]);
      setShowFormNew(false);
      setNovoProjeto({
        nome: '',
        descricao: '',
        status: 'PLANEJAMENTO',
        dataInicio: '',
        dataPrevista: '',
        empresaId: empresasData?.[0]?.id || ''
      });
      showToast('Projeto criado com sucesso', 'success');
      await onSyncData();
    } catch (err) {
      console.error('Erro:', err);
      showToast('Erro ao criar projeto', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { color: string; border: string }> = {
      'PLANEJAMENTO': { color: 'bg-gray-50 text-gray-500', border: 'border-t-[#9ca3af]' },
      'EM_EXECUCAO': { color: 'bg-blue-50 text-blue-500', border: 'border-t-[#3578d4]' },
      'CONCLUIDO': { color: 'bg-green-50 text-green-500', border: 'border-t-[#2fb15d]' },
      'ATRASADO': { color: 'bg-red-50 text-red-500', border: 'border-t-[#ef4444]' },
      'SUSPENSO': { color: 'bg-orange-50 text-orange-500', border: 'border-t-[#f59e0b]' }
    };
    return colors[status] || colors['PLANEJAMENTO'];
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'PLANEJAMENTO': 'Planejamento',
      'EM_EXECUCAO': 'Em execução',
      'CONCLUIDO': 'Concluído',
      'ATRASADO': 'Atrasado',
      'SUSPENSO': 'Suspenso'
    };
    return statusMap[status] || status;
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getProgressColor = (status: string) => {
    const colors: Record<string, string> = {
      'PLANEJAMENTO': '#9ca3af',
      'EM_EXECUCAO': '#3578d4',
      'CONCLUIDO': '#2fb15d',
      'ATRASADO': '#ef4444',
      'SUSPENSO': '#f59e0b'
    };
    return colors[status] || '#3578d4';
  };

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-5 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3578d4] mb-3"></div>
          <p className="text-gray-500 text-sm">Carregando projetos...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto p-5 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={32} className="text-red-500 mb-3 mx-auto" />
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-[#3578d4] text-white rounded text-sm font-medium hover:bg-[#2d66b5]"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-5 bg-[#f3f4f6]">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-[#1e315d]">Gestão de Projetos</h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-[6px] shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowFormNew(true)}
            className="h-[34px] px-4 bg-[#3578d4] text-white text-[13px] font-bold rounded-[6px] flex items-center hover:bg-[#2d66b5] transition-colors"
          >
            + Novo Projeto
          </button>
          <button className="h-[34px] px-3 bg-white border border-gray-200 text-gray-600 text-[12px] font-medium rounded-[6px] flex items-center hover:bg-gray-50 transition-colors">
            <FileBarChart size={14} className="mr-2 text-blue-500" />
            Exportar
          </button>
          <div className="w-[1px] h-6 bg-gray-200 mx-2" />
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar projeto..." 
              className="h-[34px] w-[200px] bg-white border border-gray-200 rounded-[6px] pl-9 pr-3 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4]"
            />
          </div>
          <div className="relative">
            <select className="h-[34px] bg-white border border-gray-200 rounded-[6px] pl-3 pr-8 text-[12px] text-gray-600 outline-none appearance-none focus:ring-1 focus:ring-[#3578d4]">
              <option>Todos os status</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {projetos.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Briefcase size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Nenhum projeto cadastrado</p>
            <p className="text-gray-400 text-sm mt-1">Os projetos aparecerão aqui quando forem criados</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {projetos.map((projeto) => {
            const statusInfo = getStatusColor(projeto.status);
            return (
              <div 
                key={projeto.id} 
                className={cn("bg-white rounded-[10px] shadow-sm border border-gray-100 border-t-4 p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow", statusInfo.border)}
                onClick={() => onViewDetail(projeto)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-[14px] font-bold text-[#1e315d] leading-tight flex-1 mr-2">{projeto.titulo}</h3>
                  <span className={cn("px-2 py-0.5 rounded-[6px] text-[10px] font-bold whitespace-nowrap", statusInfo.color)}>
                    {formatStatus(projeto.status)}
                  </span>
                </div>
                
                <p className="text-[11px] text-gray-500 mb-4 line-clamp-3 leading-relaxed min-h-[48px]">
                  {projeto.descricao || 'Sem descrição'}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {projeto.responsavel && (
                    <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                      <User size={10} className="text-blue-500 mr-1.5" />
                      <span className="text-[9px] text-gray-600 font-medium">{projeto.responsavel?.nome || '-'}</span>
                    </div>
                  )}
                  {projeto.demandasCount && (
                    <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                      <ListTodo size={10} className="text-orange-500 mr-1.5" />
                      <span className="text-[9px] text-gray-600 font-medium">{projeto.demandasCount} demandas</span>
                    </div>
                  )}
                  {projeto.dataFim && (
                    <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                      <Clock size={10} className="text-blue-400 mr-1.5" />
                      <span className="text-[9px] text-gray-600 font-medium">{formatDate(projeto.dataFim)}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Progresso</span>
                    <span className="text-[10px] font-bold text-blue-500">{projeto.progresso || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-[6px] overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500" 
                      style={{ width: `${projeto.progresso || 0}%`, backgroundColor: getProgressColor(projeto.status) }}
                    />
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Início: {formatDate(projeto.dataInicio)}</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProjeto(projeto);
                        setEditFormData({ ...projeto });
                        setShowEditModal(true);
                      }}
                      className="px-3 py-1 border border-gray-200 rounded-[4px] text-[10px] font-bold text-gray-500 hover:bg-gray-50"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteProjeto(projeto);
                        setShowConfirmDelete(true);
                      }}
                      className="px-3 py-1 border border-red-100 rounded-[4px] text-[10px] font-bold text-red-400 hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showConfirmDelete && confirmDeleteProjeto && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-[1px]">
          <div className="bg-white rounded-[10px] shadow-2xl w-full max-w-[400px] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-red-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 size={18} className="text-red-600" />
                </div>
                <h2 className="text-[14px] font-bold text-red-600">Excluir Projeto</h2>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="text-[12px] text-gray-600 mb-3">Tem certeza que deseja excluir este projeto?</p>
                <div className="bg-gray-50 rounded-[8px] p-3 border border-gray-100">
                  <p className="text-[12px] font-bold text-gray-700">{confirmDeleteProjeto.nome}</p>
                  <p className="text-[11px] text-gray-500 mt-1">ID: {confirmDeleteProjeto.id}</p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-[10px] border border-yellow-200/50 px-4 py-3">
                <p className="text-[12px] text-yellow-800 flex items-start gap-2">
                  <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Todas as demandas e comentários vinculados ao projeto também serão removidos.
                  </span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => {
                  setShowConfirmDelete(false);
                  setConfirmDeleteProjeto(null);
                }}
                disabled={isDeleting}
                className="px-5 py-2.5 border border-gray-300 rounded-[8px] text-[13px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={() => excluirProjeto(confirmDeleteProjeto.id)}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-600 text-white rounded-[8px] text-[13px] font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Excluir projeto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-[1px]">
          <div className="bg-white rounded-[10px] shadow-2xl w-full max-w-[600px] overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-[16px] font-bold text-[#1e315d]">Editar Projeto</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-600">Nome *</label>
                <input 
                  type="text" 
                  value={editFormData.nome}
                  onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })}
                  className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600">Descrição</label>
                <textarea 
                  value={editFormData.descricao}
                  onChange={(e) => setEditFormData({ ...editFormData, descricao: e.target.value })}
                  className="w-full mt-1 h-[100px] bg-white border border-gray-200 rounded-[6px] px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4] resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600">Responsável</label>
                <input 
                  type="text" 
                  value={editFormData.responsavelId || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, responsavelId: e.target.value || null })}
                  placeholder="ID do responsável"
                  className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600">Status</label>
                  <select 
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                  >
                    <option value="PLANEJAMENTO">Planejamento</option>
                    <option value="EM_ANDAMENTO">Em Andamento</option>
                    <option value="EM_REVISAO">Em Revisão</option>
                    <option value="CONCLUIDO">Concluído</option>
                    <option value="ATRASADO">Atrasado</option>
                    <option value="BLOQUEADO">Bloqueado</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600">Progresso (%)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={editFormData.progresso}
                    onChange={(e) => setEditFormData({ ...editFormData, progresso: parseInt(e.target.value) })}
                    className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600">Data Início</label>
                  <input 
                    type="date" 
                    value={editFormData.dataInicio}
                    onChange={(e) => setEditFormData({ ...editFormData, dataInicio: e.target.value })}
                    className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600">Data Término Previsto</label>
                  <input 
                    type="date" 
                    value={editFormData.dataPrevista}
                    onChange={(e) => setEditFormData({ ...editFormData, dataPrevista: e.target.value })}
                    className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-[6px] text-[13px] font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={salvarEdicao}
                disabled={isSaving}
                className="px-4 py-2 bg-[#3578d4] text-white rounded-[6px] text-[13px] font-medium hover:bg-[#2d66b5] transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação de Projeto */}
      {showFormNew && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-[1px]">
          <div className="bg-white rounded-[10px] shadow-2xl w-full max-w-[600px] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[16px] font-bold text-[#1e315d]">Novo Projeto</h2>
              <button 
                onClick={() => {
                  setShowFormNew(false);
                  setNovoProjeto({
                    nome: '',
                    descricao: '',
                    status: 'PLANEJAMENTO',
                    dataInicio: '',
                    dataPrevista: '',
                    empresaId: empresasData?.[0]?.id || ''
                  });
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-600">Empresa *</label>
                <select 
                  value={novoProjeto.empresaId}
                  onChange={(e) => setNovoProjeto({ ...novoProjeto, empresaId: e.target.value })}
                  className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-2 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                >
                  <option value="">Selecione uma empresa</option>
                  {empresasData && empresasData.length > 0 ? (
                    empresasData.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
                    ))
                  ) : (
                    <option disabled>Nenhuma empresa disponível</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600">Nome do Projeto *</label>
                <input 
                  type="text" 
                  value={novoProjeto.nome}
                  onChange={(e) => setNovoProjeto({ ...novoProjeto, nome: e.target.value })}
                  placeholder="Digite o nome do projeto"
                  className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600">Descrição *</label>
                <textarea 
                  value={novoProjeto.descricao}
                  onChange={(e) => setNovoProjeto({ ...novoProjeto, descricao: e.target.value })}
                  placeholder="Digite a descrição do projeto"
                  className="w-full mt-1 h-[100px] bg-white border border-gray-200 rounded-[6px] px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600">Status</label>
                  <select 
                    value={novoProjeto.status}
                    onChange={(e) => setNovoProjeto({ ...novoProjeto, status: e.target.value })}
                    className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                  >
                    <option value="PLANEJAMENTO">Planejamento</option>
                    <option value="EM_ANDAMENTO">Em Andamento</option>
                    <option value="EM_REVISAO">Em Revisão</option>
                    <option value="CONCLUIDO">Concluído</option>
                    <option value="ATRASADO">Atrasado</option>
                    <option value="BLOQUEADO">Bloqueado</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600">Data Início</label>
                  <input 
                    type="date" 
                    value={novoProjeto.dataInicio}
                    onChange={(e) => setNovoProjeto({ ...novoProjeto, dataInicio: e.target.value })}
                    className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600">Data Término Prevista</label>
                <input 
                  type="date" 
                  value={novoProjeto.dataPrevista}
                  onChange={(e) => setNovoProjeto({ ...novoProjeto, dataPrevista: e.target.value })}
                  className="w-full mt-1 h-[36px] bg-white border border-gray-200 rounded-[6px] px-3 text-[13px] outline-none focus:ring-1 focus:ring-[#3578d4]"
                />
              </div>

              <div className="bg-blue-50 rounded-[10px] border border-blue-200/50 px-4 py-3 mt-4">
                <p className="text-[12px] text-blue-800 flex items-start gap-2">
                  <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    O projeto será criado com status inicial e progresso 0%.
                  </span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => {
                  setShowFormNew(false);
                  setNovoProjeto({
                    nome: '',
                    descricao: '',
                    status: 'PLANEJAMENTO',
                    dataInicio: '',
                    dataPrevista: '',
                    empresaId: empresasData?.[0]?.id || ''
                  });
                }}
                disabled={isCreating}
                className="px-4 py-2 border border-gray-200 rounded-[6px] text-[13px] font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={criarNovoProjeto}
                disabled={isCreating}
                className="px-4 py-2 bg-[#3578d4] text-white rounded-[6px] text-[13px] font-medium hover:bg-[#2d66b5] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Criar Projeto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-[10px] shadow-2xl backdrop-blur-sm animation-in fade-in slide-in-from-bottom-5 duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className={`text-[13px] font-medium ${
            toast.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {toast.message}
          </span>
          <div className={`h-1 w-20 rounded-full overflow-hidden ${
            toast.type === 'success' ? 'bg-green-200' : 'bg-red-200'
          }`}>
            <div 
              className={`h-full ${
                toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              }`}
              style={{
                animation: 'shrink 4s linear forwards'
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

const EditProjectModal = ({ project, onClose }: { project: any, onClose: () => void }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-[1px]">
      <div className="bg-white rounded-[10px] shadow-2xl w-full max-w-[600px] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="text-[14px] font-bold text-[#1e315d]">Editar Projeto</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600">Nome do projeto *</label>
              <input 
                type="text" 
                defaultValue={project.titulo}
                className="w-full h-[32px] bg-white border border-gray-200 rounded-[6px] px-3 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4] placeholder:text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600">Responsável</label>
              <input 
                type="text" 
                defaultValue={project.responsavel}
                className="w-full h-[32px] bg-white border border-gray-200 rounded-[6px] px-3 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4] placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600">Data de início</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue={project.inicio}
                  className="w-full h-[32px] bg-white border border-gray-200 rounded-[6px] px-3 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4] placeholder:text-gray-300"
                />
                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600">Data de término</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue={project.vencimento}
                  className="w-full h-[32px] bg-white border border-gray-200 rounded-[6px] px-3 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4] placeholder:text-gray-300"
                />
                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600">Status</label>
              <div className="relative">
                <select 
                  defaultValue={project.status}
                  className="w-full h-[32px] bg-white border border-gray-200 rounded-[6px] pl-3 pr-8 text-[12px] text-gray-600 outline-none appearance-none focus:ring-1 focus:ring-[#3578d4]"
                >
                  <option>Em andamento</option>
                  <option>Atrasado</option>
                  <option>Planejamento</option>
                  <option>Concluído</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600">Progresso (%)</label>
              <input 
                type="text" 
                defaultValue={project.progresso}
                className="w-full h-[32px] bg-white border border-gray-200 rounded-[6px] px-3 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4] placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-600">Descrição</label>
            <textarea 
              defaultValue={project.descricao}
              rows={4}
              className="w-full bg-white border border-gray-200 rounded-[6px] p-3 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4] resize-none placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white border-t border-gray-50 flex items-center justify-end space-x-2">
          <button 
            onClick={onClose}
            className="h-[32px] px-5 bg-white border border-gray-200 text-gray-600 text-[12px] font-bold rounded-[6px] hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onClose}
            className="h-[32px] px-5 bg-[#3578d4] text-white text-[12px] font-bold rounded-[6px] hover:bg-[#2d66b5] transition-colors shadow-sm"
          >
            Salvar projeto
          </button>
        </div>
      </div>
    </div>
  );
};

const EvidenciasView = ({ onAdd, onEdit, syncVersion }: { onAdd: () => void, onEdit: (item: any) => void, syncVersion?: number }) => {
  const [evidenciasAPI, setEvidenciasAPI] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmEvidencia, setConfirmEvidencia] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusOptions = [
    { value: 'Todos', label: 'Todos os status' },
    { value: 'Válida', label: 'Válida' },
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Atrasada', label: 'Atrasada' },
    { value: 'Rejeitada', label: 'Rejeitada' }
  ];

  useEffect(() => {
    const loadEvidencias = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('nexus_token');
        if (!token) {
          setError('Token não encontrado');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/evidencias`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Erro ao carregar evidências');
        
        const data = await response.json();
        setEvidenciasAPI(data.data || []);
      } catch (err) {
        console.error('Erro:', err);
        setError('Erro ao carregar evidências');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvidencias();
  }, [syncVersion]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const abrirConfirmacaoDelete = (evidencia: any) => {
    setConfirmEvidencia(evidencia);
    setShowConfirmDelete(true);
  };

  const confirmarExclusao = async () => {
    if (!confirmEvidencia) return;
    
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('nexus_token');
      const response = await fetch(`${API_BASE_URL}/evidencias/${confirmEvidencia.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erro ao excluir');
      
      setEvidenciasAPI(evidenciasAPI.filter(e => e.id !== confirmEvidencia.id));
      setShowConfirmDelete(false);
      setConfirmEvidencia(null);
      showToast('Evidência excluída com sucesso', 'success');
    } catch (err) {
      console.error('Erro:', err);
      showToast('Erro ao excluir evidência', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Válida': return 'bg-green-50 text-green-600';
      case 'Pendente': return 'bg-orange-50 text-orange-600';
      case 'Atrasada': return 'bg-red-50 text-red-600';
      case 'Rejeitada': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getFileIcon = (tipo?: string) => {
    switch(tipo) {
      case 'pdf': return 'bg-purple-50 text-purple-400';
      case 'docx': return 'bg-yellow-50 text-yellow-500';
      case 'xlsx': return 'bg-green-50 text-green-500';
      case 'png': return 'bg-blue-50 text-blue-500';
      default: return 'bg-purple-50 text-purple-400';
    }
  };

  const getFileIconComponent = (tipo?: string) => {
    switch(tipo) {
      case 'pdf': return <FileText size={20} />;
      case 'docx': return <FileEdit size={20} />;
      case 'xlsx': return <FileSpreadsheet size={20} />;
      case 'png': return <ImageIcon size={20} />;
      default: return <Paperclip size={20} />;
    }
  };

  const filteredEvidencias = evidenciasAPI.filter(item => {
    const matchSearch = item.nomeArquivo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       item.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Todos' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <main className="flex-1 overflow-y-auto p-5 bg-[#f3f4f6]">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-[#1e315d]">Gestão de Evidências</h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-[6px] shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onAdd}
            className="h-[34px] px-4 bg-[#3578d4] text-white text-[13px] font-bold rounded-[6px] flex items-center hover:bg-[#2d66b5] transition-colors"
          >
            + Adicionar Evidência
          </button>
          <button className="h-[34px] px-3 bg-white border border-gray-200 text-gray-600 text-[12px] font-medium rounded-[6px] flex items-center hover:bg-gray-50 transition-colors">
            <FileBarChart size={14} className="mr-2 text-blue-500" />
            Exportar
          </button>
          <div className="w-[1px] h-6 bg-gray-200 mx-2" />
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar evidência..." 
              className="h-[34px] w-[200px] bg-white border border-gray-200 rounded-[6px] pl-9 pr-3 text-[12px] outline-none focus:ring-1 focus:ring-[#3578d4]"
            />
          </div>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[34px] bg-white border border-gray-200 rounded-[6px] pl-3 pr-8 text-[12px] text-gray-600 outline-none appearance-none focus:ring-1 focus:ring-[#3578d4]"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-gray-300 border-t-[#3578d4] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-[13px]">Carregando evidências...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 text-center">
          <p className="text-red-600 text-[13px] font-medium">{error}</p>
        </div>
      ) : filteredEvidencias.length === 0 ? (
        <div className="bg-white rounded-[10px] p-12 text-center border border-gray-100">
          <Paperclip size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-[14px]">Nenhuma evidência encontrada</p>
          <p className="text-gray-400 text-[12px] mt-1">{searchTerm ? 'Tente ajustar seus filtros' : 'Comece adicionando uma evidência'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredEvidencias.map((item) => (
            <div key={item.id} className="bg-white rounded-[10px] shadow-sm border border-gray-100 p-4 flex flex-col hover:shadow-md transition-shadow">
              {/* Top Section */}
              <div className="flex items-start mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 mr-3",
                  getFileIcon(item.tipo)
                )}>
                  {getFileIconComponent(item.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-bold text-[#1e315d] truncate leading-tight mb-1">{item.nomeArquivo || 'Arquivo'}</h3>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-[10px] text-gray-400">
                      <Calendar size={10} className="mr-1" />
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '-'}
                    </div>
                    <div className="flex items-center text-[10px] text-gray-400">
                      <User size={10} className="mr-1" />
                      {item.usuario?.nome || '-'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Link Section */}
              {item.demanda && (
                <div className="bg-gray-50 rounded-[6px] px-3 py-1.5 flex items-center mb-3 border border-gray-100">
                  <LinkIcon size={10} className="text-gray-400 mr-2 shrink-0" />
                  <span className="text-[10px] text-gray-500 truncate font-medium">{item.demanda.titulo}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-[11px] text-gray-600 mb-4 line-clamp-2 leading-relaxed min-h-[32px]">
                {item.descricao || '-'}
              </p>

              {/* Footer */}
              <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className={cn("px-2 py-0.5 rounded-[4px] text-[9px] font-bold", getStatusColor(item.status))}>
                  {item.status || 'Pendente'}
                </span>
                <div className="flex items-center space-x-2">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 border border-blue-200 rounded-[4px] text-[10px] font-bold text-blue-600 hover:bg-blue-50"
                  >
                    Download
                  </a>
                  <button 
                    onClick={() => onEdit(item)}
                    className="px-3 py-1 border border-blue-100 rounded-[4px] text-[10px] font-bold text-blue-600 hover:bg-blue-50"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => abrirConfirmacaoDelete(item)}
                    className="px-3 py-1 border border-red-100 rounded-[4px] text-[10px] font-bold text-red-400 hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showConfirmDelete && confirmEvidencia && (
        <div className="fixed inset-0 bg-black/50 z-[150] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[450px] overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header com ícone */}
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 px-6 py-6 border-b border-red-200/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#1e315d]">Excluir evidência?</h3>
                <p className="text-[13px] text-gray-500 mt-1">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            {/* Body com contexto */}
            <div className="px-6 py-5">
              <div className="bg-gray-50 rounded-[10px] p-4 mb-4 border border-gray-200">
                <p className="text-[12px] text-gray-500 uppercase tracking-wide mb-2">Evidência a excluir</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-[13px] text-gray-600">
                      <span className="font-semibold text-[#1e315d]">{confirmEvidencia.nomeArquivo || 'Arquivo'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-full font-medium">
                      {confirmEvidencia.status || 'Pendente'}
                    </span>
                    <span className="text-gray-500">
                      Enviada em {confirmEvidencia.createdAt ? new Date(confirmEvidencia.createdAt).toLocaleDateString('pt-BR') : '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-[10px] border border-yellow-200/50 px-4 py-3">
                <p className="text-[12px] text-yellow-800 flex items-start gap-2">
                  <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>
                    A evidência será removida do banco de dados e não poderá ser recuperada.
                  </span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => {
                  setShowConfirmDelete(false);
                  setConfirmEvidencia(null);
                }}
                disabled={isDeleting}
                className="px-5 py-2.5 border border-gray-300 rounded-[8px] text-[13px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarExclusao}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-600 text-white rounded-[8px] text-[13px] font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Excluir evidência
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-[10px] shadow-2xl animation-in fade-in slide-in-from-bottom-5 duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-500/95 text-white' 
            : 'bg-red-500/95 text-white'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span className="text-[13px] font-medium">{toast.message}</span>
        </div>
      )}
    </main>
  );
};

// --- Mock Data for Report ---
const reportKpiData = [
  { title: 'Concluídas', value: '124', color: 'bg-[#2fb15d]', icon: CheckCircle2 },
  { title: 'Em andamento', value: '42', color: 'bg-[#3578d4]', icon: Clock },
  { title: 'Bloqueadas', value: '12', color: 'bg-[#ef4444]', icon: AlertCircle },
  { title: 'Taxa de conclusão', value: '82%', color: 'bg-[#7c3aed]', icon: FileBarChart },
];

const executionByProjectData = [
  { name: 'Plataforma B2B v3', progress: 78, target: 100 },
  { name: 'Conformidade ISO 27001', progress: 55, target: 100 },
  { name: 'Integração ERP SAP', progress: 34, target: 100 },
  { name: 'App Mobile Vendas', progress: 91, target: 100 },
  { name: 'Portal RH Digital', progress: 12, target: 100 },
  { name: 'Segurança Cibernética', progress: 45, target: 100 },
  { name: 'Redesign Portal Cliente', progress: 62, target: 100 },
];

const demandsByResponsibleData = [
  { responsible: 'Rafael Costa', total: 15, completed: 12, pending: 3 },
  { responsible: 'Carlos Borges', total: 12, completed: 8, pending: 4 },
  { responsible: 'Fernanda Silva', total: 18, completed: 15, pending: 3 },
  { responsible: 'Ana Lima', total: 10, completed: 6, pending: 4 },
  { responsible: 'Pedro Alves', total: 8, completed: 3, pending: 5 },
];

const summaryByStatusData = [
  { status: 'Concluída', count: 124, percent: 65, color: 'bg-green-50 text-green-600' },
  { status: 'Em andamento', count: 42, percent: 22, color: 'bg-blue-50 text-blue-600' },
  { status: 'Pendente', count: 15, percent: 8, color: 'bg-orange-50 text-orange-600' },
  { status: 'Bloqueada', count: 12, percent: 5, color: 'bg-red-50 text-red-600' },
];

const RelatorioExecucaoView = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Março / 2026');
  const [selectedArea, setSelectedArea] = useState('Todas as Áreas');

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('nexus_token');
        if (!token) {
          setError('Token não encontrado');
          return;
        }

        // Buscar dados da API
        const [demandasRes, projetosRes] = await Promise.all([
          fetch(`${API_BASE_URL}/demandas`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/projetos`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!demandasRes.ok || !projetosRes.ok) {
          throw new Error('Erro ao carregar dados para o relatório');
        }

        const demandasData = await demandasRes.json();
        const projetosData = await projetosRes.json();

        const demandas = demandasData.data || [];
        const projetos = projetosData.data || [];

        // Processar dados para o relatório
        // KPIs
        const concluidas = demandas.filter((d: any) => d.status === 'CONCLUIDA').length;
        const emAndamento = demandas.filter((d: any) => d.status === 'EM_ANDAMENTO').length;
        const bloqueadas = demandas.filter((d: any) => d.status === 'BLOQUEADA').length;
        const taxaConclusao = demandas.length > 0 ? Math.round((concluidas / demandas.length) * 100) : 0;

        const reportKpiData = [
          { title: 'Concluídas', value: String(concluidas), color: 'bg-[#2fb15d]', icon: CheckCircle2 },
          { title: 'Em andamento', value: String(emAndamento), color: 'bg-[#3578d4]', icon: Clock },
          { title: 'Bloqueadas', value: String(bloqueadas), color: 'bg-[#ef4444]', icon: AlertCircle },
          { title: 'Taxa de conclusão', value: `${taxaConclusao}%`, color: 'bg-[#7c3aed]', icon: FileBarChart },
        ];

        // Execução por Projeto
        const executionByProjectData = projetos.map((proj: any) => ({
          name: proj.nome,
          progress: proj.progresso || 0,
          target: 100,
        }));

        // Demandas por Responsável
        const demandsByResponsible: { [key: string]: { total: number; completed: number; pending: number } } = {};
        demandas.forEach((d: any) => {
          const responsavel = d.responsavel?.nome || 'Sem responsável';
          if (!demandsByResponsible[responsavel]) {
            demandsByResponsible[responsavel] = { total: 0, completed: 0, pending: 0 };
          }
          demandsByResponsible[responsavel].total++;
          if (d.status === 'CONCLUIDA') {
            demandsByResponsible[responsavel].completed++;
          } else if (d.status === 'EM_ANDAMENTO' || d.status === 'BLOQUEADA') {
            demandsByResponsible[responsavel].pending++;
          }
        });

        const demandsByResponsibleData = Object.entries(demandsByResponsible).map(([name, data]) => ({
          responsible: name,
          total: data.total,
          completed: data.completed,
          pending: data.pending,
        }));

        // Resumo por Status
        const statusSummary: { [key: string]: number } = {};
        demandas.forEach((d: any) => {
          const status = d.status === 'CONCLUIDA' ? 'Concluída' :
                        d.status === 'EM_ANDAMENTO' ? 'Em andamento' :
                        d.status === 'BLOQUEADA' ? 'Bloqueada' :
                        d.status === 'ABERTA' ? 'Aberta' :
                        d.status === 'EM_REVISAO' ? 'Em revisão' :
                        d.status === 'ATRASADA' ? 'Atrasada' : 'Outro';
          statusSummary[status] = (statusSummary[status] || 0) + 1;
        });

        const totalDemandas = demandas.length;
        const summaryByStatusData = Object.entries(statusSummary).map(([status, count]) => {
          const percent = totalDemandas > 0 ? Math.round((count / totalDemandas) * 100) : 0;
          const colorMap: { [key: string]: string } = {
            'Concluída': 'bg-green-50 text-green-600',
            'Em andamento': 'bg-blue-50 text-blue-600',
            'Pendente': 'bg-orange-50 text-orange-600',
            'Bloqueada': 'bg-red-50 text-red-600',
            'Aberta': 'bg-gray-50 text-gray-600',
            'Em revisão': 'bg-purple-50 text-purple-600',
            'Atrasada': 'bg-red-50 text-red-600',
          };
          return {
            status,
            count: count as number,
            percent,
            color: colorMap[status] || 'bg-gray-50 text-gray-600',
          };
        });

        setReportData({
          reportKpiData,
          executionByProjectData,
          demandsByResponsibleData,
          summaryByStatusData,
        });
      } catch (err) {
        console.error('Erro ao carregar relatório:', err);
        setError('Falha ao carregar dados do relatório. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadReportData();
  }, [selectedPeriod, selectedArea]);

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-4 space-y-3 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3578d4] mb-3"></div>
          <p className="text-gray-500 text-sm">Carregando relatório...</p>
        </div>
      </main>
    );
  }

  if (error || !reportData) {
    return (
      <main className="flex-1 overflow-y-auto p-4 space-y-3 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={32} className="text-red-500 mb-3 mx-auto" />
          <p className="text-red-600 font-medium">{error || 'Erro ao carregar relatório'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-[#3578d4] text-white rounded text-sm font-medium hover:bg-[#2d66b5]"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  const { reportKpiData, executionByProjectData, demandsByResponsibleData, summaryByStatusData } = reportData;

  return (
    <main className="flex-1 overflow-y-auto bg-[#f3f4f6]">
      {/* Toolbar */}
      <div className="h-[52px] bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => window.location.reload()}
            className="h-[32px] px-4 bg-[#3578d4] text-white text-[12px] font-bold rounded-[4px] hover:bg-[#2d66b5] transition-colors shadow-sm"
          >
            Atualizar Relatório
          </button>
          <button className="h-[32px] px-3 bg-white border border-gray-200 text-gray-600 text-[11px] font-bold rounded-[4px] flex items-center hover:bg-gray-50 transition-colors">
            <FileText size={14} className="mr-2 text-red-500" />
            Exportar PDF
          </button>
          <button className="h-[32px] px-3 bg-white border border-gray-200 text-gray-600 text-[11px] font-bold rounded-[4px] flex items-center hover:bg-gray-50 transition-colors">
            <FileSpreadsheet size={14} className="mr-2 text-green-600" />
            Exportar Excel
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Período:</span>
            <div className="relative">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="h-[32px] bg-gray-50 border border-gray-200 rounded-[4px] pl-3 pr-8 text-[11px] text-gray-600 font-bold outline-none appearance-none focus:ring-1 focus:ring-[#3578d4] min-w-[140px]"
              >
                <option>Março / 2026</option>
                <option>Fevereiro / 2026</option>
                <option>Janeiro / 2026</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Área:</span>
            <div className="relative">
              <select 
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="h-[32px] bg-gray-50 border border-gray-200 rounded-[4px] pl-3 pr-8 text-[11px] text-gray-600 font-bold outline-none appearance-none focus:ring-1 focus:ring-[#3578d4] min-w-[140px]"
              >
                <option>Todas as Áreas</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          {reportKpiData.map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-[6px] shadow-sm border border-gray-100 overflow-hidden flex h-[76px]">
              <div className={cn("w-[6px] shrink-0", kpi.color)} />
              <div className="flex items-center px-4 w-full">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mr-3", kpi.color.replace('bg-', 'bg-opacity-10 text-'))}>
                  <kpi.icon size={18} className={kpi.color.replace('bg-', 'text-')} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{kpi.title}</span>
                  <span className="text-xl font-bold text-[#1e315d] leading-none">{kpi.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart Card */}
        <div className="bg-white rounded-[8px] shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-bold text-[#1e315d]">Execução por Projeto</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Progresso real vs Meta estabelecida</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#3578d4] rounded-sm mr-2" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">Progresso %</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-100 rounded-sm mr-2" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">Meta %</span>
              </div>
            </div>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={executionByProjectData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                barGap={-24}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f1f1" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#1e315d', fontWeight: 600 }}
                  width={140}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                {/* Background Bar (Target) */}
                <Bar 
                  dataKey="target" 
                  fill="#f3f4f6" 
                  radius={[0, 4, 4, 0]} 
                  barSize={24}
                  isAnimationActive={false}
                />
                {/* Progress Bar */}
                <Bar 
                  dataKey="progress" 
                  fill="#3578d4" 
                  radius={[0, 4, 4, 0]} 
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row: Tables */}
        <div className="grid grid-cols-2 gap-4">
          {/* Table 1: Responsáveis */}
          <div className="bg-white rounded-[8px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h3 className="text-[14px] font-bold text-[#1e315d]">Demandas por Responsável</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Responsável</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Total</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Concluídas</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Pendentes</th>
                  </tr>
                </thead>
                <tbody>
                  {demandsByResponsibleData.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-5">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-50 text-[#3578d4] flex items-center justify-center text-[10px] font-bold mr-3">
                            {(item.responsible ?? '').split(' ').filter(Boolean).map((n: string) => n[0] ?? '').join('').substring(0, 2)}
                          </div>
                          <span className="text-[12px] font-bold text-[#1e315d]">{item.responsible}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[12px] font-bold text-gray-600">{item.total}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[12px] font-bold text-green-600">{item.completed}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[12px] font-bold text-orange-500">{item.pending}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Status Summary */}
          <div className="bg-white rounded-[8px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h3 className="text-[14px] font-bold text-[#1e315d]">Resumo por Status</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Quantidade</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">%</th>
                    <th className="py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryByStatusData.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-5">
                        <span className={cn("px-2.5 py-1 rounded-[4px] text-[10px] font-bold whitespace-nowrap", item.color)}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[12px] font-bold text-[#1e315d]">{item.count}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[12px] font-bold text-gray-500">{item.percent}%</span>
                      </td>
                      <td className="py-3 px-5">
                        <div className="w-full bg-gray-100 rounded-full h-[6px] overflow-hidden">
                          <div 
                            className="h-full transition-all duration-500" 
                            style={{ width: `${item.percent}%`, backgroundColor: item.color.includes('green') ? '#2fb15d' : item.color.includes('blue') ? '#3578d4' : item.color.includes('orange') ? '#f59e0b' : item.color.includes('purple') ? '#7c3aed' : '#ef4444' }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const DetalheProjetoView = ({ project, onBack, onEdit, onSyncData }: { project: any, onBack: () => void, onEdit: () => void, onSyncData: () => Promise<void> }) => {
  if (!project) return null;

  const [projetoEditando, setProjetoEditando] = useState(project);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [demandasVinculadas, setDemandasVinculadas] = useState<any[]>([]);
  const [isLoadingDemandas, setIsLoadingDemandas] = useState(false);
  
  const statusOptions = [
    { value: 'PLANEJAMENTO', label: 'Planejamento' },
    { value: 'EM_ANDAMENTO', label: 'Em andamento' },
    { value: 'EM_REVISAO', label: 'Em revisão' },
    { value: 'CONCLUIDO', label: 'Concluído' },
    { value: 'ATRASADO', label: 'Atrasado' },
    { value: 'BLOQUEADO', label: 'Bloqueado' }
  ];

  useEffect(() => {
    const loadDemandasVinculadas = async () => {
      try {
        setIsLoadingDemandas(true);
        const token = localStorage.getItem('nexus_token');
        if (!token || !project?.id) return;
        
        const response = await fetch(`${API_BASE_URL}/demandas?projetoId=${project?.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const resultado = await response.json();
          setDemandasVinculadas(resultado.data || []);
        }
      } catch (err) {
        console.error('Erro ao carregar demandas:', err);
      } finally {
        setIsLoadingDemandas(false);
      }
    };
    
    loadDemandasVinculadas();
  }, [project?.id]);

  const handleStatusChange = async (novoStatus: string) => {
    try {
      const token = localStorage.getItem('nexus_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/projetos/${project?.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: novoStatus })
      });

      if (response.ok) {
        setProjetoEditando({ ...projetoEditando, status: novoStatus });
        setStatusDropdown(false);
        await onSyncData();
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleProgressoChange = async (novoProgresso: number) => {
    try {
      const token = localStorage.getItem('nexus_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/projetos/${project?.id}/progresso`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ progresso: novoProgresso })
      });

      if (response.ok) {
        setProjetoEditando({ ...projetoEditando, progresso: novoProgresso });
        await onSyncData();
      }
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  };

  const calculateAutoProgresso = () => {
    if (demandasVinculadas.length === 0) return projetoEditando?.progresso || 0;
    const concluidas = demandasVinculadas.filter((d: any) => d.status === 'CONCLUIDA').length;
    return Math.round((concluidas / demandasVinculadas.length) * 100);
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-[28px] font-bold text-[#1e315d]">{projetoEditando?.nome}</h1>
          </div>
          <button 
            onClick={onEdit}
            className="px-4 py-2 bg-[#3578d4] text-white rounded-lg hover:bg-[#2d66b5] transition-colors"
          >
            Editar Projeto
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Descrição</p>
            <p className="text-lg text-gray-800">{projetoEditando?.descricao || 'Sem descrição'}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Data de Início</p>
            <p className="text-lg text-gray-800">{formatDate(projetoEditando?.dataInicio)}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Data Prevista</p>
            <p className="text-lg text-gray-800">{formatDate(projetoEditando?.dataPrevista)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1e315d]">Status e Progresso</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Status</p>
              <div className="relative">
                <button 
                  onClick={() => setStatusDropdown(!statusDropdown)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <span>{statusOptions.find(s => s.value === projetoEditando?.status)?.label || 'Selecionar'}</span>
                  <ChevronDown size={16} />
                </button>
                
                {statusDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {statusOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-sm"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Progresso: {projetoEditando?.progresso}%</p>
              <div className="flex items-center gap-4">
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={projetoEditando?.progresso || 0}
                  onChange={(e) => handleProgressoChange(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-gray-800 w-12">{projetoEditando?.progresso}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-[#1e315d] mb-4">Demandas Vinculadas ({demandasVinculadas.length})</h2>
          
          {isLoadingDemandas ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando demandas...</p>
            </div>
          ) : demandasVinculadas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma demanda vinculada a este projeto</p>
            </div>
          ) : (
            <div className="space-y-3">
              {demandasVinculadas.map((demanda: any) => (
                <div key={demanda.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{demanda.titulo}</p>
                    <p className="text-sm text-gray-500">{demanda.descricao}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm px-3 py-1 bg-gray-100 rounded-full">{demanda.status}</span>
                    <span className="text-sm font-medium">{demanda.progresso || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<'painel' | 'demandas' | 'projetos' | 'evidencias' | 'relatorio' | 'configuracoes' | 'detalhe-projeto' | 'notificacoes' | 'administracao' | 'usuarios-empresa'>('painel');
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('nexus_token'));
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const userStr = localStorage.getItem('nexus_user');
    return userStr ? JSON.parse(userStr) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(authToken));
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [dataSyncVersion, setDataSyncVersion] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isEmpresaModalOpen, setIsEmpresaModalOpen] = useState(false);
  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = useState(false);
  const [isSubusuarioModalOpen, setIsSubusuarioModalOpen] = useState(false);
  const [isUsuarioDetalheModalOpen, setIsUsuarioDetalheModalOpen] = useState(false);
  const [isUsuarioEditModalOpen, setIsUsuarioEditModalOpen] = useState(false);
  const [isEmpresaDetalheModalOpen, setIsEmpresaDetalheModalOpen] = useState(false);
  const [isConfirmacaoModalOpen, setIsConfirmacaoModalOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [allProjetos, setAllProjetos] = useState<any[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState<any>(null);
  const [selectedUsuario, setSelectedUsuario] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [notificacoesList, setNotificacoesList] = useState<any[]>([]);
  const [empresasAdminData, setEmpresasAdminData] = useState<any[]>([]);
  const [usuariosAdminList, setUsuariosAdminList] = useState<any[]>([]);
  const [subusuariosList, setSubusuariosList] = useState<any[]>([]);
  const [confirmacaoConfig, setConfirmacaoConfig] = useState<{ title: string, message: string, onConfirm: () => void, type?: 'danger' | 'warning' }>({
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const toDateBr = (value?: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const toDateBrWithTime = (value?: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
  };

  const mapNotificationVisual = (tipo: string) => {
    if (tipo === 'Demanda') return { icon: ListTodo, color: 'text-blue-500', bgColor: 'bg-blue-50' };
    if (tipo === 'Projeto') return { icon: Briefcase, color: 'text-purple-500', bgColor: 'bg-purple-50' };
    if (tipo === 'Evidência') return { icon: FileText, color: 'text-yellow-500', bgColor: 'bg-yellow-50' };
    return { icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-50' };
  };

  const apiRequest = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    if (authToken) headers.set('Authorization', `Bearer ${authToken}`);

    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    const response = await fetch(fullUrl, { ...options, headers });
    const payload = await response.json();

    if (!response.ok || !payload.success) {
      throw new Error(payload.message || 'Falha na API');
    }

    return payload.data;
  };

  const syncDataFromApi = async (retryCount = 0) => {
    try {
      console.log('[SYNC] Iniciando sincronização de dados...', { authToken: !!authToken });
      const [empresas, usuarios, projetos, demandas, evidencias, notificacoes] = await Promise.all([
        apiRequest('/empresas'),
        apiRequest('/usuarios'),
        apiRequest('/projetos'),
        apiRequest('/demandas'),
        apiRequest('/evidencias'),
        apiRequest('/notificacoes'),
      ]);
      console.log('[SYNC] Dados recebidos:', { empresas: empresas.length, usuarios: usuarios.length });

      const empresasData = empresas.map((empresa: any) => ({
        id: empresa.id,
        nome: empresa.nome,
        cnpj: empresa.cnpj,
        responsavel: empresa.responsavel,
        email: empresa.email,
        telefone: empresa.telefone,
        plano: empresa.plano,
        status: empresa.status === 'ATIVO' ? 'Ativo' : empresa.status === 'INATIVO' ? 'Inativo' : 'Pendente',
      }));

      const usuariosAdminData = usuarios
        .filter((usuario: any) => usuario.tipoUsuario !== 'SUBUSUARIO')
        .map((usuario: any) => ({
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          empresa: usuario.empresa?.nome || 'Sem empresa',
          perfil: usuario.perfil,
          status: usuario.status === 'ATIVO' ? 'Ativo' : 'Inativo',
          ultimoAcesso: toDateBrWithTime(usuario.ultimoAcesso),
        }));

      const subusuariosData = usuarios
        .filter((usuario: any) => usuario.tipoUsuario === 'SUBUSUARIO')
        .map((usuario: any) => ({
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          empresa: usuario.empresa?.nome || 'Sem empresa',
          principal: usuario.usuarioPai?.nome || 'N/A',
          setor: usuario.setor || 'N/A',
          perfil: usuario.perfil,
          status: usuario.status === 'ATIVO' ? 'Ativo' : 'Bloqueado',
        }));

      const projetosData = projetos.map((projeto: any) => ({
        id: projeto.id,
        titulo: projeto.nome,
        status: projeto.status === 'EM_ANDAMENTO' ? 'Em andamento' : projeto.status === 'CONCLUIDO' ? 'Concluído' : projeto.status,
        statusColor: projeto.status === 'EM_ANDAMENTO' ? 'bg-blue-50 text-blue-500' : projeto.status === 'CONCLUIDO' ? 'bg-green-50 text-green-500' : 'bg-gray-100 text-gray-500',
        borderColor: projeto.status === 'EM_ANDAMENTO' ? 'border-t-[#3578d4]' : projeto.status === 'CONCLUIDO' ? 'border-t-[#2fb15d]' : 'border-t-[#94a3b8]',
        descricao: projeto.descricao,
        responsavel: projeto.responsavel?.nome || 'N/A',
        demandas: projeto.demandas?.length || 0,
        vencimento: toDateBr(projeto.dataPrevista),
        progresso: projeto.progresso,
        progressoColor: projeto.progresso >= 80 ? '#2fb15d' : projeto.progresso >= 40 ? '#3578d4' : '#f59e0b',
        inicio: toDateBr(projeto.dataInicio),
      }));

      const demandasData = demandas.map((demanda: any) => ({
        id: demanda.id,
        area: demanda.empresa?.nome || 'Empresa',
        areaColor: '#3578d4',
        vencimento: toDateBr(demanda.vencimento),
        descricao: demanda.titulo,
        responsavel: demanda.responsavel?.nome || 'N/A',
        prioridade: demanda.prioridade === 'ALTA' ? 'Alta' : demanda.prioridade === 'BAIXA' ? 'Baixa' : 'Média',
        status: demanda.status === 'EM_ANDAMENTO' ? 'Em andamento' : demanda.status === 'CONCLUIDA' ? 'Concluída' : demanda.status,
        progresso: demanda.progresso,
        progressoColor: demanda.progresso >= 80 ? '#2fb15d' : demanda.progresso >= 40 ? '#3578d4' : '#f59e0b',
      }));

      const evidenciasData = evidencias.map((evidencia: any) => ({
        id: evidencia.id,
        arquivo: evidencia.nomeArquivo,
        tipo: evidencia.tipoArquivo,
        data: toDateBr(evidencia.dataEnvio),
        responsavel: evidencia.responsavel?.nome || 'N/A',
        vinculo: evidencia.demanda?.titulo || evidencia.projeto?.nome || 'Sem vínculo',
        descricao: evidencia.observacoes || 'Sem observações.',
        status: evidencia.status === 'VALIDA' ? 'Válida' : evidencia.status === 'PENDENTE' ? 'Pendente' : 'Atrasada',
        statusColor: evidencia.status === 'VALIDA' ? 'bg-green-50 text-green-600' : evidencia.status === 'PENDENTE' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600',
      }));

      const notificacoesData = notificacoes.map((notificacao: any) => {
        const visual = mapNotificationVisual(notificacao.tipo);
        return {
          id: notificacao.id,
          tipo: notificacao.tipo,
          titulo: notificacao.titulo,
          descricao: notificacao.descricao,
          data: toDateBrWithTime(notificacao.createdAt),
          lida: notificacao.lida,
          ...visual,
        };
      });

      setNotificacoesList(notificacoesData);
      setEmpresasAdminData(empresasData);
      setUsuariosAdminList(usuariosAdminData);
      setSubusuariosList(subusuariosData);
      setAllProjetos(projetos);
      console.log('[SYNC] Estados atualizados:', { 
        empresas: empresasData.length, 
        usuarios: usuariosAdminData.length, 
        subusuarios: subusuariosData.length,
        notificacoes: notificacoesData.length
      });
      setDataSyncVersion((current) => current + 1);
    } catch (error: any) {
      console.error('[SYNC ERROR]', error);
      
      // Retry automático para erro de JSON parse (problema do backend "dormindo" no Render)
      const isJsonError = error instanceof SyntaxError || 
                         error?.message?.includes('JSON') || 
                         error?.message?.includes('Unexpected token');
      
      if (isJsonError && retryCount === 0) {
        console.log('[SYNC RETRY] Erro de JSON detectado. Aguardando 3 segundos antes de nova tentativa...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('[SYNC RETRY] Tentando sincronizar novamente...');
        return syncDataFromApi(1); // Tenta novamente com retryCount = 1
      }
      
      // Se for um erro de retry ou outro tipo de erro, apenas loga
      if (retryCount > 0) {
        console.error('[SYNC FINAL ERROR] Falha mesmo após retry:', error);
      }
    }
  };

  const notificationRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authToken) {
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
    syncDataFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const resetInterfaceState = () => {
    setCurrentView('painel');
    setIsEditModalOpen(false);
    setIsEvidenceModalOpen(false);
    setIsEmpresaModalOpen(false);
    setIsUsuarioModalOpen(false);
    setIsSubusuarioModalOpen(false);
    setIsUsuarioDetalheModalOpen(false);
    setIsUsuarioEditModalOpen(false);
    setIsEmpresaDetalheModalOpen(false);
    setIsConfirmacaoModalOpen(false);
    setIsNotificationDropdownOpen(false);
    setSelectedProject(null);
    setSelectedEvidence(null);
    setSelectedEmpresa(null);
    setSelectedUsuario(null);
    setToast(null);
  };

  const handleLogin = async (email: string, senha: string) => {
    setIsLoginLoading(true);
    setAuthError(null);

    try {
      console.log('[LOGIN] Iniciando requisição para', `${API_BASE_URL}/auth/login`);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      console.log('[LOGIN] Status:', response.status);

      // Verificar se a resposta é JSON antes de fazer parse
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const textContent = await response.text();
        console.error('[LOGIN] Tipo errado:', contentType);
        throw new Error(`Servidor retornou tipo inválido: ${contentType || 'vazio'}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[LOGIN] Erro HTTP:', response.status, errorText);
        let errorMsg = `Erro (${response.status})`;
        try {
          const errorData = JSON.parse(errorText);
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          // Ignore parse error, use generic message
        }
        throw new Error(errorMsg);
      }

      let payload;
      let responseText = '';
      try {
        responseText = await response.text();
        
        if (!responseText || responseText.trim() === '') {
          console.error('[LOGIN] Resposta vazia do servidor');
          throw new Error('Servidor retornou resposta vazia');
        }

        payload = JSON.parse(responseText);
      } catch (parseError: any) {
        console.error('[LOGIN] JSON parse error:', parseError.message);
        console.error('[LOGIN] Conteúdo recebido:', responseText?.substring(0, 500));
        throw new Error(`Resposta inválida do servidor: ${parseError.message}`);
      }

      if (!payload.success) {
        throw new Error(payload.message || 'Autenticação falhou');
      }

      const token = payload.data?.token;
      const usuario = payload.data?.usuario;
      
      if (!token || !usuario) {
        console.error('[LOGIN] Dados incompletos:', { token: !!token, usuario: !!usuario });
        throw new Error('Resposta do servidor incompleta');
      }

      localStorage.setItem('nexus_token', token);
      localStorage.setItem('nexus_user', JSON.stringify(usuario));
      setCurrentUser(usuario);
      setAuthToken(token);
      resetInterfaceState();
      setIsAuthenticated(true);
      showToast('Login realizado com sucesso.');
    } catch (error: any) {
      console.error('[LOGIN ERROR]', error.message);
      setAuthError(error.message || 'Falha no login. Tente novamente.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = () => {
    resetInterfaceState();
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    setCurrentUser(null);
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  const handleViewProjectDetail = (project: any) => {
    setSelectedProject(project);
    setCurrentView('detalhe-projeto');
  };

  const handleAddEvidence = () => {
    setSelectedEvidence(null);
    setIsEvidenceModalOpen(true);
  };

  const handleCloseEvidenceModal = () => {
    setIsEvidenceModalOpen(false);
    // Recarregar lista de evidências
    setDataSyncVersion((current) => current + 1);
  };

  const handleEditEvidence = (evidence: any) => {
    setSelectedEvidence(evidence);
    setIsEvidenceModalOpen(true);
  };

  const handleViewCompany = (empresa: any) => {
    setSelectedEmpresa(empresa);
    setIsEmpresaDetalheModalOpen(true);
  };

  const handleEditCompany = (empresa: any) => {
    setSelectedEmpresa(empresa);
    setIsEmpresaModalOpen(true);
  };

  const handleManageUsers = (empresa: any) => {
    setSelectedEmpresa(empresa);
    setCurrentView('usuarios-empresa');
  };

  const handleDeactivateCompany = (empresa: any) => {
    setSelectedEmpresa(empresa);
    setConfirmacaoConfig({
      title: 'Desativar Empresa',
      message: `Tem certeza que deseja desativar a empresa ${empresa.nome}? Os dados não serão excluídos, mas o acesso será bloqueado.`,
      onConfirm: () => {
        showToast("Empresa desativada com sucesso");
      },
      type: 'warning'
    });
    setIsConfirmacaoModalOpen(true);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleViewUser = (usuario: any) => {
    setSelectedUsuario(usuario);
    setIsUsuarioDetalheModalOpen(true);
  };

  const handleEditUser = (usuario: any) => {
    setSelectedUsuario(usuario);
    setIsUsuarioEditModalOpen(true);
  };

  const handleResetPassword = (usuario: any) => {
    setSelectedUsuario(usuario);
    setConfirmacaoConfig({
      title: 'Redefinir Senha',
      message: `Deseja redefinir a senha do usuário ${usuario.nome}? Um link de redefinição será enviado para o e-mail ${usuario.email}.`,
      onConfirm: () => {
        showToast("Senha redefinida com sucesso");
      },
      type: 'warning'
    });
    setIsConfirmacaoModalOpen(true);
  };

  const handleDeactivateUser = (usuario: any) => {
    setSelectedUsuario(usuario);
    setConfirmacaoConfig({
      title: 'Desativar Usuário',
      message: `Deseja desativar o usuário ${usuario.nome}? O usuário perderá acesso ao sistema até ser reativado.`,
      onConfirm: () => {
        showToast("Usuário desativado com sucesso");
      },
      type: 'danger'
    });
    setIsConfirmacaoModalOpen(true);
  };

  const handleToggleLock = (usuario: any) => {
    setSelectedUsuario(usuario);
    const isLocked = usuario.status === 'Bloqueado' || usuario.status === 'Inativo';
    setConfirmacaoConfig({
      title: isLocked ? 'Desbloquear Usuário' : 'Bloquear Usuário',
      message: isLocked 
        ? `Deseja desbloquear o usuário ${usuario.nome}? O usuário voltará a ter acesso ao sistema.`
        : `Deseja bloquear o usuário ${usuario.nome}? O usuário perderá acesso imediatamente.`,
      onConfirm: () => {
        showToast(`Usuário ${isLocked ? 'desbloqueado' : 'bloqueado'} com sucesso`);
      },
      type: isLocked ? 'warning' : 'danger'
    });
    setIsConfirmacaoModalOpen(true);
  };

  const handleDeleteUser = (usuario: any) => {
    setSelectedUsuario(usuario);
    setConfirmacaoConfig({
      title: 'Deletar Usuário',
      message: `Tem certeza que deseja deletar o usuário ${usuario.nome}? Esta ação é irreversível e todos os dados associados serão removidos do sistema.`,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/usuarios/${usuario.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
          });
          if (response.ok) {
            showToast("Usuário deletado com sucesso");
            syncDataFromApi();
          } else {
            showToast("Erro ao deletar usuário", 'error');
          }
        } catch (error) {
          console.error('Delete user error:', error);
          showToast("Erro ao deletar usuário", 'error');
        }
      },
      type: 'danger'
    });
    setIsConfirmacaoModalOpen(true);
  };

  const handleToggleCompanyStatus = (empresa: any) => {
    setSelectedEmpresa(empresa);
    const isActive = empresa.status === 'Ativo';
    setConfirmacaoConfig({
      title: isActive ? 'Desativar Empresa' : 'Ativar Empresa',
      message: isActive
        ? `Tem certeza que deseja desativar a empresa ${empresa.nome}? Os dados não serão excluídos, mas o acesso será bloqueado.`
        : `Tem certeza que deseja ativar a empresa ${empresa.nome}? O acesso será restaurado.`,
      onConfirm: () => {
        showToast(`Empresa ${isActive ? 'desativada' : 'ativada'} com sucesso`);
        syncDataFromApi();
      },
      type: isActive ? 'warning' : 'success'
    });
    setIsConfirmacaoModalOpen(true);
  };

  const handleDeleteCompany = (empresa: any) => {
    setSelectedEmpresa(empresa);
    setConfirmacaoConfig({
      title: 'Deletar Empresa',
      message: `Tem certeza que deseja deletar a empresa ${empresa.nome}? Esta ação é irreversível e todos os dados associados serão removidos do sistema.`,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/empresas/${empresa.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
          });
          if (response.ok) {
            showToast("Empresa deletada com sucesso");
            syncDataFromApi();
          } else {
            showToast("Erro ao deletar empresa", 'error');
          }
        } catch (error) {
          console.error('Delete company error:', error);
          showToast("Erro ao deletar empresa", 'error');
        }
      },
      type: 'danger'
    });
    setIsConfirmacaoModalOpen(true);
  };

  const onSaveUserEdit = (data: any) => {
    console.log("Saving user edit", data);
    setIsUsuarioEditModalOpen(false);
    showToast("Usuário atualizado com sucesso");
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} authError={authError} isLoading={isLoginLoading} />;
  }

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans text-[#0f172a] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#1e315d] flex flex-col shrink-0 z-20">
        {/* Logo */}
        <div className="p-4 flex items-center">
          <div className="w-7 h-7 bg-[#3578d4] rounded flex flex-wrap p-1 gap-0.5 items-center justify-center mr-2.5">
            <div className="w-[40%] h-[40%] bg-white rounded-[1px]" />
            <div className="w-[40%] h-[40%] bg-white/40 rounded-[1px]" />
            <div className="w-[40%] h-[40%] bg-white/40 rounded-[1px]" />
            <div className="w-[40%] h-[40%] bg-white/40 rounded-[1px]" />
          </div>
          <span className="text-white font-bold text-base tracking-wider">NEXUS</span>
        </div>

        {/* Search */}
        <div className="px-3 mb-4">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a0aec0]" />
            <input 
              type="text" 
              placeholder="Procurar opção do menu..." 
              className="w-full bg-[#253a6e] border-none rounded-md py-1.5 pl-8 pr-3 text-[11px] text-white placeholder:text-[#a0aec0]/60 focus:ring-1 focus:ring-[#3578d4] outline-none h-[30px]"
            />
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Painel" 
            active={currentView === 'painel'} 
            onClick={() => setCurrentView('painel')}
          />
          <SidebarItem 
            icon={ListTodo} 
            label="Demandas" 
            active={currentView === 'demandas'} 
            onClick={() => setCurrentView('demandas')}
          />
          <SidebarItem 
            icon={Briefcase} 
            label="Projetos" 
            active={currentView === 'projetos'}
            onClick={() => setCurrentView('projetos')}
          />
          <SidebarItem 
            icon={FileText} 
            label="Evidências" 
            active={currentView === 'evidencias'}
            onClick={() => setCurrentView('evidencias')}
          />
          <SidebarItem 
            icon={FileBarChart} 
            label="Relatório de Execução" 
            active={currentView === 'relatorio'}
            onClick={() => setCurrentView('relatorio')}
          />
          <SidebarItem 
            icon={Settings} 
            label="Configurações" 
            active={currentView === 'configuracoes'}
            onClick={() => setCurrentView('configuracoes')}
          />
          <SidebarItem 
            icon={ShieldCheck} 
            label="Administrador" 
            active={currentView === 'administracao'}
            onClick={() => setCurrentView('administracao')}
          />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 mt-auto">
          <div className="flex items-center mb-3">
            <div className="w-7 h-7 rounded-full bg-[#3578d4] flex items-center justify-center text-white text-[10px] font-bold mr-2.5">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-white text-[11px] font-bold">Administrador</span>
              <span className="text-[#a0aec0] text-[9px]">Administrador principal</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-[46px] bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0 z-10">
          <h2 className="text-[13px] font-bold text-[#1e315d]">
            {currentView === 'painel' ? 'Painel' : 
             currentView === 'demandas' ? 'Gestão de Demandas' : 
             currentView === 'projetos' ? 'Gestão de Projetos' : 
             currentView === 'evidencias' ? 'Gestão de Evidências' :
             currentView === 'relatorio' ? 'Relatório de Execução' :
             currentView === 'configuracoes' ? 'Configurações' :
             currentView === 'notificacoes' ? 'Notificações' :
             currentView === 'administracao' ? 'Administrador' :
             currentView === 'usuarios-empresa' ? 'Usuários da Empresa' :
             'Detalhes do Projeto'}
          </h2>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <span className="text-[11px] font-medium text-gray-500 mr-2">Administrador principal</span>
              <User size={14} className="text-gray-400" />
            </div>
            <div 
              ref={bellRef}
              className="relative cursor-pointer" 
              onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
            >
              <div className="w-7 h-7 rounded-full bg-[#3578d4] flex items-center justify-center">
                <Bell size={14} className="text-white" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 bg-[#ef4444] text-white text-[8px] font-bold px-1 rounded-full border border-white">
                {notificacoesList.filter((notif) => !notif.lida).length}
              </span>

              <AnimatePresence>
                {isNotificationDropdownOpen && (
                  <div ref={notificationRef}>
                    <NotificationDropdown 
                      onClose={() => setIsNotificationDropdownOpen(false)}
                      onViewAll={() => setCurrentView('notificacoes')}
                      notificacoesList={notificacoesList}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-2.5 py-1 rounded border border-red-100 text-[#ef4444] text-[10px] font-bold hover:bg-red-50 transition-colors"
            >
              <div className="w-1 h-1 rounded-full border border-red-400 mr-1.5" />
              Sair
            </button>
          </div>
        </header>

        {currentView === 'painel' ? <DashboardView /> : 
         currentView === 'demandas' ? <DemandasView usuariosAdminList={usuariosAdminList} currentUser={currentUser} empresasData={empresasAdminData} authToken={authToken} projetosData={allProjetos} onSyncData={syncDataFromApi} /> : 
         currentView === 'projetos' ? <ProjetosView onEdit={handleEditProject} onViewDetail={handleViewProjectDetail} currentUser={currentUser} empresasData={empresasAdminData} authToken={authToken} onSyncData={syncDataFromApi} /> :
         currentView === 'evidencias' ? <EvidenciasView onAdd={handleAddEvidence} onEdit={handleEditEvidence} syncVersion={dataSyncVersion} /> :
         currentView === 'relatorio' ? <RelatorioExecucaoView /> :
         currentView === 'configuracoes' ? <ConfiguracoesView currentUser={currentUser} setCurrentUser={setCurrentUser} /> :
         currentView === 'notificacoes' ? <NotificacoesView notificacoesList={notificacoesList} /> :
         currentView === 'administracao' ? (
           <AdministracaoView 
             onNewCompany={() => setIsEmpresaModalOpen(true)}
             onNewUser={() => setIsUsuarioModalOpen(true)}
             onNewSubUser={() => setIsSubusuarioModalOpen(true)}
             onViewCompany={handleViewCompany}
             onEditCompany={handleEditCompany}
             onManageUsers={handleManageUsers}
             onDeactivateCompany={handleDeactivateCompany}
             onToggleCompanyStatus={handleToggleCompanyStatus}
             onDeleteCompany={handleDeleteCompany}
             onViewUser={handleViewUser}
             onEditUser={handleEditUser}
             onResetPassword={handleResetPassword}
             onToggleLock={handleToggleLock}
             onDelete={handleDeleteUser}
             empresasData={empresasAdminData}
             usuariosAdminData={usuariosAdminList}
             subusuariosData={subusuariosList}
           />
         ) :
         currentView === 'usuarios-empresa' ? (
           <UsuariosEmpresaView 
             empresa={selectedEmpresa} 
             onBack={() => setCurrentView('administracao')}
             onNewUser={() => setIsUsuarioModalOpen(true)}
             onNewSubUser={() => setIsSubusuarioModalOpen(true)}
             onViewUser={handleViewUser}
             onEditUser={handleEditUser}
             onResetPassword={handleResetPassword}
             onDeactivateUser={handleDeactivateUser}
             onToggleLock={handleToggleLock}
             onDelete={handleDeleteUser}
           />
         ) :
         <DetalheProjetoView project={selectedProject} onBack={() => setCurrentView('projetos')} onEdit={() => setIsEditModalOpen(true)} onSyncData={syncDataFromApi} />}
      </div>

      {isEditModalOpen && (
        <EditProjectModal 
          project={selectedProject} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}

      {isEvidenceModalOpen && (
        <EvidenceModal 
          evidence={selectedEvidence}
          onClose={handleCloseEvidenceModal} 
        />
      )}

      {isEmpresaModalOpen && (
        <EmpresaModal 
          onClose={() => setIsEmpresaModalOpen(false)} 
          onSuccess={() => {
            setIsEmpresaModalOpen(false);
            syncDataFromApi();
          }}
          authToken={authToken || ''}
        />
      )}

      {isUsuarioModalOpen && (
        <UsuarioModal 
          empresa={selectedEmpresa}
          onClose={() => setIsUsuarioModalOpen(false)} 
        />
      )}

      {isSubusuarioModalOpen && (
        <SubusuarioModal 
          empresa={selectedEmpresa}
          onClose={() => setIsSubusuarioModalOpen(false)} 
        />
      )}

      {isEmpresaDetalheModalOpen && (
        <EmpresaDetalheModal 
          empresa={selectedEmpresa} 
          onClose={() => setIsEmpresaDetalheModalOpen(false)} 
        />
      )}

      {isConfirmacaoModalOpen && (
        <ConfirmacaoModal 
          title={confirmacaoConfig.title}
          message={confirmacaoConfig.message}
          onConfirm={confirmacaoConfig.onConfirm}
          onClose={() => setIsConfirmacaoModalOpen(false)}
          type={confirmacaoConfig.type}
        />
      )}

      {isUsuarioDetalheModalOpen && (
        <UsuarioDetalheModal 
          usuario={selectedUsuario} 
          onClose={() => setIsUsuarioDetalheModalOpen(false)} 
        />
      )}

      {isUsuarioEditModalOpen && (
        <UsuarioEditModal 
          usuario={selectedUsuario} 
          onClose={() => setIsUsuarioEditModalOpen(false)} 
          onSave={onSaveUserEdit}
        />
      )}

      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

