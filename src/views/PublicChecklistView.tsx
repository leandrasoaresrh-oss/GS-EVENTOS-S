import React, { useState, useEffect } from "react";
import { SignatureCanvas } from "../components/SignatureCanvas";
import { Camera, CheckCircle, Smartphone, MapPin, Calendar, Clock, Image, Layers, AlertTriangle, Upload, Trash2, ArrowLeft } from "lucide-react";

interface ParsedLine {
  type: 'header' | 'item' | 'text';
  text: string;
}

export const PublicChecklistView: React.FC = () => {
  // Query url extraction
  const params = new URLSearchParams(window.location.search);
  const eventIdFromUrl = params.get("eventId") || params.get("event-id");
  const checklistIdFromUrl = params.get("checklistId") || params.get("checklist-id");

  // Load event details dynamically
  const [eventName, setEventName] = useState("Festival Arena Pop 2026");
  const [eventDate, setEventDate] = useState("2026-11-28");
  const [eventAddress, setEventAddress] = useState("Arena Anhembi, São Paulo - SP");
  const [allowPhotoUpload, setAllowPhotoUpload] = useState(true);
  const [checklistTitle, setChecklistTitle] = useState("Roteiro Técnico & Cobertura Fotográfica");

  // Photographer states
  const [photographerName, setPhotographerName] = useState("");
  const [phone, setPhone] = useState("");
  const [observations, setObservations] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [checklistMarkdown, setChecklistMarkdown] = useState<string>(`
## Recepção e Entrada
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
* [ ] Foto oficial dos organizadores no backdrop da marca
  `);

  useEffect(() => {
    // 1. Fetch Events from localStorage to resolve Name/Date
    const savedEventsStr = localStorage.getItem("gs_events");
    let targetEvent: any = null;
    if (savedEventsStr) {
      const eventsList = JSON.parse(savedEventsStr);
      targetEvent = eventsList.find((e: any) => e.id === eventIdFromUrl);
      if (targetEvent) {
        setEventName(targetEvent.name);
        setEventDate(targetEvent.date || "Data não especificada");
        setEventAddress(targetEvent.address || "Local não informado");
      }
    }

    // 2. Fetch specific checklists
    const savedChecklistsStr = localStorage.getItem("gs_event_photographer_checklists");
    if (savedChecklistsStr && checklistIdFromUrl) {
      const checklists = JSON.parse(savedChecklistsStr);
      const targetChecklist = checklists.find((c: any) => c.id === checklistIdFromUrl);
      if (targetChecklist) {
        setChecklistTitle(targetChecklist.title);
        setChecklistMarkdown(targetChecklist.markdownContent);
        setAllowPhotoUpload(targetChecklist.allowPhotoUpload !== false);
        
        // If already submitted previously, we can populate or show status
        if (targetChecklist.submitted) {
          setPhotographerName(targetChecklist.photographerName || "");
          setPhone(targetChecklist.photographerPhone || "");
          setObservations(targetChecklist.observations || "");
          setCheckedItems(targetChecklist.completedItemTexts || []);
          setUploadedPhotos(targetChecklist.photos || []);
          setSignatureUrl(targetChecklist.signatureUrl || "");
        }
      }
    }
  }, [eventIdFromUrl, checklistIdFromUrl]);

  // Parse markdown lines to render high contrast custom controls
  const parsedLines: ParsedLine[] = checklistMarkdown
    .split("\n")
    .map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return { type: 'header' as const, text: trimmed.replace(/^###\s*/, "") };
      } else if (trimmed.startsWith("##")) {
        return { type: 'header' as const, text: trimmed.replace(/^##\s*/, "") };
      } else if (trimmed.startsWith("#")) {
        return { type: 'header' as const, text: trimmed.replace(/^#\s*/, "") };
      } else if (trimmed.startsWith("* [ ]") || trimmed.startsWith("* [x]")) {
        return { type: 'item' as const, text: trimmed.replace(/^\*\s*\[\s*[x ]\s*\]\s*/i, "") };
      } else if (trimmed.startsWith("- [ ]") || trimmed.startsWith("- [x]")) {
        return { type: 'item' as const, text: trimmed.replace(/^-\s*\[\s*[x ]\s*\]\s*/i, "") };
      } else if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
        return { type: 'item' as const, text: trimmed.replace(/^[*+-]\s*/, "") };
      } else if (trimmed.length > 0) {
        return { type: 'text' as const, text: trimmed };
      }
      return null;
    })
    .filter((line): line is ParsedLine => line !== null);

  const handleToggleItem = (itemText: string) => {
    setCheckedItems(prev => 
      prev.includes(itemText) 
        ? prev.filter(t => t !== itemText) 
        : [...prev, itemText]
    );
  };

  const handleCustomAnswerChange = (itemText: string, val: string) => {
    setCustomAnswers(prev => ({
      ...prev,
      [itemText]: val
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemovePhoto = (indexToSelect: number) => {
    setUploadedPhotos(prev => prev.filter((_, idx) => idx !== indexToSelect));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photographerName.trim()) {
      setErrorMsg("Por favor, informe seu nome completo.");
      return;
    }
    if (!signatureUrl) {
      setErrorMsg("A sua assinatura digital desenhada é obrigatória para validar a entrega técnica.");
      return;
    }

    const payload = {
      submitted: true,
      submittedAt: new Date().toISOString(),
      photographerName,
      photographerPhone: phone,
      completedItemTexts: checkedItems,
      observations,
      photos: uploadedPhotos,
      signatureUrl,
      additionalAnswers: customAnswers
    };

    // Update localStorage for photographer checklists
    const checklistsStr = localStorage.getItem("gs_event_photographer_checklists");
    let list: any[] = [];
    if (checklistsStr) {
      list = JSON.parse(checklistsStr);
    }

    // Find and update or insert
    const idx = list.findIndex((c: any) => c.id === (checklistIdFromUrl || "default"));
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        ...payload
      };
    } else {
      // Default backup list if opened draft without matching internal ID
      list.push({
        id: checklistIdFromUrl || "default",
        eventId: eventIdFromUrl || "default",
        title: checklistTitle,
        markdownContent: checklistMarkdown,
        allowPhotoUpload,
        ...payload
      });
    }
    localStorage.setItem("gs_event_photographer_checklists", JSON.stringify(list));

    // Also update public list legacy tracking for backwards compatibility inside the general dashboard
    const legacySaved = localStorage.getItem("gs_public_checklists");
    const legacyList = legacySaved ? JSON.parse(legacySaved) : [];
    const legacySubmission = {
      id: "pub_chk_" + Date.now(),
      photographerName,
      phone,
      eventName,
      date: new Date().toISOString().split("T")[0],
      checklist: {
        equipmentCam: checkedItems.length > 0,
        equipmentLens: true,
        equipmentCards: true,
        equipmentFlash: true,
        backupConfigured: uploadedPhotos.length > 0,
      },
      observations,
      signatureUrl
    };
    localStorage.setItem("gs_public_checklists", JSON.stringify([legacySubmission, ...legacyList]));

    setSubmitted(true);
    setErrorMsg("");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-xs text-gray-700 dark:text-zinc-300 font-sans">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-8 rounded-3xl shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Checklist de Cobertura Concluído!</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Obrigado, <strong>{photographerName}</strong>. Suas respostas de conformidade de cobertura de imagens foram homologadas com sucesso.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-150 dark:border-zinc-850 text-[10px] text-gray-400 font-mono text-left space-y-1">
            <p>• Evento: {eventName}</p>
            <p>• Transação: PHOT_SUB_{Date.now()}</p>
            <p>• Itens Marcados: {checkedItems.length} de {parsedLines.filter(l => l.type === 'item').length}</p>
            <p>• Mídias Anexadas: {uploadedPhotos.length} fotos</p>
            <p>• Status de Envio: CONCLUÍDO E PROTOCOLADO</p>
          </div>
          <p className="text-[10px] text-gray-400">Você já pode fechar esta aba com segurança.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4 flex flex-col items-center justify-center text-xs text-gray-800 dark:text-zinc-350 font-sans relative overflow-hidden">
      {/* Background Decorative bubbles */}
      <div className="absolute top-10 right-20 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl w-full bg-white dark:bg-zinc-90 w-full bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden relative z-10">
        
        {/* HEADER BAR HERO */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 text-center space-y-1">
          <div className="mx-auto w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-1 shadow-md">
            <Camera size={22} className="text-white" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10 inline-block">
            GS EVENTOS & PRODUÇÕES • COBERTURA EXTERNA
          </span>
          <h1 className="text-lg font-black mt-2 font-display">{checklistTitle}</h1>
          <p className="text-[11px] text-white/80 max-w-md mx-auto">
            Por favor, preencha o progresso fotográfico em campo de forma simples, direta e assine digitalmente.
          </p>
        </div>

        {/* EVENT DETAILS */}
        <div className="p-4 bg-gray-50 dark:bg-zinc-955 border-b dark:border-zinc-850 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] text-gray-500 dark:text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-orange-500 shrink-0" />
            <div className="truncate">
              <span className="text-gray-400 uppercase text-[8px] block">Localização do Evento</span>
              <strong className="text-gray-700 dark:text-zinc-200">{eventAddress}</strong>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-orange-500 shrink-0" />
            <div>
              <span className="text-gray-400 uppercase text-[8px] block">Data de Realização</span>
              <strong className="text-gray-700 dark:text-zinc-200">{eventDate}</strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 font-sans">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold rounded-xl border border-red-200/40 text-center flex items-center gap-1.5 justify-center">
              <AlertTriangle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* DADOS DETALHADOS PROFISSIONAL */}
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase text-orange-500 border-b dark:border-zinc-800 pb-1 block tracking-wider font-mono">
              Dados do Profissional Externo
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-gray-400 block pb-0.5">Seu Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pedro Henrique Silva"
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 font-semibold"
                  value={photographerName}
                  onChange={e => setPhotographerName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-gray-400 block pb-0.5">Telefone Comercial / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="Ex: (11) 98765-4321"
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl focus:outline-none"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC MARKDOWN CHECKLIST */}
          <div className="space-y-4 pt-2">
            <span className="text-[10px] font-black uppercase text-orange-500 border-b dark:border-zinc-800 pb-1 block tracking-wider font-mono">
              Grade de Cobertura & Capturas Recomendadas
            </span>

            <div className="space-y-4">
              {parsedLines.map((line, idx) => {
                if (line.type === "header") {
                  return (
                    <div key={idx} className="pt-2">
                      <h3 className="text-xs font-black text-gray-800 dark:text-zinc-100 font-display flex items-center gap-1.5 border-b border-gray-100 dark:border-zinc-850 pb-1.5 uppercase tracking-wide">
                        <span className="w-1.5 h-3.5 bg-orange-500 rounded-sm inline-block"></span>
                        <span>{line.text}</span>
                      </h3>
                    </div>
                  );
                } else if (line.type === "item") {
                  const isChecked = checkedItems.includes(line.text);
                  return (
                    <div 
                      key={idx}
                      onClick={() => handleToggleItem(line.text)}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3 cursor-pointer select-none hover:scale-[1.005] ${
                        isChecked 
                          ? "bg-slate-500/5 border-orange-500/45 dark:bg-zinc-900/40" 
                          : "bg-white dark:bg-zinc-900/10 border-gray-200/75 dark:border-zinc-850 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Swapped via parent div onClick
                        className="w-4.5 h-4.5 rounded-lg border-gray-300 text-orange-500 focus:ring-orange-500 mt-0.5 pointer-events-none shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <strong className={`text-xs font-extrabold ${isChecked ? "text-gray-900 dark:text-zinc-100 line-through opacity-70" : "text-gray-800 dark:text-zinc-200"}`}>
                          {line.text}
                        </strong>
                        
                        {/* Optional photo checklist item inline answer if checked */}
                        {isChecked && (
                          <div className="mt-2" onClick={e => e.stopPropagation()}>
                            <input 
                              type="text"
                              value={customAnswers[line.text] || ""}
                              onChange={e => handleCustomAnswerChange(line.text, e.target.value)}
                              placeholder="Observação da foto (Opcional - Ex: Feita com flash rebotado)"
                              className="w-full text-[10px] p-1.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <p key={idx} className="text-xs text-gray-500 dark:text-zinc-400 italic font-mono pl-4">
                      {line.text}
                    </p>
                  );
                }
              })}
            </div>
          </div>

          {/* PHOTO ATTACHMENTS */}
          {allowPhotoUpload && (
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase text-orange-500 border-b dark:border-zinc-800 pb-1 block tracking-wider font-mono">
                Anexar Fotos / Capturas Realizadas (Opcional)
              </span>
              <p className="text-[10px] text-gray-400">Anexe previews em tempo real ou backups Rápidos de cliques de validação.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {uploadedPhotos.map((photo, i) => (
                  <div key={i} className="aspect-video relative rounded-xl border dark:border-zinc-800 overflow-hidden bg-gray-100 dark:bg-zinc-950 shadow-3xs group">
                    <img src={photo} alt={`Uploaded target ${i+1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-all"
                      title="Excluir foto"
                    >
                      <Trash2 size={12} />
                    </button>
                    <span className="absolute bottom-1 left-2 text-[8px] bg-black/60 text-white font-mono rounded px-1 font-bold">Foto #{i+1}</span>
                  </div>
                ))}
                
                <label className="border-2 border-dashed border-gray-200 dark:border-zinc-800 hover:border-orange-500/40 rounded-xl aspect-video flex flex-col justify-center items-center gap-1.5 cursor-pointer bg-gray-50/50 dark:bg-zinc-900/10 hover:bg-orange-500/5 transition-all text-gray-400 dark:text-zinc-500 select-none">
                  <Upload size={18} className="text-orange-500" />
                  <span className="text-[10px] font-bold">Adicionar Foto</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* OBSERVATIONS EXTRA */}
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono">
              Comentários Extras / Observações Operacionais
            </label>
            <textarea
              rows={2}
              className="w-full p-2.5 bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl focus:outline-none resize-none"
              placeholder="Ex: Iluminação do palco foi alterada no cronograma de última hora por solicitação do organizador..."
              value={observations}
              onChange={e => setObservations(e.target.value)}
            />
          </div>

          {/* SIGNATURE CANVAS */}
          <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 space-y-3 shadow-3xs">
            <SignatureCanvas
              onSave={(url) => setSignatureUrl(url)}
              label="Assinatura Digital de Conformidade Operacional *"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-[0.98] text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-all hover:scale-[1.005] active:scale-[0.99]"
          >
            <CheckCircle size={16} /> Enviar Checklist de Cobertura
          </button>
        </form>

      </div>
    </div>
  );
};
export default PublicChecklistView;
