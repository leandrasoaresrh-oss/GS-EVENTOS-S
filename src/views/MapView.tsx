import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MapPin, Search, Calendar, Users, Sliders, Navigation, Activity } from "lucide-react";

export const MapView: React.FC = () => {
  const { events, users, suppliers } = useApp();

  // Find first event to set as default active event
  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    return events[0]?.id || "";
  });

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];

  // Helper to translate event stages
  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "visita_tecnica":
        return "Visita Técnica";
      case "pre_evento":
        return "Pré-Evento";
      case "montagem":
        return "Montagem";
      case "execucao":
        return "Execução (Ao Vivo)";
      case "pos_evento":
        return "Pós-Evento";
      case "finalizado":
        return "Finalizado";
      default:
        return stage;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "visita_tecnica":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-200/50";
      case "pre_evento":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200/50";
      case "montagem":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50";
      case "execucao":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50 animate-pulse";
      case "pos_evento":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/50";
      case "finalizado":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200/50";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const selectedEventStaff = selectedEvent
    ? users.filter(u => selectedEvent.staffIds?.includes(u.id))
    : [];

  const selectedEventSuppliers = selectedEvent
    ? suppliers.filter(s => selectedEvent.supplierIds?.includes(s.id))
    : [];

  return (
    <div className="space-y-6">
      
      {/* HEADER DESCRIPTION */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Mapa de Localização de Eventos</h2>
        <p className="text-xs text-gray-500 font-sans">Visualização integrada das coordenadas operacionais e status georreferenciado das produções ativas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: EVENTS LIST PANEL (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-zinc-900 overflow-hidden shadow-xs flex flex-col h-[550px]">
          <div className="p-4 border-b dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/30">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">Produções Ativas ({events.length})</h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y dark:divide-zinc-900 select-none">
            {events.map((ev) => {
              const active = ev.id === selectedEventId;
              const coords = ev.coordinates || [0, 0];
              return (
                <button
                  key={ev.id}
                  onClick={() => setSelectedEventId(ev.id)}
                  className={`w-full p-4 text-left flex items-start gap-4 transition-all duration-150 ${
                    active 
                      ? "bg-orange-500/[0.06] border-l-4 border-orange-500" 
                      : "hover:bg-gray-50/60 dark:hover:bg-zinc-900/40"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${
                    active 
                      ? "bg-orange-500 text-white border-orange-500 shadow-xs" 
                      : "bg-gray-100 dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 border-gray-150 dark:border-zinc-800"
                  }`}>
                    <MapPin size={16} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="font-extrabold text-xs text-gray-950 dark:text-zinc-50 truncate">{ev.name}</h4>
                    <p className="text-[10px] text-gray-400 block truncate">{ev.address}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border font-mono ${getStageColor(ev.stage)}`}>
                        {getStageLabel(ev.stage)}
                      </span>
                      <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-mono font-bold">
                        {coords[0]?.toFixed(4)}, {coords[1]?.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: MAP CONTAINER & DETAILS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {selectedEvent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              
              {/* DETAILS PANEL (MD_1) */}
              <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-100 dark:border-zinc-900 space-y-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border font-mono tracking-wide uppercase ${getStageColor(selectedEvent.stage)}`}>
                      {getStageLabel(selectedEvent.stage)}
                    </span>
                    <span className="text-[10px] bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 px-2 py-0.5 rounded-full font-bold font-mono">
                      Progresso: {selectedEvent.progress}%
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-950 dark:text-zinc-50 mt-3 tracking-tight">
                    {selectedEvent.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium font-sans flex items-start gap-1.5 mt-2">
                    <MapPin size={13} className="text-orange-500 shrink-0 mt-0.5" />
                    <span>{selectedEvent.address}</span>
                  </p>

                  <div className="border-t border-gray-100 dark:border-zinc-900 my-4"></div>

                  {/* Operational indicators */}
                  <div className="space-y-3.5 text-xs font-sans">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-gray-400 font-mono flex items-center gap-1">
                        <Calendar size={12} /> Data de Início
                      </span>
                      <span className="font-extrabold text-gray-700 dark:text-zinc-350">{selectedEvent.date}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-gray-400 font-mono flex items-center gap-1">
                        <Users size={12} /> Staff Alocado
                      </span>
                      <span className="font-extrabold text-gray-750 dark:text-zinc-350">
                        {selectedEventStaff.length} Colaboradores
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-gray-400 font-mono flex items-center gap-1">
                        <Sliders size={12} /> Fornecedores Vinculados
                      </span>
                      <span className="font-extrabold text-gray-750 dark:text-zinc-350">
                        {selectedEventSuppliers.length} Contratados
                      </span>
                    </div>

                    {/* Allocated Staff list (Quick Avatars) */}
                    <div className="pt-2">
                      <span className="text-[9px] uppercase font-black text-gray-400 font-mono block mb-2 leading-none">Coordenadores Responsáveis</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedEventStaff.map(staff => (
                          <div 
                            key={staff.id} 
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-zinc-900 border border-gray-150/50 dark:border-zinc-800 rounded-full text-[10px] font-bold text-gray-700 dark:text-zinc-300 shadow-3xs"
                            title={staff.email}
                          >
                            <span>{staff.avatar}</span>
                            <span>{staff.name.split(" ")[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-3.5 space-y-2 mt-4">
                  <span className="text-[10px] uppercase font-black text-orange-600 dark:text-orange-400 font-mono block leading-none flex items-center gap-1">
                    <Activity size={12} className="animate-pulse" /> Monitoramento em Tempo Real
                  </span>
                  <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
                    Localização operacional baseada nos pontos cadastrados de montagem e visita técnica. Faça check-in do app em campo para sincronizar alertas.
                  </p>
                </div>
              </div>

              {/* MAP IFRAME (MD_2) */}
              <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-zinc-900 shadow-xs overflow-hidden h-[550px] md:h-auto flex flex-col relative group">
                {/* Embed OpenStreetMap / Google Static Mock Map fallback for high reliability */}
                {selectedEvent.coordinates ? (
                  <iframe
                    title="Event Location Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={`https://maps.google.com/maps?q=${selectedEvent.coordinates[0]},${selectedEvent.coordinates[1]}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    className="flex-1 w-full h-[350px] md:h-full border-0 select-none brightness-95 dark:brightness-90 contrast-105"
                  ></iframe>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-900 text-center gap-2">
                    <Navigation size={28} className="text-orange-500" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Sem Coordenadas Disponíveis</span>
                    <span className="text-[10px] text-gray-400">Insira valores válidos latitude/longitude para obter a cobertura.</span>
                  </div>
                )}
                
                {/* Float helper absolute button */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedEvent.coordinates?.[0] || 0},${selectedEvent.coordinates?.[1] || 0}`}
                  target="_blank"
                  rel="noreferrer referrer"
                  className="absolute bottom-4 right-4 bg-orange-600 hover:bg-orange-700 text-white font-bold p-3 rounded-full shadow-lg flex items-center justify-center gap-1.5 transition-all text-xs font-mono select-none"
                >
                  <Navigation size={14} className="animate-bounce" /> Ver no Google Maps
                </a>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-955 border rounded-3xl text-center gap-2 h-[550px]">
              <MapPin size={32} className="text-gray-400 animate-bounce" />
              <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Nenhum evento selecionado</span>
              <p className="text-xs text-gray-400">Por favor, clique em um evento da lista ao lado para conferir sua geolocalização no mapa.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
