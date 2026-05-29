import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { BottomNav } from "./components/BottomNav";
import { MobileDrawer } from "./components/MobileDrawer";
import { Menu } from "lucide-react";

// Views
import { DashboardView } from "./views/DashboardView";
import { EventsView } from "./views/EventsView";
import { BriefingView } from "./views/BriefingView";
import { AlertsView } from "./views/AlertsView";
import { SuppliersView } from "./views/SuppliersView";
import { TimeClockView } from "./views/TimeClockView";
import { VencimentosView } from "./views/VencimentosView";
import { KanbanView } from "./views/KanbanView";
import { WorkersView } from "./views/WorkersView";
import { FormsView } from "./views/FormsView";
import { WellbeingView } from "./views/WellbeingView";
import { BudgetsView } from "./views/BudgetsView";
import { CredentialsView } from "./views/CredentialsView";
import { MeetingsView } from "./views/MeetingsView";
import { ProposalsView } from "./views/ProposalsView";
import { NotesView } from "./views/NotesView";
import { LogsView } from "./views/LogsView";
import { MapView } from "./views/MapView";
import { ConfiguracoesView } from "./views/ConfiguracoesView";
import { PerfilView } from "./views/PerfilView";
import { PublicChecklistView } from "./views/PublicChecklistView";
import { LoginView } from "./views/LoginView";

const AppContent: React.FC = () => {
  const { activeView, theme, companyConfig, isLoggedIn } = useApp();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const isPublicRoute = 
    window.location.pathname.includes("checklist-publico") || 
    window.location.search.includes("checklist-publico");

  if (isPublicRoute) {
    return <PublicChecklistView />;
  }

  if (!isLoggedIn) {
    return <LoginView />;
  }

  // Render correct view based on navigation selection
  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "perfil":
        return <PerfilView />;
      case "configuracoes":
        return <ConfiguracoesView />;
      case "eventos":
        return <EventsView />;
      case "events":
        return <EventsView />;
      case "briefing":
        return <BriefingView />;
      case "alertas":
      case "alerts":
        return <AlertsView />;
      case "fornecedores":
      case "suppliers":
        return <SuppliersView />;
      case "ponto":
        return <TimeClockView />;
      case "vencimentos":
        return <VencimentosView />;
      case "tarefas":
      case "tasks":
        return <KanbanView />;
      case "colaboradores":
      case "workers":
        return <WorkersView />;
      case "formularios":
      case "forms":
        return <FormsView />;
      case "bem_estar":
      case "wellbeing":
        return <WellbeingView />;
      case "orcamentos":
      case "budgets":
        return <BudgetsView />;
      case "credenciais":
      case "credentials":
        return <CredentialsView />;
      case "reunioes":
      case "meetings":
        return <MeetingsView />;
      case "propostas":
      case "proposals":
        return <ProposalsView />;
      case "mapa":
        return <MapView />;
      case "notes":
      case "notas":
        return <NotesView />;
      case "logs":
        return <LogsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`min-h-screen md:h-screen md:overflow-hidden font-sans flex text-gray-900 bg-slate-100/95 dark:bg-zinc-950 transition-colors duration-300 relative ${theme === "dark" ? "dark text-zinc-100" : ""}`}>
      
      {/* Whimsical Ambient Background Glows */}
      <div className="absolute top-10 right-20 w-96 h-96 bg-orange-200/35 dark:bg-orange-950/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-[450px] h-[450px] bg-amber-200/30 dark:bg-amber-950/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-rose-100/25 dark:bg-rose-950/5 rounded-full blur-3xl -z-10 pointer-events-none" style={{ animationDelay: '1.5s' }}></div>

      {/* SIDEBAR NAVIGATION - VISIBLE ON DESKTOP md:block */}
      <div className="hidden md:block shrink-0 relative z-10 h-full">
        <Sidebar />
      </div>

      {/* CORE WRAPPER SCROLLABLE ENGINE */}
      <div className="flex-1 flex flex-col min-w-0 md:h-full md:overflow-hidden pb-20 md:pb-0">
        
        {/* TOP COMPACT STATUS BANNER - Delicate, glassy, and visually stunning */}
        <header className="border-b border-gray-100/70 dark:border-zinc-900 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-lg sticky top-0 z-30 px-6 py-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-2.5">
            {/* Hamburger Menu trigger on Mobile */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl text-gray-700 dark:text-zinc-300 transition-all active:scale-95 cursor-pointer shrink-0 animate-fadeIn"
              title="Menu de navegação"
            >
              <Menu size={20} className="stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-gray-950 dark:text-zinc-50 font-display flex items-center gap-1.5">
                <span className="text-orange-500 shrink-0 font-sans" style={{ color: companyConfig.primaryColor }}>{companyConfig.logo}</span>
                <span>{companyConfig.name}</span>
              </span>
            </div>
            <span className="text-[10px] bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/20 text-orange-700 dark:text-orange-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-display border border-orange-200/40 dark:border-orange-900/40 shadow-xs">
              ⚡ Híbrida v2.6
            </span>
          </div>

          <div className="text-[11px] text-gray-400 dark:text-zinc-500 font-mono text-right hidden sm:flex items-center gap-2 bg-gray-50/75 dark:bg-zinc-900/30 px-3.5 py-1.5 rounded-2xl border border-gray-150/50 dark:border-zinc-800">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" style={{ backgroundColor: companyConfig.primaryColor }}></span>
            <span>Data de Monitoramento: <strong className="text-gray-700 dark:text-zinc-350">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
          </div>
        </header>

        {/* CONTAINER VIEW INJECTOR WITH COMPACT PADDING */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {renderView()}
        </main>
      </div>

      {/* MOBILE BOTTOM NAV - VISIBLE ON MOBILE <md */}
      <div className="block md:hidden">
        <BottomNav onMenuClick={() => setIsMobileDrawerOpen(true)} />
      </div>

      {/* MOBILE FULL DRAWER NAVIGATION */}
      <MobileDrawer isOpen={isMobileDrawerOpen} onClose={() => setIsMobileDrawerOpen(false)} />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
