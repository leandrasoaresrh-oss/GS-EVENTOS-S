import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Search, Shield, UserCheck, Award, QrCode, Grid, FileText, Download, Edit } from "lucide-react";

export const CredentialsView: React.FC = () => {
  const { employees, events } = useApp();

  const [activeEmpId, setActiveEmpId] = useState<string>("emp1");
  const [activeEventTitle, setActiveEventTitle] = useState<string>("Réveillon Copacabana 2027");
  const [accessZone, setAccessZone] = useState<string>("ACESSO TOTAL (Staff)");

  const selectedWorker = employees.find(e => e.id === activeEmpId) || employees[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* HEADER DESCRIPTION */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Gerador Visual de Credenciais (Crachás)</h2>
        <p className="text-xs text-gray-500 font-sans">Crachás de credenciamento oficial para controle de portaria de eventos e auditagem com QR Code.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CONTAINER 1: CREDENTIALS CONTROLLERS CONFIG */}
        <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4 shadow-xs text-xs">
          <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-white">Configurar Impressão de Crachá</h3>

          {/* Colaborador */}
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono">Selecionar Colaborador cadastrado</label>
            <select
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none"
              value={activeEmpId}
              onChange={(e) => setActiveEmpId(e.target.value)}
            >
              {employees.filter(e => e.active).map(emp => (
                <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.role})</option>
              ))}
            </select>
          </div>

          {/* Evento */}
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono">Associar a Evento específico</label>
            <select
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none"
              value={activeEventTitle}
              onChange={(e) => setActiveEventTitle(e.target.value)}
            >
              {events.map(ev => (
                <option key={ev.id} value={ev.title}>{ev.title}</option>
              ))}
            </select>
          </div>

          {/* Zona Acesso */}
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold text-gray-400 font-mono">Zona / Setor de Acesso Permitido</label>
            <select
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none"
              value={accessZone}
              onChange={(e) => setAccessZone(e.target.value)}
            >
              <option value="ACESSO TOTAL (Staff)">Área Total / Montagem / Backstage (Staff)</option>
              <option value="BACKSTAGE (Fotógrafos)">Produção e Artistas (Backstage)</option>
              <option value="MONTAGEM (Técnicos)">Apenas Montagem / Diurnos (Técnicos)</option>
              <option value="PÚBLICO GERAL (Clínica)">Postos de Apoio / Clínicas (Saúde)</option>
            </select>
          </div>

          <button
            onClick={() => alert("Simulando exportação de arquivo PDF pronto para impressoras térmicas verticais...")}
            className="w-full py-2.5 bg-gray-905 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-bold rounded-xl flex items-center justify-center gap-1.5 font-mono"
          >
            <Download size={14} /> Exportar Crachá (PDF)
          </button>
        </div>

        {/* CONTAINER 2: CREDENTIAL BADGE PREVIEW RENDER DESIGN (Pág 22, 53) */}
        {selectedWorker && (
          <div className="flex justify-center items-center">
            
            {/* COMPACT BADGE CARD MODEL (Double view vertical - design de luxo) */}
            <div className="w-[300px] bg-slate-900 text-slate-100 p-6 rounded-3xl border-4 border-orange-500 shadow-xl space-y-6 text-center font-sans relative overflow-hidden">
              
              {/* TOP STRAP HOLE */}
              <div className="w-12 h-3 bg-slate-800 mx-auto rounded-full border border-slate-700"></div>

              {/* BRAND HEADER */}
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-widest font-black text-orange-400 font-mono">GS EVENTOS</span>
                <span className="text-[10px] text-slate-400 block truncate font-mono uppercase">{activeEventTitle}</span>
              </div>

              {/* CARD SEPARATOR */}
              <div className="border-t border-dashed border-slate-700"></div>

              {/* PHOTO avatar */}
              <div className="relative w-24 h-24 mx-auto rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-md">
                <span className="text-5xl">{selectedWorker.photo || "👤"}</span>
              </div>

              {/* PROFILE DETAILS */}
              <div className="space-y-1">
                <h4 className="text-md font-extrabold text-white uppercase tracking-tight truncate leading-tight">
                  {selectedWorker.fullName}
                </h4>
                <span className="text-xs text-orange-400 font-semibold uppercase block">
                  {selectedWorker.role}
                </span>
                <span className="text-[9px] text-slate-400 font-mono block">
                  CPF: {selectedWorker.cpf}
                </span>
              </div>

              {/* ACCESS REGULATION ZONE */}
              <div className="py-2 px-3 bg-amber-500 text-slate-950 font-black tracking-widest rounded-xl font-mono text-[10px] uppercase shadow-inner">
                {accessZone}
              </div>

              {/* FOOTER BAR WITH INTEGRATED QRCODE CONTROL (Pág 53) */}
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800">
                <QrCode size={40} className="text-white shrink-0" />
                <div className="text-left font-mono">
                  <span className="text-[8px] text-slate-400 block">AUDITAGEM DIGITAL</span>
                  <span className="text-[9px] text-white font-bold block">ID: GS-{selectedWorker.id.toUpperCase()}</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
