import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  BarChart2, Calendar, AlertTriangle, Users, Clock, CheckSquare, 
  ChevronRight, Sparkles, AlertCircle, TrendingUp, CheckCircle, PieChart, Activity
} from "lucide-react";

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const { 
    currentUser, companyConfig, events, occurrences, tasks, suppliers, 
    employees, wellbeingRecords, timeRecords, checkIns, setActiveView
  } = useApp();

  const [chartType, setChartType] = useState<'barra' | 'pizza' | 'linha'>('barra');

  // Unified view changer with safety fallback
  const changeView = setActiveTab || setActiveView;

  // CONTADORES REAIS DO CLIENT-SIDE DB
  const activeEvents = events.filter(e => e.stage !== "finalizado");
  const openOccurrences = occurrences.filter(o => !o.userResponsible || o.userResponsible === "");
  const pendingTasks = tasks.filter(t => t.status !== "Concluida");
  const activeSuppliers = suppliers.filter(s => s.status === "Ativo");
  const activeEmployees = employees.filter(e => e.active);

  // SCORE DE SAÚDE OPERACIONAL INTELIGENTE (0 a 100) - pág 24, 27
  // Quanto menos ocorrências abertas e tarefas atrasadas, maior o score.
  const calculateHealthScore = () => {
    let score = 100;
    
    // Penalidade por ocorrência aberta
    score -= occurrences.length * 8;
    
    // Penalidade por tarefa atrasada
    const overdueTasks = tasks.filter(t => t.status === "Atrasada");
    score -= overdueTasks.length * 6;
    
    // Penalidade por eventos sem equipe alocada
    const unstaffedEvents = events.filter(e => e.staffIds.length === 0);
    score -= unstaffedEvents.length * 10;

    return Math.max(0, Math.min(100, score));
  };

  const healthScore = calculateHealthScore();

  // Color helper based on score
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30";
    if (score >= 50) return "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30";
    return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* 1. WELCOME HERO SECTION (Visually delightful, sun-splashed playful gradient card with organic mesh) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#EA580C] via-[#F97316] to-[#FBBF24] rounded-[32px] p-8 text-white shadow-xl shadow-orange-500/15 border-0" style={{ background: `linear-gradient(135deg, ${companyConfig.primaryColor || '#EA580C'}, ${companyConfig.secondaryColor || '#F97316'}, #FBBF24)` }}>
        {/* Soft floating bubbly circles overlay */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl animate-float-gentle"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-400/20 rounded-full -mb-10 blur-xl animate-float-opposite"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20">
              <span className="text-sm">✨</span>
              <span className="text-[10px] uppercase tracking-wider text-amber-50 font-extrabold font-mono">
                {companyConfig.name}
              </span>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4.5xl font-extrabold tracking-tight font-display">
                Olá, <span className="underline decoration-amber-300 decoration-wavy underline-offset-4">{currentUser.name}</span>!
              </h2>
              <div className="inline-flex items-center gap-2 bg-orange-700/30 text-orange-50 text-[10px] font-bold px-3 py-0.5 rounded-full mt-1 border border-orange-400/25">
                Perfil: {currentUser.profile} e Gestor de Sistemas
              </div>
            </div>
            
            <p className="text-xs md:text-sm text-orange-50/90 max-w-xl font-medium pt-1">
              Sua operação de hoje está configurada perfeitamente. Checklists, fornecedores associados e controle de ponto integrados com precisão.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/25 self-start md:self-auto font-mono shadow-sm transition-all duration-250 hover:scale-[1.03]">
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-orange-100 uppercase tracking-widest font-black leading-tight">Saúde Operacional</span>
              <span className="text-2xl font-black text-white">{healthScore}%</span>
            </div>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white text-orange-600 shadow-md">
              <Activity size={20} className="animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME SUMMARY STATS (Redesigned into beautiful, playful cards with thick colored left borders) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 - Events */}
        <div 
          onClick={() => changeView("eventos")}
          className="bg-white dark:bg-gray-900 p-5 rounded-r-3xl rounded-l-lg border-y border-r border-gray-100 dark:border-gray-800 border-l-6 hover:bg-orange-50/20 dark:hover:bg-orange-950/5 flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-250 active:scale-95 hover:-translate-y-1 hover:rotate-1 group"
          style={{ borderLeftColor: companyConfig.primaryColor || '#EA580C' }}
        >
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Eventos Ativos</span>
            <p className="text-2.5xl font-black text-gray-950 dark:text-white group-hover:text-[var(--color-primary)] transition-colors">
              {activeEvents.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/25 text-[var(--color-primary)] flex items-center justify-center shadow-xs">
            <Calendar size={18} />
          </div>
        </div>

        {/* Metric 2 - Occurrences */}
        <div 
          onClick={() => changeView("eventos")}
          className="bg-white dark:bg-gray-900 p-5 rounded-r-3xl rounded-l-lg border-y border-r border-gray-100 dark:border-gray-800 border-l-6 border-red-500 hover:bg-red-50/20 dark:hover:bg-red-950/5 flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-250 active:scale-95 hover:-translate-y-1 hover:-rotate-1 group"
        >
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Ocorrências</span>
            <p className="text-2.5xl font-black text-red-500 dark:text-red-400">
              {occurrences.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/25 text-red-500 flex items-center justify-center shadow-xs">
            <AlertTriangle size={18} />
          </div>
        </div>

        {/* Metric 3 - Tasks */}
        <div 
          onClick={() => changeView("tarefas")}
          className="bg-white dark:bg-gray-900 p-5 rounded-r-3xl rounded-l-lg border-y border-r border-gray-100 dark:border-gray-800 border-l-6 border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/5 flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-250 active:scale-95 hover:-translate-y-1 hover:rotate-1 group"
        >
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Tarefas Pendentes</span>
            <p className="text-2.5xl font-black text-blue-500 group-hover:text-blue-600 transition-colors">
              {pendingTasks.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/25 text-blue-500 flex items-center justify-center shadow-xs">
            <CheckSquare size={18} />
          </div>
        </div>

        {/* Metric 4 - Suppliers */}
        <div 
          onClick={() => changeView("fornecedores")}
          className="bg-white dark:bg-gray-900 p-5 rounded-r-3xl rounded-l-lg border-y border-r border-gray-100 dark:border-gray-800 border-l-6 border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/5 flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-250 active:scale-95 hover:-translate-y-1 hover:-rotate-1 group"
        >
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Fornecedores</span>
            <p className="text-2.5xl font-black text-emerald-500 group-hover:text-emerald-600 transition-colors">
              {activeSuppliers.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/25 text-emerald-500 flex items-center justify-center shadow-xs">
            <Users size={18} />
          </div>
        </div>
      </div>

      {/* 3. HOME PERSONALIZATION BY PROFILE ROLE (pág 24: "Home Personalizada por Perfil") */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 size): Dynamic Role specific view & graphs */}
        <div className="lg:col-span-2 space-y-6">

          {/* DYNAMIC ROLE CARD CONTAINER */}
          <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b dark:border-gray-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <span className="font-semibold text-gray-900 dark:text-white text-md">
                  Foco do Perfil: <span className="text-[var(--color-primary)] font-bold">{currentUser.profile === "Admin" ? "Visão Estratégica Geral (Admin)" : currentUser.profile}</span>
                </span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-900 px-3 py-1 rounded-full font-mono">
                Online
              </span>
            </div>

            {/* A: OPERACIONAL - Vê ocorrências + checklists + eventos */}
            {(currentUser.profile === "Operacional" || currentUser.profile === "Freelancer") && (
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-500 font-mono">Painel de Acompanhamento Rápido em Campo</h4>
                
                {activeEvents.length === 0 ? (
                  <p className="text-xs text-gray-500">Nenhum evento ativo alocado em progresso.</p>
                ) : (
                  <div className="space-y-3">
                    {activeEvents.slice(0, 2).map(ev => (
                      <div key={ev.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h5 className="font-bold text-sm text-gray-900 dark:text-white truncate">{ev.name}</h5>
                          <p className="text-xs text-gray-500 truncate max-w-md">{ev.address}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-orange-100 dark:bg-orange-850/20 text-[var(--color-primary)] font-bold px-2 py-0.5 rounded-full">
                              Etapa: {ev.stage.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-[var(--color-primary)]">{ev.progress}%</span>
                          <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-mono">Progresso</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => changeView("eventos")}
                    className="text-xs bg-[var(--color-primary)] hover:opacity-95 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1 shadow-xs"
                  >
                    Módulo de Eventos & Checklists
                    <ChevronRight size={14} />
                  </button>
                  <button 
                    onClick={() => changeView("ponto")}
                    className="text-xs bg-slate-100 dark:bg-gray-900 hover:bg-slate-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold px-4 py-2 rounded-xl"
                  >
                    Ver Meu Ponto
                  </button>
                </div>
              </div>
            )}

            {/* B: ESCRITÓRIO - Vê tarefas + prazos + reuniões */}
            {currentUser.profile === "Escritorio" && (
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-500 font-mono">Suas Tarefas & Cronograma Administrativo</h4>
                
                {pendingTasks.length === 0 ? (
                  <p className="text-xs text-gray-500">Parabéns! Todas as tarefas administrativas foram resolvidas.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingTasks.slice(0, 3).map(task => (
                      <div key={task.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${task.status === "Atrasada" ? "bg-red-500" : "bg-amber-500"}`}></span>
                          <div className="text-xs">
                            <span className="font-bold text-gray-800 dark:text-gray-200 block">{task.title}</span>
                            <span className="text-[10px] text-gray-400">Prazo: {task.dueDate} • Prioridade: {task.priority}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-1 flex gap-2">
                  <button 
                    onClick={() => changeView("tarefas")}
                    className="text-xs bg-[var(--color-primary)] text-white font-bold px-4 py-2 rounded-xl"
                  >
                    Gerenciar Quadro Kanban
                  </button>
                  <button 
                    onClick={() => changeView("reunioes")}
                    className="text-xs bg-slate-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold px-4 py-2 rounded-xl"
                  >
                    Pautas de Reuniões
                  </button>
                </div>
              </div>
            )}

            {/* C: DP / RH - Vê ponto eletrônico + equipe ativa + wellbeing */}
            {currentUser.profile === "DP" && (
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-500 font-mono">Painel Integrado de Gestão de Pessoal</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                    <span className="text-[10px] text-gray-400 font-mono uppercase">Total Colaboradores</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{activeEmployees.length}</span>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                    <span className="text-[10px] text-gray-400 font-mono uppercase">Registros de Ponto</span>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{timeRecords.length}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => changeView("colaboradores")}
                    className="text-xs bg-[var(--color-primary)] text-white font-bold px-4 py-2 rounded-xl"
                  >
                    Gerir Fichas de Equipes
                  </button>
                  <button 
                    onClick={() => changeView("ponto")}
                    className="text-xs bg-slate-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold px-4 py-2 rounded-xl"
                  >
                    Controle Completo de Pontos
                  </button>
                </div>
              </div>
            )}

            {/* D: ADMIN / ADMINISTRATIVO (Visão estatística total com gráficos) */}
            {(currentUser.profile === "Admin" || currentUser.profile === "Administrativo") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-500 font-mono">Status de Projetos</h4>
                  
                  {/* CHART TYPE SELECTOR - pág 22 */}
                  <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-800 text-[11px] gap-1.5">
                    <button 
                      onClick={() => setChartType('barra')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${chartType === 'barra' ? 'text-white shadow-xs scale-105' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                      style={chartType === 'barra' ? { backgroundColor: companyConfig.primaryColor || '#EA580C' } : {}}
                    >
                      Barras 📊
                    </button>
                    <button 
                      onClick={() => setChartType('pizza')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${chartType === 'pizza' ? 'text-white shadow-xs scale-105' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                      style={chartType === 'pizza' ? { backgroundColor: companyConfig.primaryColor || '#EA580C' } : {}}
                    >
                      Pizza 🍕
                    </button>
                    <button 
                      onClick={() => setChartType('linha')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${chartType === 'linha' ? 'text-white shadow-xs scale-105' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                      style={chartType === 'linha' ? { backgroundColor: companyConfig.primaryColor || '#EA580C' } : {}}
                    >
                      Linha 📈
                    </button>
                  </div>
                </div>

                {/* VISUAL PREMIUM GRAPHICS DESIGNED VIA ADAPTIVE SVG (ultra fast, crisp on high-dpi mobile screens) */}
                <div className="h-44 bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100/70 dark:border-gray-900 rounded-[28px] p-5 flex items-center justify-center font-mono">
                  {chartType === 'barra' && (
                    <svg className="w-full h-full" viewBox="0 0 400 130">
                      {/* Horizontal lines */}
                      <line x1="40" y1="20" x2="380" y2="20" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3,3" />
                      <line x1="40" y1="60" x2="380" y2="60" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3,3" />
                      <line x1="40" y1="100" x2="380" y2="100" stroke="#9CA3AF" strokeWidth="0.5" />
                      
                      {/* Bars - styled as beautiful rounded capsules */}
                      <g className="hover:opacity-90 hover:scale-[1.02] origin-bottom transition-all duration-200 cursor-pointer">
                        <rect x="70" y="80" width="28" height="20" rx="14" fill="#F97316" />
                        <text x="84" y="115" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#9CA3AF">Visitas</text>
                        <text x="84" y="75" textAnchor="middle" fontSize="10" fontWeight="extrabold" fill="#374151" className="dark:fill-white">1</text>
                      </g>

                      <g className="hover:opacity-90 hover:scale-[1.02] origin-bottom transition-all duration-200 cursor-pointer">
                        <rect x="150" y="60" width="28" height="40" rx="14" fill="#3B82F6" />
                        <text x="164" y="115" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#9CA3AF">Pre-Ev</text>
                        <text x="164" y="55" textAnchor="middle" fontSize="10" fontWeight="extrabold" fill="#374151" className="dark:fill-white">2</text>
                      </g>

                      <g className="hover:opacity-90 hover:scale-[1.02] origin-bottom transition-all duration-200 cursor-pointer">
                        <rect x="230" y="40" width="28" height="60" rx="14" fill="#10B981" />
                        <text x="244" y="115" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#9CA3AF">Pos-Ev</text>
                        <text x="244" y="35" textAnchor="middle" fontSize="10" fontWeight="extrabold" fill="#374151" className="dark:fill-white">3</text>
                      </g>

                      <g className="hover:opacity-90 hover:scale-[1.02] origin-bottom transition-all duration-200 cursor-pointer">
                        <rect x="310" y="90" width="28" height="10" rx="9" fill="#EC4899" />
                        <text x="324" y="115" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#9CA3AF">Final</text>
                        <text x="324" y="85" textAnchor="middle" fontSize="10" fontWeight="extrabold" fill="#374151" className="dark:fill-white">0</text>
                      </g>
                    </svg>
                  )}

                  {chartType === 'pizza' && (
                    <svg className="w-64 h-full" viewBox="0 0 200 120">
                      {/* Simple segment display with beautiful rounded end caps */}
                      <circle cx="60" cy="60" r="42" fill="transparent" stroke="#F3F4F6" className="dark:stroke-gray-800" strokeWidth="16" />
                      {/* Active events segment */}
                      <circle cx="60" cy="60" r="42" fill="transparent" stroke={companyConfig.primaryColor || '#EA580C'} strokeWidth="16" strokeDasharray="180 300" strokeDashoffset="45" strokeLinecap="round" />
                      {/* Legend */}
                      <g transform="translate(125, 30)" fontSize="10">
                        <rect width="8" height="8" fill={companyConfig.primaryColor || '#EA580C'} rx="3" />
                        <text x="14" y="8" className="dark:fill-gray-300 font-bold">Ativos (75%)</text>
                        <rect y="20" width="8" height="8" fill="#F3F4F6" className="dark:fill-gray-800" rx="3" />
                        <text x="14" y="28" className="dark:fill-gray-300 font-bold">Inativos (25%)</text>
                      </g>
                    </svg>
                  )}

                  {chartType === 'linha' && (
                    <svg className="w-full h-full" viewBox="0 0 400 130">
                      {/* Background lines */}
                      <line x1="40" y1="20" x2="380" y2="20" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3,3" />
                      <line x1="40" y1="60" x2="380" y2="60" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3,3" />
                      <line x1="40" y1="100" x2="380" y2="100" stroke="#E5E7EB" strokeWidth="0.5" />

                      {/* Continuous sparkline path with dynamic curves */}
                      <path d="M 50,90 Q 120,30 200,75 T 350,25" fill="none" stroke={companyConfig.primaryColor || '#EA580C'} strokeWidth="4" strokeLinecap="round" />
                      
                      {/* Point overlays - rounded bubble circles */}
                      <circle cx="50" cy="90" r="6" fill={companyConfig.primaryColor || '#EA580C'} stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="160" cy="55" r="6" fill={companyConfig.primaryColor || '#EA580C'} stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="270" cy="55" r="6" fill={companyConfig.primaryColor || '#EA580C'} stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="350" cy="25" r="6" fill={companyConfig.primaryColor || '#EA580C'} stroke="#FFFFFF" strokeWidth="2" />

                      {/* X Axis labels */}
                      <text x="50" y="115" textAnchor="middle" fontSize="9" fill="#9CA3AF">Mar</text>
                      <text x="160" y="115" textAnchor="middle" fontSize="9" fill="#9CA3AF">Abr</text>
                      <text x="270" y="115" textAnchor="middle" fontSize="9" fill="#9CA3AF">Mai</text>
                      <text x="350" y="115" textAnchor="middle" fontSize="9" fill="#9CA3AF">Jun (Est.)</text>
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* EVENTS PROGRESS PANEL (Acompanhamento em tempo real das etapas) */}
          <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-md flex items-center gap-2">
              <span>📋</span> Painel de Etapas de Eventos
            </h3>
            
            <div className="space-y-4">
              {events.slice(0, 3).map(ev => {
                const stagesList = ["visita_tecnica", "pre_evento", "montagem", "execucao", "pos_evento", "finalizado"];
                const currentIndex = stagesList.indexOf(ev.stage);
                
                return (
                  <div key={ev.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-xs">{ev.name}</span>
                      <span className="text-xs font-mono font-bold text-[var(--color-primary)]">{ev.progress}%</span>
                    </div>

                    {/* Step Visualizer - pág 22 ("Painel de Etapas") */}
                    <div className="grid grid-cols-6 gap-1">
                      {stagesList.map((stg, sIdx) => (
                        <div key={stg} className="flex flex-col items-center gap-1">
                          <div className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                            sIdx < currentIndex 
                              ? "bg-emerald-500" 
                              : sIdx === currentIndex 
                                ? "bg-[var(--color-primary)] animate-pulse" 
                                : "bg-gray-200 dark:bg-gray-800"
                          }`}></div>
                          <span className={`text-[8px] truncate max-w-full font-mono scale-90 hidden sm:block ${sIdx === currentIndex ? 'text-[var(--color-primary)] font-bold' : 'text-gray-400'}`}>
                            {stg.replace("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Mobile Only Active Stage Caption */}
                    <div className="block sm:hidden text-center pt-1.5">
                      <span className="text-[10px] font-mono leading-none text-gray-400">
                        Etapa Atual: <span className="text-[var(--color-primary)] font-bold uppercase bg-[var(--color-primary)]/5 px-2 py-0.5 rounded-md inline-block">{ev.stage.replace("_", " ")}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (1/3 size): Real-Time Activity Log & Quick actions */}
        <div className="space-y-6">
          
          {/* DAILY BRIEFING CHIP (Acesso rápido ao Briefing diário com layout lúdico e leve) */}
          <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-[28px] p-6 text-white shadow-lg shadow-amber-500/10 space-y-4 hover:scale-[1.02] transition-transform duration-250 border-0">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-250 animate-pulse" />
              <span className="text-[10px] uppercase font-extrabold tracking-wider font-mono text-yellow-100">Sugestão Operacional</span>
            </div>
            <h4 className="font-extrabold text-[15px] leading-snug font-display">Briefing do Dia & Alinhamentos</h4>
            <p className="text-xs text-amber-50/90 leading-relaxed font-medium">
              Consulte a agenda de hoje, as restrições urgentes de fornecedores mapeados e organize tarefas.
            </p>
            <button 
              onClick={() => changeView("briefing")}
              className="w-full py-2.5 bg-white text-amber-800 hover:text-amber-900 font-bold text-xs rounded-xl shadow-sm hover:scale-[1.02] active:scale-95 transition-all text-center"
            >
              🚀 Abrir Briefing Diário
            </button>
          </div>

          {/* ACTIVE ALERTS / INTELLIGENT COMPLIANCE (pág 24: "Central de Alertas Inteligentes") */}
          <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider font-mono text-gray-400">
              Notificações de Alerta
            </h3>

            <div className="space-y-3">
              {occurrences.slice(0, 2).map((occ) => (
                <div key={occ.id} className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex gap-3">
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-red-900 dark:text-red-300 block">{occ.title}</span>
                    <span className="text-red-700 dark:text-red-400 text-[10px] line-clamp-2 mt-0.5">{occ.description}</span>
                  </div>
                </div>
              ))}

              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex gap-3">
                <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-300 block">Vencimento de Alvará Crítico</span>
                  <span className="text-amber-700 dark:text-amber-400 text-[10px] mt-0.5">Certificado AVCB de Copacabana expira logo. Módulo de Vencimentos em alerta.</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => changeView("alertas")}
              className="w-full text-center text-xs text-[var(--color-primary)] font-bold hover:underline"
            >
              Ver todos os {occurrences.length + 1} alertas
            </button>
          </div>

          {/* RECENT CHECK-INS FEED (Operação ao vivo) - pág 23 ("Check-in Rápido") */}
          <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider font-mono text-gray-400">
              Linha do Tempo (Ao vivo)
            </h3>

            {checkIns.length === 0 ? (
              <p className="text-xs text-gray-400">Nenhum evento registrado ainda hoje na timeline.</p>
            ) : (
              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
                {checkIns.slice(0, 3).map((check) => (
                  <div key={check.id} className="flex gap-3 relative z-10">
                    <span className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold font-mono">
                      ✓
                    </span>
                    <div className="text-xs">
                      <span className="font-bold text-gray-800 dark:text-gray-200 block">{check.type}</span>
                      <p className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">{check.description}</p>
                      <span className="text-[9px] text-gray-400 font-mono block mt-1">
                        {new Date(check.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • por {check.responsibleName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
