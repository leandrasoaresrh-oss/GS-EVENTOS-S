import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Search, Calendar, FileText, CheckSquare, PlusCircle, Award, Sparkles, Trash } from "lucide-react";

export const MeetingsView: React.FC = () => {
  const { currentUser } = useApp();

  // Simulated Meeting corporate DB local storage
  const [meetings, setMeetings] = useState<any[]>(() => {
    const saved = localStorage.getItem("gs_meetings_list");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "mt_1",
        title: "Alinhamento de Infraestrutura Réveillon 2027",
        date: "2026-05-30",
        hour: "10:00",
        local: "Sala de Reunião Principal / Online Meet",
        chair: "Gustavo Soares",
        agenda: "Fechamento final do contrato de cabeamento e geração de energia. Verificação de pendências sanitárias das ambulâncias de emergência.",
        decisions: [
          "Aprovado reajuste de 5% no budget Master para infraestrutura de segurança",
          "Acionado o departamento pessoal para credenciamento extra de freelancers"
        ],
        completed: false
      },
      {
        id: "mt_2",
        title: "Apresentação de Resultados All-inclusive Lounge",
        date: "2026-05-25",
        hour: "15:30",
        local: "Escritório Rio Sul / Auditório",
        chair: "Carlos Eduardo Silva",
        agenda: "Demonстраção do faturamento bruto e lucros pós-evento. Apresentação do ranking de checklists respondidos pelos fornecedores.",
        decisions: [
          "Fornecedor de energia obteve nota 5 em conformidade e será homologado para os próximos anos",
          "Lançamento de premiação de desempenho para equipes de produção executiva"
        ],
        completed: true
      }
    ];
  });

  const saveToLocal = (updatedList: any[]) => {
    setMeetings(updatedList);
    localStorage.setItem("gs_meetings_list", JSON.stringify(updatedList));
  };

  // Form states - pág 22, 28
  const [isCreating, setIsCreating] = useState(false);
  const [mtTitle, setMtTitle] = useState("");
  const [mtDate, setMtDate] = useState("");
  const [mtHour, setMtHour] = useState("");
  const [mtLocal, setMtLocal] = useState("");
  const [mtAgenda, setMtAgenda] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mtTitle || !mtDate || !mtAgenda) return;

    const newM = {
      id: "mt_" + Date.now(),
      title: mtTitle,
      date: mtDate,
      hour: mtHour || "09:00",
      local: mtLocal || "Online Teams",
      chair: currentUser.name,
      agenda: mtAgenda,
      decisions: [],
      completed: false
    };

    const updated = [newM, ...meetings];
    saveToLocal(updated);

    // Reset Form
    setIsCreating(false);
    setMtTitle("");
    setMtDate("");
    setMtHour("");
    setMtLocal("");
    setMtAgenda("");
  };

  const handleDelete = (id: string) => {
    const updated = meetings.filter(m => m.id !== id);
    saveToLocal(updated);
  };

  const handleAddDecision = (meetingId: string, text: string) => {
    if (!text) return;
    const updated = meetings.map(m => {
      if (m.id === meetingId) {
        return {
          ...m,
          decisions: [...m.decisions, text]
        };
      }
      return m;
    });
    saveToLocal(updated);
  };

  const handleToggleComplete = (id: string) => {
    const updated = meetings.map(m => m.id === id ? { ...m, completed: !m.completed } : m);
    saveToLocal(updated);
  };

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.agenda.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Central de Reuniões & Atas</h2>
          <p className="text-xs text-gray-500 font-sans">Agendamento de conselhos corporativos, pautas estratégicas e monitoramento de atas decisórias de eventos.</p>
        </div>
        
        {currentUser.profile === "Admin" && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-[var(--color-primary)] text-white hover:opacity-90 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={16} /> Agendar Nova Reunião
          </button>
        )}
      </div>

      {/* FILTER SEARCH ROW */}
      <div className="flex bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Pesquise reuniões de conselho executivo ou pautas..."
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* CREATION DIALOG FORM */}
      {isCreating && (
        <form onSubmit={handleCreateMeeting} className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans shadow-sm">
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Pauta Principal / Reunião *</label>
            <input type="text" required placeholder="Ex: Acolhimento e Readequação de Clima" value={mtTitle} onChange={(e) => setMtTitle(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focues:outline-none" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Data Agendada *</label>
            <input type="date" required value={mtDate} onChange={(e) => setMtDate(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-gray-700 focus:outline-none" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Horário</label>
            <input type="time" value={mtHour} onChange={(e) => setMtHour(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-gray-700" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Localização (Físico ou Online)</label>
            <input type="text" placeholder="Ex: Google Meet - LINK" value={mtLocal} onChange={(e) => setMtLocal(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focues:outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Ordem do Dia / Agenda descritiva *</label>
            <input type="text" required placeholder="Preocupações com prazos de alvarás AVCB..." value={mtAgenda} onChange={(e) => setMtAgenda(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none" />
          </div>

          <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t dark:border-gray-900">
            <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-xl font-bold font-mono">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-xs">Marcar Reunião</button>
          </div>
        </form>
      )}

      {/* MEETINGS CARDS LISTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMeetings.map((mt) => {
          
          return (
            <div key={mt.id} className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4 flex flex-col justify-between shadow-xs">
              
              <div className="space-y-3.5 text-xs font-sans">
                
                {/* top tag status */}
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold font-mono uppercase ${mt.completed ? "bg-emerald-100 text-emerald-800 border-emerald-500/10" : "bg-blue-100 text-blue-800 border-blue-500/10"}`}>
                    {mt.completed ? "✓ Realizada & Ata Gerada" : "☉ Agendada"}
                  </span>
                  <span className="text-gray-400 font-mono italic">Presidente: {mt.chair}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-gray-400 font-bold font-mono block">Data: {mt.date} às {mt.hour}</span>
                  <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-white leading-snug mt-1">{mt.title}</h3>
                  <span className="text-[10px] text-[var(--color-primary)] font-mono block mt-1">Sala: {mt.local}</span>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border dark:border-gray-850 space-y-1.5 leading-relaxed">
                  <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest block">CONTEXTO & PAUTA</span>
                  <p className="text-gray-650 dark:text-gray-300 text-[11px]">{mt.agenda}</p>
                </div>

                {/* Decisions Ata List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest block">ATA DE DECISÕES DO CONSELHO</span>
                  <div className="space-y-1 text-[11px] text-gray-700 dark:text-gray-300">
                    {mt.decisions.map((dec: string, index: number) => (
                      <div key={index} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-emerald-505 text-emerald-500 font-bold">✓</span>
                        <span>{dec}</span>
                      </div>
                    ))}
                    {mt.decisions.length === 0 && (
                      <span className="text-[10px] text-gray-400 italic block">Pendente preenchimento pós-conselho.</span>
                    )}
                  </div>
                </div>

                {/* Quick Add Decision Input if Not Completed (Pág 21) */}
                {!mt.completed && (
                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder="Adicionar decisão oficial na ata... (clique Enter)"
                      className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddDecision(mt.id, e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>
                )}

              </div>

              {/* footer controls */}
              <div className="pt-3 border-t dark:border-gray-900 flex justify-between items-center text-[10px]">
                <button
                  onClick={() => handleToggleComplete(mt.id)}
                  className="font-black text-[var(--color-primary)] hover:underline font-mono uppercase"
                >
                  {mt.completed ? "Reabrir Pauta" : "Consolidar Reunião"}
                </button>

                {currentUser.profile === "Admin" && (
                  <button
                    onClick={() => handleDelete(mt.id)}
                    className="p-1 hover:bg-red-50 text-red-500 rounded"
                  >
                    <Trash size={12} />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
