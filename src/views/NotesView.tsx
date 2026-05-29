import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Search, FileText, Check, Trash, Edit } from "lucide-react";

export const NotesView: React.FC = () => {
  const { currentUser } = useApp();

  // Simulated Notes database local storage
  const [notes, setNotes] = useState<any[]>(() => {
    const saved = localStorage.getItem(`gs_notes_${currentUser.id}`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "note01",
        title: "Ligar para fornecedor de geradores",
        content: "Aferir se a voltagem enviada será de fato 220v trifásica para som do palco.",
        color: "bg-amber-100 text-amber-900 border-amber-300",
        date: "2026-05-28"
      },
      {
        id: "note02",
        title: "Cobrar planilha de controle de diárias do DP",
        content: "Leandra Soares ficou de conferir os freelancers que fizeram hora extra na montagem.",
        color: "bg-purple-100 text-purple-900 border-purple-300",
        date: "2026-05-27"
      }
    ];
  });

  const saveToLocal = (newNotes: any[]) => {
    setNotes(newNotes);
    localStorage.setItem(`gs_notes_${currentUser.id}`, JSON.stringify(newNotes));
  };

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteColor, setNoteColor] = useState("bg-amber-100 text-amber-900 border-amber-300");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;

    const newN = {
      id: "note_" + Date.now(),
      title: noteTitle,
      content: noteContent,
      color: noteColor,
      date: new Date().toISOString().split("T")[0]
    };

    const updated = [newN, ...notes];
    saveToLocal(updated);

    setNoteTitle("");
    setNoteContent("");
  };

  const handleDelete = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    saveToLocal(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER DESCRIPTION */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Meu Bloco de Anotações Pessoais</h2>
        <p className="text-xs text-gray-500 font-sans">Rascunhos e lembretes rápidos autoconsolidados de forma isolada para cada operador de campo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* CONTAINER 1: NOTE QUICK FORM ADDER */}
        <div className="md:col-span-1 bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4 shadow-xs text-xs">
          <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-white">Criar Anotação Rápida</h3>

          <form onSubmit={handleAddNote} className="space-y-3 font-sans">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Título do lembrete *</label>
              <input type="text" required placeholder="Ligar para ambulâncias..." value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none" />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Conteúdo do lembrete *</label>
              <textarea required placeholder="Detalhes táticos..." value={noteContent} onChange={(e) => setNoteContent(e.target.value)} rows={3} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none" />
            </div>

            {/* Color selection options */}
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Card Accent Style</label>
              <div className="flex gap-2">
                {[
                  { class: "bg-amber-100 text-amber-900 border-amber-300", label: "Amarelo" },
                  { class: "bg-purple-100 text-purple-900 border-purple-300", label: "Roxo" },
                  { class: "bg-sky-100 text-sky-900 border-sky-300", label: "Azul" },
                  { class: "bg-emerald-100 text-emerald-900 border-emerald-300", label: "Verde" }
                ].map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setNoteColor(c.class)}
                    className={`w-5 h-5 rounded-full border border-slate-400/25 ${c.class.split(" ")[0]}`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-xs"
            >
              Gravar Lembrete
            </button>
          </form>
        </div>

        {/* CONTAINER 2: NOTE LIST GRAPHIC */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notes.map((n) => (
            <div key={n.id} className={`p-5 rounded-3xl border flex flex-col justify-between space-y-3 shadow-xs ${n.color}`}>
              <div>
                <h4 className="font-extrabold text-sm tracking-tight leading-snug">{n.title}</h4>
                <p className="text-xs mt-1.5 leading-relaxed font-sans">{n.content}</p>
              </div>

              <div className="pt-2 border-t border-slate-900/10 flex justify-between items-center text-[10px] font-mono opacity-80">
                <span>Ref: {n.date}</span>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-1 hover:bg-black/5 rounded text-red-700"
                  title="Excluir lembrete"
                >
                  <Trash size={12} />
                </button>
              </div>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="sm:col-span-2 text-center py-20 bg-white dark:bg-gray-950 rounded-3xl border border-dashed dark:border-gray-900 text-xs text-gray-400 font-sans">
              Nenhum rascunho arquivado. Adicione um novo lembrete tático ao lado!
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
