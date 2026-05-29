import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Search, Calendar, FileText, CheckCircle, AlertTriangle, AlertCircle, Clock, Trash, Edit } from "lucide-react";

export const VencimentosView: React.FC = () => {
  const { suppliers, employees, users, currentUser } = useApp();

  // Simulated Vencimentos DB local storage
  const [docList, setDocList] = useState<any[]>(() => {
    const saved = localStorage.getItem("gs_vencimentos_docs");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "venc_1",
        name: "Licença de Operação Copacabana",
        type: "Licença",
        category: "Eventos",
        relatedEntity: "Réveillon Copacabana 2027",
        responsible: "Leandra Soares",
        issueDate: "2026-01-01",
        dueDate: "2026-06-03", // Próximo do vencimento (menos de 7 dias)
        validDays: 154,
        notes: "Laudo emitido e pago, pendente apenas retificação oficial."
      },
      {
        id: "venc_2",
        name: "Certificado AVCB Central USP",
        type: "Certificado",
        category: "Segurança",
        relatedEntity: "Haras Santa Clara",
        responsible: "Carlos Eduardo Silva",
        issueDate: "2025-05-30",
        dueDate: "2026-05-29", // Vencendo amanhã!
        validDays: 365,
        notes: "Urgente realizar renovação preventiva e protocolar taxa municipal."
      },
      {
        id: "venc_3",
        name: "Contrato Fornecimento Energia Mega",
        type: "Contrato",
        category: "Energia",
        relatedEntity: "Mega Geradores",
        responsible: "Leandra Kaisa",
        issueDate: "2025-10-15",
        dueDate: "2026-10-15", // Ativo (dentro do prazo)
        validDays: 365,
        notes: "Contrato de fornecimento sob diárias reduzidas preferenciais."
      },
      {
        id: "venc_4",
        name: "Alvará Sanitário Posto Ambulância",
        type: "Alvará",
        category: "Segurança",
        relatedEntity: "SAS Ambulâncias",
        responsible: "Leandra Soares",
        issueDate: "2024-05-10",
        dueDate: "2025-05-10", // Vencido!
        validDays: 365,
        notes: "Alvará anual expirou na prefeitura do Rio corporativo."
      }
    ];
  });

  const saveToLocal = (newDocs: any[]) => {
    setDocList(newDocs);
    localStorage.setItem("gs_vencimentos_docs", JSON.stringify(newDocs));
  };

  // Form registration state - pág 39, 77
  const [isCreating, setIsCreating] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("Contrato");
  const [docCategory, setDocCategory] = useState("Geral");
  const [calcMethod, setCalcMethod] = useState<'fixa' | 'prazo'>('fixa');
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [validDaysQty, setValidDaysQty] = useState("30");
  const [relatedEntity, setRelatedEntity] = useState("");
  const [responsibleName, setResponsibleName] = useState("");
  const [notes, setNotes] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyMine, setShowOnlyMine] = useState(currentUser.profile === "Operacional");

  // CALCULATE AUTOMATIC DOCUMENT STATUS IN REAL-TIME (pág 42, 64)
  // Current local simulated date: 2026-05-28
  const currentDate = new Date("2026-05-28");

  const calculateStatus = (dueDateStr: string) => {
    const due = new Date(dueDateStr);
    const timeDiff = due.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) return { label: "Vencido", colorClass: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-950/20", daysRemaining: daysDiff };
    if (daysDiff <= 7) return { label: "Vencendo", colorClass: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/20", daysRemaining: daysDiff };
    if (daysDiff <= 30) return { label: "Próximo do Vencimento", colorClass: "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-950/20", daysRemaining: daysDiff };
    return { label: "Ativo", colorClass: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/20", daysRemaining: daysDiff };
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !issueDate) return;

    let computedDueDate = dueDate;
    if (calcMethod === 'prazo') {
      const start = new Date(issueDate);
      start.setDate(start.getDate() + parseInt(validDaysQty));
      computedDueDate = start.toISOString().split("T")[0];
    }

    const calculatedDays = Math.ceil((new Date(computedDueDate).getTime() - new Date(issueDate).getTime()) / (1000 * 60 * 60 * 24));

    const newDoc = {
      id: editingId || "venc_" + Date.now(),
      name: docName,
      type: docType,
      category: docCategory,
      relatedEntity: relatedEntity || "Geral",
      responsible: responsibleName || currentUser.name,
      issueDate,
      dueDate: computedDueDate,
      validDays: calculatedDays,
      notes
    };

    let updatedDocs = [];
    if (editingId) {
      updatedDocs = docList.map(d => d.id === editingId ? newDoc : d);
    } else {
      updatedDocs = [newDoc, ...docList];
    }

    saveToLocal(updatedDocs);
    setIsCreating(false);
    setEditingId(null);
    setDocName("");
    setIssueDate("");
    setDueDate("");
    setRelatedEntity("");
    setNotes("");
  };

  const handleDelete = (id: string) => {
    const updated = docList.filter(d => d.id !== id);
    saveToLocal(updated);
  };

  const handleOpenEdit = (doc: any) => {
    setEditingId(doc.id);
    setDocName(doc.name);
    setDocType(doc.type);
    setDocCategory(doc.category);
    setIssueDate(doc.issueDate);
    setDueDate(doc.dueDate);
    setRelatedEntity(doc.relatedEntity);
    setResponsibleName(doc.responsible);
    setNotes(doc.notes);
    setCalcMethod('fixa');
    setIsCreating(true);
  };

  // Dashboard Stats
  const totalDocs = docList.length;
  const activeDocs = docList.filter(d => calculateStatus(d.dueDate).label === "Ativo").length;
  const expiredDocs = docList.filter(d => calculateStatus(d.dueDate).label === "Vencido").length;
  const approachingDocs = docList.filter(d => ["Vencendo", "Próximo do Vencimento"].includes(calculateStatus(d.dueDate).label)).length;

  const filteredDocs = docList.filter(d => {
    const matchesQuery = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (showOnlyMine) {
      return matchesQuery && d.responsible === currentUser.name;
    }
    return matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER DESCRIPTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Calculadora & Painel de Vencimentos</h2>
          <p className="text-xs text-gray-500 font-sans">Controle inteligente sobre validades de alvarás, licenças, contratos e ASOs diários.</p>
        </div>
        
        {["Admin", "Administrativo", "DP", "Operacional", "Escritorio"].includes(currentUser.profile) && (
          <button
            onClick={() => {
              setEditingId(null);
              setIsCreating(true);
            }}
            className="bg-[var(--color-primary)] text-white hover:opacity-90 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow-xs"
          >
            <Plus size={16} /> Cadastrar Novo Prazo
          </button>
        )}
      </div>

      {/* 4 SUMMARY METRICS DASHBOARD - pág 42, 64 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col justify-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">Total de Registros</span>
          <span className="text-2xl font-black text-gray-900 dark:text-white mt-1">{totalDocs}</span>
        </div>
        <div className="p-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col justify-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">Ativos e Vigentes</span>
          <span className="text-2xl font-black text-emerald-500 mt-1">{activeDocs}</span>
        </div>
        <div className="p-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col justify-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">Prazos Expirados</span>
          <span className="text-2xl font-black text-red-500 mt-1">{expiredDocs}</span>
        </div>
        <div className="p-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col justify-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">Vencimentos Próximos</span>
          <span className="text-2xl font-black text-amber-500 mt-1">{approachingDocs}</span>
        </div>
      </div>

      {/* FILTER SEARCH ROW */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Pesquise por nome do documento, tipo ou categoria..."
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 text-xs shrink-0 select-none">
          <input
            type="checkbox"
            id="checkbox-show-mine"
            checked={showOnlyMine}
            onChange={(e) => setShowOnlyMine(e.target.checked)}
            className="w-4 h-4 text-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)] cursor-pointer text-orange-600 focus:outline-none"
          />
          <label htmlFor="checkbox-show-mine" className="font-bold text-gray-600 dark:text-zinc-300 cursor-pointer">
            Atribuídos a Mim ({currentUser.name})
          </label>
        </div>
      </div>

      {/* REGISTRATION FORM POPUP DIALOG - pág 39, 77 */}
      {isCreating && (
        <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-sm text-gray-800 dark:text-gray-200">
            {editingId ? "Editar Informações do Documento" : "Lançamento de Novo Prazo Administrativo"}
          </h3>

          <form onSubmit={handleCreateDocument} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nome do Documento / Título *</label>
              <input type="text" required placeholder="Ex: Alvará AVCB Copacabana" value={docName} onChange={(e) => setDocName(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl" />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Tipo de Enquadramento</label>
              <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-gray-700 focus:outline-none">
                <option value="Alvará">Alvará Comercial</option>
                <option value="Certificado">Certificado de NR / AVCB</option>
                <option value="Contrato">Contrato Fornecedor/Serviço</option>
                <option value="ASO">ASO / Exame Ocupacional</option>
                <option value="Seguro">Apólice de Seguro</option>
                <option value="Licença">Licença Municipal</option>
                <option value="Outro">Outro Documento</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Categoria de Agrupamento</label>
              <input type="text" placeholder="Ex: Engenharia, Eventos, Clinica" value={docCategory} onChange={(e) => setDocCategory(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl" />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-400">Método de Lançamento de Vigência</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCalcMethod('fixa')}
                  className={`flex-1 py-2 text-xs rounded-xl font-bold border ${calcMethod === 'fixa' ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:border-gray-800'}`}
                >
                  Informar Data Fixa
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMethod('prazo')}
                  className={`flex-1 py-2 text-xs rounded-xl font-bold border ${calcMethod === 'prazo' ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:border-gray-800'}`}
                >
                  Informar Vigência em Dias
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Data de Emissão (Início) *</label>
              <input type="date" required value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-gray-700" />
            </div>

            {calcMethod === 'fixa' ? (
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Data Exata de Vencimento *</label>
                <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-gray-700" />
              </div>
            ) : (
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Vigência (Dias úteis/corridos)</label>
                <input type="number" value={validDaysQty} onChange={(e) => setValidDaysQty(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-gray-700" />
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Empresa / Fornecedor / Evento Vinculado</label>
              <input type="text" placeholder="Ex: Réveillon Copacabana" value={relatedEntity} onChange={(e) => setRelatedEntity(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl" />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Responsável Interno *</label>
              <select 
                value={responsibleName} 
                onChange={(e) => setResponsibleName(e.target.value)} 
                required
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <option value="">Selecione o Responsável</option>
                {users.map(u => (
                  <option key={u.id} value={u.name}>
                    {u.avatar} {u.name} ({u.profile})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Descrição / Comentários</label>
              <input type="text" placeholder="Insira dados de protocolo ou contatos adicionais..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl" />
            </div>

            <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t dark:border-gray-900">
              <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-xl font-bold font-mono">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-xs">Salvar Documento</button>
            </div>
          </form>
        </div>
      )}

      {/* DOCUMENT EXPIRATION LIST */}
      <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
        <div className="divide-y dark:divide-gray-900">
          
          {filteredDocs.map((doc) => {
            const status = calculateStatus(doc.dueDate);
            const isAlertActive = status.daysRemaining <= 30;

            return (
              <div key={doc.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-sans hover:bg-gray-50/50 dark:hover:bg-gray-900/10">
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[var(--color-primary)] flex items-center justify-center font-black text-xs">
                    DOC
                  </span>
                  
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 line-clamp-1">
                      <span className="text-[9px] uppercase font-bold font-mono text-gray-400 px-1 py-0.2 bg-gray-100 dark:bg-gray-900 rounded">
                        {doc.type}
                      </span>
                      <span className="text-[9px] uppercase font-bold font-mono text-gray-400">
                        {doc.category}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-[#1F2937] dark:text-white">{doc.name}</h4>
                    
                    <p className="text-[10px] text-gray-500">
                      Vínculo: <strong className="text-gray-700 dark:text-gray-300 font-semibold">{doc.relatedEntity}</strong> • Responsável: <strong className="text-gray-700 dark:text-gray-300 font-semibold">{doc.responsible}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center justify-end gap-4 min-w-0 md:min-w-[280px]">
                  <div className="text-right font-mono shrink-0">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest block scale-90">Data de Vencimento</span>
                    <strong className="text-gray-850 dark:text-gray-200">{doc.dueDate}</strong>
                    
                    {isAlertActive ? (
                      <span className="text-[10px] text-amber-500 font-bold block mt-0.5 animate-pulse">
                        {status.daysRemaining === 0 ? "Expira hoje" : status.daysRemaining < 0 ? `Vencido há ${Math.abs(status.daysRemaining)} dias` : `Faltam ${status.daysRemaining} dias`}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">
                        Faltam {status.daysRemaining} dias
                      </span>
                    )}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full font-bold font-mono tracking-wide uppercase shrink-0 ${status.colorClass}`} style={{ fontSize: "9px" }}>
                    {status.label}
                  </span>

                  {currentUser.profile === "Admin" && (
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(doc)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-850 rounded text-gray-700 dark:text-gray-300"
                        title="Editar"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id)} 
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Deletar"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
};
