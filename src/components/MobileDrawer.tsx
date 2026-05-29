import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { UserProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart2, Sun, Moon, Calendar, Users, AlertTriangle, Clock, 
  Map, FileText, CheckSquare, Award, CreditCard, ChevronDown, Check, Settings, 
  Sliders, MessageSquare, LogOut, ChevronRight, X, Clipboard, Search
} from "lucide-react";
import { getMenuIcon } from "./IconsRegistry";

// Matches icon list in Sidebar.tsx
const iconMap: Record<string, React.ComponentType<any>> = {
  dashboard: BarChart2,
  configuracoes: Settings,
  briefing: FileText,
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

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    companyConfig, 
    sidebarOrder, 
    switchProfile, 
    activeView,
    setActiveView,
    theme,
    setTheme,
    logout
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");

  const mergedLabels = { ...labelsMap, ...(companyConfig?.menuLabels || {}) };

  const isTabAllowedForProfile = (tab: string, profile: UserProfile): boolean => {
    if (tab === "configuracoes") return profile === "Admin";
    if (profile === "Admin") return true;

    switch (profile) {
      case "Administrativo":
        return ["dashboard", "briefing", "eventos", "fornecedores", "tarefas", "colaboradores", "orcamentos", "reunioes", "propostas", "mapa", "vencimentos", "notas"].includes(tab);
      case "Escritorio":
        return ["dashboard", "briefing", "eventos", "vencimentos", "tarefas", "orcamentos", "reunioes", "propostas", "notas"].includes(tab);
      case "DP":
        return ["dashboard", "ponto", "colaboradores", "bem_estar", "credenciais", "notas"].includes(tab);
      case "Operacional":
        return ["dashboard", "eventos", "ponto", "vencimentos", "formularios", "notas"].includes(tab);
      case "Freelancer":
        return ["eventos", "ponto", "notas"].includes(tab);
      default:
        return false;
    }
  };

  const currentOrder = sidebarOrder.tabOrder;
  const currentHidden = sidebarOrder.hiddenTabs;

  const allowedTabs = currentOrder.filter(tab => isTabAllowedForProfile(tab, currentUser.profile));
  const visibleTabs = allowedTabs.filter(tab => !currentHidden.includes(tab));

  const filteredTabs = visibleTabs.filter(tab => {
    const label = mergedLabels[tab] || tab;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleTabClick = (tab: string) => {
    setActiveView(tab);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Glass Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-zinc-950/80 backdrop-blur-xs z-50 md:hidden"
          />

          {/* Drawer Panel Sliding Out From The Left */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-zinc-950 border-r border-slate-150 dark:border-zinc-900 shadow-2xl z-51 flex flex-col h-full md:hidden select-none"
          >
            {/* Drawer Header Brand */}
            <div className="p-5 border-b border-slate-100 dark:border-zinc-900 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-950/40">
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-black text-orange-600 dark:text-orange-500 font-display flex items-center gap-1">
                  <span style={{ color: companyConfig.primaryColor }}>{companyConfig.logo}</span>
                  <span className="text-gray-900 dark:text-zinc-50">{companyConfig.name}</span>
                </span>
                <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-orange-950/40 dark:text-orange-300 px-2 py-0.5 rounded-full uppercase font-black">
                  COCKPIT
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                aria-label="Fechar menu"
              >
                <X size={18} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Simulated Live User Profile Indicator & Swapper */}
            <div className="p-4 mx-4 my-3 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-zinc-900/40 dark:to-zinc-950/20 border border-slate-150 dark:border-zinc-900 rounded-2xl flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 bg-white dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-850 flex items-center justify-center overflow-hidden shrink-0">
                  {currentUser.avatar && (currentUser.avatar.startsWith("data:image/") || currentUser.avatar.startsWith("http")) ? (
                    <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Perfil" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xl">{currentUser.avatar || "👤"}</span>
                  )}
                </span>
                <div className="min-w-0 flex-1 leading-none">
                  <strong className="text-[11px] font-black text-slate-850 dark:text-zinc-100 block truncate font-display mb-0.5">
                    {currentUser.name}
                  </strong>
                  <span className="text-[9px] font-mono font-black text-orange-500 uppercase tracking-widest block">
                    {currentUser.profile}
                  </span>
                </div>
              </div>

              {/* Developer Profile quick simulator trigger for Leandra and team */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-gray-500 dark:text-zinc-400">
                  <ChevronDown size={11} className="stroke-[3]" />
                </div>
                <select 
                  value={currentUser.profile}
                  onChange={(e) => switchProfile(e.target.value as UserProfile)}
                  className="w-full text-[9px] pl-3 pr-8 py-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-200 font-extrabold focus:outline-none cursor-pointer appearance-none uppercase text-center tracking-widest shadow-3xs"
                  title="Simular Cargo Operacional"
                >
                  <option value="Admin">⚡ Admin GESTOR</option>
                  <option value="Administrativo">👔 Administrativo</option>
                  <option value="Escritorio">💻 Escritório</option>
                  <option value="DP">📊 Dep. Pessoal</option>
                  <option value="Operacional">🚧 Operacional</option>
                  <option value="Freelancer">🤝 Freelancer</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Search Field */}
            <div className="px-4 mb-2">
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-3 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder="Pesquisar view operacional..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 placeholder-gray-400 dark:placeholder-zinc-600 bg-slate-50/70 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-850 rounded-xl text-[11px] font-bold focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-950 font-sans shadow-3xs text-gray-800 dark:text-zinc-100 transition-all"
                />
              </div>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-none">
            {filteredTabs.length > 0 ? (
                filteredTabs.map((tab) => {
                  const Icon = getMenuIcon(tab, companyConfig?.menuIcons?.[tab]);
                  const label = mergedLabels[tab] || tab;
                  const active = activeView === tab;

                  return (
                    <button
                      key={tab}
                      onClick={() => handleTabClick(tab)}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-150 text-xs font-bold font-sans active:scale-[0.98] cursor-pointer ${
                        active 
                          ? "bg-orange-50/40 dark:bg-orange-950/15 text-[var(--color-primary)] shadow-3xs border border-orange-500/10" 
                          : "text-gray-650 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900/40"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon size={16} className={active ? "text-[var(--color-primary)]" : "text-gray-400 dark:text-zinc-500"} />
                        <span className="truncate">{label}</span>
                      </div>
                      <ChevronRight size={13} className={active ? "text-[var(--color-primary)]" : "text-gray-350 dark:text-zinc-650"} />
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <span className="text-[10px] text-gray-400 font-bold block font-mono uppercase">Nenhuma view encontrada</span>
                </div>
              )}
            </div>

            {/* Bottom Controls Panel */}
            <div className="p-4 border-t border-slate-100 dark:border-zinc-900 bg-slate-50/20 dark:bg-zinc-950/40 flex items-center justify-between gap-2">
              
              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-center gap-2 flex-1 text-[11px] text-gray-500 dark:text-zinc-400 py-2 border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 rounded-xl hover:bg-slate-50 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer font-bold shadow-3xs"
              >
                {theme === "dark" ? (
                  <>
                    <Sun size={13} className="text-amber-500" />
                    <span>Modo Claro</span>
                  </>
                ) : (
                  <>
                    <Moon size={13} className="text-indigo-600" />
                    <span>Modo Escuro</span>
                  </>
                )}
              </button>

              {/* Secure Log-Out button matching App */}
              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="flex items-center justify-center gap-1.5 flex-1 text-[11px] text-red-500 hover:text-red-700 py-2 border border-red-100 dark:border-red-950/30 bg-red-50/10 dark:bg-red-950/5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/10 transition-all cursor-pointer font-bold shadow-3xs"
              >
                <LogOut size={13} className="text-red-500 hover:scale-105 transition-transform" />
                <span>Sair</span>
              </button>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
