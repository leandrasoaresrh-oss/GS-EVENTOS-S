import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Heart, Send, CheckCircle2, Shield, UserX, AlertCircle } from "lucide-react";

export const WellbeingView: React.FC = () => {
  const { currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'acolhimento' | 'pesquisa' | 'gestao'>('acolhimento');

  // Interactive feedback state
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [feelingScore, setFeelingScore] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Simulated feedbacks database list (somente visível para Admin ou DP/RH - pág 5, 102)
  const [feedbacks, setFeedbacks] = useState<any[]>(() => {
    const saved = localStorage.getItem("gs_wellbeing_feedbacks");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "fb_1",
        date: "2026-05-27 11:30",
        score: 4,
        isAnonymous: true,
        user: "Anônimo",
        text: "A carga de trabalho nas diárias estendidas de montagem está um pouco alta. Sugiro adicionar mais freelancers para os dias de desmontagem rápida.",
        resolved: false
      },
      {
        id: "fb_2",
        date: "2026-05-26 15:40",
        score: 5,
        isAnonymous: false,
        user: "Carlos Eduardo Silva",
        text: "Me senti super apoiado na última ocorrência de emergência que tratamos. Excelente suporte médico e material completo no posto.",
        resolved: true
      }
    ];
  });

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText) return;

    const newFeedback = {
      id: "fb_" + Date.now(),
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      score: feelingScore,
      isAnonymous,
      user: isAnonymous ? "Anônimo" : currentUser.name,
      text: feedbackText,
      resolved: false
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem("gs_wellbeing_feedbacks", JSON.stringify(updated));

    setIsSubmitted(true);
    setFeedbackText("");
  };

  const handleResolve = (id: string) => {
    const updated = feedbacks.map(f => f.id === id ? { ...f, resolved: true } : f);
    setFeedbacks(updated);
    localStorage.setItem("gs_wellbeing_feedbacks", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Canal de Acolhimento & Ouvidoria</h2>
          <p className="text-xs text-gray-500 font-sans">Espaço seguro para feedbacks de clima, acolhimento profissional de campo e escuta anônima direta.</p>
        </div>
      </div>

      {/* THREE TAB PANELS SELECTOR */}
      <div className="flex border-b dark:border-gray-900 text-xs font-bold gap-2 whitespace-nowrap overflow-x-auto">
        <button 
          onClick={() => { setActiveTab('acolhimento'); setIsSubmitted(false); }}
          className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'acolhimento' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
        >
          ❤️ Enviar Relato de Clima
        </button>
        
        {(currentUser.profile === "Admin" || currentUser.profile === "DP") && (
          <button 
            onClick={() => setActiveTab('gestao')}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'gestao' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
          >
            🔒 Painel de Escuta Ouvidoria ({feedbacks.length})
          </button>
        )}
      </div>

      {/* TAB ACOLHIMENTO FORM DESIGN */}
      {activeTab === 'acolhimento' && (
        <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6 text-xs font-sans shadow-xs">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 size={44} className="text-emerald-500 mx-auto" />
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">Seu relato foi enviado de forma segura!</h3>
              <p className="text-xs text-gray-400">Obrigado por nos ajudar a aperfeiçoar o ambiente de trabalho e gerência na empresa.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-2 text-xs text-[var(--color-primary)] font-black hover:underline"
              >
                Enviar outro feedback
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendFeedback} className="space-y-6">
              
              <div className="bg-orange-50/50 dark:bg-orange-950/20 p-4 border border-dashed rounded-2xl dark:border-orange-900/40 text-[10px] text-gray-500 flex items-start gap-2.5">
                <Shield className="text-[var(--color-primary)] shrink-0" size={16} />
                <p className="leading-relaxed">
                  <strong>POLÍTICA DE SIGILO TOTAL:</strong> A segurança mental de nossa equipe é prioridade absoluta. Este canal é monitorado e criptografado diretamente pelo setor de Recursos Humanos e DP. Você tem controle opcional se deseja se identificar ou enviar de forma 100% anônima.
                </p>
              </div>

              {/* Anonymous Slider options (Pág 23) */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono">Formato de Envio do Relato</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input 
                      type="radio" 
                      name="anon_opt" 
                      checked={isAnonymous} 
                      onChange={() => setIsAnonymous(true)} 
                      className="w-4 h-4 text-[var(--color-primary)] border-gray-300 rounded-full focus:ring-[var(--color-primary)]"
                    />
                    <span className="flex items-center gap-1"><UserX size={14} className="text-gray-400" /> Anônimo / Sigiloso</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input 
                      type="radio" 
                      name="anon_opt" 
                      checked={!isAnonymous} 
                      onChange={() => setIsAnonymous(false)} 
                      className="w-4 h-4 text-[var(--color-primary)] border-gray-300 rounded-full focus:ring-[var(--color-primary)]"
                    />
                    <span>Identificado ({currentUser.name})</span>
                  </label>
                </div>
              </div>

              {/* Slider scale feeling 1-5 */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono">Como você qualifica seu bem-estar / clima hoje? (Nota 1-5)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={feelingScore} 
                    onChange={(e) => setFeelingScore(parseInt(e.target.value))}
                    className="flex-1 accent-[var(--color-primary)]"
                  />
                  <span className="text-xl font-black text-[var(--color-primary)] font-mono">{feelingScore} / 5</span>
                </div>
                <div className="flex justify-between text-[9px] text-gray-400 uppercase font-mono font-bold">
                  <span>1. Exausto / Sob Pressão</span>
                  <span>3. Desafiador / Regular</span>
                  <span>5. Excelente / Produtivo</span>
                </div>
              </div>

              {/* Feedback Message */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono">Fale conosco / Sugestão / Relato operacional *</label>
                <textarea
                  required
                  placeholder="Seus comentários, preocupações com o clima em eventos, elogios, sugestões de escala de trabalho ou desabafos construtivos..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-2xl text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2 border-t dark:border-gray-900">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[var(--color-primary)] text-white hover:opacity-95 font-bold rounded-xl flex items-center gap-1 shadow-xs font-mono text-xs uppercase"
                >
                  <Send size={14} /> Enviar p/ Escuta Corporativa
                </button>
              </div>

            </form>
          )}
        </div>
      )}

      {/* TAB GESTAO / ESCUTA RH - RESTRICTED */}
      {activeTab === 'gestao' && (
        <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b dark:border-gray-900 text-xs font-bold text-gray-500 bg-gray-50/50 dark:bg-gray-900/10">
            Últimas ouvidorias cadastradas para tratamento de clima (Exclusivo DP/RH)
          </div>

          <div className="divide-y dark:divide-gray-900 text-xs font-sans">
            {feedbacks.map(fb => (
              <div key={fb.id} className="p-5 space-y-3 hover:bg-gray-50/50 dark:hover:bg-gray-900/10">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] bg-red-50/10 border dark:border-gray-850 px-2 py-0.5 rounded-full font-bold font-mono text-[var(--color-primary)] uppercase scale-95">
                        Nota Clima: {fb.score}/5
                      </span>
                      <span className="text-[10px] uppercase text-gray-400 font-mono">
                        Autor: {fb.isAnonymous ? "Anônimo (Protegido)" : fb.user}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{fb.date}</span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-sans">{fb.text}</p>

                <div className="pt-2 border-t dark:border-gray-900 flex justify-between items-center text-[10px]">
                  <span className={`px-2 py-0.5 rounded font-bold font-mono ${fb.resolved ? "bg-emerald-100 text-emerald-800" : "bg-amber-105 bg-amber-100 text-amber-800"}`}>
                    {fb.resolved ? "✓ Respondido e Mitigado de forma sigilosa pelo DP" : "☉ Em análise pelo RH"}
                  </span>

                  {!fb.resolved && (
                    <button
                      onClick={() => handleResolve(fb.id)}
                      className="text-[10px] font-bold text-[var(--color-primary)] hover:underline font-mono uppercase"
                    >
                      Acolher e Marcar Tratado
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
