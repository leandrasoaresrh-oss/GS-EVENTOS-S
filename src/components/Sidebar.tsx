import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { UserProfile } from "../types";
import { 
  BarChart2, Sun, Moon, Calendar, Users, AlertTriangle, Clock, 
  Map, FileText, CheckSquare, Award, CreditCard, ChevronDown, Check, Settings, 
  Sliders, MessageSquare, Image, LogOut, ChevronRight, Eye, EyeOff, ArrowUp, ArrowDown, Clipboard
} from "lucide-react";
import { getMenuIcon } from "./IconsRegistry";

// Lucide icon helper
const iconMap: Record<string, React.ComponentType<any>> = {
  dashboard: BarChart2,
  configuracoes: Settings,
  briefing: FileText, // Usamos FileText como Briefing do Dia
  alertas: AlertTriangle,
  eventos: Calendar,
  fornecedores: Sliders,
  ponto: Clock,
  vencimentos: Clipboard,
  tarefas: CheckSquare,
  colaboradores: Users,
  formularios: FileText,
  bem_estar: Award,
  orcamentos: CreditCard,
  credenciais: CreditCard,
  reunioes: MessageSquare,
  propostas: FileText,
  mapa: Map,
  notas: FileText,
  logs: Settings
};

const labelsMap: Record<string, string> = {
  dashboard: "Dashboard",
  configuracoes: "Configurações",
  briefing: "Briefing do Dia",
  alertas: "Saúde Operacional",
  eventos: "Eventos",
  fornecedores: "Fornecedores",
  ponto: "Ponto Eletrônico",
  vencimentos: "Vencimentos",
  tarefas: "Quadro Kanban",
  colaboradores: "Fichas & Equipes",
  formularios: "Construtor de Formulários",
  bem_estar: "Cultura & Bem-Estar",
  orcamentos: "Orçamentos",
  credenciais: "Credenciais Visuais",
  reunioes: "Pautas & Atas",
  propostas: "Gerador de Propostas",
  mapa: "Mapa de Eventos",
  notas: "Bloco de Notas",
  logs: "Logs de Auditoria"
};

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab: propActiveTab, setActiveTab: propSetActiveTab }) => {
  const { 
    currentUser, 
    companyConfig, 
    sidebarOrder, 
    updateSidebarOrder, 
    switchProfile, 
    users,
    activeView,
    setActiveView,
    theme,
    setTheme,
    activeCompanyId,
    setActiveCompanyId,
    companies,
    logout
  } = useApp();

  const activeTab = propActiveTab || activeView;
  const setActiveTab = propSetActiveTab || setActiveView;

  const [isEditingMenu, setIsEditingMenu] = useState(false);

  // Merge default labels with custom renamed labels from settings
  const mergedLabels = { ...labelsMap, ...(companyConfig?.menuLabels || {}) };

  const isImageLogo = (val: string): boolean => {
    if (!val) return false;
    const trimmed = val.trim();
    return (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("data:image/") ||
      trimmed.startsWith("/") ||
      trimmed.endsWith(".png") ||
      trimmed.endsWith(".jpg") ||
      trimmed.endsWith(".jpeg") ||
      trimmed.endsWith(".svg") ||
      trimmed.endsWith(".gif") ||
      trimmed.endsWith(".webp")
    );
  };

  // MENU PERMISSION CHECKS (pág 5, pág 56)
  const isTabAllowedForProfile = (tab: string, profile: UserProfile): boolean => {
    if (tab === "configuracoes") return profile === "Admin";
    if (profile === "Admin") return true; // Admin accesses ALL

    switch (profile) {
      case "Administrativo":
        // Eventos, fornecedores, tarefas, relatórios, colaboradores, orçamentos, reuniões, pautas, propostas
        return ["dashboard", "briefing", "eventos", "fornecedores", "tarefas", "colaboradores", "orcamentos", "reunioes", "propostas", "mapa", "vencimentos", "notas"].includes(tab);
      case "Escritorio":
        // Tarefas, calendário/eventos, documentos/vencimentos, pautas, propostas, orçamentos, bloco notas
        return ["dashboard", "briefing", "eventos", "vencimentos", "tarefas", "orcamentos", "reunioes", "propostas", "notas"].includes(tab);
      case "DP":
        // Colaboradores, ponto, banco de horas (wellbeing/bem estar), credenciais, bloco notas
        return ["dashboard", "ponto", "colaboradores", "bem_estar", "credenciais", "notas"].includes(tab);
      case "Operacional":
        // Checklists, relatórios, ocorrências, galeria, chat, check_in (all map to widgets in eventos/dashboard basically)
        return ["dashboard", "eventos", "ponto", "vencimentos", "formularios", "notas"].includes(tab);
      case "Freelancer":
        // Acesso limitado ao evento vinculado
        return ["eventos", "ponto", "notas"].includes(tab);
      default:
        return false;
    }
  };

  const currentOrder = sidebarOrder.tabOrder;
  const currentHidden = sidebarOrder.hiddenTabs;

  // Filter visible tabs for current profile and preferences
  const allowedTabs = currentOrder.filter(tab => isTabAllowedForProfile(tab, currentUser.profile));
  const visibleTabs = allowedTabs.filter(tab => !currentHidden.includes(tab));

  // Edit menu helpers
  const handleToggleTabVisibility = (tab: string) => {
    if (currentHidden.includes(tab)) {
      updateSidebarOrder(currentHidden.filter(t => t !== tab), currentOrder);
    } else {
      // Don't let users hide EVERYTHING
      if (visibleTabs.length <= 1) return;
      updateSidebarOrder([...currentHidden, tab], currentOrder);
    }
  };

  const handleMoveTabUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...currentOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index - 1];
    newOrder[index - 1] = temp;
    updateSidebarOrder(currentHidden, newOrder);
  };

  const handleMoveTabDown = (index: number) => {
    if (index === currentOrder.length - 1) return;
    const newOrder = [...currentOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index + 1];
    newOrder[index + 1] = temp;
    updateSidebarOrder(currentHidden, newOrder);
  };

  return (
    <div 
      className="hidden md:flex flex-col w-66 border-r transition-all duration-300 h-full shrink-0 relative select-none"
      style={theme === "dark" ? {} : { 
        backgroundColor: `${companyConfig.primaryColor || '#E85D04'}0d`, 
        borderRight: `1px solid ${companyConfig.primaryColor || '#E85D04'}20`
      }}
    >
      {/* Brand / Logo (Dynamic - Single Corporate Installation) */}
      <div className="flex flex-col gap-3.5 px-6 py-5 border-b border-gray-200 dark:border-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl blur-xs opacity-50"></div>
            <span className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white text-xl font-bold shadow-md overflow-hidden animate-pulse">
              {isImageLogo(companyConfig.logo) ? (
                <img src={companyConfig.logo} className="object-cover w-full h-full" alt="Main Logo" referrerPolicy="no-referrer" />
              ) : (
                companyConfig.logo
              )}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-extrabold text-gray-950 dark:text-zinc-50 text-[14px] leading-tight font-display tracking-tight uppercase">
              {companyConfig.name}
            </h1>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <span className="text-[9px] uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-extrabold font-mono leading-none">
                Corporativo Ativo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profiler swapper for developers (Pages 5-11 profile switching) - Floating badge element */}
      <div className="mx-4 my-3 p-3 bg-gradient-to-tr from-gray-50/70 to-slate-50/30 dark:from-zinc-900/40 dark:to-zinc-950/20 border border-gray-150 dark:border-zinc-800/50 rounded-2xl shadow-2xs flex flex-col gap-2 relative">
        <div className="flex items-center gap-2.5">
          <div className="relative shrink-0">
            <span className="w-9 h-9 bg-white dark:bg-zinc-900 rounded-xl shadow-xs border border-gray-100 dark:border-zinc-800 flex items-center justify-center overflow-hidden">
              {currentUser.avatar && (currentUser.avatar.startsWith("data:image/") || currentUser.avatar.startsWith("http")) ? (
                <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Perfil" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-xl">{currentUser.avatar || "👤"}</span>
              )}
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border border-white dark:border-zinc-950 rounded-full"></span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-black text-gray-850 dark:text-zinc-100 truncate font-display leading-tight">{currentUser.name}</span>
            <span className="text-[9px] font-mono text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider truncate">{currentUser.profile}</span>
          </div>
        </div>

        {/* Custom Profile Swap trigger button */}
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-gray-500 dark:text-zinc-400 z-10">
            <ChevronDown size={10} className="stroke-[2.5]" />
          </div>
          <select 
            value={currentUser.profile}
            onChange={(e) => switchProfile(e.target.value as UserProfile)}
            className="w-full text-[9px] pl-3 pr-7 py-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200/60 dark:border-zinc-800/80 cursor-pointer text-gray-700 dark:text-zinc-200 font-extrabold focus:outline-none focus:ring-1 focus:ring-orange-500/10 shadow-3xs appearance-none font-display uppercase tracking-widest text-center"
            title="Simular Perfil Ativo"
          >
            <option value="Admin" className="bg-white dark:bg-zinc-950">⚡ Admin GESTOR</option>
            <option value="Administrativo" className="bg-white dark:bg-zinc-950">👔 Administrativo</option>
            <option value="Escritorio" className="bg-white dark:bg-zinc-950">💻 Escritório</option>
            <option value="DP" className="bg-white dark:bg-zinc-950">📊 Dep. Pessoal</option>
            <option value="Operacional" className="bg-white dark:bg-zinc-950">🚧 Operacional</option>
            <option value="Freelancer" className="bg-white dark:bg-zinc-950">🤝 Freelancer</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {isEditingMenu ? (
          <div className="space-y-1 bg-amber-500/5 border border-amber-500/10 rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-amber-600 uppercase font-mono tracking-wider block mb-2 leading-none">REORDENAR MENU</span>
            {allowedTabs.map((tab, idx) => {
              const label = mergedLabels[tab] || tab;
              const isHidden = currentHidden.includes(tab);
              return (
                <div key={tab} className="flex items-center justify-between gap-1 text-xs py-1.5 px-2 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-lg">
                  <button 
                    onClick={() => handleToggleTabVisibility(tab)}
                    className="flex items-center gap-2 font-medium shrink-0 max-w-[120px] truncate"
                  >
                    <span className={isHidden ? "line-through text-gray-400 opacity-60" : "font-semibold hover:text-[var(--color-primary)]"}>
                      {label}
                    </span>
                  </button>
                  <div className="flex items-center gap-0.5">
                    <button 
                      onClick={() => handleMoveTabUp(idx)}
                      disabled={idx === 0}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded disabled:opacity-20 flex items-center justify-center font-bold"
                    >
                      <ArrowUp size={10} />
                    </button>
                    <button 
                      onClick={() => handleMoveTabDown(idx)}
                      disabled={idx === allowedTabs.length - 1}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded disabled:opacity-20 flex items-center justify-center font-bold"
                    >
                      <ArrowDown size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          visibleTabs.map((tab) => {
            const Icon = getMenuIcon(tab, companyConfig?.menuIcons?.[tab]);
            const label = mergedLabels[tab] || tab;
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                id={`sidemenu-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150 relative ${
                  active 
                    ? "bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)] font-semibold shadow-xs" 
                    : "text-gray-650 dark:text-zinc-400 hover:bg-gray-200/50 dark:hover:bg-gray-900/50 hover:text-gray-950 dark:hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-[var(--color-primary)] rounded-r-md"></span>
                )}
                <Icon size={18} className={active ? "text-[var(--color-primary)]" : "text-gray-400 dark:text-gray-500"} />
                <span className="truncate">{label}</span>
              </button>
            );
          })
        )}
      </div>

      {/* Footer controls: Edit Menu & Light/Dark toggler */}
      <div className="p-4 border-t dark:border-gray-800 space-y-2">
        <button
          onClick={() => setIsEditingMenu(!isEditingMenu)}
          className="flex items-center justify-center gap-2 w-full text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white py-1.5 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-all font-mono cursor-pointer"
        >
          <Sliders size={12} />
          {isEditingMenu ? "Ver Menu" : "Editar Menu"}
        </button>

        <div className="flex items-center justify-between gap-2">
          {/* Theme selection toggle solar/moon */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center gap-2 flex-1 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white py-1.5 border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/80 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-850 transition-all cursor-pointer"
            title={theme === "dark" ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
          >
            {theme === "dark" ? (
              <>
                <Sun size={13} className="text-amber-500" />
                <span className="text-[10px] font-bold">Claro</span>
              </>
            ) : (
              <>
                <Moon size={13} className="text-indigo-600" />
                <span className="text-[10px] font-bold">Escuro</span>
              </>
            )}
          </button>

          {/* Sair / Logout */}
          <button
            onClick={logout}
            className="flex items-center justify-center gap-1.5 flex-1 text-xs text-red-500 hover:text-red-700 py-1.5 border border-red-100 dark:border-red-950/40 bg-red-50/10 dark:bg-red-950/5 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/20 transition-all cursor-pointer font-bold"
            title="Sair do Cockpit"
          >
            <LogOut size={13} className="text-red-500" />
            <span className="text-[10px]">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};
