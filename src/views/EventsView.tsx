import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Event, Supplier, Occurrence, PointRecordType, EventPhoto, EventMessage, CheckInRecord } from "../types";
import { SignatureCanvas } from "../components/SignatureCanvas";
import { EventReports } from "../components/EventReports";
import { EventBudget } from "../components/EventBudget";
import { 
  Calendar, MapPin, CheckCircle2, AlertTriangle, Users, MessageSquare, 
  Camera, Plus, Clock, Search, SlidersHorizontal, Image as ImageIcon, Send, Trash, Shield, Info, Filter, ArrowLeft,
  FileText, ClipboardCheck, DollarSign, PenTool, CheckCircle, AlertOctagon, UserCheck, HelpCircle, Edit
} from "lucide-react";

export const EventsView: React.FC = () => {
  const { 
    events, suppliers, createEvent, updateEvent, deleteEvent, addEvent,
    occurrences, addOccurrence, updateOccurrence, deleteOccurrence,
    currentUser, checkIns, addCheckIn, eventPhotos, addEventPhoto, deleteEventPhoto,
    eventMessages, addEventMessage, supplierEvaluations, addSupplierEvaluation
  } = useApp();

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'checklists' | 'fotos' | 'chat' | 'ocorrencias' | 'orcamento' | 'relatorios'>('timeline');

  // Filters for Events List
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState<string>("todos");

  // Occurrences form state inside details
  const [newOccTitle, setNewOccTitle] = useState("");
  const [newOccDesc, setNewOccDesc] = useState("");
  const [newOccPriority, setNewOccPriority] = useState<'Baixa' | 'Media' | 'Alta' | 'Critica'>('Media');
  const [newOccCategory, setNewOccCategory] = useState<any>('Atraso');
  const [newOccSupplierId, setNewOccSupplierId] = useState("");

  // Evaluator checklist state
  const [evaluationSupplierId, setEvaluationSupplierId] = useState<string | null>(null);
  const [evalTeamComplete, setEvalTeamComplete] = useState(true);
  const [evalOnTime, setEvalOnTime] = useState(true);
  const [evalFullUniform, setEvalFullUniform] = useState(true);
  const [evalUniformGood, setEvalUniformGood] = useState(true);
  const [evalSuitableFootwear, setEvalSuitableFootwear] = useState(true);
  const [evalCleanPres, setEvalCleanPres] = useState(true);
  const [evalPosture, setEvalPosture] = useState(true);
  const [evalProactive, setEvalProactive] = useState(true);
  const [evalKnowsFunc, setEvalKnowsFunc] = useState(true);
  const [evalSignatureUrl, setEvalSignatureUrl] = useState(""); // Drawn Base64 Signature
  const [evalStatus, setEvalStatus] = useState<'Aprovado' | 'Parcial' | 'Reprovado'>('Aprovado');
  const [evalNoNotes, setEvalNoNotes] = useState("");
  
  // Quick Chat state
  const [chatMessage, setChatMessage] = useState("");

  // New Event Form Modal Toggle
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingOcc, setEditingOcc] = useState<Occurrence | null>(null);
  const [confirmDeleteEventId, setConfirmDeleteEventId] = useState<string | null>(null);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventAddress, setNewEventAddress] = useState("");
  const [newEventStage, setNewEventStage] = useState<any>("pre_evento");

  // Quick check-in optional observations dialog state
  const [selectedQuickAction, setSelectedQuickAction] = useState<{ label: string; icon: string; desc: string } | null>(null);
  const [quickCheckInObservation, setQuickCheckInObservation] = useState("");

  // Public Photographer checklists submitted
  const [publicChecklists, setPublicChecklists] = useState<any[]>([]);

  // Photographer checklists functional engine
  const [checklistActiveMode, setChecklistActiveMode] = useState<'fornecedores' | 'fotografos'>('fornecedores');
  const [photoChecklists, setPhotoChecklists] = useState<any[]>([]);
  const [isCreatingPhotoChecklist, setIsCreatingPhotoChecklist] = useState(false);
  const [photoChecklistTitle, setPhotoChecklistTitle] = useState("Roteiro Técnico & Cobertura Fotográfica");
  const [photoChecklistMarkdown, setPhotoChecklistMarkdown] = useState(`## Entrada e Fachada
* [ ] Foto detalhada da fachada externa com iluminação principal
* [ ] Foto widescreen do portal de entrada principal e recepção
* [ ] Fotos da equipe de staff e recepção posicionados

## Cenografia e Ambientação
* [ ] Visão panorâmica detalhada do salão principal decorado (sem convidados)
* [ ] close-up das mesas decoradas, arranjos e cardápios
* [ ] Foto do mezanino e bares operantes com iluminação cênica

## Momentos Especiais & Palco
* [ ] Fotos das apresentações de abertura e mestre de cerimônias
* [ ] Foto do público e interação na área VIP
* [ ] Foto oficial dos organizadores no backdrop da marca`);
  const [photoChecklistAllowUpload, setPhotoChecklistAllowUpload] = useState(true);
  const [copiedChecklistId, setCopiedChecklistId] = useState<string | null>(null);

  // Visual Checklist Builder engine
  interface BuilderItem {
    id: string;
    text: string;
  }

  interface BuilderSection {
    id: string;
    title: string;
    items: BuilderItem[];
  }

  const [builderSections, setBuilderSections] = useState<BuilderSection[]>([
    {
      id: "sec_1",
      title: "Cenografia e Ambientação",
      items: [
        { id: "itm_1", text: "Visão panorâmica detalhada do salão principal decorado (sem convidados)" },
        { id: "itm_2", text: "close-up das mesas decoradas, arranjos e cardápios" },
        { id: "itm_3", text: "Foto do mezanino e bares operantes com iluminação cênica" }
      ]
    },
    {
      id: "sec_2",
      title: "Momentos Especiais & Palco",
      items: [
        { id: "itm_4", text: "Fotos das apresentações de abertura e mestre de cerimônias" },
        { id: "itm_5", text: "Foto do público e interação na área VIP" },
        { id: "itm_6", text: "Foto oficial dos organizadores no backdrop da marca" }
      ]
    }
  ]);

  // Hook to auto-compile visual builder steps into photoChecklistMarkdown template format
  useEffect(() => {
    const md = builderSections
      .map(sec => {
        const header = `## ${sec.title.trim()}`;
        const items = sec.items.map(itm => `* [] ${itm.text.trim()}`).join("\n");
        return `${header}\n${items}`;
      })
      .join("\n\n");
    setPhotoChecklistMarkdown(md);
  }, [builderSections]);

  const handleAddSection = () => {
    const newSecId = "sec_" + Date.now();
    setBuilderSections(prev => [
      ...prev,
      {
        id: newSecId,
        title: "Nova Seção",
        items: [
          { id: "itm_" + Date.now(), text: "Nova diretriz de registro fotográfico" }
        ]
      }
    ]);
  };

  const handleUpdateSectionTitle = (secId: string, val: string) => {
    setBuilderSections(prev =>
      prev.map(sec => (sec.id === secId ? { ...sec, title: val } : sec))
    );
  };

  const handleRemoveSection = (secId: string) => {
    setBuilderSections(prev => prev.filter(sec => sec.id !== secId));
  };

  const handleAddItemToSection = (secId: string) => {
    setBuilderSections(prev =>
      prev.map(sec => {
        if (sec.id === secId) {
          return {
            ...sec,
            items: [
              ...sec.items,
              { id: "itm_" + Date.now(), text: "" }
            ]
          };
        }
        return sec;
      })
    );
  };

  const handleUpdateItemText = (secId: string, itemId: string, val: string) => {
    setBuilderSections(prev =>
      prev.map(sec => {
        if (sec.id === secId) {
          return {
            ...sec,
            items: sec.items.map(itm => (itm.id === itemId ? { ...itm, text: val } : itm))
          };
        }
        return sec;
      })
    );
  };

  const handleRemoveItemFromSection = (secId: string, itemId: string) => {
    setBuilderSections(prev =>
      prev.map(sec => {
        if (sec.id === secId) {
          return {
            ...sec,
            items: sec.items.filter(itm => itm.id !== itemId)
          };
        }
        return sec;
      })
    );
  };

  const loadPhotoChecklists = () => {
    const saved = localStorage.getItem("gs_event_photographer_checklists");
    if (saved) {
      setPhotoChecklists(JSON.parse(saved));
    } else {
      setPhotoChecklists([]);
    }
  };

  useEffect(() => {
    loadPhotoChecklists();
  }, [selectedEventId]);

  const handleSavePhotoChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const newChecklist = {
      id: "pchk_" + Date.now(),
      eventId: selectedEvent.id,
      title: photoChecklistTitle,
      markdownContent: photoChecklistMarkdown,
      allowPhotoUpload: photoChecklistAllowUpload,
      submitted: false,
      submittedAt: null,
      photographerName: "",
      photographerPhone: "",
      completedItemTexts: [],
      observations: "",
      photos: [],
      signatureUrl: ""
    };

    const currentSaved = localStorage.getItem("gs_event_photographer_checklists");
    const currentList = currentSaved ? JSON.parse(currentSaved) : [];
    const updated = [newChecklist, ...currentList];
    localStorage.setItem("gs_event_photographer_checklists", JSON.stringify(updated));

    setPhotoChecklists(updated);
    setIsCreatingPhotoChecklist(false);
    // Reset defaults
    setPhotoChecklistTitle("Roteiro Técnico & Cobertura Fotográfica");
    setPhotoChecklistAllowUpload(true);
  };

  const handleCopyLink = (chkId: string) => {
    if (!selectedEvent) return;
    const shareUrl = `${window.location.origin}/?checklist-publico=true&eventId=${selectedEvent.id}&checklistId=${chkId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedChecklistId(chkId);
    setTimeout(() => setCopiedChecklistId(null), 2000);
  };

  const handleDeletePhotoChecklist = (idToDelete: string) => {
    const currentSaved = localStorage.getItem("gs_event_photographer_checklists");
    if (currentSaved) {
      const list = JSON.parse(currentSaved);
      const filtered = list.filter((c: any) => c.id !== idToDelete);
      localStorage.setItem("gs_event_photographer_checklists", JSON.stringify(filtered));
      setPhotoChecklists(filtered);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("gs_public_checklists");
    if (saved) {
      setPublicChecklists(JSON.parse(saved));
    }
  }, [selectedEventId]);

  // AUTO-CALCULATE RECOMMENDED APPROVAL STATUS BY CHECKLIST ANSWERS
  useEffect(() => {
    // Score based on checked criteria (9 criteria total)
    const criteria = [
      evalTeamComplete, evalOnTime, evalFullUniform, evalUniformGood, 
      evalSuitableFootwear, evalCleanPres, evalPosture, evalProactive, evalKnowsFunc
    ];
    const score = criteria.filter(c => c === true).length;
    
    if (score === 9) {
      setEvalStatus("Aprovado");
    } else if (score >= 6) {
      setEvalStatus("Parcial");
    } else {
      setEvalStatus("Reprovado");
    }
  }, [
    evalTeamComplete, evalOnTime, evalFullUniform, evalUniformGood, 
    evalSuitableFootwear, evalCleanPres, evalPosture, evalProactive, evalKnowsFunc
  ]);

  const handleStartEditOcc = (occ: Occurrence) => {
    setEditingOcc(occ);
    setNewOccTitle(occ.title);
    setNewOccDesc(occ.description);
    setNewOccPriority(occ.priority);
    setNewOccCategory(occ.category);
    setNewOccSupplierId(occ.supplierId || "");
  };

  const handleStartEditEvent = (evt: Event, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening detailed view
    setEditingEvent(evt);
    setNewEventName(evt.name);
    setNewEventDate(evt.date);
    setNewEventAddress(evt.address);
    setNewEventStage(evt.stage);
    setIsCreatingEvent(true);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName || !newEventDate) return;

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        name: newEventName,
        date: newEventDate,
        address: newEventAddress || "Espaço a definir",
        stage: newEventStage,
      });
    } else {
      addEvent({
        name: newEventName,
        date: newEventDate,
        address: newEventAddress || "Espaço a definir",
        coordinates: [-23.5539, -46.6521],
        stage: newEventStage,
        progress: 10,
        checklistIds: [],
        supplierIds: [],
        staffIds: [currentUser.id]
      });
    }

    setNewEventName("");
    setNewEventDate("");
    setNewEventAddress("");
    setEditingEvent(null);
    setIsCreatingEvent(false);
  };

  // CheckIn quick buttons configurations - 12 BOTÕES GRANDES
  const quickActions = [
    { label: "Fornecedor Chegou", icon: "🚚", desc: "Registro de chegada de empresa terceirizada" },
    { label: "Colaborador Chegou", icon: "🙋‍♂️", desc: "Registro de entrada de pessoal / staff" },
    { label: "Montagem Iniciada", icon: "🏗️", desc: "Início oficial da montagem de estruturas" },
    { label: "Equipe Alinhada", icon: "🤝", desc: "Reunião de briefing rápido finalizada" },
    { label: "Gerador Ativado", icon: "⚡", desc: "Gerador de energia redundante acoplado" },
    { label: "Som & Luz Testados", icon: "💡", desc: "Testes técnicos de sonorização concluídos" },
    { label: "Segurança Postada", icon: "🛡️", desc: "Equipe de brigada civil postada nos postos" },
    { label: "Portas Abertas", icon: "🚪", desc: "Início da recepção do público geral" },
    { label: "Show Iniciado", icon: "🎤", desc: "Início oficial da programação principal" },
    { label: "Show Encerrado", icon: "👏", desc: "Fim das exibições de palco e falas" },
    { label: "Desmontagem Iniciada", icon: "🧹", desc: "Início da remoção de equipamentos" },
    { label: "Evento Concluído", icon: "✨", desc: "Fechamento total dos trabalhos operacionais" }
  ];

  const triggerQuickCheckInNotes = (action: typeof quickActions[0]) => {
    setSelectedQuickAction(action);
    setQuickCheckInObservation("");
  };

  const handleConfirmQuickCheckIn = () => {
    if (!selectedQuickAction || !selectedEventId) return;
    const finalDesc = quickCheckInObservation.trim() 
      ? `${selectedQuickAction.desc} (Nota: ${quickCheckInObservation.trim()})` 
      : selectedQuickAction.desc;

    addCheckIn(selectedEventId, selectedQuickAction.label, finalDesc);
    setSelectedQuickAction(null);
    setQuickCheckInObservation("");
  };

  // Submit supplier evaluation
  const handleSubmitEvaluation = (e: React.FormEvent, eventId: string) => {
    e.preventDefault();
    if (!evaluationSupplierId || !evalSignatureUrl) return;

    const supplierObj = suppliers.find(s => s.id === evaluationSupplierId);

    addSupplierEvaluation({
      supplierId: evaluationSupplierId,
      eventId: eventId,
      supplierName: supplierObj?.tradeName || "Indefinido",
      evaluatorName: currentUser.name,
      rating: evalStatus,
      signatureUrl: evalSignatureUrl, // Drawn Signature Added Here
      date: new Date().toISOString().split("T")[0],
      checklist: {
        teamComplete: evalTeamComplete,
        onTime: evalOnTime,
        fullUniform: evalFullUniform,
        uniformGood: evalUniformGood,
        suitableFootwear: evalSuitableFootwear,
        cleanPres: evalCleanPres,
        posture: evalPosture,
        proactive: evalProactive,
        knowsFunc: evalKnowsFunc
      },
      notes: evalNoNotes
    });

    // Reset Checklist inputs
    setEvaluationSupplierId(null);
    setEvalSignatureUrl("");
    setEvalNoNotes("");
    setEvalTeamComplete(true);
    setEvalOnTime(true);
    setEvalFullUniform(true);
    setEvalUniformGood(true);
    setEvalSuitableFootwear(true);
    setEvalCleanPres(true);
    setEvalPosture(true);
    setEvalProactive(true);
    setEvalKnowsFunc(true);
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  // Filter lists
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === "todos" || e.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  // Calculate checklists categories count
  const getEvaluatedSuppliersIds = () => {
    if (!selectedEvent) return [];
    return supplierEvaluations
      .filter(ev => ev.eventId === selectedEvent.id)
      .map(ev => ev.supplierId);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. EVENTS SUMMARY ROW & LISTING (If none selected) */}
      {!selectedEvent ? (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white">Central Operacional de Eventos</h2>
              <p className="text-xs text-gray-400">Verifique status de estágios operacionais, cronogramas de montagem e vistorias de camarins.</p>
            </div>

            <button
              onClick={() => setIsCreatingEvent(true)}
              className="bg-[var(--color-primary)] text-white hover:opacity-90 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-3xs"
            >
              <Plus size={16} /> Cadastrar Novo Evento
            </button>
          </div>

          {/* QUICK STATISTICS IN CAMPUS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-gray-150 dark:border-zinc-850">
              <span className="text-[10px] text-gray-400 block uppercase font-mono">Total de Eventos</span>
              <strong className="text-lg text-gray-800 dark:text-zinc-200 block">{events.length}</strong>
            </div>
            <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-gray-150 dark:border-zinc-850">
              <span className="text-[10px] text-green-500 block uppercase font-mono">Em Execução Hoje</span>
              <strong className="text-lg text-emerald-600 block">{events.filter(e => e.stage === "execucao").length}</strong>
            </div>
            <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-gray-150 dark:border-zinc-850">
              <span className="text-[10px] text-orange-500 block uppercase font-mono">Pós-Evento / Fechamento</span>
              <strong className="text-lg text-[var(--color-primary)] block">{events.filter(e => e.stage === "pos_evento").length}</strong>
            </div>
            <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-gray-150 dark:border-zinc-850">
              <span className="text-[10px] text-gray-400 block uppercase font-mono">Visitas Técnicas Agendadas</span>
              <strong className="text-lg text-gray-700 dark:text-zinc-350 block">{events.filter(e => e.stage === "visita_tecnica").length}</strong>
            </div>
          </div>

          {/* FILTERING HEADER */}
          <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-gray-150 dark:border-zinc-850">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Pesquisar por nome ou endereço do evento..."
                className="w-full pl-10 pr-4 py-2 border dark:border-zinc-850 rounded-xl bg-gray-50/50 dark:bg-zinc-900 text-xs focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 px-3 border dark:border-zinc-850 bg-gray-50/50 dark:bg-zinc-900 rounded-xl text-xs text-gray-700 focus:outline-none"
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
              >
                <option value="todos">Todos os Estágios</option>
                <option value="visita_tecnica">Visita Técnica</option>
                <option value="pre_evento">Pré-Evento</option>
                <option value="montagem">Montagem</option>
                <option value="execucao">Execução / Ao Vivo</option>
                <option value="pos_evento">Pós-Evento</option>
                <option value="finalizado">Concluído</option>
              </select>
            </div>
          </div>

          {/* NEW EVENT FORM MODAL IN-PLACE */}
          {isCreatingEvent && (
            <form onSubmit={handleCreateEvent} className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border-2 border-[var(--color-primary)]/20 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans shadow-lg animate-scale-up md:col-span-12">
              <div className="md:col-span-4 border-b dark:border-zinc-900 pb-2">
                <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  {editingEvent ? "📝 Editar Evento / Célula" : "➕ Novo Evento / Célula"}
                </h3>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nome do Evento / Projeto *</label>
                <input type="text" required placeholder="Ex: Festival Arena Pop 2026" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Data Realização *</label>
                <input type="date" required value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl text-gray-700 dark:text-zinc-300 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Estágio Inicial / Atual</label>
                <select value={newEventStage} onChange={(e) => setNewEventStage(e.target.value as any)} className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl text-gray-750 dark:text-zinc-350 focus:outline-none text-xs">
                  <option value="visita_tecnica">Visita Técnica</option>
                  <option value="pre_evento">Pré-Evento</option>
                  <option value="montagem">Montagem</option>
                  <option value="execucao">Execução / Ao Vivo</option>
                  <option value="pos_evento">Pós-Evento</option>
                  <option value="finalizado">Concluído</option>
                </select>
              </div>
              <div className="md:col-span-4">
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Endereço Completo</label>
                <input type="text" placeholder="Ex: Allianz Parque, São Paulo - SP" value={newEventAddress} onChange={(e) => setNewEventAddress(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl focus:outline-none" />
              </div>
              <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t dark:border-zinc-900">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setIsCreatingEvent(false);
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-zinc-900 rounded-xl font-bold font-mono text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-xs hover:bg-orange-600">
                  {editingEvent ? "Salvar Alterações" : "Gravar Evento"}
                </button>
              </div>
            </form>
          )}

          {/* EVENTS LIST GRID CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(evt => (
              <div
                key={evt.id}
                onClick={() => {
                  setSelectedEventId(evt.id);
                  setActiveSubTab('timeline');
                }}
                className={`bg-white dark:bg-zinc-950 rounded-r-3xl rounded-l-lg border-y border-r border-gray-150 dark:border-zinc-850 p-6 space-y-4 flex flex-col justify-between relative shadow-xs transition-all duration-250 hover:shadow-md hover:-translate-y-1 hover:rotate-1 cursor-pointer border-l-6 ${
                  evt.stage === "execucao" ? "border-[var(--color-primary)]" :
                  evt.stage === "finalizado" ? "border-emerald-500" :
                  evt.stage === "montagem" ? "border-indigo-500" :
                  evt.stage === "pre_evento" ? "border-amber-500" :
                  "border-slate-400"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold text-white bg-slate-500 font-mono`} style={{ backgroundColor: evt.stage === "execucao" ? "var(--color-primary)" : evt.stage === "finalizado" ? "#10B981" : evt.stage === "montagem" ? "#6366F1" : evt.stage === "pre_evento" ? "#F59E0B" : undefined }}>
                      {evt.stage.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono font-bold flex items-center gap-1 bg-gray-50 dark:bg-zinc-900 px-2 py-0.5 rounded-md border dark:border-zinc-805">
                      <Clock size={11} className="text-gray-400" /> {evt.date}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-gray-900 dark:text-zinc-50 leading-tight tracking-tight hover:text-[var(--color-primary)] transition-colors">{evt.name}</h3>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <MapPin size={11} className="text-[var(--color-primary)]" />
                      <span className="truncate">{evt.address}</span>
                    </p>
                  </div>

                  {/* High contrast visual pills for allocated staff & suppliers */}
                  <div className="bg-gray-50/70 dark:bg-zinc-900/40 rounded-2xl p-2.5 grid grid-cols-2 gap-2 text-center text-[10px] font-mono border dark:border-zinc-900">
                    <div className="bg-gray-100/50 dark:bg-zinc-900 p-1.5 rounded-xl">
                      <span className="text-gray-500 dark:text-zinc-400 font-bold block">👥 {evt.staffIds.length} Staff</span>
                      <span className="text-[8px] text-gray-400 uppercase tracking-wider block font-extrabold mt-0.5">Alocados</span>
                    </div>
                    <div className="bg-orange-50/40 dark:bg-orange-950/10 p-1.5 rounded-xl">
                      <span className="text-[var(--color-primary)] font-bold block">🚚 {evt.supplierIds?.length || 0} Fornec</span>
                      <span className="text-[8px] text-orange-400 dark:text-orange-500 uppercase tracking-wider block font-extrabold mt-0.5">Vinculados</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t dark:border-zinc-900 flex justify-between items-center gap-2">
                  <div className="flex gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                    {confirmDeleteEventId === evt.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] text-red-500 font-bold uppercase font-mono">Confirma?</span>
                        <button
                          onClick={() => {
                            deleteEvent(evt.id);
                            setConfirmDeleteEventId(null);
                          }}
                          className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] uppercase font-bold"
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => setConfirmDeleteEventId(null)}
                          className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 text-[9px] uppercase font-bold"
                        >
                          Não
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={(e) => handleStartEditEvent(evt, e)}
                          className="p-1 px-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1 text-[9px] uppercase tracking-wider transition-colors font-mono"
                          title="Editar"
                        >
                          <Edit size={10} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteEventId(evt.id)}
                          className="p-1 px-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 font-bold flex items-center gap-1 text-[9px] uppercase tracking-wider transition-colors font-mono"
                          title="Excluir"
                        >
                          <Trash size={10} />
                        </button>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-[var(--color-primary)] font-extrabold flex items-center gap-1 hover:translate-x-1 transition-transform font-mono">
                    Gerenciar Operação &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        
        // 2. DETAILED SINGLE EVENT VIEW
        <div className="space-y-6 animate-fade-in">
          
          {/* BACK HEADER HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b dark:border-zinc-900 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedEventId(null)}
                className="p-2 hover:bg-gray-150 dark:hover:bg-zinc-900 rounded-xl text-gray-600 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-mono">Gerenciando Célula</span>
                <h2 className="text-xl font-extrabold text-[#1F2937] dark:text-white flex items-center gap-2">
                  <span>{selectedEvent.name}</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono text-gray-500 dark:text-zinc-400 mr-1">Alterar Estágio:</span>
              <div className="flex flex-wrap gap-1">
                {["visita_tecnica", "pre_evento", "montagem", "execucao", "pos_evento", "finalizado"].map((st) => (
                  <button
                    key={st}
                    onClick={() => updateEvent(selectedEvent.id, { stage: st as any })}
                    className={`text-[9px] font-bold uppercase font-mono px-2 py-1 rounded-md border ${selectedEvent.stage === st ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'bg-gray-50 dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-800'}`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN TAB SWITCH NAVIGATION */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100 dark:border-zinc-900 select-none">
            <button 
              onClick={() => setActiveSubTab('timeline')}
              className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                activeSubTab === 'timeline' 
                  ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                  : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              🚀 Check-in & Timeline
            </button>
            <button 
              onClick={() => setActiveSubTab('fornecedores')}
              className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                activeSubTab === 'fornecedores' 
                  ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                  : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              📋 Fornecedores
            </button>
            <button 
              onClick={() => setActiveSubTab('fotografos')}
              className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                activeSubTab === 'fotografos' 
                  ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                  : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              📸 Checklist Fotográfico
            </button>
            <button 
              onClick={() => setActiveSubTab('orcamento')}
              className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                activeSubTab === 'orcamento' 
                  ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                  : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              📊 Orçamentos
            </button>
            <button 
              onClick={() => setActiveSubTab('relatorios')}
              className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                activeSubTab === 'relatorios' 
                  ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                  : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              📂 Relatórios
            </button>
            <button 
              onClick={() => setActiveSubTab('fotos')}
              className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                activeSubTab === 'fotos' 
                  ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                  : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              🖼️ Galeria
            </button>
            <button 
              onClick={() => setActiveSubTab('chat')}
              className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                activeSubTab === 'chat' 
                  ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                  : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              💬 Chat Operacional
            </button>
            <button 
              onClick={() => setActiveSubTab('ocorrencias')}
              className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                activeSubTab === 'ocorrencias' 
                  ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                  : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              ⚠️ Ocorrências ({occurrences.filter(o => o.eventId === selectedEvent.id).length})
            </button>
          </div>

          {/* Subtab 1: Check-in & Timeline */}
          {activeSubTab === 'timeline' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Check-ins Buttons Col (2/3 size) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-850 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-gray-850 dark:text-zinc-100">Check-in Rápido em Campo</h3>
                    <p className="text-xs text-gray-400">Toque em qualquer ação abaixo para registrar e notificar a equipe em tempo real.</p>
                  </div>
                  
                  {/* The 12 big touch buttons */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {quickActions.map(act => (
                      <button
                        key={act.label}
                        onClick={() => triggerQuickCheckInNotes(act)}
                        className="p-3 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/80 active:scale-95 border dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 transition-all text-xs font-bold"
                        style={{ minHeight: "84px" }}
                      >
                        <span className="text-2xl">{act.icon}</span>
                        <span className="text-gray-800 dark:text-zinc-200 leading-tight block">{act.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feed Col (1/3 size) */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-850 space-y-4">
                  <h3 className="font-bold text-xs uppercase text-gray-400 tracking-wider">Últimos Registros do Evento</h3>
                  
                  {checkIns.filter(c => c.eventId === selectedEvent.id).length === 0 ? (
                    <p className="text-xs text-gray-500 p-2">Nenhum check-in registrado ainda na timeline deste evento.</p>
                  ) : (
                    <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800 max-h-96 overflow-y-auto pr-1">
                      {checkIns.filter(c => c.eventId === selectedEvent.id).map(c => (
                        <div key={c.id} className="text-xs relative z-10 pl-6 space-y-0.5">
                          <span className="absolute left-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
                          <span className="font-extrabold text-gray-800 dark:text-gray-200 block">{c.type}</span>
                          <p className="text-gray-500 dark:text-gray-400 text-[10px]">{c.description}</p>
                          <span className="text-[9px] text-gray-400 block font-mono">
                            {c.timestamp ? new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"} • {c.responsibleName}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Subtab 2: Checklist Fornecedores */}
          {activeSubTab === 'fornecedores' && (
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-850 space-y-6">

              {!evaluationSupplierId && (
                // MODE: SUPPLIER EVALUATIONS - SEGREGATE INTO PENDING AND CONCLUDED SUPPLIERS
                <div className="space-y-6 animate-scale-up">
                    
                    {/* PENDING FOR EVALUATION */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-xs uppercase text-orange-550 block font-mono">Pendentes de Avaliação de Qualidade</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suppliers
                          .filter(s => !getEvaluatedSuppliersIds().includes(s.id))
                          .map(sup => (
                            <div 
                              key={sup.id}
                              className="p-4 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-2xl flex items-center justify-between gap-4 animate-scale-up"
                            >
                              <div className="text-xs">
                                <span className="text-[8px] bg-orange-100 dark:bg-orange-950/40 text-[var(--color-primary)] font-bold px-2 py-0.5 rounded uppercase font-mono">
                                  {sup.category}
                                </span>
                                <h4 className="font-bold text-gray-800 dark:text-white mt-1">{sup.tradeName}</h4>
                                <span className="text-[10px] text-gray-400 font-mono">CNPJ: {sup.cnpj}</span>
                              </div>
                              <button
                                onClick={() => setEvaluationSupplierId(sup.id)}
                                className="bg-[var(--color-primary)] text-white hover:opacity-90 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-3xs"
                              >
                                Avaliar
                              </button>
                            </div>
                        ))}
                        {suppliers.filter(s => !getEvaluatedSuppliersIds().includes(s.id)).length === 0 && (
                          <p className="text-xs text-gray-400 italic py-2">Todos os fornecedores deste evento já foram devidamente avaliados!</p>
                        )}
                      </div>
                    </div>

                    {/* CONCLUDED EVALUATIONS DISPLAY WITH HISTORY */}
                    <div className="space-y-3 pt-4 border-t dark:border-zinc-900">
                      <h3 className="font-bold text-xs uppercase text-emerald-600 block font-mono">Avaliações Concluídas</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {supplierEvaluations
                          .filter(ev => ev.eventId === selectedEvent.id)
                          .map(ev => (
                            <div 
                              key={ev.id}
                              className="p-4 bg-emerald-50/10 border border-emerald-500/10 rounded-2xl space-y-3 animate-scale-up"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-black text-gray-850 dark:text-zinc-100">{ev.supplierName}</h4>
                                  <span className="text-[9px] text-gray-400 block pb-1">Avaliado por: <strong>{ev.evaluatorName}</strong></span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono ${ev.rating === "Aprovado" ? "bg-emerald-500/10 text-emerald-600" : ev.rating === "Parcial" ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-600"}`}>
                                  {ev.rating}
                                </span>
                              </div>

                              {/* Checklist Criteria Summarized Grid */}
                              <div className="p-3 bg-gray-50/50 dark:bg-zinc-950 rounded-xl border dark:border-zinc-900 text-[10px] font-mono grid grid-cols-2 gap-2 text-gray-450 dark:text-zinc-500">
                                <span>📅 Horário: <strong className={(ev.checklist ? ev.checklist.onTime : ev.arrivedOnTime) ? "text-emerald-500" : "text-red-500"}>{(ev.checklist ? ev.checklist.onTime : ev.arrivedOnTime) ? "Ok" : "Falta"}</strong></span>
                                <span>👔 Uniforme: <strong className={(ev.checklist ? ev.checklist.fullUniform : ev.fullUniform) ? "text-emerald-500" : "text-red-500"}>{(ev.checklist ? ev.checklist.fullUniform : ev.fullUniform) ? "Ok" : "Falta"}</strong></span>
                                <span>👥 Postura: <strong className={(ev.checklist ? ev.checklist.posture : ev.professionalPosture) ? "text-emerald-500" : "text-red-500"}>{(ev.checklist ? ev.checklist.posture : ev.professionalPosture) ? "Ok" : "Falta"}</strong></span>
                                <span>💪 Proativ: <strong className={(ev.checklist ? ev.checklist.proactive : ev.proactive) ? "text-emerald-500" : "text-red-500"}>{(ev.checklist ? ev.checklist.proactive : ev.proactive) ? "Ok" : "Falta"}</strong></span>
                              </div>

                              {ev.notes && (
                                <p className="text-[10px] text-gray-450 italic bg-gray-50/20 p-2 rounded-lg border dark:border-zinc-900">Nota: "{ev.notes}"</p>
                              )}

                              {ev.signatureUrl && (
                                <div className="border-t dark:border-zinc-905 pt-2 flex items-center justify-between">
                                  <span className="text-[9px] text-gray-450 uppercase font-mono">Assinatura Capturada:</span>
                                  <img src={ev.signatureUrl} alt="Drawn signature proof" className="h-6 object-contain bg-white dark:bg-zinc-900 border rounded p-0.5" referrerPolicy="no-referrer" />
                                </div>
                              )}

                            </div>
                        ))}
                        {supplierEvaluations.filter(ev => ev.eventId === selectedEvent.id).length === 0 && (
                          <p className="text-xs text-gray-400 italic">Nenhuma avaliação cadastrada nesta praça ainda.</p>
                        )}
                      </div>
                    </div>

                </div>
              )}

            </div>
          )}

          {/* Subtab 2.5: Checklist Fotográfico */}
          {activeSubTab === 'fotografos' && (
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-850 space-y-6 animate-scale-up">
              <div className="space-y-6">
                  
                  {/* UPPER INTENTION */}
                  <div className="flex md:flex-row flex-col justify-between items-start md:items-center p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl gap-3">
                    <div className="text-xs">
                      <strong className="block font-bold text-gray-850 dark:text-zinc-100">Criação & Envio de Checklists Técnicos</strong>
                      <p className="text-[10px] text-gray-400">Gere um link automatizado restrito para os profissionais externos realizarem a cobertura fotográfica em campo.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCreatingPhotoChecklist(true)}
                      className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
                    >
                      + Novo Checklist Fotográfico
                    </button>
                  </div>

                  {/* IS CREATING CHECKLIST MODAL OR INLINE FORM */}
                  {isCreatingPhotoChecklist && (
                    <form onSubmit={handleSavePhotoChecklist} className="p-5 bg-gray-50 dark:bg-zinc-900/50 border dark:border-zinc-850 rounded-2xl space-y-4 animate-scale-up">
                      <div className="flex justify-between items-center border-b dark:border-zinc-800 pb-2">
                        <span className="text-xs font-black uppercase text-orange-500 font-mono">Configurar Novo Checklist de Imagens</span>
                        <button type="button" onClick={() => setIsCreatingPhotoChecklist(false)} className="text-[10px] bg-gray-200 dark:bg-zinc-800 font-bold px-2.5 py-1 rounded-lg">Cancelar</button>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-gray-400">Título Identificador</label>
                        <input
                          type="text"
                          required
                          value={photoChecklistTitle}
                          onChange={e => setPhotoChecklistTitle(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl focus:outline-none"
                          placeholder="Ex: Roteiro Técnico de Fotos - Cobertura Principal"
                        />
                      </div>

                      {/* Interactive Visual Builder Segment */}
                      <div className="space-y-3 pb-3 border-b dark:border-zinc-800">
                        <div className="flex justify-between items-center">
                          <div>
                            <label className="block text-[10px] uppercase font-mono font-black text-orange-500">Construtor de Lista de Fotos (Recomendado)</label>
                            <p className="text-[9px] text-gray-500">Adicione grupos (seções) e as diretrizes/fotos requeridas. O sistema gera o Markdown automaticamente!</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {builderSections.map((sec, sIdx) => (
                            <div key={sec.id} className="p-3.5 bg-white dark:bg-zinc-950 border dark:border-zinc-850 rounded-2xl space-y-3 shadow-3xs relative group/sec hover:border-orange-200 dark:hover:border-orange-950 transition-colors">
                              {/* Section Header */}
                              <div className="flex items-center gap-2">
                                <span className="text-[8px] font-black uppercase font-mono px-1.5 py-0.5 bg-orange-500/10 text-orange-600 rounded">Grupo/Seção #{sIdx + 1}</span>
                                <input
                                  type="text"
                                  value={sec.title}
                                  onChange={e => handleUpdateSectionTitle(sec.id, e.target.value)}
                                  className="flex-1 text-xs font-extrabold bg-transparent border-b border-dashed border-gray-200 focus:border-orange-500 dark:border-zinc-800 dark:focus:border-orange-500 pb-0.5 focus:outline-none"
                                  placeholder="Digite o nome do grupo de fotos (Ex: Cerimônia, Decoração)"
                                />
                                {builderSections.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSection(sec.id)}
                                    className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 rounded-lg transition-all"
                                    title="Remover este grupo"
                                  >
                                    <Trash size={12} />
                                  </button>
                                )}
                              </div>

                              {/* Items inside section */}
                              <div className="pl-4 space-y-2 border-l border-gray-150 dark:border-zinc-805">
                                {sec.items.map((itm, iIdx) => (
                                  <div key={itm.id} className="flex items-center gap-2 group/itm">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                                    <input
                                      type="text"
                                      value={itm.text}
                                      onChange={e => handleUpdateItemText(sec.id, itm.id, e.target.value)}
                                      className="flex-1 text-xs bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-850 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500/30 text-gray-700 dark:text-zinc-200 font-medium"
                                      placeholder="Ex: Foto panorâmica da mesa de doces ou close-up"
                                    />
                                    {sec.items.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveItemFromSection(sec.id, itm.id)}
                                        className="p-1 text-gray-300 hover:text-rose-500 rounded transition-all opacity-45 group-hover/itm:opacity-100"
                                        title="Excluir este item"
                                      >
                                        <Trash size={10} />
                                      </button>
                                    )}
                                  </div>
                                ))}

                                <button
                                  type="button"
                                  onClick={() => handleAddItemToSection(sec.id)}
                                  className="text-[9px] font-black uppercase text-orange-500 hover:text-orange-600 flex items-center gap-1 font-mono pt-1 hover:underline cursor-pointer"
                                >
                                  <Plus size={10} /> ADICIONAR CAPTURA REQUERIDA
                                </button>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={handleAddSection}
                            className="w-full py-2 bg-gray-50 dark:bg-zinc-900 hover:bg-orange-500/5 hover:border-orange-500/20 text-gray-500 dark:text-zinc-400 border border-dashed rounded-xl text-[10px] font-black uppercase font-mono tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Plus size={12} className="text-orange-500" /> + ADICIONAR NOVO GRUPO/SEÇÃO DE COBERTURA
                          </button>
                        </div>
                      </div>

                      {/* Expandable/Previsualizing Markdown Segment */}
                      <details className="group border dark:border-zinc-850 rounded-2xl bg-gray-100/50 dark:bg-zinc-950/40 p-2 text-xs">
                        <summary className="font-extrabold text-[10px] text-gray-500 dark:text-zinc-400 font-mono uppercase cursor-pointer flex justify-between items-center select-none py-1 px-2.5">
                          <span>Visualizar Código Markdown do Template (Auto-Gerado)</span>
                          <span className="text-gray-400 font-normal group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="mt-2 text-[10px] font-mono p-3 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-xl leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap text-emerald-600 dark:text-emerald-400 scrollbar-thin">
                          {photoChecklistMarkdown}
                        </div>
                      </details>

                      <div className="flex items-center gap-2.5 pt-1">
                        <input 
                          type="checkbox" 
                          id="allow_up" 
                          checked={photoChecklistAllowUpload} 
                          onChange={e => setPhotoChecklistAllowUpload(e.target.checked)}
                          className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                        />
                        <label htmlFor="allow_up" className="text-xs font-bold text-gray-700 dark:text-zinc-200 cursor-pointer">Permitir que o fotógrafo anexe previews/arquivos de fotos em tempo real?</label>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t dark:border-zinc-800">
                        <button type="submit" className="px-4 py-2.5 bg-[var(--color-primary)] text-white font-black text-xs rounded-xl shadow-xs">Criar e Gerar Link Único</button>
                      </div>
                    </form>
                  )}

                  {/* ACTIVE PHOTO CHECKLISTS SECTOR */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-xs uppercase text-orange-550 block font-mono">Listagem de Checklists Geradas para este Evento</h3>
                    
                    <div className="space-y-3">
                      {photoChecklists.filter(c => c.eventId === selectedEvent.id).map((chk) => (
                        <div 
                          key={chk.id}
                          className="p-4 bg-gray-50/70 dark:bg-zinc-900 border dark:border-zinc-850 rounded-2xl space-y-4 animate-scale-up"
                        >
                          {/* Top checklist line */}
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-black text-gray-850 dark:text-zinc-50 text-sm leading-tight">{chk.title}</h4>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono ${chk.submitted ? "bg-emerald-500/10 text-emerald-600" : "bg-gray-150 dark:bg-zinc-800 text-gray-400"}`}>
                                  {chk.submitted ? "Respondido" : "Não Iniciado"}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-mono uppercase block mt-1">ID Único: {chk.id}</span>
                            </div>

                            <div className="flex gap-2">
                              {/* Copy Link Button */}
                              <button
                                type="button"
                                onClick={() => handleCopyLink(chk.id)}
                                className={`px-3 py-1.5 rounded-xl font-bold font-mono text-[10px] transition-all flex items-center gap-1.5 cursor-pointer border ${
                                  copiedChecklistId === chk.id
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-600 dark:bg-emerald-950/20"
                                    : "bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-orange-550 border-gray-150 dark:border-zinc-700"
                                }`}
                              >
                                {copiedChecklistId === chk.id ? (
                                  <>✔️ LINK COPIADO!</>
                                ) : (
                                  <>🔗 COPIAR LINK PÚBLICO</>
                                )}
                              </button>

                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={() => handleDeletePhotoChecklist(chk.id)}
                                className="p-1.5 text-red-500 hover:text-red-700 bg-white hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-750 rounded-xl transition-all border dark:border-zinc-700 cursor-pointer"
                                title="Excluir checklist"
                              >
                                <Trash size={13} />
                              </button>
                            </div>
                          </div>

                          {/* SUBMITTED RESPONSES COLLAPSIBLE PREVIEW */}
                          {chk.submitted ? (
                            <div className="p-4 bg-white dark:bg-zinc-950 rounded-xl border dark:border-zinc-900 space-y-4 text-xs">
                              {/* Professional profile summary */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-b dark:border-zinc-900 pb-3">
                                <div>
                                  <span className="text-[9px] text-gray-400 block font-mono">Profissional Responder</span>
                                  <strong className="text-gray-900 dark:text-zinc-100">{chk.photographerName}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-gray-400 block font-mono">Telefone de Contato</span>
                                  <strong className="text-gray-900 dark:text-zinc-100">{chk.photographerPhone || "Não informado"}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-gray-400 block font-mono">Horário do Protocolo</span>
                                  <strong className="text-gray-900 dark:text-zinc-100 font-mono text-[10px]">
                                    {chk.submittedAt ? `${new Date(chk.submittedAt).toLocaleTimeString("pt-BR")} - ${new Date(chk.submittedAt).toLocaleDateString("pt-BR")}` : "--:-- - --/--/----"}
                                  </strong>
                                </div>
                              </div>

                              {/* Completed captures lists */}
                              <div>
                                <span className="text-[9px] text-orange-550 block font-mono uppercase font-bold tracking-wider mb-2">Capturas Executadas e Homologadas</span>
                                <div className="space-y-1.5 font-sans">
                                  {chk.completedItemTexts && chk.completedItemTexts.length > 0 ? (
                                    chk.completedItemTexts.map((item: string, i: number) => {
                                      const specAnswer = chk.additionalAnswers?.[item];
                                      return (
                                        <div key={i} className="flex flex-col p-2 bg-gray-50/50 dark:bg-zinc-900 border border-gray-150/40 dark:border-zinc-850 rounded-lg">
                                          <div className="flex items-center gap-2">
                                            <span className="text-emerald-500 font-bold shrink-0">✔</span>
                                            <span className="font-semibold text-gray-800 dark:text-zinc-200">{item}</span>
                                          </div>
                                          {specAnswer && (
                                            <span className="text-[10px] text-orange-500 font-mono italic pl-4.5 mt-0.5">↳ Resposta/Nota: "{specAnswer}"</span>
                                          )}
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <p className="text-xs text-gray-400 italic">Nenhum item do checklist foi marcado como concluído.</p>
                                  )}
                                </div>
                              </div>

                              {chk.observations && (
                                <div className="bg-orange-500/5 p-3 rounded-lg border dark:border-zinc-900 text-[11px] text-gray-500 italic">
                                  <strong>Observações de Campo do Fotógrafo:</strong> "{chk.observations}"
                                </div>
                              )}

                              {/* Lightbox / Preview photo gallery */}
                              {chk.photos && chk.photos.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="text-[9px] text-gray-400 block font-mono uppercase">Fotos Anexadas pelo Profissional</span>
                                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {chk.photos.map((ph: string, i: number) => (
                                      <div key={i} className="aspect-video relative rounded-lg overflow-hidden border dark:border-zinc-850">
                                        <img src={ph} alt={`Submission photo ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Signature display */}
                              {chk.signatureUrl && (
                                <div className="pt-2 border-t dark:border-zinc-900 flex items-center justify-between">
                                  <span className="text-[9px] text-gray-400 uppercase font-mono">Assinatura Certificadora:</span>
                                  <img src={chk.signatureUrl} alt="Photographer Signature proof" className="h-7 object-contain bg-white dark:bg-zinc-900 border rounded" referrerPolicy="no-referrer" />
                                </div>
                              )}

                            </div>
                          ) : (
                            <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border dark:border-zinc-900 text-xs text-center text-gray-400 font-mono">
                              Aguardando preenchimento externo de cobertura voluntária via link...
                            </div>
                          )}

                        </div>
                      ))}
                      {photoChecklists.filter(c => c.eventId === selectedEvent.id).length === 0 && (
                        <div className="p-8 text-center bg-gray-50 dark:bg-zinc-900 rounded-2xl border dark:border-zinc-850">
                          <p className="text-xs text-gray-400 italic">Código de acesso zerado. Crie um novo checklist fotográfico acima para gerar links de cobertura técnica do evento!</p>
                        </div>
                      )}
                    </div>
                  </div>

              </div>
            </div>
          )}

          {/* SECTION: CRITERIA ASSESSMENT FORM INSIDE FORNECEDORES SUBTAB */}
          {activeSubTab === 'fornecedores' && evaluationSupplierId && (
                // 2B: CRITERIA ASSESSMENT FORM
                <form onSubmit={(e) => handleSubmitEvaluation(e, selectedEvent.id)} className="space-y-6">
                  <div className="flex items-center justify-between border-b dark:border-zinc-900 pb-3">
                    <div className="text-xs">
                      <span className="text-gray-400 uppercase font-mono block">Nova Avaliação Cadastral</span>
                      <strong className="text-sm text-[var(--color-primary)]">
                        {suppliers.find(s => s.id === evaluationSupplierId)?.tradeName}
                      </strong>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setEvaluationSupplierId(null)}
                      className="text-xs bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-xl font-bold border dark:border-zinc-805 cursor-pointer"
                    >
                      Mudar Fornecedor
                    </button>
                  </div>

                  {/* Criteria Toggles */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest font-mono">Checklist e Critérios Básicos de Atendimento (Sim/Não)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Grid Row 1 */}
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-zinc-900/40 rounded-xl border dark:border-zinc-850">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Equipe Completa?</span>
                        <input type="checkbox" checked={evalTeamComplete} onChange={(e) => setEvalTeamComplete(e.target.checked)} className="accent-[var(--color-primary)] h-4 w-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-zinc-900/40 rounded-xl border dark:border-zinc-850">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Chegou no Horário Estabelecido?</span>
                        <input type="checkbox" checked={evalOnTime} onChange={(e) => setEvalOnTime(e.target.checked)} className="accent-[var(--color-primary)] h-4 w-4" />
                      </div>

                      {/* Grid Row 2 */}
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-zinc-900/40 rounded-xl border dark:border-zinc-850">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Uniforme Completo em Equipe?</span>
                        <input type="checkbox" checked={evalFullUniform} onChange={(e) => setEvalFullUniform(e.target.checked)} className="accent-[var(--color-primary)] h-4 w-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-zinc-900/40 rounded-xl border dark:border-zinc-850">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Uniforme em Ótimo Estado de Conservação?</span>
                        <input type="checkbox" checked={evalUniformGood} onChange={(e) => setEvalUniformGood(e.target.checked)} className="accent-[var(--color-primary)] h-4 w-4" />
                      </div>

                      {/* Grid Row 3 */}
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-zinc-900/40 rounded-xl border dark:border-zinc-850">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Calçado Equipado e Adequado?</span>
                        <input type="checkbox" checked={evalSuitableFootwear} onChange={(e) => setEvalSuitableFootwear(e.target.checked)} className="accent-[var(--color-primary)] h-4 w-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-zinc-900/40 rounded-xl border dark:border-zinc-850">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Higiene Corporal e Apresentação Limpa?</span>
                        <input type="checkbox" checked={evalCleanPres} onChange={(e) => setEvalCleanPres(e.target.checked)} className="accent-[var(--color-primary)] h-4 w-4" />
                      </div>

                      {/* Grid Row 4 */}
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-zinc-900/40 rounded-xl border dark:border-zinc-850">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Postura Profissional e de Respeito?</span>
                        <input type="checkbox" checked={evalPosture} onChange={(e) => setEvalPosture(e.target.checked)} className="accent-[var(--color-primary)] h-4 w-4" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-zinc-900/40 rounded-xl border dark:border-zinc-850">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Proatividade Operacional?</span>
                        <input type="checkbox" checked={evalProactive} onChange={(e) => setEvalProactive(e.target.checked)} className="accent-[var(--color-primary)] h-4 w-4" />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-zinc-900/40 rounded-xl border dark:border-zinc-850 md:col-span-2">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Domínio e Conhecimento Técnico da Função Alocada?</span>
                        <input type="checkbox" checked={evalKnowsFunc} onChange={(e) => setEvalKnowsFunc(e.target.checked)} className="accent-[var(--color-primary)] h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Status do Fornecedor e Assinatura */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t dark:border-zinc-900">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Status Final (Calculado Automaticamente)</label>
                      <div className={`p-2.5 rounded-xl border font-bold text-xs flex items-center gap-1 bg-white dark:bg-zinc-950 ${evalStatus === "Aprovado" ? "border-emerald-500 text-emerald-600" : evalStatus === "Parcial" ? "border-amber-500 text-amber-600" : "border-red-500 text-red-600"}`}>
                        <Shield size={14} />
                        <span>Status Proposto: {evalStatus} {evalStatus === "Aprovado" ? "(Recomendação Excelente)" : evalStatus === "Parcial" ? "(Exige Melhorias)" : "(Recusa Recomendada)"}</span>
                      </div>
                    </div>

                    {/* DRAWN INTERACTIVE SIGNATURE */}
                    <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                      <SignatureCanvas
                        onSave={(url) => setEvalSignatureUrl(url)}
                        label="Sua Assinatura Manual (Desehar com mouse/dedo) *"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Relbato de Ocorrências e Notas Técnicas</label>
                      <textarea
                        rows={2}
                        placeholder="Registre apontamentos, desvios de postura ou observações de melhoria..."
                        className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-805 rounded-xl text-xs focus:outline-none resize-none"
                        value={evalNoNotes}
                        onChange={(e) => setEvalNoNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEvaluationSupplierId(null)}
                      className="text-xs bg-gray-150 hover:bg-gray-200 dark:bg-zinc-900 text-gray-650 px-4 py-2.5 rounded-xl font-bold font-mono cursor-pointer"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={!evalSignatureUrl}
                      className={`text-xs px-5 py-2.5 rounded-xl font-bold shadow-xs ${evalSignatureUrl ? 'bg-[var(--color-primary)] text-white hover:opacity-95 cursor-pointer' : 'bg-gray-250 text-gray-400 cursor-not-allowed border dark:border-zinc-850'}`}
                    >
                      Salvar Avaliação & Encerrar Checklist
                    </button>
                  </div>
                </form>
              )}

          {/* Subtab 3: ORÇAMENTO PLANILHA */}
          {activeSubTab === 'orcamento' && (
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-850 select-none animate-scale-up">
              <EventBudget eventId={selectedEvent.id} />
            </div>
          )}

          {/* Subtab 4: RELATÓRIOS DO EVENTO (PRÉ, PÓS, VISITA TÉCNICA) */}
          {activeSubTab === 'relatorios' && (
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-850 animate-scale-up">
              <EventReports eventId={selectedEvent.id} />
            </div>
          )}

          {/* Subtab 5: Photos Gallery */}
          {activeSubTab === 'fotos' && (
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-850 space-y-6">
              <div className="flex items-center justify-between border-b dark:border-zinc-900 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-gray-805 dark:text-zinc-100">Galeria Operacional do Evento</h3>
                  <p className="text-xs text-gray-400">Mídia e registros fotográficos segregados por categoria de evidência.</p>
                </div>
                
                <button
                  onClick={() => addEventPhoto({
                    eventId: selectedEvent.id,
                    category: "Montagem",
                    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500"
                  })}
                  className="bg-[var(--color-primary)] text-white hover:opacity-90 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Camera size={14} /> Registrar Foto de Teste
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {eventPhotos.filter(p => p.eventId === selectedEvent.id).map(photo => (
                  <div key={photo.id} className="group relative rounded-2xl overflow-hidden border dark:border-zinc-850 aspect-video bg-gray-100 dark:bg-zinc-900 shadow-3xs">
                    <img src={photo.url} alt="Evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-[10px] text-white">
                      <span className="font-bold uppercase font-mono bg-orange-500/90 w-max px-1.5 rounded mb-1">{photo.category}</span>
                      <span>Enviado às {photo.createdAt ? new Date(photo.createdAt).toLocaleTimeString() : "--:--"}</span>
                    </div>
                    <button
                      onClick={() => deleteEventPhoto(photo.id)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 rounded-full text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtab 6: Comunicação (Chat) */}
          {activeSubTab === 'chat' && (
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-850 grid grid-cols-1 gap-4 max-h-[500px] flex flex-col">
              <div className="border-b dark:border-zinc-900 pb-2">
                <strong className="text-sm text-gray-805 dark:text-zinc-100">Célula Integrada de Mensageria</strong>
                <p className="text-[10px] text-gray-400">Envie recomendações rápidas de posicionamento e briefings urgentes.</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 min-h-[250px] p-2 bg-gray-50/30 dark:bg-zinc-900/10 rounded-2xl max-h-[300px]">
                {eventMessages.filter(m => m.eventId === selectedEvent.id).map(msg => {
                  const isMe = msg.senderName === currentUser.name;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 max-w-sm rounded-2xl text-xs space-y-1 shadow-3xs ${isMe ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-zinc-200'}`}>
                        <div className="flex justify-between items-center text-[8px] font-bold font-mono opacity-80 gap-4">
                          <span>{msg.senderName}</span>
                          <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}</span>
                        </div>
                        <p className="font-medium leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Instrua ou esclareça sobre a tarefa..."
                  className="flex-1 px-3 py-2 border dark:border-zinc-850 rounded-xl bg-gray-50 dark:bg-zinc-900 focus:outline-none text-xs"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && chatMessage.trim()) {
                      addEventMessage({
                        eventId: selectedEvent.id,
                        senderName: currentUser.name,
                        text: chatMessage.trim()
                      });
                      setChatMessage("");
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (!chatMessage.trim()) return;
                    addEventMessage({
                      eventId: selectedEvent.id,
                      senderName: currentUser.name,
                      text: chatMessage.trim()
                    });
                    setChatMessage("");
                  }}
                  className="bg-[var(--color-primary)] text-white hover:opacity-95 p-2 px-3.5 rounded-xl cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Subtab 7: Ocorrências */}
          {activeSubTab === 'ocorrencias' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-850 space-y-4">
                  <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">Ocorrências Atribuídas ao Evento</h3>
                  
                  {occurrences.filter(o => o.eventId === selectedEvent.id).length === 0 ? (
                    <p className="text-xs text-gray-500">Parabéns! Nenhuma intercorrência ativa registrada.</p>
                  ) : (
                    <div className="space-y-4">
                      {occurrences.filter(o => o.eventId === selectedEvent.id).map(occ => {
                        const sup = suppliers.find(s => s.id === occ.supplierId);
                        
                        return (
                          <div 
                            key={occ.id} 
                            className="p-4 bg-gray-50/80 dark:bg-zinc-900 border dark:border-zinc-850 rounded-2xl space-y-3 relative"
                          >
                            <span className="absolute top-4 right-4 text-[9px] uppercase tracking-wider font-bold font-mono px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400">
                              {occ.priority}
                            </span>

                            <div className="space-y-1">
                              <span className="text-[10px] bg-gray-200 dark:bg-gray-850 px-2 py-0.5 rounded font-mono font-bold text-gray-500">
                                {occ.category}
                              </span>
                              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-2">{occ.title}</h4>
                              <p className="text-xs text-gray-650 dark:text-gray-450 mt-1">{occ.description}</p>
                            </div>

                            {sup && (
                              <div className="bg-white dark:bg-zinc-950 p-2 rounded-xl border dark:border-zinc-900 text-[10px]">
                                <span className="text-gray-400 uppercase tracking-widest block font-mono text-[8px]">Fornecedor Envolvido</span>
                                <strong className="text-gray-700 dark:text-zinc-300 font-bold">{sup.tradeName}</strong>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono border-t pt-2 dark:border-gray-800">
                              <span>Registrado por: <strong>{occ.responsible}</strong></span>
                              <span>Data: {occ.createdAt ? new Date(occ.createdAt).toLocaleDateString() : "--/--/----"}</span>
                            </div>

                            <div className="flex gap-3 justify-end pt-2 border-t dark:border-gray-850">
                              <button 
                                onClick={() => handleStartEditOcc(occ)}
                                className="text-[10px] text-orange-550 font-bold hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <Edit size={10} /> Editar
                              </button>
                              <button 
                                onClick={() => {
                                  if (window.confirm("Deseja realmente excluir esta ocorrência?")) {
                                    deleteOccurrence(occ.id);
                                  }
                                }}
                                className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <Trash size={10} /> Excluir
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-850 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 font-sans">
                        {editingOcc ? "📝 Editar Ocorrência" : "Cadastrar Nova Ocorrência"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {editingOcc ? "Altere as informações registradas abaixo." : "Identificou um problema ou falha? Registre imediatamente."}
                      </p>
                    </div>
                    {editingOcc && (
                      <button
                        onClick={() => {
                          setEditingOcc(null);
                          setNewOccTitle("");
                          setNewOccDesc("");
                          setNewOccSupplierId("");
                        }}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 dark:bg-zinc-900 border dark:border-zinc-800 p-1 px-2 rounded-lg font-bold uppercase text-gray-500 font-mono"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-405 mb-1">Título Resumido *</label>
                      <input
                        type="text"
                        placeholder="Ex: Vazamento no banheiro químico"
                        className="w-full p-2 border dark:border-zinc-850 rounded-xl bg-gray-50 dark:bg-zinc-900 text-xs focus:outline-none"
                        value={newOccTitle}
                        onChange={(e) => setNewOccTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-405 mb-1">Prioridade</label>
                      <select
                        className="w-full p-2 border dark:border-zinc-850 rounded-xl bg-gray-50 dark:bg-zinc-900 text-xs focus:outline-none text-gray-750"
                        value={newOccPriority}
                        onChange={(e) => setNewOccPriority(e.target.value as any)}
                      >
                        <option value="Baixa">Baixa</option>
                        <option value="Media">Média</option>
                        <option value="Alta">Alta</option>
                        <option value="Critica">Crítica (Interrompe operação)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-405 mb-1">Categoria</label>
                      <select
                        className="w-full p-2 border dark:border-zinc-850 rounded-xl bg-gray-50 dark:bg-zinc-900 text-xs focus:outline-none text-gray-750"
                        value={newOccCategory}
                        onChange={(e) => setNewOccCategory(e.target.value as any)}
                      >
                        <option value="Atraso">Atraso</option>
                        <option value="Falha Eletrica">Falha Elétrica</option>
                        <option value="Equipe Incompleta">Equipe Incompleta</option>
                        <option value="Acidente">Acidente</option>
                        <option value="Prob. Estrutural">Problema Estrutural</option>
                        <option value="Fornecedor Ausente">Fornecedor Ausente</option>
                        <option value="Falha Comunicação">Falha de Comunicação</option>
                        <option value="Outros">Outras</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-450 mb-1">Fornecedor Relacionado</label>
                      <select
                        className="w-full p-2 border dark:border-zinc-850 rounded-xl bg-gray-50 dark:bg-zinc-900 text-xs focus:outline-none text-gray-750 animate-fade-in"
                        value={newOccSupplierId}
                        onChange={(e) => setNewOccSupplierId(e.target.value)}
                      >
                        <option value="">Nenhum</option>
                        {suppliers.map(s => (
                          <option key={s.id} value={s.id}>{s.tradeName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-450 mb-1">Descrição Detalhada *</label>
                      <textarea
                        rows={3}
                        placeholder="Descreva minuciosamente o ocorrido em campo..."
                        className="w-full p-2 border dark:border-zinc-850 rounded-xl bg-gray-50 dark:bg-zinc-900 text-xs focus:outline-none resize-none"
                        value={newOccDesc}
                        onChange={(e) => setNewOccDesc(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (!newOccTitle || !newOccDesc) return;
                        if (editingOcc) {
                          updateOccurrence(editingOcc.id, {
                            title: newOccTitle,
                            priority: newOccPriority,
                            category: newOccCategory,
                            description: newOccDesc,
                            supplierId: newOccSupplierId || undefined,
                          });
                        } else {
                          addOccurrence({
                            title: newOccTitle,
                            priority: newOccPriority,
                            category: newOccCategory,
                            description: newOccDesc,
                            responsible: currentUser.name,
                            supplierId: newOccSupplierId || undefined,
                            eventId: selectedEvent.id,
                            photo: undefined
                          });
                        }
                        setNewOccTitle("");
                        setNewOccDesc("");
                        setNewOccSupplierId("");
                        setEditingOcc(null);
                      }}
                      className="w-full py-2 bg-[var(--color-primary)] text-white hover:opacity-95 font-bold rounded-xl shadow-xs cursor-pointer text-center"
                    >
                      {editingOcc ? "Salvar Alterações" : "Registrar Ocorrência"}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* QUICK CHECK-IN OBSERVATION BOX / DIALOG */}
      {selectedQuickAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-55">
          <div className="bg-white dark:bg-zinc-905 max-w-md w-full p-6 rounded-3xl border dark:border-zinc-800 shadow-xl space-y-4 animate-scale-up">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl">{selectedQuickAction.icon}</span>
              <div>
                <span className="text-[10px] font-black uppercase text-orange-550 block font-mono">Check-in Rápido</span>
                <strong className="text-md text-[#1F2937] dark:text-white">{selectedQuickAction.label}</strong>
              </div>
            </div>

            <p className="text-xs text-gray-500">{selectedQuickAction.desc}</p>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono">Observação Adicional / Detalhes (Opcional)</label>
              <textarea
                rows={3}
                className="w-full p-2.5 bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-850 rounded-xl text-xs focus:outline-none resize-none"
                placeholder="Ex: Fornecedor chegou com 15 minutos de antecedência..."
                value={quickCheckInObservation}
                onChange={e => setQuickCheckInObservation(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-2 border-t dark:border-zinc-900 justify-end">
              <button
                onClick={() => setSelectedQuickAction(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-zinc-900 text-gray-655 font-bold rounded-xl text-xs font-mono cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmQuickCheckIn}
                className="px-5 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl text-xs uppercase cursor-pointer shadow-3xs"
              >
                Gravar Registro
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default EventsView;
