import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { PointRecordType, Employee, TimeRecord } from "../types";
import { 
  Clock, CheckCircle, AlertCircle, Calendar, Users, Filter, Plus, 
  ShieldCheck, Check, X, FileText, UploadCloud, Hourglass, Award 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const TimeClockView: React.FC = () => {
  const { 
    timeRecords, addTimeRecord, updateTimeRecord, employees, currentUser, addAuditLog 
  } = useApp();

  // Selected employee for clock punch simulation
  const [selectedEmpId, setSelectedEmpId] = useState<string>("");
  const [clockTime, setClockTime] = useState(new Date());

  // Tabs: 'bater_ponto' | 'justificar' | 'painel_dp' (Restricted)
  const [activeSubTab, setActiveSubTab] = useState<'bater_ponto' | 'justificar' | 'painel_dp'>('bater_ponto');

  // Justification Form States
  const [justDate, setJustDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [justType, setJustType] = useState<PointRecordType>("Entrada");
  const [justReason, setJustReason] = useState<string>("Problema Técnico / Dispositivo");
  const [justText, setJustText] = useState<string>("");
  const [justSuccessMsg, setJustSuccessMsg] = useState<string>("");

  // Filters for DP History view
  const [filterEmpId, setFilterEmpId] = useState<string>("todos");
  const [filterJustificativa, setFilterJustificativa] = useState<string>("todos");

  // Keep Clock updated in real-time
  useEffect(() => {
    const timer = setInterval(() => setClockTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine if profile can see entire company or just itself
  const isDPorAdmin = ["Admin", "DP", "Administrativo"].includes(currentUser.profile);

  // Auto-find employee tied to logged in user
  const loggedEmployee = employees.find(
    e => e.fullName.toLowerCase() === currentUser.name.toLowerCase() || 
         e.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  useEffect(() => {
    if (isDPorAdmin) {
      if (employees.length > 0 && !selectedEmpId) {
        setSelectedEmpId(employees[0].id);
      }
    } else if (loggedEmployee) {
      setSelectedEmpId(loggedEmployee.id);
    }
  }, [currentUser, employees, isDPorAdmin, loggedEmployee]);

  const handlePunchClock = (type: PointRecordType) => {
    const empId = isDPorAdmin ? selectedEmpId : (loggedEmployee?.id || "emp_temp");
    const emp = employees.find(e => e.id === empId);
    
    // Safety check
    if (!emp) {
      alert("Colaborador não identificado no cadastro de Recursos Humanos.");
      return;
    }

    addTimeRecord({
      employeeId: empId,
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString(),
      type,
      approved: true,
      notes: `Registrado com sucesso via terminal digital instantâneo por ${currentUser.name}.`
    });

    // Pulse notification effect
    const btn = document.getElementById(`btn-clock-${type.replace(/\s+/g, '')}`);
    if (btn) {
      btn.classList.add("ring-4", "ring-emerald-500/50");
      setTimeout(() => btn.classList.remove("ring-4", "ring-emerald-500/50"), 800);
    }
  };

  const handleSendJustification = (e: React.FormEvent) => {
    e.preventDefault();
    const empId = isDPorAdmin ? selectedEmpId : (loggedEmployee?.id || "emp1");
    const emp = employees.find(e => e.id === empId);

    if (!emp) return;

    if (!justText.trim()) {
      alert("Por favor, digite o motivo detalhado de sua justificativa.");
      return;
    }

    // Add point record flags
    addTimeRecord({
      employeeId: empId,
      date: justDate,
      timestamp: `${justDate}T${new Date().toTimeString().split(" ")[0]}`,
      type: justType,
      approved: false, // Must be verified by DP
      notes: `[PENDENTE DP] Justificativa anexada: ${justReason}. Detalhe: ${justText}`,
      justification: `[${justReason}] ${justText}`,
      justificationStatus: "Pendente"
    });

    addAuditLog("Ponto: Enviou justificativa de atraso", emp.fullName);
    setJustSuccessMsg("Sua justificativa foi protocolada com sucesso e enviada ao Departamento Pessoal (DP) para homologação.");
    setJustText("");
    
    setTimeout(() => {
      setJustSuccessMsg("");
      setActiveSubTab("bater_ponto");
    }, 4000);
  };

  const handleVerifyJustification = (recordId: string, approve: boolean) => {
    updateTimeRecord(recordId, {
      approved: approve,
      justificationStatus: approve ? "Aprovado" : "Rejeitado",
      notes: approve 
        ? "Justificativa validada e aprovada pelo Coordenador de DP." 
        : "Justificativa indeferida pelo Coordenador de DP."
    });
  };

  // Calculations helper for Point records (Entrance, exit, lunch intervals, total hours)
  const calculateJornada = (empId: string, targetDate: string) => {
    const dayRecords = timeRecords.filter(r => r.employeeId === empId && r.date === targetDate);
    if (dayRecords.length === 0) return { in: "--:--", out: "--:--", total: "0.00h", status: "Falta", records: [] };

    const inRecord = dayRecords.find(r => r.type === "Entrada");
    const outRecord = dayRecords.find(r => r.type === "Saida");

    const inTime = inRecord ? new Date(inRecord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--";
    const outTime = outRecord ? new Date(outRecord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--";

    let totalStr = "0.00h";
    let scoreStatus = "Ok";

    // Filter approved stamps
    const approvedRecords = dayRecords.filter(r => r.approved);

    if (inRecord && outRecord && inRecord.approved && outRecord.approved) {
      const diffMs = new Date(outRecord.timestamp).getTime() - new Date(inRecord.timestamp).getTime();
      const diffHrs = (diffMs / (1000 * 60 * 60)).toFixed(2);
      totalStr = `${diffHrs}h`;
      
      const targetHours = 8;
      const parsedHrs = parseFloat(diffHrs);
      if (parsedHrs < targetHours - 0.1) {
        scoreStatus = "Jornada Incompleta";
      } else if (parsedHrs > targetHours + 0.5) {
        scoreStatus = "Hora Extra";
      } else {
        scoreStatus = "Regular";
      }
    } else {
      scoreStatus = "Pendente / Incompleto";
    }

    return {
      in: inTime,
      out: outTime,
      total: totalStr,
      status: scoreStatus,
      records: dayRecords
    };
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "Regular":
      case "Ok":
        return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/45";
      case "Hora Extra":
        return "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/45";
      case "Falta":
        return "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/45";
      default:
        return "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/45";
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  // Filtering records needing attention / justifications
  const pendingJustifications = timeRecords.filter(
    r => r.justification && r.justificationStatus === "Pendente"
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR AND PROFILE CONSTRAINTS INDICATOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3.5 bg-white dark:bg-zinc-900 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-3xs">
        <div>
          <span className="text-[10px] md:text-sm uppercase font-mono tracking-widest text-[var(--color-primary)] font-black">RECURSOS HUMANOS</span>
          <h2 className="text-lg md:text-2xl font-black tracking-tight text-gray-900 dark:text-zinc-50 mt-0.5 md:mt-1 leading-tight">
            Espelho & Terminal de Ponto
          </h2>
          <p className="text-[10px] md:text-xs text-gray-400 dark:text-zinc-400 mt-0.5 md:mt-1 max-w-2xl leading-relaxed">
            Seu ponto de controle físico-operacional em eventos. Resolução de atrasos, retroativos e homologações.
          </p>
        </div>

        {/* PROFILE BADGE - Sleek and inline on mobile, standard card on desktop */}
        <div className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-gray-150 dark:border-zinc-850 text-xs font-bold shrink-0 shadow-3xs">
          <span className="w-5 h-5 md:w-6 md:h-6 leading-none shrink-0 overflow-hidden flex items-center justify-center bg-white dark:bg-zinc-900 rounded-lg">
            {currentUser.avatar && (currentUser.avatar.startsWith("data:image/") || currentUser.avatar.startsWith("http")) ? (
              <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Perfil" referrerPolicy="no-referrer" />
            ) : (
              <span>{currentUser.avatar}</span>
            )}
          </span>
          <div className="leading-none">
            <span className="text-[8px] md:text-[10px] block font-mono font-bold text-gray-400 dark:text-zinc-500 uppercase leading-none md:mb-0.5">Perfil Logado</span>
            <strong className="text-[10px] md:text-xs text-gray-700 dark:text-zinc-300 font-extrabold uppercase tracking-wide">{currentUser.profile}</strong>
          </div>
        </div>
      </div>

      {/* HORIZONTAL TAB MENU */}
      <div className="flex border-b border-gray-250 dark:border-zinc-800 gap-1 overflow-x-auto text-sm font-semibold">
        <button
          onClick={() => setActiveSubTab('bater_ponto')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'bater_ponto'
              ? "border-[var(--color-primary)] text-[var(--color-primary)]"
              : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-150"
          }`}
        >
          ⌚ Terminal de Batida
        </button>

        <button
          onClick={() => setActiveSubTab('justificar')}
          className={`px-4 py-2.5 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'justificar'
              ? "border-[var(--color-primary)] text-[var(--color-primary)]"
              : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-150"
          }`}
        >
          📝 Justificar Ausência ou Atraso
        </button>

        {isDPorAdmin && (
          <button
            onClick={() => setActiveSubTab('painel_dp')}
            className={`px-4 py-2.5 border-b-2 font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'painel_dp'
                ? "border-purple-600 text-purple-650 font-bold"
                : "border-transparent text-purple-500 hover:text-purple-600"
            }`}
          >
            📊 Homologações DP {pendingJustifications.length > 0 && (
              <span className="bg-red-505 bg-red-500 text-white rounded-full px-1.5 py-0.2 text-[9px] font-black animate-bounce">
                {pendingJustifications.length}
              </span>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: VISUAL CLOCK & QUICK BATIDAS */}
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm space-y-6">
          
          {/* DIGITAL HERO CLOCK (Swiss modern font / JetBrains style) */}
          <div className="bg-zinc-950 dark:bg-black text-white p-6 rounded-2xl text-center space-y-1 relative shadow-inner overflow-hidden border border-zinc-900">
            <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block">HORÁRIO DE MONITORAMENTO</span>
            <span className="text-4xl font-mono font-black tracking-wider block text-[var(--color-primary)] drop-shadow-[0_0_10px_rgba(232,93,4,0.15)] select-none">
              {clockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="text-[11px] text-zinc-400 capitalize block select-none">
              {clockTime.toLocaleDateString("pt-BR", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* ACTIVE COLLABORATOR PIN CONTROL */}
          <div className="space-y-2 bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-xl border border-gray-100 dark:border-zinc-850">
            {isDPorAdmin ? (
              <>
                <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">Simular Colaborador Ativo</label>
                <select
                  className="w-full text-xs p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] font-mono font-semibold"
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.role})
                    </option>
                  ))}
                </select>
                <span className="text-[9px] text-gray-400 font-mono block">Dica de Administrador: Selecione o funcionário para registrar ou testar pontos.</span>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(var(--color-primary-rgb),0.1)] text-[var(--color-primary)] text-sm font-bold">
                  👤
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-400 block leading-none">Matrícula Integrada</span>
                  <strong className="text-xs text-zinc-800 dark:text-zinc-200 truncate block mt-0.5">
                    {loggedEmployee ? loggedEmployee.fullName : currentUser.name}
                  </strong>
                  <span className="text-[9px] text-zinc-400 block mt-0.5">Cargo: {loggedEmployee ? loggedEmployee.role : "Operacional"}</span>
                </div>
              </div>
            )}
          </div>

          {/* QUICK-TAP ACTION BUTTONS FOR BACKSTAGE (pág 76 responsive layout) */}
          <div className="space-y-3">
            <span className="block text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">Registrar Marcador Direto</span>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { type: "Entrada", label: "Entrada", icon: "🟢", desc: "Início do Turno" },
                { type: "Saida", label: "Saída", icon: "🔴", desc: "Fim do Turno" },
                { type: "Ida Almoço", label: "Ida Almoço", icon: "🍱", desc: "Início Almoço" },
                { type: "Retorno Almoço", label: "Volta Almoço", icon: "🍱", desc: "Fim Almoço" },
                { type: "Ida Café", label: "Ida Café", icon: "☕", desc: "Início Café" },
                { type: "Retorno Café", label: "Volta Café", icon: "☕", desc: "Fim Café" }
              ].map((m) => (
                <button
                  key={m.type}
                  id={`btn-clock-${m.type.replace(/\s+/g, '')}`}
                  onClick={() => handlePunchClock(m.type as PointRecordType)}
                  className="p-3 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-850 active:scale-95 border border-gray-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-center items-center text-center gap-1 transition-all duration-100 cursor-pointer min-h-[44px] group"
                >
                  <span className="text-sm shrink-0 group-hover:scale-125 transition-transform">{m.icon}</span>
                  <div className="min-w-0">
                    <span className="text-gray-900 dark:text-zinc-150 font-bold block text-xs leading-none">{m.label}</span>
                    <span className="text-[8px] text-gray-400 dark:text-zinc-500 font-mono block mt-0.5">{m.desc}</span>
                  </div>
                </button>
              ))}
            </div>
            <span className="text-[9px] font-mono text-zinc-400 text-center block bg-zinc-50 dark:bg-zinc-950 p-2 rounded-lg border dark:border-zinc-800">
              ⚡ Toques rápidos de 1-clique otimizados para rede móvel em feiras e eventos.
            </span>
          </div>

        </div>

        {/* MIDDLE & RIGHT AREA: TABS RENDERING CONTAINER */}
        <div className="lg:col-span-2 space-y-6">

          {/* TAB 1: BATIMENTO TERMINAL AND DAILY RECONCILE */}
          {activeSubTab === "bater_ponto" && (
            <div className="space-y-6">
              
              {/* MY DAILY STAMPS / HISTÓRICO INDIVIDUAL DO DIA */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b dark:border-zinc-800 pb-3">
                  <h3 className="font-extrabold text-sm text-gray-950 dark:text-zinc-50 flex items-center gap-2">
                    <Calendar size={18} className="text-[var(--color-primary)]" />
                    Marcações Lançadas Hoje ({todayStr.split("-").reverse().join("/")})
                  </h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-100 dark:border-emerald-900">
                    Filtro: Tempo Real
                  </span>
                </div>

                {/* TODAY TIMELINE */}
                {(() => {
                  const empId = isDPorAdmin ? selectedEmpId : (loggedEmployee?.id || "not_found");
                  const daily = calculateJornada(empId, todayStr);
                  
                  return (
                    <div className="space-y-4">
                      {/* STAT PANEL */}
                      <div className="grid grid-cols-3 gap-3 p-4 bg-zinc-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-850 rounded-2xl text-center">
                        <div>
                          <span className="block text-[9px] uppercase tracking-wider font-mono text-gray-400">Primeira Entrada</span>
                          <strong className="text-sm font-black text-gray-800 dark:text-zinc-100">{daily.in}</strong>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase tracking-wider font-mono text-gray-400">Última Saída</span>
                          <strong className="text-sm font-black text-gray-800 dark:text-zinc-100">{daily.out}</strong>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase tracking-wider font-mono text-gray-400">Soma de Horas</span>
                          <strong className="text-sm font-black text-[var(--color-primary)]">{daily.total}</strong>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border flex items-center justify-between text-xs font-mono leading-none bg-zinc-50/50 dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-850">
                        <span className="text-gray-400 uppercase font-black tracking-widest text-[9px]">Análise Preliminar</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadgeStyles(daily.status)}`}>
                          {daily.status}
                        </span>
                      </div>

                      {/* DETAILED MARKS LOG */}
                      <div className="space-y-2">
                        <span className="block text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">Cronograma de Batidas de Hoje</span>
                        {daily.records.length === 0 ? (
                          <div className="py-6 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2 border border-dashed rounded-xl dark:border-zinc-800 p-4">
                            <Clock size={24} className="opacity-30" />
                            <span>Nenhuma batida registrada para o colaborador selecionado na data de hoje.</span>
                          </div>
                        ) : (
                          <div className="divide-y dark:divide-zinc-800 border dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50">
                            {daily.records.map((r, i) => (
                              <div key={r.id} className="p-3 flex items-center justify-between text-xs hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-zinc-400 font-mono w-4 text-right">#{i + 1}</span>
                                  <div>
                                    <span className="font-black text-gray-900 dark:text-zinc-105">{r.type}</span>
                                    {r.justification && (
                                      <span className="block text-[9px] text-amber-600 dark:text-amber-400 font-mono bg-amber-50 dark:bg-amber-950/30 font-semibold px-1 py-0.2 rounded mt-0.5">
                                        Justificativa: {r.justification}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 rounded border dark:border-zinc-800">
                                    {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                  </span>
                                  {r.justification ? (
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full border ${
                                      r.justificationStatus === "Aprovado" 
                                        ? "text-emerald-500 border-emerald-200 bg-emerald-50" 
                                        : r.justificationStatus === "Rejeitado" 
                                        ? "text-red-500 border-red-200 bg-red-50" 
                                        : "text-amber-500 border-amber-200 bg-amber-50 animate-pulse"
                                    }`}>
                                      {r.justificationStatus === "Aprovado" ? "Aprovado" : r.justificationStatus === "Rejeitado" ? "Recusado" : "Avaliando"}
                                    </span>
                                  ) : (
                                    <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-0.5">
                                      <Check size={10} /> Ok
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* MULTI_COMPANY COMPLIANCE AUDIT FEED */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm space-y-4">
                <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest font-mono">Últimas Batidas do Evento / Plataforma</h3>
                <div className="divide-y dark:divide-zinc-800 max-h-44 overflow-y-auto pr-1">
                  {timeRecords.slice(0, 5).map(record => {
                    const emp = employees.find(e => e.id === record.employeeId);
                    return (
                      <div key={record.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
                          <div>
                            <span className="font-bold text-gray-800 dark:text-zinc-200">{emp?.fullName || "Operador Desconhecido"}</span>
                            <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider block mt-0.5">{record.type}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 rounded border dark:border-zinc-800">
                          {new Date(record.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: JUSTIFICATION REQUEST PROCESSOR */}
          {activeSubTab === "justificar" && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm space-y-6">
              
              <div>
                <h3 className="font-extrabold text-base text-gray-950 dark:text-zinc-50">Justificar Registro ou Atraso</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Incompletudes, esquecimentos, atestados de saúde ou de transporte devem ser protocolados aqui.
                </p>
              </div>

              {justSuccessMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/35 text-emerald-600 dark:text-emerald-400 text-xs p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle size={20} className="shrink-0" />
                  <p className="font-semibold">{justSuccessMsg}</p>
                </div>
              )}

              <form onSubmit={handleSendJustification} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">Data do Incidente</label>
                    <input 
                      type="date"
                      value={justDate}
                      onChange={(e) => setJustDate(e.target.value)}
                      className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-gray-205 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">Marcação de Destino</label>
                    <select
                      value={justType}
                      onChange={(e) => setJustType(e.target.value as PointRecordType)}
                      className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-gray-205 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] font-semibold"
                    >
                      <option value="Entrada">🟢 Entrada</option>
                      <option value="Saida">🔴 Saída</option>
                      <option value="Ida Almoço">🍱 Ida Almoço</option>
                      <option value="Retorno Almoço">🍱 Volta Almoço</option>
                      <option value="Ida Café">☕ Ida Café</option>
                      <option value="Retorno Café">☕ Volta Café</option>
                    </select>
                  </div>

                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">Motivo Principal</label>
                  <select
                    value={justReason}
                    onChange={(e) => setJustReason(e.target.value)}
                    className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-gray-205 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] font-semibold"
                  >
                    <option value="Problema Técnico / Dispositivo">📱 Problema Técnico / Celular sem bateria</option>
                    <option value="Esquecimento de Registro">🧠 Esquecimento do colaborador ao chegar/sair</option>
                    <option value="Problemas de Transporte / Trânsito">🚗 Trânsito / Atraso com transporte fretado</option>
                    <option value="Atestado de Saúde / Doença">🏥 Atestado Médico / Consulta</option>
                    <option value="Atraso de Terceiros / Produção">🏗️ Bloqueio externo / Produção do Show atrasada</option>
                    <option value="Outros Motivos">❓ Outros Motivos (especificar detalhadamente)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">Descrição Detalhada / Justificativa</label>
                  <textarea
                    rows={4}
                    value={justText}
                    onChange={(e) => setJustText(e.target.value)}
                    placeholder="Digite minuciosamente o motivo da justificativa, fornecendo horas exatas caso necessário e links de atestados se houver..."
                    className="w-full text-xs p-3 bg-zinc-50 dark:bg-zinc-950 border border-gray-205 dark:border-zinc-800 rounded-xl text-gray-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                </div>

                {/* FILE UPLOAD DRAG DROP AREA */}
                <div className="border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl p-6 text-center hover:bg-zinc-50 dark:hover:bg-zinc-950/40 transition-all cursor-pointer group">
                  <input type="file" id="files" className="hidden" />
                  <label htmlFor="files" className="cursor-pointer space-y-1 block">
                    <UploadCloud size={24} className="mx-auto text-zinc-400 group-hover:text-[var(--color-primary)] transition-colors" />
                    <span className="block text-xs font-bold text-zinc-850 dark:text-zinc-300">Anexar Comprovante / Atestado de Frequência</span>
                    <span className="block text-[9px] text-zinc-400 font-mono">PNG, JPG, PDF até 5MB</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t dark:border-zinc-800">
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-95 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Enviar Justificativa
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* TAB 3: DP VALIDATION / EXECUTIVE BOARD FOR PENDING REVIEWS */}
          {activeSubTab === "painel_dp" && isDPorAdmin && (
            <div className="space-y-6">

              {/* HOMOLOGATION LIST PANEL */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b dark:border-zinc-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-[#1F2937] dark:text-white flex items-center gap-2 text-sm">
                      <ShieldCheck size={18} className="text-purple-650" />
                      Painel Gerencial de Validações & Retificações
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-none mt-1">Aprove ou rejeite justificativas lançadas pelos operadores.</p>
                  </div>
                  <span className="text-[9px] font-mono font-black bg-purple-100 text-purple-700 px-2.5 py-1 rounded">
                    Perfil DP: {currentUser.name}
                  </span>
                </div>

                {/* SUB FILTERS */}
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <select
                    value={filterEmpId}
                    onChange={(e) => setFilterEmpId(e.target.value)}
                    className="p-2 bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl text-xs"
                  >
                    <option value="todos">Todos Colaboradores</option>
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>{e.fullName}</option>
                    ))}
                  </select>

                  <select
                    value={filterJustificativa}
                    onChange={(e) => setFilterJustificativa(e.target.value)}
                    className="p-2 bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl text-xs"
                  >
                    <option value="todos">Todos os Pontos</option>
                    <option value="justificados">Apenas com Justificativa</option>
                    <option value="pendentes">Apenas Pendentes DP</option>
                  </select>
                </div>

                {/* COLLABORATOR JUSTIFICATION ACTION LIST */}
                <div className="space-y-4">
                  {(() => {
                    // Filter records based on UI checkboxes
                    let filtered = timeRecords.filter(r => {
                      if (filterEmpId !== "todos" && r.employeeId !== filterEmpId) return false;
                      if (filterJustificativa === "justificados" && !r.justification) return false;
                      if (filterJustificativa === "pendentes" && r.justificationStatus !== "Pendente") return false;
                      return true;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="py-12 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2 border border-dashed rounded-xl dark:border-zinc-800 p-6">
                          <Hourglass size={32} className="text-zinc-300 animate-spin" />
                          <span className="font-bold">Nenhum registro de ponto encontrado para os critérios de busca selecionados.</span>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        {filtered.map(record => {
                          const emp = employees.find(e => e.id === record.employeeId);
                          
                          return (
                            <div 
                              key={record.id} 
                              className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all ${
                                record.justificationStatus === "Pendente" 
                                  ? "bg-amber-500/5 dark:bg-amber-950/10 border-amber-300/35" 
                                  : "bg-zinc-50/50 dark:bg-zinc-950/20 border-gray-150 dark:border-zinc-850"
                              }`}
                            >
                              <div className="space-y-1.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-gray-950 dark:text-zinc-100">
                                    {emp?.fullName || record.employeeId}
                                  </span>
                                  <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded font-semibold font-mono text-zinc-505 dark:text-zinc-400">
                                    {emp?.role || "Operador"}
                                  </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 font-mono">
                                  <span>Tipo: <strong className="text-zinc-800 dark:text-zinc-300">{record.type}</strong></span>
                                  <span>Data: <strong>{record.date.split("-").reverse().join("/")}</strong></span>
                                  <span>Hora: <strong>{new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                                </div>

                                {record.justification && (
                                  <div className="p-2.5 bg-white dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl text-xs text-gray-800 dark:text-zinc-200 space-y-1">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600 block leading-none font-mono">🔍 Justificativa Anexada</span>
                                    <p className="font-medium">{record.justification}</p>
                                  </div>
                                )}
                              </div>

                              {/* ACTIONS */}
                              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                                {record.justificationStatus === "Pendente" ? (
                                  <>
                                    <button
                                      onClick={() => handleVerifyJustification(record.id, true)}
                                      className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                                      title="Aprovar Ponto de Registro"
                                    >
                                      <Check size={14} /> Homologar
                                    </button>
                                    <button
                                      onClick={() => handleVerifyJustification(record.id, false)}
                                      className="p-2 bg-red-500 hover:bg-red-650 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                                      title="Recusar Justificativa"
                                    >
                                      <X size={14} /> Indeferir
                                    </button>
                                  </>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full border ${
                                      record.justificationStatus === "Aprovado"
                                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-990"
                                        : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-990"
                                    }`}>
                                      {record.justificationStatus === "Aprovado" ? "Aprovado" : "Recusado"}
                                    </span>
                                    <button
                                      onClick={() => {
                                        // Reset to allow review again
                                        updateTimeRecord(record.id, { justificationStatus: "Pendente" });
                                      }}
                                      className="p-1 hover:bg-gray-150 dark:hover:bg-zinc-800 rounded text-[9px] font-mono font-bold text-gray-400 cursor-pointer"
                                    >
                                      Reavaliar
                                    </button>
                                  </div>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
