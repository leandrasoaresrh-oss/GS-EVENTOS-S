import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Search, FileText, CheckCircle2, ChevronRight, Eye, ClipboardList, Trash, ArrowRight, Save, Image, Signature } from "lucide-react";

export const FormsView: React.FC = () => {
  const { events, currentUser, users } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'preencher' | 'construtor' | 'respostas'>('preencher');
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyMine, setShowOnlyMine] = useState(currentUser.profile === "Operacional");
  const [exportSuccess, setExportSuccess] = useState(false);

  // Form builder state (Apenas para Admin - pág 23)
  const [formName, setFormName] = useState("");
  const [targetEvent, setTargetEvent] = useState("");
  const [formResponsible, setFormResponsible] = useState("");
  const [fields, setFields] = useState<any[]>([
    { id: "f_1", label: "Nome do Vistoriador", type: "text", required: true },
    { id: "f_2", label: "Horário de Entrada Equipamentos", type: "text", required: true },
    { id: "f_3", label: "Anexar Foto do Crachá", type: "file", required: true },
    { id: "f_4", label: "Assinatura do Responsável", type: "signature", required: true }
  ]);

  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");

  // Filled Forms DB local storage simulated
  const [builtForms, setBuiltForms] = useState<any[]>(() => {
    const saved = localStorage.getItem("gs_forms_list");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "form_standard_1",
        name: "Vistoria Prévia de Brigada de Incêndio",
        event: "Haras Santa Clara",
        sector: "Segurança",
        fields: [
          { id: "b_1", label: "Extintores de CO2 Desimpedidos", type: "checkbox", required: true },
          { id: "b_2", label: "Quantidade de Brigadistas Presentes", type: "number", required: true },
          { id: "b_3", label: "Foto do Posto Médico", type: "file", required: true },
          { id: "b_4", label: "Assinatura do Médico Chefe", type: "signature", required: true }
        ],
        submissionsCount: 14,
        responsible: "Carlos Eduardo Silva"
      },
      {
        id: "form_standard_2",
        name: "Checklist de Entrega de Equipamentos",
        event: "All-inclusive Lounge 2026",
        sector: "Produção",
        fields: [
          { id: "e_1", label: "Entrada Cabeamento Gerador", type: "checkbox", required: true },
          { id: "e_2", label: "Voltagem aferida no Quadro", type: "text", required: true },
          { id: "e_3", label: "Documento Assinado em PDF", type: "file", required: false }
        ],
        submissionsCount: 8,
        responsible: "Carlos Eduardo Silva"
      }
    ];
  });

  const [formSubmissions, setFormSubmissions] = useState<any[]>(() => {
    const saved = localStorage.getItem("gs_forms_submissions");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "sub_1",
        formName: "Vistoria Prévia de Brigada de Incêndio",
        event: "Haras Santa Clara",
        submittedBy: "Carlos Eduardo Silva",
        date: "2026-05-27 16:40:11",
        values: {
          "Extintores de CO2 Desimpedidos": "Sim",
          "Quantidade de Brigadistas Presentes": "12",
          "Foto do Posto Médico": "Simulado_Posto_Medico.jpg",
          "Assinatura do Médico Chefe": "Carlos_E_S_Assinado"
        }
      }
    ];
  });

  const saveFormsToLocal = (updatedList: any[]) => {
    setBuiltForms(updatedList);
    localStorage.setItem("gs_forms_list", JSON.stringify(updatedList));
  };

  const saveSubmissionsToLocal = (updatedSub: any[]) => {
    setFormSubmissions(updatedSub);
    localStorage.setItem("gs_forms_submissions", JSON.stringify(updatedSub));
  };

  const [fillingForm, setFillingForm] = useState<any | null>(null);
  const [fillingAnswers, setFillingAnswers] = useState<Record<string, string>>({});

  const handleAddField = () => {
    if (!newFieldLabel) return;
    const newF = {
      id: "f_" + Date.now(),
      label: newFieldLabel,
      type: newFieldType,
      required: true
    };
    setFields([...fields, newF]);
    setNewFieldLabel("");
  };

  const handleCreateFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    const newForm = {
      id: "form_" + Date.now(),
      name: formName,
      event: targetEvent || "Geral",
      sector: "Produção",
      fields,
      submissionsCount: 0,
      responsible: formResponsible || ""
    };

    const updated = [newForm, ...builtForms];
    saveFormsToLocal(updated);

    setFormName("");
    setFormResponsible("");
    setFields([]);
    setActiveSubTab('preencher');
  };

  const handleOpenFill = (frm: any) => {
    setFillingForm(frm);
    setFillingAnswers({});
  };

  const handleSaveFillForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fillingForm) return;

    const newSub = {
      id: "sub_" + Date.now(),
      formName: fillingForm.name,
      event: fillingForm.event,
      submittedBy: currentUser.name,
      date: new Date().toISOString().replace("T", " ").substring(0, 19),
      values: fillingAnswers
    };

    const updatedSub = [newSub, ...formSubmissions];
    saveSubmissionsToLocal(updatedSub);

    // Increment submission count
    const updatedForms = builtForms.map(f => f.id === fillingForm.id ? { ...f, submissionsCount: f.submissionsCount + 1 } : f);
    saveFormsToLocal(updatedForms);

    setFillingForm(null);
    setFillingAnswers({});
    setActiveSubTab('respostas');
  };

  const handleDeleteFormDoc = (id: string) => {
    const updated = builtForms.filter(f => f.id !== id);
    saveFormsToLocal(updated);
  };

  const filteredForms = builtForms.filter(f => {
    const matchesQuery = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.event.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (showOnlyMine) {
      return matchesQuery && (f.responsible === currentUser.name || !f.responsible);
    }
    return matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER DESCRIPTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Construtor & Formulários Inteligente</h2>
          <p className="text-xs text-gray-500">Formulários customizados para vistorias em campo com suporte a foto e assinatura operacionais.</p>
        </div>
      </div>

      {/* FILTER SEARCH ROW & SUBTABS */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex border-b md:border-b-0 md:border-r dark:border-gray-900 pr-0 md:pr-4 md:mr-2 text-xs font-bold gap-1 whitespace-nowrap overflow-x-auto">
          <button 
            onClick={() => { setActiveSubTab('preencher'); setFillingForm(null); }}
            className={`px-4 py-2 rounded-xl transition-all ${activeSubTab === 'preencher' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
          >
            📋 Formulários Disponíveis
          </button>
          
          {(currentUser.profile === "Admin" || currentUser.profile === "DP") && (
            <button 
              onClick={() => { setActiveSubTab('construtor'); setFillingForm(null); }}
              className={`px-4 py-2 rounded-xl transition-all ${activeSubTab === 'construtor' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
            >
              🛠 Construtor Formulários
            </button>
          )}

          <button 
            onClick={() => { setActiveSubTab('respostas'); setFillingForm(null); }}
            className={`px-4 py-2 rounded-xl transition-all ${activeSubTab === 'respostas' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
          >
            📊 Respostas Enviadas ({formSubmissions.length})
          </button>
        </div>

        <div className="flex-1 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Pesquise por nome do formulário..."
              className="w-full pl-10 pr-4 py-2 border dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 text-xs shrink-0 select-none bg-gray-50 dark:bg-zinc-900/50 p-2 rounded-xl border border-gray-150/50 dark:border-zinc-800">
            <input
              type="checkbox"
              id="forms-show-mine"
              checked={showOnlyMine}
              onChange={(e) => setShowOnlyMine(e.target.checked)}
              className="w-4 h-4 text-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)] cursor-pointer text-orange-600 focus:outline-none"
            />
            <label htmlFor="forms-show-mine" className="font-bold text-gray-650 dark:text-zinc-300 cursor-pointer">
              Atribuídos a Mim ({currentUser.name})
            </label>
          </div>
        </div>
      </div>

      {/* DETAILED VIEWS DEPENDS ON ACTIVE SUBTAB */}

      {/* SUBTAB 1: AVAILABLE GENERAL PREENCHIMENTO */}
      {activeSubTab === 'preencher' && !fillingForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map(frm => (
            <div key={frm.id} className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4 flex flex-col justify-between relative shadow-xs">
              <div className="space-y-2">
                <span className="text-[10px] bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 font-bold px-2.5 py-0.5 rounded-full uppercase font-mono tracking-wider">
                  Setor: {frm.sector || "Produção"}
                </span>

                <h3 className="font-extrabold text-[#1F2937] dark:text-white leading-snug">{frm.name}</h3>
                
                <p className="text-[11px] text-gray-500 font-sans">
                  Evento Escopo: <strong className="text-gray-700 dark:text-gray-300 font-bold">{frm.event}</strong>
                </p>
                {frm.responsible && (
                  <p className="text-[11px] text-gray-500 font-sans">
                    Responsável: <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-450 font-bold px-1.5 py-0.5 rounded font-mono text-[10px]">{frm.responsible}</span>
                  </p>
                )}
                <p className="text-[11px] text-gray-400">
                  Campos obrigatórios de vistoria: <strong className="font-extrabold text-gray-700 dark:text-gray-300 font-mono">{frm.fields?.length || 0}</strong>
                </p>
              </div>

              <div className="pt-3 border-t dark:border-gray-900 flex justify-between items-center text-xs">
                <span className="text-[10px] text-gray-400 font-mono">{frm.submissionsCount} preenchimentos</span>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenFill(frm)}
                    className="bg-[var(--color-primary)] text-white hover:opacity-90 px-3.5 py-1.5 font-bold rounded-xl text-[10px] flex items-center gap-1.5 shadow-sm"
                  >
                    Responder Form <ChevronRight size={12} />
                  </button>
                  
                  {currentUser.profile === "Admin" && (
                    <button
                      onClick={() => handleDeleteFormDoc(frm.id)}
                      className="p-1 hover:bg-red-50 text-red-500 rounded"
                    >
                      <Trash size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORM FILLING INTERACTIVE PROCESS FLOW - pág 23, 25 */}
      {fillingForm && (
        <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4 max-w-2xl mx-auto shadow-sm">
          <div className="border-b dark:border-gray-900 pb-3">
            <h3 className="font-extrabold text-sm text-gray-950 dark:text-white">{fillingForm.name}</h3>
            <p className="text-xs text-gray-400 mt-1">Responder vistoria oficial associada a: <strong>{fillingForm.event}</strong></p>
          </div>

          <form onSubmit={handleSaveFillForm} className="space-y-4 text-xs font-sans">
            {fillingForm.fields.map((field: any) => (
              <div key={field.id} className="space-y-1">
                <label className="block text-[11px] uppercase font-bold text-gray-400 font-mono">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    required={field.required}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none"
                    value={fillingAnswers[field.label] || ""}
                    onChange={(e) => setFillingAnswers({ ...fillingAnswers, [field.label]: e.target.value })}
                  />
                )}

                {field.type === "number" && (
                  <input
                    type="number"
                    required={field.required}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none"
                    value={fillingAnswers[field.label] || ""}
                    onChange={(e) => setFillingAnswers({ ...fillingAnswers, [field.label]: e.target.value })}
                  />
                )}

                {field.type === "checkbox" && (
                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      id={field.id}
                      className="w-4 h-4 text-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)]"
                      checked={fillingAnswers[field.label] === "Sim"}
                      onChange={(e) => setFillingAnswers({ ...fillingAnswers, [field.label]: e.target.checked ? "Sim" : "Não" })}
                    />
                    <label htmlFor={field.id} className="text-gray-700 dark:text-gray-300">Marque se verificado / Conforme</label>
                  </div>
                )}

                {field.type === "file" && (
                  <div className="space-y-2">
                    <div className="flex gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          const randName = ["ENTRADA_AVCB.jpg", "FOTO_MEDICA.jpg", "ASO_COMPLETO.pdf", "REGISTRO_FOTO_1.png"];
                          const choice = randName[Math.floor(Math.random() * randName.length)];
                          setFillingAnswers({ ...fillingAnswers, [field.label]: `ATRIBUÍDO_CAMERA_${choice}` });
                        }}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 border border-dashed rounded-xl dark:border-gray-800 text-[10px] flex items-center gap-1 font-bold font-mono"
                      >
                        <Image size={12} /> Simular Upload Foto/Câmera obrigatória *
                      </button>
                    </div>
                    {fillingAnswers[field.label] && (
                      <span className="text-[10px] text-emerald-500 font-bold block">✓ {fillingAnswers[field.label]}</span>
                    )}
                  </div>
                )}

                {field.type === "signature" && (
                  <div className="space-y-2">
                    <div className="flex gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setFillingAnswers({ ...fillingAnswers, [field.label]: `ASSINATURA_DIGITAL_CRIPTO_${currentUser.name.toUpperCase().replace(/ /g, "_")}` });
                        }}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 border border-dashed rounded-xl dark:border-gray-800 text-[10px] flex items-center gap-1 font-bold font-mono text-purple-600 dark:text-purple-400"
                      >
                        <Signature size={12} /> Simular Assinatura Digital Criptografada *
                      </button>
                    </div>
                    {fillingAnswers[field.label] && (
                      <span className="text-[10px] text-emerald-500 font-bold block">✓ {fillingAnswers[field.label]}</span>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-900">
              <button 
                type="button" 
                onClick={() => setFillingForm(null)} 
                className="px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-xl font-bold font-mono"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-xs"
              >
                Submeter Vistoria Finalizada
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 2: CONSTRUCTOR ENGINE - pág 23 */}
      {activeSubTab === 'construtor' && (
        <form onSubmit={handleCreateFormSubmit} className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6 max-w-2xl mx-auto shadow-xs text-xs font-sans">
          <div className="border-b dark:border-gray-900 pb-3">
            <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-white">Criador Interativo de Formulários de Vistoria</h3>
            <p className="text-gray-500 mt-1">Publique checklists e cadastros customizados diretamente no feed de campo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nome do Formulário *</label>
              <input type="text" required placeholder="Vistoria Entrada Posto de Comando" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none" />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Associar / Escopo Evento</label>
              <select value={targetEvent} onChange={(e) => setTargetEvent(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none">
                <option value="">Formulário Geral (Sem Vínculo)</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.name}>{ev.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Responsável pelo Preenchimento *</label>
              <select 
                value={formResponsible} 
                onChange={(e) => setFormResponsible(e.target.value)} 
                required
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <option value="">Selecione o Responsável</option>
                {users.map(u => (
                  <option key={u.id} value={u.name}>{u.avatar} {u.name} ({u.profile})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fields configuration panel */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-850 space-y-4">
            <h4 className="font-bold text-xs text-gray-850 dark:text-gray-250 uppercase font-mono tracking-wide">Configurar Mapeadores de Campo</h4>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nome da Pergunta/Instrução (Ex: Extintores no lugar)"
                className="flex-1 p-2 bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
              />
              <select
                className="p-2 bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl text-gray-700"
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
              >
                <option value="text">Texto livre</option>
                <option value="number">Número numérico</option>
                <option value="checkbox">Checkbox Sim/Não</option>
                <option value="file">Foto/Arquivo obrigatória</option>
                <option value="signature">Assinatura do Responsável</option>
              </select>
              <button
                type="button"
                onClick={handleAddField}
                className="bg-[var(--color-primary)] text-white hover:opacity-90 px-3.5 py-1.5 font-bold rounded-xl flex items-center gap-1 font-mono shrink-0"
              >
                + Adicionar Campo
              </button>
            </div>

            {/* List of active fields under construction */}
            <div className="space-y-1.5 pt-2">
              {fields.map((f, index) => (
                <div key={f.id} className="p-2 bg-white dark:bg-gray-950 border dark:border-gray-850 rounded-xl flex items-center justify-between text-[11px]">
                  <span>{index + 1}. <strong className="text-gray-800 dark:text-gray-200">{f.label}</strong> ({f.type})</span>
                  <button
                    type="button"
                    onClick={() => setFields(fields.filter(fi => fi.id !== f.id))}
                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="submit"
              className="px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-xs"
            >
              Publicar Formulário
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB 3: HISTORICAL SUBMISSIONS - pág 23 */}
      {activeSubTab === 'respostas' && (
        <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b dark:border-gray-900 text-xs font-bold text-gray-500 bg-gray-50/50 dark:bg-gray-900/10 flex justify-between items-center">
            <span>Últimos preenchimentos cadastrados em tempo real</span>
            <button
              onClick={() => {
                setExportSuccess(true);
                setTimeout(() => setExportSuccess(false), 3000);
              }}
              className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-all ${exportSuccess ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" : "text-[var(--color-primary)] hover:underline"}`}
            >
              {exportSuccess ? "✓ Planilha DP Exportada com Sucesso!" : "Exportar XLSX / PDF"}
            </button>
          </div>

          <div className="divide-y dark:divide-gray-900">
            {formSubmissions.map(sub => (
              <div key={sub.id} className="p-4 space-y-3 hover:bg-gray-50/50 dark:hover:bg-gray-900/10">
                <div className="flex justify-between items-start gap-3">
                  <div className="text-xs">
                    <h4 className="font-extrabold text-gray-900 dark:text-white">{sub.formName}</h4>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Enviado por: <strong>{sub.submittedBy}</strong> • Evento: {sub.event}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded">
                    {sub.date}
                  </span>
                </div>

                {/* Submissions data detail */}
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  {Object.entries(sub.values).map(([label, val]: any) => (
                    <div key={label} className="border-b dark:border-gray-850 pb-1.5">
                      <span className="text-gray-400 font-bold block uppercase scale-90 tracking-wider text-[9px]">{label}</span>
                      <strong className="text-gray-850 dark:text-gray-250 truncate block mt-0.5">{val}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
