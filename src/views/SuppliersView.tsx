import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Supplier } from "../types";
import { 
  Plus, Search, Sliders, Shield, Award, Edit, Trash, ThumbsUp, ThumbsDown, 
  Info, X, Calendar, ClipboardList, CheckSquare, MessageSquare, AlertTriangle, 
  Star, Check, AlertCircle, FileText, Sparkles, TrendingUp, ChevronLeft, ChevronRight
} from "lucide-react";

export const SuppliersView: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);

  // Form State (for both create & full edit)
  const [cnpj, setCnpj] = useState("");
  const [corpName, setCorpName] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [category, setCategory] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

  // Dashboard Modal selection state
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [activeDashboardTab, setActiveDashboardTab] = useState<'geral' | 'eventos' | 'tarefas' | 'checklists' | 'avaliacoes' | 'ocorrencias'>('geral');

  // Tab container scroll ref
  const suppliersTabContainerRef = useRef<HTMLDivElement>(null);

  const scrollSuppliersTabs = (direction: 'left' | 'right') => {
    if (suppliersTabContainerRef.current) {
      const scrollAmount = 240;
      suppliersTabContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Simulated live occurrences and evaluations states for the selected supplier dashboard to make it feel rich and real
  interface LiveOccurrence {
    id: string;
    date: string;
    type: 'atraso' | 'falha' | 'equipe' | 'elogio' | 'observacao';
    title: string;
    description: string;
    event: string;
    status: 'Tratado' | 'Pendente' | 'Registrado';
  }

  interface LiveEvaluation {
    id: string;
    stars: number;
    event: string;
    reviewer: string;
    comment: string;
    date: string;
  }

  interface LiveTask {
    id: string;
    title: string;
    responsibility: string;
    dueDate: string;
    status: 'Concluído' | 'Pendente' | 'Atrasada' | 'Em Andamento';
    category: string;
  }

  interface LiveChecklist {
    id: string;
    title: string;
    type: 'contratacao' | 'operacional' | 'pos-evento' | 'avaliacao';
    date: string;
    status: 'Preenchido' | 'Pendente' | 'Assinado';
    items: { text: string; done: boolean }[];
  }

  const [simulatedOccurrences, setSimulatedOccurrences] = useState<Record<string, LiveOccurrence[]>>({
    '1': [
      { id: 'oc_1', date: '2026-05-24', type: 'elogio', title: 'Excelente Tempo de Resposta', description: 'Atendimento médico de suporte rápido e eficaz durante o incidente no camarote.', event: 'Show de Encerramento Corporativo', status: 'Registrado' },
      { id: 'oc_2', date: '2026-05-15', type: 'observacao', title: 'Falta de Carimbo na Ficha de Controle', description: 'Duas fichas de entrega de insumos secundários vieram sem carimbo legível.', event: 'Festa de Gala de Outono', status: 'Tratado' }
    ],
    '2': [
      { id: 'oc_3', date: '2026-05-22', type: 'atraso', title: 'Uniforme Despadronizado', description: 'Um dos garçons adicionais escalados se apresentou sem a gravata preta padrão.', event: 'Casamento Imperial', status: 'Tratado' },
      { id: 'oc_4', date: '2026-05-10', type: 'falha', title: 'Reposição de Gelo Tardia', description: 'Demora de 15 minutos na entrega do terceiro lote de gelo escamado.', event: 'Show de Lançamento de Software', status: 'Tratado' }
    ]
  });

  const [simulatedEvaluations, setSimulatedEvaluations] = useState<Record<string, LiveEvaluation[]>>({
    '1': [
      { id: 'ev_1', stars: 5, event: 'Show de Encerramento Corporativo', reviewer: 'Carlos Drumond (Coordenador de Área)', comment: 'Equipe altamente preparada. Ambulância equipada perfeitamente conforme exigência da ANVISA.', date: '2026-05-24' },
      { id: 'ev_2', stars: 4, event: 'Conferência Anual de TI', reviewer: 'Renata Lemos (Diretora)', comment: 'Fácil alinhamento operacional. Foram pontuais e cordiais.', date: '2026-05-18' }
    ],
    '2': [
      { id: 'ev_3', stars: 5, event: 'Casamento Imperial', reviewer: 'Mariana & Gabriel (Noivos)', comment: 'O buffet estava divino! Mesa de frios impecável e os risotos servidos quente e no tempo certo.', date: '2026-05-22' },
      { id: 'ev_4', stars: 3, event: 'Show de Lançamento de Software', reviewer: 'Lucio Antunes (Gerente de Evento)', comment: 'A comida estava fantástica, mas fomos surpreendidos pelo atraso inicial na montagem do bar principal.', date: '2026-05-10' }
    ]
  });

  const [simulatedTasks, setSimulatedTasks] = useState<Record<string, LiveTask[]>>({
    '1': [
      { id: 'tk_1', title: 'Assinatura do contrato de prestação de serviços', responsibility: 'Admin', dueDate: '2026-05-10', status: 'Concluído', category: 'Contratação' },
      { id: 'tk_2', title: 'Envio de laudo técnico de vistoria veicular', responsibility: 'Operacional', dueDate: '2026-05-20', status: 'Concluído', category: 'Documentação' },
      { id: 'tk_3', title: 'Alinhamento operacional rádio-frequência', responsibility: 'DP', dueDate: '2026-05-29', status: 'Pendente', category: 'Alinhamentos' }
    ],
    '2': [
      { id: 'tk_4', title: 'Aprovação de cardápio final da cerimônia', responsibility: 'Admin', dueDate: '2026-05-15', status: 'Concluído', category: 'Contratação' },
      { id: 'tk_5', title: 'Confirmação do número exato de convidados', responsibility: 'Administrativo', dueDate: '2026-05-20', status: 'Concluído', category: 'Alinhamentos' },
      { id: 'tk_6', title: 'Liberação de pagamento do sinal (50%)', responsibility: 'Escritorio', dueDate: '2026-05-22', status: 'Concluído', category: 'Pagamentos' },
      { id: 'tk_7', title: 'Entrega da nota fiscal complementar pós-serviço', responsibility: 'Administrativo', dueDate: '2026-05-30', status: 'Pendente', category: 'Pendências' }
    ]
  });

  const [simulatedChecklists, setSimulatedChecklists] = useState<Record<string, LiveChecklist[]>>({
    '1': [
      { id: 'ck_1', title: 'Checklist de Contratação & Termos Médicos', type: 'contratacao', date: '2026-05-10', status: 'Assinado', items: [{ text: 'Garantias de UTI móvel ok', done: true }, { text: 'Alvará sanitário válido apresentado', done: true }, { text: 'Termo de responsabilidade assinado', done: true }] },
      { id: 'ck_2', title: 'Checklist de Vistoria de Equipamentos em Campo', type: 'operacional', date: '2026-05-24', status: 'Preenchido', items: [{ text: 'Combustível da unidade ok', done: true }, { text: 'Ar-condicionado regulado em 22ºC', done: true }, { text: 'Desfibrilador verificado', done: true }] }
    ],
    '2': [
      { id: 'ck_3', title: 'Checklist de Critérios Higiênicos de Alimentos', type: 'contratacao', date: '2026-05-15', status: 'Assinado', items: [{ text: 'Envio de licenças da vigilância', done: true }, { text: 'Certidão negativa de débitos', done: true }] },
      { id: 'ck_4', title: 'Checklist Operacional de Montagem Física', type: 'operacional', date: '2026-05-22', status: 'Preenchido', items: [{ text: 'Toalhas lavadas e passadas passadas', done: true }, { text: 'Aquecedores de réchaud cheios', done: true }, { text: 'Pratos e talhares esterilizados', done: true }] },
      { id: 'ck_5', title: 'Ficha de Avaliação Pós-Consul', type: 'avaliacao', date: '2026-05-25', status: 'Pendente', items: [{ text: 'Retirada das louças', done: false }, { text: 'Limpeza da cozinha do salão', done: false }] }
    ]
  });

  // Checklist visualization popup
  const [selectedChecklist, setSelectedChecklist] = useState<LiveChecklist | null>(null);

  // Interactive Addition of occurrence inside selected supplier dashboard
  const [newOccurrenceType, setNewOccurrenceType] = useState<'atraso' | 'falha' | 'equipe' | 'elogio' | 'observacao'>('atraso');
  const [newOccurrenceTitle, setNewOccurrenceTitle] = useState("");
  const [newOccurrenceDesc, setNewOccurrenceDesc] = useState("");
  const [newOccurrenceEvent, setNewOccurrenceEvent] = useState("");

  const handleCreateOccurrence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || !newOccurrenceTitle || !newOccurrenceDesc) return;

    const newOccItem: LiveOccurrence = {
      id: "live_oc_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      type: newOccurrenceType,
      title: newOccurrenceTitle,
      description: newOccurrenceDesc,
      event: newOccurrenceEvent || "Evento Desconhecido",
      status: 'Registrado'
    };

    setSimulatedOccurrences(prev => ({
      ...prev,
      [selectedSupplier.id]: [newOccItem, ...(prev[selectedSupplier.id] || [])]
    }));

    // Update main count
    updateSupplier(selectedSupplier.id, {
      ...selectedSupplier,
      occurrencesCount: (selectedSupplier.occurrencesCount || 0) + 1
    });

    // Reset inputs
    setNewOccurrenceTitle("");
    setNewOccurrenceDesc("");
    setNewOccurrenceEvent("");
  };

  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplierId(sup.id);
    setCnpj(sup.cnpj);
    setCorpName(sup.corporateName);
    setTradeName(sup.tradeName);
    setCategory(sup.category);
    setContact(sup.contact);
    setPhone(sup.phone);
    setEmail(sup.email);
    setCity(sup.city);
    setNotes(sup.notes || "");
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnpj || !tradeName) return;

    if (editingSupplierId) {
      updateSupplier(editingSupplierId, {
        cnpj,
        corporateName: corpName,
        tradeName,
        category,
        contact,
        phone,
        email,
        city,
        notes
      });
    } else {
      addSupplier({
        cnpj,
        corporateName: corpName,
        tradeName,
        category,
        contact,
        phone,
        email,
        city,
        status: "Ativo",
        notes
      });
    }

    // Reset states
    setIsCreating(false);
    setEditingSupplierId(null);
    setCnpj("");
    setCorpName("");
    setTradeName("");
    setCategory("");
    setContact("");
    setPhone("");
    setEmail("");
    setCity("");
    setNotes("");
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.cnpj.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Central Operacional de Fornecedores</h2>
          <p className="text-xs text-gray-500">Acompanhe contratos, indicadores operacionais, histórico de tarefas, checklists e avaliações.</p>
        </div>
        <button
          onClick={() => {
            setEditingSupplierId(null);
            setIsCreating(true);
          }}
          className="bg-[var(--color-primary)] text-white hover:opacity-90 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow-sm cursor-pointer"
        >
          <Plus size={16} /> Credenciar Novo Fornecedor
        </button>
      </div>

      {/* FILTER SEARCH ROW */}
      <div className="flex bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Pesquise fornecedores credenciados por nome fantasia, categoria de atendimento ou dados cadastrais..."
            className="w-full pl-10 pr-4 py-2 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/70 dark:bg-gray-900 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* FORM DIALOG (CREATOR / STANDARD EDIT MODAL) */}
      {isCreating && (
        <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-105 dark:border-gray-800 space-y-4 shadow-md transition-all">
          <div className="flex justify-between items-center border-b dark:border-gray-850 pb-2">
            <h3 className="font-extrabold text-sm text-gray-850 dark:text-gray-200 uppercase tracking-wider font-mono">
              {editingSupplierId ? "✏️ Editar Credenciamento do Fornecedor" : "➕ Formulário de Credenciamento Inicial"}
            </h3>
            <button 
              onClick={() => {
                setIsCreating(false);
                setEditingSupplierId(null);
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400"
            >
              <X size={16} />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">CNPJ *</label>
              <input
                type="text"
                placeholder="00.000.000/0001-00"
                required
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Razão Social</label>
              <input
                type="text"
                placeholder="Razão social jurídica completa..."
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                value={corpName}
                onChange={(e) => setCorpName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nome Fantasia *</label>
              <input
                type="text"
                placeholder="Ex: SOS Ambulâncias"
                required
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] font-bold text-gray-850 dark:text-zinc-100"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Categoria de Atendimento</label>
              <input
                type="text"
                placeholder="Ex: Ambulancia, Gerador, Higiene"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nome do Contato Principal</label>
              <input
                type="text"
                placeholder="Ex: Dra. Patricia"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Telefone Comercial</label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">E-mail Comercial</label>
              <input
                type="email"
                placeholder="contato@fornecedor.com"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-xl text-xs focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Base / Cidade</label>
              <input
                type="text"
                placeholder="São Paulo"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-xl text-xs focus:outline-none"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Observações Operacionais</label>
              <input
                type="text"
                placeholder="Ex: Contêm ambulâncias UTI completas..."
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t dark:border-gray-850 mt-2">
              <button 
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingSupplierId(null);
                }}
                className="px-3.5 py-2 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-zinc-300 rounded-xl font-bold font-mono transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-5 py-2 text-xs bg-[var(--color-primary)] text-white hover:opacity-95 font-black uppercase tracking-wider rounded-xl shadow-xs cursor-pointer"
              >
                Salvar Informações cadastrais
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUPPLIERS CARD LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map(sup => {
          // Calculate realistic ratings
          const totalVotes = (sup.ratingPositive || 0) + (sup.ratingNegative || 0);
          const approbationRate = totalVotes > 0 ? Math.round((sup.ratingPositive / totalVotes) * 100) : 100;

          return (
            <div 
              key={sup.id} 
              onClick={() => {
                setSelectedSupplier(sup);
                setActiveDashboardTab('geral');
              }}
              className={`bg-white dark:bg-gray-950 rounded-2xl border border-gray-205 dark:border-zinc-900 p-5 space-y-4 flex flex-col justify-between relative shadow-xs transition-all duration-200 hover:shadow-md hover:scale-[1.005] hover:border-[var(--color-primary)]/40 cursor-pointer border-l-4 ${sup.status === "Ativo" ? "border-l-[var(--color-primary)]" : "border-l-red-500"}`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-orange-100/70 dark:bg-orange-950/40 text-[var(--color-primary)] font-black px-2.5 py-0.5 rounded-full uppercase font-mono tracking-wide">
                    {sup.category || "Fretamento / Logísitca"}
                  </span>
                  <span className={`text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full font-mono ${sup.status === "Ativo" ? "bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-red-100 text-red-800"}`}>
                    {sup.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-zinc-50 leading-snug">{sup.tradeName}</h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">Ref Jurídica: {sup.corporateName || "(Razão não informada)"}</p>
                </div>

                {sup.notes && (
                  <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{sup.notes}</p>
                )}
              </div>

              {/* Advanced Indicators Overlay preview */}
              <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-2 px-3 grid grid-cols-3 gap-1 divide-x divide-gray-150 dark:divide-zinc-800 text-center text-xs font-mono">
                <div className="space-y-0.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center gap-0.5">
                    👍 {sup.ratingPositive || 0}
                  </span>
                  <span className="text-[8px] text-gray-400 uppercase tracking-widest font-mono font-bold scale-[0.85] block mt-0.5">APROVAÇÃO</span>
                </div>
                <div className="space-y-0.5 pl-1.5">
                  <span className="text-red-500 dark:text-red-400 font-extrabold flex items-center justify-center gap-0.5">
                    👎 {sup.ratingNegative || 0}
                  </span>
                  <span className="text-[8px] text-gray-400 uppercase tracking-widest font-mono font-bold scale-[0.85] block mt-0.5">GLOSAS</span>
                </div>
                <div className="space-y-0.5 pl-1.5">
                  <span className={`${sup.occurrencesCount > 0 ? "text-amber-500 font-bold" : "text-gray-500 font-medium"} flex items-center justify-center gap-0.5`}>
                    ⚠️ {sup.occurrencesCount || 0}
                  </span>
                  <span className="text-[8px] text-gray-400 uppercase tracking-widest font-mono font-bold scale-[0.85] block mt-0.5">ALERTAS</span>
                </div>
              </div>

              <div className="pt-2.5 border-t dark:border-zinc-900 text-[10px] flex justify-between items-center text-gray-500 font-mono">
                <span className="truncate max-w-[200px] block font-sans">📞 {sup.phone} • {sup.contact}</span>
                <span className="text-[9px] font-black uppercase text-[var(--color-primary)] group-hover:underline flex items-center gap-0.5 font-sans">
                  ABRIR COCKPIT 🔍
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================== COMPLETE OPERATIONAL DASHBOARD MODAL INTERACTION ==================== */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-gray-900/40 dark:bg-zinc-950/75 backdrop-blur-sm z-50 flex items-center justify-center md:p-4 p-0 overflow-y-auto select-none animate-fadeIn">
          <div className="bg-white dark:bg-zinc-950 md:rounded-3xl rounded-none border border-gray-150 dark:border-zinc-850 shadow-2xl max-w-4xl w-full md:max-h-[85vh] h-full md:h-auto overflow-hidden flex flex-col">
            
            {/* Header: Cockpit Title & Basic Indicators info */}
            <div className="p-6 border-b dark:border-zinc-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 dark:bg-zinc-900/20">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-lg select-none">
                  🏗️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-gray-950 dark:text-zinc-50 leading-tight">{selectedSupplier.tradeName}</h3>
                    <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full font-mono">
                      CREDENCIE ATIVO
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">CNPJ: {selectedSupplier.cnpj} | Categoria: {selectedSupplier.category || 'Atas / Serviço'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                <button
                  onClick={() => {
                    setSelectedSupplier(null);
                  }}
                  className="p-1 px-2.5 bg-gray-100 hover:bg-gray-250 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-xl font-bold font-mono text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-all border dark:border-zinc-800"
                >
                  <X size={12} /> Fechar Central
                </button>
              </div>
            </div>

            {/* AUTOMATIC TOP INDICATORS PANEL (DASHBOARD BANNER KPI - pág 22) */}
            <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-5 gap-3 border-b dark:border-zinc-850 bg-white dark:bg-zinc-950">
              
              <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-0.5 text-center">
                <strong className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {selectedSupplier.id === '1' ? '4.8 ⭐' : '4.9 ⭐'}
                </strong>
                <span className="text-[8px] text-gray-400 block font-mono font-extrabold uppercase tracking-wide">Média Avaliações</span>
              </div>

              <div className="p-2.5 bg-gray-500/5 border border-gray-500/15 rounded-xl space-y-0.5 text-center">
                <strong className="text-sm font-black text-gray-800 dark:text-zinc-200 font-mono">
                  {selectedSupplier.id === '1' ? '5 eventos' : '8 eventos'}
                </strong>
                <span className="text-[8px] text-gray-400 block font-mono font-extrabold uppercase tracking-wide">Participações</span>
              </div>

              <div className="p-2.5 bg-red-500/5 border border-red-500/15 rounded-xl space-y-0.5 text-center">
                <strong className="text-sm font-black text-red-500 font-mono">
                  {selectedSupplier.occurrencesCount || 0}
                </strong>
                <span className="text-[8px] text-gray-400 block font-mono font-extrabold uppercase tracking-wide">Ocorrências</span>
              </div>

              <div className="p-2.5 bg-amber-500/5 border border-amber-500/15 rounded-xl space-y-0.5 text-center">
                <strong className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">
                  {(simulatedTasks[selectedSupplier.id] || []).filter(t => t.status !== 'Concluído').length} pendentes
                </strong>
                <span className="text-[8px] text-gray-400 block font-mono font-extrabold uppercase tracking-wide">Tarefas Ativas</span>
              </div>

              <div className="p-2.5 bg-indigo-500/5 border border-indigo-500/15 rounded-xl space-y-0.5 text-center col-span-2 sm:col-span-1">
                <strong className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {selectedSupplier.id === '1' ? '91%' : '95%'}
                </strong>
                <span className="text-[8px] text-gray-400 block font-mono font-extrabold uppercase tracking-wide">Taxa Aprovação</span>
              </div>

            </div>

            {/* Modern Unified Flex-Wrap Tabs (No scrolling required) */}
            <div className="p-4 border-b border-slate-150/60 dark:border-zinc-850 bg-gray-50/10 dark:bg-zinc-950/20 select-none">
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveDashboardTab('geral')}
                  className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                    activeDashboardTab === 'geral' 
                      ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                      : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  📋 Cadastro & Contatos
                </button>
                <button 
                  onClick={() => setActiveDashboardTab('eventos')}
                  className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                    activeDashboardTab === 'eventos' 
                      ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                      : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  📅 Participação em Eventos
                </button>
                <button 
                  onClick={() => setActiveDashboardTab('tarefas')}
                  className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                    activeDashboardTab === 'tarefas' 
                      ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                      : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  📝 Histórico de Tarefas
                </button>
                <button 
                  onClick={() => setActiveDashboardTab('checklists')}
                  className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                    activeDashboardTab === 'checklists' 
                      ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                      : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  ✔️ Checklists Associados ({(simulatedChecklists[selectedSupplier.id] || []).length})
                </button>
                <button 
                  onClick={() => setActiveDashboardTab('avaliacoes')}
                  className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                    activeDashboardTab === 'avaliacoes' 
                      ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                      : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  ⭐ Avaliações ({(simulatedEvaluations[selectedSupplier.id] || []).length})
                </button>
                <button 
                  onClick={() => setActiveDashboardTab('ocorrencias')}
                  className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                    activeDashboardTab === 'ocorrencias' 
                      ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                      : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-905 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  ⚠️ Registro Ocorrências ({(simulatedOccurrences[selectedSupplier.id] || []).length})
                </button>
              </div>
            </div>

            {/* Tab Contents Scrollable body */}
            <div className="p-6 overflow-y-auto flex-1 font-sans text-xs">
              
              {/* TAB 1: CADASTRO GERAL */}
              {activeDashboardTab === 'geral' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-zinc-900/30 p-4 rounded-2xl border dark:border-zinc-850 space-y-3">
                    <span className="text-[10px] font-black uppercase text-orange-500 font-mono tracking-wider">DADOS GERAIS DO PRESTADOR</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">Razão Social Jurídica</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5">{selectedSupplier.corporateName || "(Apenas nome fantasia)"}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">CNPJ / Cadastro de Contribuinte</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5">{selectedSupplier.cnpj}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">Cidade Base Operacional</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5">{selectedSupplier.city || "São Paulo"}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">Categoria Principal de Serviço</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5">{selectedSupplier.category || "Serviço Operacional / Eventos"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-900/30 p-4 rounded-2xl border dark:border-zinc-850 space-y-3">
                    <span className="text-[10px] font-black uppercase text-orange-500 font-mono tracking-wider">CONTATOS OPERACIONAIS</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">Nome do Responsável de Contato</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5">{selectedSupplier.contact}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">Telefone para Acionamento Direto</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5">{selectedSupplier.phone}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">E-mail para Recebimento de Ordens</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5">{selectedSupplier.email || "(E-mail não cadastrado)"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-900/30 p-4 rounded-2xl border dark:border-zinc-850 space-y-3">
                    <span className="text-[10px] font-black uppercase text-orange-500 font-mono tracking-wider">ANEXOS & DOCUMENTAÇÕES CREDENCIADAS</span>
                    <div className="space-y-2">
                      <div className="p-3 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-xl flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-rose-500">📄</span>
                          <div>
                            <strong className="block font-bold">ALVARA_SAN_PREFEITURA_2026.pdf</strong>
                            <span className="text-[9px] text-gray-400 font-mono">1.2 MB | Atualizado em 14/01/2026</span>
                          </div>
                        </div>
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono uppercase">VÁLIDO ✔</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-xl flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-500">📄</span>
                          <div>
                            <strong className="block font-bold">CERTIDOES_NEGATIVAS_TRIB_FEDERAIS.pdf</strong>
                            <span className="text-[9px] text-gray-400 font-mono">540 KB | Atualizado em 02/05/2026</span>
                          </div>
                        </div>
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono uppercase">VÁLIDO ✔</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 p-2">
                    <button 
                      onClick={() => {
                        handleOpenEdit(selectedSupplier);
                        setSelectedSupplier(null);
                      }}
                      className="px-4 py-2 text-xs bg-gray-150 text-gray-800 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:text-zinc-200 border dark:border-zinc-800 rounded-xl font-bold font-sans flex items-center gap-1 cursor-pointer transition-all hover:bg-gray-250"
                    >
                      <Edit size={12} /> Editar Dados Cadastrais & Credenciamento
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: PARTICIPAÇÃO EM EVENTOS */}
              {activeDashboardTab === 'eventos' && (
                <div className="space-y-4">
                  <div className="text-xs space-y-1">
                    <h4 className="font-extrabold text-[#1F2937] dark:text-gray-300">Linha do tempo de Eventos Realizados / Vinculados</h4>
                    <p className="text-gray-400 text-[11px]">Todos os eventos onde este fornecedor foi oficialmente contratado e alocado.</p>
                  </div>

                  {selectedSupplier.id === '1' ? (
                    <div className="space-y-3 font-mono">
                      <div className="p-4 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <strong className="text-xs font-extrabold text-gray-850 dark:text-zinc-100 block">Show de Encerramento Corporativo</strong>
                          <span className="text-[10px] text-gray-400">Data realização: 24 de Maio de 2026</span>
                        </div>
                        <div className="text-[11px] font-mono text-right">
                          <span className="text-orange-500 font-black block">Serviço: UTI Móvel & Apoio Médico</span>
                          <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black block font-sans">Responsável Interno: Dr. Leandro Soares</span>
                        </div>
                      </div>
                      <div className="p-4 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <strong className="text-xs font-extrabold text-gray-850 dark:text-zinc-100 block">Conferência Anual de TI</strong>
                          <span className="text-[10px] text-gray-400">Data realização: 18 de Maio de 2026</span>
                        </div>
                        <div className="text-[11px] font-mono text-right">
                          <span className="text-orange-500 font-black block">Serviço: Posto Médico Temporário</span>
                          <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black block font-sans">Responsável Interno: Renata Lemos</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 font-mono">
                      <div className="p-4 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <strong className="text-xs font-extrabold text-gray-850 dark:text-zinc-100 block">Casamento Imperial</strong>
                          <span className="text-[10px] text-gray-400">Data realização: 22 de Maio de 2026</span>
                        </div>
                        <div className="text-[11px] font-mono text-right">
                          <span className="text-orange-500 font-black block">Serviço: Buffet, Bar & Garçons</span>
                          <span className="text-[9px] text-gray-400 uppercase tracking-wide font-black block font-sans">Responsável Interno: Mariana Alano</span>
                        </div>
                      </div>
                      <div className="p-4 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <strong className="text-xs font-extrabold text-gray-850 dark:text-zinc-100 block">Show de Lançamento de Software</strong>
                          <span className="text-[10px] text-gray-400">Data realização: 10 de Maio de 2026</span>
                        </div>
                        <div className="text-[11px] font-mono text-right">
                          <span className="text-orange-500 font-black block">Serviço: Coquetel para Clientes VIP</span>
                          <span className="text-[9px] text-gray-400 uppercase tracking-wide font-black block font-sans">Responsável Interno: Lúcio Antunes</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TAREFAS */}
              {activeDashboardTab === 'tarefas' && (
                <div className="space-y-4">
                  <div className="text-xs space-y-1 pb-2 border-b dark:border-zinc-850 flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-[#1F2937] dark:text-gray-300 uppercase tracking-widest font-mono text-[10px]">LISTAGEM GERAL DE HISTÓRICO DE TAREFAS</h4>
                      <p className="text-gray-400 text-[11px] font-sans">Contratuais, operacionais, vistorias e pagamentos atrelados a este prestador.</p>
                    </div>
                  </div>

                  <div className="space-y-2 font-mono">
                    {(simulatedTasks[selectedSupplier.id] || []).map(tk => (
                      <div key={tk.id} className="p-3.5 bg-slate-50 dark:bg-zinc-900/40 border dark:border-zinc-900 rounded-xl flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3 h-3 rounded-full shrink-0 ${tk.status === "Concluído" ? "bg-emerald-500" : tk.status === "Atrasada" ? "bg-red-500 animate-pulse" : "bg-amber-500 animate-pulse"}`}></span>
                          <div>
                            <strong className="text-xs font-extrabold text-gray-850 dark:text-zinc-100">{tk.title}</strong>
                            <span className="text-[9px] text-indigo-500 block">Tipo: {tk.category} | Prazo: {tk.dueDate}</span>
                          </div>
                        </div>
                        <div className="text-right text-[10px]">
                          <span className="font-black block uppercase text-gray-500">Resp: {tk.responsibility}</span>
                          <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${tk.status === "Concluído" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                            {tk.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CHECKLISTS */}
              {activeDashboardTab === 'checklists' && (
                <div className="space-y-4">
                  <div className="text-xs pb-1 border-b dark:border-zinc-850">
                    <h4 className="font-mono font-black text-xs text-orange-500 uppercase tracking-widest">Controles e Fichas de Checklist Operacionais</h4>
                    <p className="text-gray-400">Clique em qualquer um dos cards abaixo para abrir e visualizar as perguntas e respostas completas.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(simulatedChecklists[selectedSupplier.id] || []).map(chk => (
                      <div 
                        key={chk.id}
                        onClick={() => setSelectedChecklist(chk)}
                        className="p-4 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-2xl space-y-3 cursor-pointer hover:border-[var(--color-primary)] transition-all group shadow-3xs"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-mono uppercase bg-indigo-500/10 text-indigo-500 px-2.5 py-0.5 rounded-full font-bold">
                              Checklist de {chk.type}
                            </span>
                            <strong className="block text-xs font-black text-gray-850 dark:text-zinc-100 mt-1.5 group-hover:text-[var(--color-primary)]">{chk.title}</strong>
                          </div>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-mono font-black px-2 py-0.5 rounded">
                            {chk.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between">
                          <span>Data preenchimento: {chk.date}</span>
                          <span className="text-blue-500">Visualizar Itens 🔍</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: AVALIAÇÕES */}
              {activeDashboardTab === 'avaliacoes' && (
                <div className="space-y-4">
                  <div className="text-xs pb-1 border-b dark:border-zinc-850">
                    <h4 className="font-extrabold text-[#1F2937] dark:text-gray-300">Resenhas e Histórico de Avaliações Técnicas do Fornecedor</h4>
                    <p className="text-gray-400 text-[11px]">Compilado de notas emitidas pelos coordenadores e organizadores de campo pós-evento.</p>
                  </div>

                  <div className="space-y-3">
                    {(simulatedEvaluations[selectedSupplier.id] || []).map(ev => (
                      <div key={ev.id} className="p-4 bg-slate-50 dark:bg-zinc-900/40 border dark:border-zinc-900 rounded-2xl space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="flex text-amber-500 font-mono text-sm leading-none">
                              {Array.from({ length: ev.stars }).map((_, i) => "★")}
                            </span>
                            <span className="text-gray-400 font-mono text-[9px] pt-0.5">({ev.stars} de 5)</span>
                          </div>
                          <span className="text-gray-400 font-mono text-[9px]">{ev.date}</span>
                        </div>
                        <p className="text-xs text-gray-800 dark:text-zinc-200 italic">"{ev.comment}"</p>
                        <div className="text-[9px] text-gray-400 uppercase tracking-wider font-mono">
                          <span>Evento: <strong>{ev.event}</strong> | Avaliado por: <strong>{ev.reviewer}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: OCORRÊNCIAS */}
              {activeDashboardTab === 'ocorrencias' && (
                <div className="space-y-6">
                  
                  {/* Create Custom/Mock occurrence */}
                  <form onSubmit={handleCreateOccurrence} className="p-4 bg-orange-50/20 dark:bg-zinc-900/50 border border-orange-500/15 rounded-2xl space-y-4 text-xs font-sans">
                    <div className="flex items-center gap-1">
                      <AlertCircle size={14} className="text-orange-500 animate-pulse" />
                      <strong className="text-xs font-extrabold uppercase font-mono text-orange-600 block pl-1">REGISTRAR NOVA OCORRÊNCIA EM CAMPO</strong>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Título Resumido da Ocorrência *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Atraso de 30 min por erro de logística"
                          className="w-full text-xs p-2 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg focus:outline-none"
                          value={newOccurrenceTitle}
                          onChange={e => setNewOccurrenceTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Evento Relacionado *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Congresso de Agro / Casamento"
                          className="w-full text-xs p-2 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg focus:outline-none"
                          value={newOccurrenceEvent}
                          onChange={e => setNewOccurrenceEvent(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Tipo de Ocorrência</label>
                      <select
                        className="w-full text-xs p-2 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg focus:outline-none uppercase font-mono font-bold text-orange-500"
                        value={newOccurrenceType}
                        onChange={e => setNewOccurrenceType(e.target.value as any)}
                      >
                        <option value="atraso">⏱️ Atraso operacionais / pontualidade</option>
                        <option value="falha">⚡ Falha eletro-mecânica / técnica</option>
                        <option value="equipe">🚧 Equipe incompleta / problemas de contingência</option>
                        <option value="elogio">🎉 Elogio oficial / excepcionalidade</option>
                        <option value="observacao">📝 Observação administrativa interna</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Descrição Detalhada do Fato *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Descreva detalhadamente o ocorrido com o prestador..."
                        className="w-full text-xs p-2 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg focus:outline-none"
                        value={newOccurrenceDesc}
                        onChange={e => setNewOccurrenceDesc(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button 
                        type="submit"
                        className="px-5 py-2 text-[10px] bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider rounded-lg shadow-3xs cursor-pointer"
                      >
                        Salvar e Fixar Ocorrência em Dashboard
                      </button>
                    </div>
                  </form>

                  {/* Occurrence List */}
                  <div className="space-y-3 font-mono">
                    <span className="text-[10px] font-black uppercase text-gray-400 pl-1 block">REGISTROS ANTERIORES</span>
                    
                    {(simulatedOccurrences[selectedSupplier.id] || []).length === 0 ? (
                      <p className="text-gray-400 text-center py-4 italic font-sans">Nenhuma ocorrência ou advertência registrada para este fornecedor. Histórico limpo! 🎉</p>
                    ) : (
                      (simulatedOccurrences[selectedSupplier.id] || []).map(oc => (
                        <div key={oc.id} className="p-4 bg-rose-50/20 dark:bg-zinc-950 border dark:border-zinc-900 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                          <div className="space-y-1 pr-4">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${oc.type === 'elogio' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></span>
                              <strong className="text-xs font-black text-gray-800 dark:text-zinc-50 leading-none">{oc.title}</strong>
                            </div>
                            <p className="text-[11px] text-gray-600 dark:text-zinc-350 leading-relaxed font-sans">{oc.description}</p>
                            <span className="text-[9px] text-gray-400 block font-mono">Evento: {oc.event} | Data: {oc.date}</span>
                          </div>
                          <div className="shrink-0 flex md:flex-col items-end justify-between font-mono w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-zinc-900">
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase font-mono ${oc.type === 'atraso' ? 'bg-amber-100 text-amber-800' : oc.type === 'elogio' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {oc.type}
                            </span>
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">{oc.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-MODAL VISUALIZAR CHECKLIST COMPACT ==================== */}
      {selectedChecklist && (
        <div className="fixed inset-0 bg-gray-900/40 dark:bg-zinc-950/80 backdrop-blur-xs z-55 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border dark:border-zinc-850 p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b dark:border-zinc-850 pb-2">
              <span className="text-[9px] uppercase font-mono font-black text-orange-500">Visualizar Itens do Checklist</span>
              <button 
                className="p-1 text-gray-400 hover:text-gray-900 font-bold"
                onClick={() => setSelectedChecklist(null)}
              >
                ✕
              </button>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-gray-850 dark:text-zinc-100">{selectedChecklist.title}</h4>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">Preenchido em: {selectedChecklist.date} | Status: {selectedChecklist.status}</p>
            </div>

            <div className="space-y-1.5 pt-2">
              {selectedChecklist.items.map((it, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-zinc-900/50 rounded-lg">
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold ${it.done ? "bg-emerald-500 text-white" : "bg-gray-200 dark:bg-zinc-850"}`}>
                    {it.done ? "✓" : ""}
                  </span>
                  <span className="text-slate-700 dark:text-zinc-200 font-medium text-xs font-sans">{it.text}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t dark:border-zinc-855">
              <button
                onClick={() => setSelectedChecklist(null)}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-250 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs text-gray-700 dark:text-zinc-300 font-bold rounded-xl font-mono cursor-pointer"
              >
                Fechar Visualizador
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
