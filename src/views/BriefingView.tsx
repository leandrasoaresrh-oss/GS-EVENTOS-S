import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Search, Calendar, Award, ShieldAlert, Sparkles, AlertCircle, Edit, Trash } from "lucide-react";

export const BriefingView: React.FC = () => {
  const { currentUser } = useApp();

  // Simulated Briefing DB local storage
  const [briefs, setBriefs] = useState<any[]>(() => {
    const saved = localStorage.getItem("gs_briefs_list");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "brief_1",
        title: "Briefing Geral Pré-Alinhamento Réveillon Copacabana 2027",
        event: "Réveillon Copacabana 2027",
        date: "2026-05-28 07:00:00",
        importance: "Critico",
        author: "Gustavo Soares",
        summary: "Alinhamento tático com as forças da Polícia Militar, bombeiros e equipes de saúde. Todos os postos operacionais devem abrir à zero hora do dia de entrada.",
        checklist: [
          "Verificar chegada dos postos médicos às 19:00",
          "Testar canal de rádio principal com coordenação",
          "Distribuir credenciais do backstage para os fotógrafos",
          "Aferir voltagem dos 4 geradores de apoio principal"
        ]
      },
      {
        id: "brief_2",
        title: "Vistoria Preventiva de Acessibilidade",
        event: "All-inclusive Lounge 2026",
        date: "2026-05-27 10:15:00",
        importance: "Alto",
        author: "Leandra Kaisa",
        summary: "Varredura prévia de calçadas, rampas e elevadores de serviço. O fornecedor de montagem do Haras precisa ajustar o fechamento lateral das tendas.",
        checklist: [
          "Confirmar rampa de acesso dos palcos principais",
          "Checar placas de sinalização tátil de segurança",
          "Liberar credenciais prioritárias de estacionamento"
        ]
      }
    ];
  });

  const saveBriefsToLocal = (newBriefs: any[]) => {
    setBriefs(newBriefs);
    localStorage.setItem("gs_briefs_list", JSON.stringify(newBriefs));
  };

  // State
  const [isCreating, setIsCreating] = useState(false);
  const [briefTitle, setBriefTitle] = useState("");
  const [briefSummary, setBriefSummary] = useState("");
  const [briefEvent, setBriefEvent] = useState("");
  const [briefImportance, setBriefImportance] = useState("Critico");
  const [checkItemsStr, setCheckItemsStr] = useState("");

  const handleCreateBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefTitle || !briefSummary) return;

    const listItems = checkItemsStr.split("\n").filter(i => i.trim() !== "");

    const newBrief = {
      id: "brief_" + Date.now(),
      title: briefTitle,
      summary: briefSummary,
      event: briefEvent || "Geral",
      date: new Date().toISOString().replace("T", " ").substring(0, 19),
      importance: briefImportance,
      author: currentUser.name,
      checklist: listItems
    };

    const updated = [newBrief, ...briefs];
    saveBriefsToLocal(updated);

    // Reset Form
    setIsCreating(false);
    setBriefTitle("");
    setBriefSummary("");
    setBriefEvent("");
    setCheckItemsStr("");
  };

  const handleDelete = (id: string) => {
    const updated = briefs.filter(b => b.id !== id);
    saveBriefsToLocal(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Central de Briefing & Alinhamentos</h2>
          <p className="text-xs text-gray-500 font-sans">Informativos táticos cruciais para alinhamento diário da equipe geral de campo.</p>
        </div>
        
        {currentUser.profile === "Admin" && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-[var(--color-primary)] text-white hover:opacity-90 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={16} /> Emitir Novo Briefing
          </button>
        )}
      </div>

      {/* FORM MODAL PANEL */}
      {isCreating && (
        <form onSubmit={handleCreateBrief} className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4 text-xs font-sans shadow-sm">
          <h3 className="font-extrabold text-sm text-gray-850 dark:text-gray-250">Lançamento de Comunicação Tática (Briefing)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Título do Briefing *</label>
              <input type="text" required placeholder="Ex: Orientações de Acesso Zona Sul" value={briefTitle} onChange={(e) => setBriefTitle(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl" />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Evento Escopo</label>
              <input type="text" placeholder="Ex: Réveillon Copacabana" value={briefEvent} onChange={(e) => setBriefEvent(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl" />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nível de Severidade</label>
              <select value={briefImportance} onChange={(e) => setBriefImportance(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-gray-750 focus:outline-none">
                <option value="Regular">Informativo Geral</option>
                <option value="Alto">Atenção Crítica</option>
                <option value="Critico">Imediato / Campo</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Sumário do Briefing / Informações *</label>
              <textarea required placeholder="Lembretes táticos operacionais..." value={briefSummary} onChange={(e) => setBriefSummary(e.target.value)} rows={3} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-xs focus:outline-none" />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Diretivas Checklist Rápidas (Uma por linha)</label>
              <textarea placeholder="Ex: Testar gerador de CO2&#13;Checar credenciamento do DP" value={checkItemsStr} onChange={(e) => setCheckItemsStr(e.target.value)} rows={3} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-xs font-mono focus:outline-none" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t dark:border-gray-900">
            <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-xl font-bold font-mono">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-xs">Publicar Diretiva</button>
          </div>
        </form>
      )}

      {/* BRIEFING CARD LISTINGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {briefs.map((b) => (
          <div key={b.id} className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px]">
                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase font-mono ${b.importance === "Critico" ? "bg-red-100 text-red-700" : b.importance === "Alto" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"}`}>
                  {b.importance}
                </span>
                <span className="text-gray-400 font-mono">{b.date}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-gray-400 font-bold font-mono">Evento: {b.event}</span>
                <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-white leading-snug mt-1">{b.title}</h3>
              </div>

              <p className="text-xs text-gray-650 dark:text-gray-400 leading-relaxed font-sans">{b.summary}</p>

              {b.checklist?.length > 0 && (
                <div className="p-3.5 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border dark:border-gray-850 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest block">CHECKLIST DE CAMPO</span>
                  <div className="space-y-1 text-[11px] font-sans text-gray-600 dark:text-gray-300">
                    {b.checklist.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-[var(--color-primary)] text-xs">☉</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t dark:border-gray-900 flex justify-between items-center text-[10px] text-gray-400">
              <span className="font-semibold block truncate">Emitido por: {b.author}</span>
              
              {currentUser.profile === "Admin" && (
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1 hover:bg-red-50 text-red-500 rounded"
                >
                  <Trash size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
