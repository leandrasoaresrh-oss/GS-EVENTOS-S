import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, ShieldAlert, FileText, CheckCircle2, Trash, Database } from "lucide-react";

export const LogsView: React.FC = () => {
  const { auditLogs, clearLogs, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = auditLogs.filter(log => 
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER DESCRIPTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1F2937] dark:text-white">Registros de Auditoria do Sistema (Logs)</h2>
          <p className="text-xs text-gray-400 font-sans">Rastreamento sistêmico de todas as ações de gravação, exclusão e alteração de dados efetuadas por usuários logados.</p>
        </div>
        
        {currentUser.profile === "Admin" && auditLogs.length > 0 && (
          <button
            onClick={clearLogs}
            className="bg-red-50 hover:bg-red-105 border border-red-200 text-red-600 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm font-mono"
          >
            <Trash size={14} /> Limpar Auditoria
          </button>
        )}
      </div>

      {/* FILTER SEARCH ROW */}
      <div className="flex bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Pesquise logs por usuário, ação auditada ou detalhes técnicos..."
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* AUDIT LOG LISTING TABLE */}
      <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b dark:border-gray-900 text-xs font-bold text-gray-500 bg-gray-50/50 dark:bg-gray-900/10 flex justify-between items-center font-mono">
          <span>Feed de Rastreamento de banco (Exclusivo a Administradores)</span>
          <span>Registros ativos: {auditLogs.length}</span>
        </div>

        <div className="divide-y dark:divide-gray-900 font-mono text-xs">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] hover:bg-gray-50/50 dark:hover:bg-gray-900/10">
              
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0"></span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <strong className="text-gray-900 dark:text-gray-100">{log.user}</strong>
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-900 text-gray-500 px-1.5 py-0.2 rounded font-extrabold pb-0.5">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1 leading-relaxed">{log.details}</p>
                </div>
              </div>

              <span className="text-[10px] text-gray-400 whitespace-nowrap self-end sm:self-auto bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded">
                {log.timestamp}
              </span>

            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-20 font-sans text-xs text-gray-400">
              <Database size={28} className="text-gray-300 mx-auto mb-2" />
              Nenhum log de alteração registrado na auditoria até o momento.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
