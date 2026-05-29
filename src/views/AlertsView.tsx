import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { AlertCircle, ShieldAlert, Sparkles, Filter, CheckCircle2, Search, Info, Trash } from "lucide-react";

export const AlertsView: React.FC = () => {
  const { occurrences, timeRecords, employees, suppliers } = useApp();

  // Simulated operational warnings (calculado com base nas regras do PDF pág 22, 28)
  const [warnings, setWarnings] = useState<any[]>(() => {
    // 1. Check completed points from employees:
    const pointsUnfinished = employees.filter(e => e.active).slice(0, 1).map(e => ({
      id: "w_point_1",
      title: "Registro de Ponto Incompleto detectado hoje",
      severity: "Alto",
      category: "Departamento Pessoal",
      message: `O colaborador ${e.fullName} registrou Entrada mas ainda não registrou Saída programada.`,
      target: e.fullName,
      status: "Pendente",
      actionNeeded: "Deverá ser retificado no painel gerencial de Ponto Eletrônico."
    }));

    // 2. Check low scores from supplier checklists:
    const lowScoreSuppliers = suppliers.filter(s => s.ratingNegative > 0).map(s => ({
      id: `w_sup_${s.id}`,
      title: "Avaliação Negativa de Credenciamento",
      severity: "Critico",
      category: "Fornecedores",
      message: `Recebido checklist de conformidade reprovado para o credenciado ${s.tradeName}.`,
      target: s.tradeName,
      status: "Pendente",
      actionNeeded: "Realizar vistoria técnica imediata dos geradores de energia / ambulâncias de plantão."
    }));

    // 3. Document expirations:
    const docExps = [
      {
        id: "w_doc_1",
        title: "Alvará Sanitário de Ambulância Expirado",
        severity: "Critico",
        category: "Segurança / Admin",
        message: "O Alvará Sanitário da ambulância de plantão de Haras expirou em 2025-05-10.",
        target: "SAS Ambulâncias",
        status: "Pendente",
        actionNeeded: "Exigir nova licença sanitária sob pena de descredenciamento imediato."
      },
      {
        id: "w_doc_2",
        title: "Seguro Responsabilidade Civil Próximo do Vencimento",
        severity: "Médio",
        category: "Contratos / Seguros",
        message: "A apólice de seguro do Réveillon Copacabana vence nos próximos 7 dias (2026-06-03).",
        target: "Leandra Soares",
        status: "Pendente",
        actionNeeded: "Contatar corretora oficial para quitação da parcela de renovação."
      }
    ];

    return [...pointsUnfinished, ...lowScoreSuppliers, ...docExps];
  });

  const [activeSeverity, setActiveSeverity] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const handleResolveWarning = (id: string) => {
    setWarnings(prev => prev.map(w => w.id === id ? { ...w, status: "Resolvido" } : w));
  };

  const handleDeleteWarning = (id: string) => {
    setWarnings(prev => prev.filter(w => w.id !== id));
  };

  const getSeverityStyle = (severity: string) => {
    if (severity === "Critico") return "border-red-500/30 bg-red-50/60 text-red-700 dark:bg-red-950/20 dark:text-red-400";
    if (severity === "Alto") return "border-amber-500/30 bg-amber-50/60 text-amber-700 dark:bg-amber-955/20 dark:text-amber-400";
    return "border-blue-500/30 bg-blue-50/60 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400";
  };

  const filteredWarnings = warnings.filter(w => {
    const matchSeverity = activeSeverity === "Todos" || w.severity === activeSeverity;
    const matchSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) || w.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSeverity && matchSearch;
  });

  // Calculate high stats consolidated
  const criticalCount = warnings.filter(w => w.severity === "Critico" && w.status === "Pendente").length;
  const highCount = warnings.filter(w => w.severity === "Alto" && w.status === "Pendente").length;
  const resolvedCount = warnings.filter(w => w.status === "Resolvido").length;

  return (
    <div className="space-y-6">
      
      {/* HEADER ROW */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Alerta de Saúde Operacional</h2>
        <p className="text-xs text-gray-500 font-sans font-medium">Cruzamento de dados automatizados, inconformidades em checklists de fornecedores e controle de prazos críticos.</p>
      </div>

      {/* METRIC ROW BENTO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50/40 dark:bg-red-950/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center gap-3">
          <ShieldAlert className="text-red-500 shrink-0" size={24} />
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-mono font-bold block">Críticos Pendentes</span>
            <strong className="text-xl text-red-650 dark:text-red-400 font-black font-mono">{criticalCount}</strong>
          </div>
        </div>

        <div className="bg-amber-50/40 dark:bg-amber-955/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30 flex items-center gap-3">
          <AlertCircle className="text-amber-500 shrink-0" size={24} />
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-mono font-bold block">Atenção Ativa</span>
            <strong className="text-xl text-amber-600 dark:text-amber-400 font-black font-mono">{highCount}</strong>
          </div>
        </div>

        <div className="bg-emerald-50/40 dark:bg-emerald-950/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3">
          <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-mono font-bold block">Resolvidos de Campo</span>
            <strong className="text-xl text-emerald-650 dark:text-emerald-400 font-black font-mono">{resolvedCount}</strong>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BUTTONS */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex gap-1.5 overflow-x-auto text-[11px] font-bold pb-2 md:pb-0 font-mono">
          {["Todos", "Critico", "Alto", "Médio"].map(sev => (
            <button
              key={sev}
              onClick={() => setActiveSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl transition-all ${activeSeverity === sev ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-900'}`}
            >
              Urgência: {sev}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Pesquise por palavra-chave..."
            className="w-full pl-9 pr-4 py-1.5 border dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* SYSTEM WARNING CORRELATOR FEED */}
      <div className="space-y-4">
        {filteredWarnings.map((warn) => {
          const isPending = warn.status === "Pendente";
          
          return (
            <div 
              key={warn.id}
              className={`p-5 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all opacity-100 bg-white dark:bg-gray-950 dark:border-gray-900 shadow-xs ${!isPending ? 'opacity-65' : ''}`}
            >
              <div className="flex items-start gap-3.5">
                <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${warn.severity === "Critico" ? 'bg-red-500' : warn.severity === "Alto" ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-gray-100 dark:bg-gray-900 text-gray-400 px-1.5 py-0.2 rounded font-extrabold tracking-wider">
                      {warn.category}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      Alvo: {warn.target}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-white leading-snug">{warn.title}</h3>
                  <p className="text-xs text-gray-500">{warn.message}</p>
                  
                  {isPending && warn.actionNeeded && (
                    <div className="pt-1.5 flex items-center gap-1.5 text-[10px] text-gray-400 font-mono font-medium">
                      <span className="text-amber-500">☉</span>
                      <span>Resolução: {warn.actionNeeded}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto uppercase font-mono text-[10px] font-bold">
                {isPending ? (
                  <>
                    <button
                      onClick={() => handleResolveWarning(warn.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15"
                    >
                      Marcar Resolvido
                    </button>
                    <button
                      onClick={() => handleDeleteWarning(warn.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                    >
                      <Trash size={14} />
                    </button>
                  </>
                ) : (
                  <span className="text-emerald-500 flex items-center gap-1 font-bold">
                    ✓ Mitigado com Sucesso
                  </span>
                )}
              </div>

            </div>
          );
        })}

        {filteredWarnings.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-950 rounded-3xl border border-dashed dark:border-gray-900">
            <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400 font-sans">Sem inconformidades ativas detectadas. Infraestrutura de campo operando com 100% integridade.</p>
          </div>
        )}
      </div>

    </div>
  );
};
