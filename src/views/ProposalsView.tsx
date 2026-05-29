import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Search, FileText, CheckCircle2, DollarSign, Calculator, Download, Trash, Edit, Settings, Check } from "lucide-react";

export const ProposalsView: React.FC = () => {
  const { currentUser } = useApp();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Simulated Commercial Proposals DB local storage
  const [proposals, setProposals] = useState<any[]>(() => {
    const saved = localStorage.getItem("gs_proposals_list");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "prop_1",
        clientName: "Ambev S.A.",
        projectName: "Camarote Brahma Allianz Parque",
        date: "2026-05-28",
        rawVal: 154000.00,
        taxPercent: 12.00,
        feePercent: 8.00,
        finalVal: 184800.00,
        responsible: "Carlos Eduardo Silva",
        status: "Aprovado",
        notes: "Aprovado pela diretoria de marketing nacional do cliente."
      },
      {
        id: "prop_2",
        title: "Repasse Allianz Park",
        clientName: "Allianz Park Admin",
        projectName: "Montagem Tendas Cobertas",
        date: "2026-05-25",
        rawVal: 45000.00,
        taxPercent: 6.00,
        feePercent: 5.00,
        finalVal: 49950.00,
        responsible: "Leandra Kaisa",
        status: "Pendente",
        notes: "Aguardando assinatura digital do responsável legal do parque."
      }
    ];
  });

  const saveToLocal = (newProps: any[]) => {
    setProposals(newProps);
    localStorage.setItem("gs_proposals_list", JSON.stringify(newProps));
  };

  // Form states - pág 22, 28
  const [isCreating, setIsCreating] = useState(false);
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [rawVal, setRawVal] = useState("");
  const [taxPercent, setTaxPercent] = useState("12");
  const [feePercent, setFeePercent] = useState("8");
  const [notes, setNotes] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !projectName || !rawVal) return;

    // Intelligent financial calculation (tax & margins - pág 53)
    const raw = parseFloat(rawVal);
    const tax = parseFloat(taxPercent);
    const fee = parseFloat(feePercent);

    const taxVal = raw * (tax / 100);
    const feeVal = raw * (fee / 100);
    const computedFinal = raw + taxVal + feeVal;

    const newProp = {
      id: "prop_" + Date.now(),
      clientName,
      projectName,
      date: new Date().toISOString().split("T")[0],
      rawVal: raw,
      taxPercent: tax,
      feePercent: fee,
      finalVal: computedFinal,
      responsible: currentUser.name,
      status: "Pendente",
      notes
    };

    const updated = [newProp, ...proposals];
    saveToLocal(updated);

    // Reset Form
    setIsCreating(false);
    setClientName("");
    setProjectName("");
    setRawVal("");
    setNotes("");
  };

  const handleToggleStatus = (id: string, newStatus: string) => {
    const updated = proposals.map(p => p.id === id ? { ...p, status: newStatus } : p);
    saveToLocal(updated);
  };

  const handleDelete = (id: string) => {
    const updated = proposals.filter(p => p.id !== id);
    saveToLocal(updated);
  };

  const filteredProposals = proposals.filter(p => 
    p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Gerenciador de Propostas & Orçamentos</h2>
          <p className="text-xs text-gray-500 font-sans">Desenvolvimento inteligente de precificação para novos clientes corporativos com cálculo autômato de taxas.</p>
        </div>
        
        {currentUser.profile === "Admin" && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-[var(--color-primary)] text-white hover:opacity-90 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={16} /> Criar Nova Proposta
          </button>
        )}
      </div>

      {/* FILTER SEARCH ROW */}
      <div className="flex bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Pesquise propostas por nome de cliente, projeto ou responsável..."
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* INTERACTIVE PROPOSAL CREATION FORM */}
      {isCreating && (
        <form onSubmit={handleCreateProposal} className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans shadow-xs">
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Razão Comercial Cliente *</label>
            <input type="text" required placeholder="Ex: Unilever S.A." value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nome Fantasia Projeto / Evento *</label>
            <input type="text" required placeholder="Ex: Convenção Global de Alinhamento 2026" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Custo Bruto Base (R$) *</label>
            <input type="number" step="0.01" required placeholder="100000.00" value={rawVal} onChange={(e) => setRawVal(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none font-mono" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Impostos Estimados (%) *</label>
            <input type="number" required placeholder="12" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none font-mono" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Margem Operacional (%) *</label>
            <input type="number" required placeholder="8" value={feePercent} onChange={(e) => setFeePercent(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none font-mono" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Descrição Breve Prazos</label>
            <input type="text" placeholder="Ex: Prazo de execução de 4 dias intensos..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none" />
          </div>

          <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t dark:border-gray-900">
            <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-xl font-bold font-mono">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-xs">Calcular & Publicar</button>
          </div>
        </form>
      )}

      {/* PROPOSALS LISTINGS TABLE STYLE */}
      <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
        <div className="divide-y dark:divide-gray-900">
          {filteredProposals.map((prop) => {
            
            return (
              <div key={prop.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-sans hover:bg-gray-50/50 dark:hover:bg-gray-900/10">
                
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <span className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 font-extrabold flex items-center justify-center rounded-xl">
                    <FileText size={20} />
                  </span>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 line-clamp-1">
                      <span className="text-[10px] bg-sky-105 bg-sky-100 dark:bg-sky-950/30 text-[var(--color-primary)] font-bold px-1.5 py-0.2 rounded font-mono">
                        Ref: {prop.clientName}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold font-mono">
                        Lançado em: {prop.date}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-[#1F2937] dark:text-white leading-tight">{prop.projectName}</h4>
                    <p className="text-[10px] text-gray-400">Responsável Operador: {prop.responsible}</p>
                    {prop.notes && <p className="text-[11px] text-gray-500 max-w-lg leading-snug">{prop.notes}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center justify-end gap-4 shrink-0 min-w-0 md:min-w-[340px] text-right">
                  
                  {/* Financial calculation breakdown (Pág 53) */}
                  <div className="font-mono text-[10px] text-gray-400 hidden xl:block">
                    <span>Base: R$ {prop.rawVal.toLocaleString('pt-BR')}</span>
                    <span> (+Impostos: {prop.taxPercent}% Margem: {prop.feePercent}%)</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-gray-400 uppercase font-mono block scale-90 tracking-widest">Preço Sugerido Final</span>
                    <strong className="text-gray-850 dark:text-gray-100 font-black text-sm font-mono">
                      R$ {prop.finalVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </div>

                  {/* Status checkbox toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(prop.id, prop.status === "Aprovado" ? "Pendente" : "Aprovado")}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${prop.status === "Aprovado" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}`}
                    >
                      {prop.status}
                    </button>

                    <button
                      onClick={() => {
                        setDownloadingId(prop.id);
                        setTimeout(() => setDownloadingId(null), 2500);
                      }}
                      className={`p-1 rounded text-gray-700 dark:text-zinc-300 transition-all ${downloadingId === prop.id ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" : "hover:bg-gray-100 dark:hover:bg-gray-850"}`}
                      title={downloadingId === prop.id ? "PDF Gerado!" : "Exportar PDF"}
                    >
                      {downloadingId === prop.id ? <Check size={14} className="text-emerald-600" /> : <Download size={14} />}
                    </button>

                    {currentUser.profile === "Admin" && (
                      <button
                        onClick={() => handleDelete(prop.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash size={14} />
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
