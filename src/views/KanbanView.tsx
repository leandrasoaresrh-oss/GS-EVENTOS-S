import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Task, User } from "../types";
import { 
  Plus, Search, Calendar, List, Kanban, Lock, Unlock, 
  CheckSquare, Edit, Trash, AlertCircle, ArrowRight, ArrowLeft,
  Sliders, CalendarRange, Clock, AlertTriangle, UserCheck
} from "lucide-react";

export const KanbanView: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, users, currentUser } = useApp();

  // Selected view type: 'kanban' | 'list' | 'calendar'
  const [viewType, setViewType] = useState<'kanban' | 'list' | 'calendar'>('kanban');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskRespId, setTaskRespId] = useState(currentUser.id);
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState<'Baixa' | 'Media' | 'Alta' | 'Urgente'>('Media');
  const [taskSector, setTaskSector] = useState("Produção");
  const [dependsOnId, setDependsOnId] = useState(""); // Parent task ID dependency

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDueDate) return;

    addTask({
      title: taskTitle,
      description: taskDesc,
      responsibleId: taskRespId,
      dueDate: taskDueDate,
      priority: taskPriority,
      status: "Pendente",
      sector: taskSector,
      dependsOnTaskId: dependsOnId || undefined
    } as any);

    // Reset fields
    setTaskTitle("");
    setTaskDesc("");
    setDependsOnId("");
    setTaskDueDate("");
    setIsFormOpen(false);
  };

  const isTaskBlocked = (task: Task) => {
    if (!task.dependsOnTaskId) return false;
    const parent = tasks.find(t => t.id === task.dependsOnTaskId);
    return parent ? parent.status !== "Concluida" : false;
  };

  const getParentTaskText = (task: Task) => {
    if (!task.dependsOnTaskId) return "";
    const parent = tasks.find(t => t.id === task.dependsOnTaskId);
    return parent ? parent.title : "Tarefa desconhecida";
  };

  const handleMoveStatus = (id: string, current: string, direction: 'frente' | 'tras') => {
    const task = tasks.find(t => t.id === id);
    if (task && isTaskBlocked(task)) return; // Prevent transition block

    const list: string[] = ["Pendente", "Em Andamento", "Atrasada", "Concluida"];
    let idx = list.indexOf(current);
    if (direction === 'frente' && idx < list.length - 1) {
      updateTask(id, { status: list[idx + 1] as any });
    } else if (direction === 'tras' && idx > 0) {
      updateTask(id, { status: list[idx - 1] as any });
    }
  };

  // Check Overdue relative to current system date (May 28th, 2026)
  const currentDate = new Date("2026-05-28");

  const checkAndGetOverdueStatus = (task: Task) => {
    if (task.status === "Concluida") return "Concluida";
    const due = new Date(task.dueDate);
    if (due.getTime() < currentDate.getTime()) {
      return "Atrasada";
    }
    return task.status;
  };

  // ACCESS PRIVILEGES - Regular users only view tasks assigned to them, created by them, or related.
  // Admin continues seeing all tasks.
  const isAccessible = (task: Task) => {
    if (currentUser.profile === "Admin") return true;
    return task.responsibleId === currentUser.id;
  };

  const filteredTasks = tasks
    .map(t => ({ ...t, status: checkAndGetOverdueStatus(t) }))
    .filter(t => isAccessible(t))
    .filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Stats Counters
  const totalTasksCount = filteredTasks.length;
  const completedTasksCount = filteredTasks.filter(t => t.status === "Concluida").length;
  const inProgressTasksCount = filteredTasks.filter(t => t.status === "Em Andamento").length;
  const overdueCount = filteredTasks.filter(t => t.status === "Atrasada").length;
  const completionRate = totalTasksCount ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Calendar visual building helpers
  const getDaysInMonth = () => {
    // Show May 2026 for demonstration
    const dateArray = [];
    for (let i = 1; i <= 31; i++) {
      const dayStr = i < 10 ? `0${i}` : `${i}`;
      dateArray.push(`2026-05-${dayStr}`);
    }
    return dateArray;
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white">Gerenciador de Atividades e Demandas</h2>
          <p className="text-xs text-gray-400">Atribua metas, configure regras de dependência de processo e acompanhe as três visões de equipe.</p>
        </div>
        
        {/* All users can create tasks now */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-[var(--color-primary)] text-white hover:opacity-90 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-3xs"
        >
          <Plus size={16} /> Nova Atividade / Demanda
        </button>
      </div>

      {/* COMPLIANCE OVERVIEW BANNER */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-850 space-y-4 shadow-3xs">
        <div className="flex justify-between items-center border-b dark:border-zinc-900 pb-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 font-mono">Consolidação Operacional de Tarefas ({currentUser.name})</h3>
          
          {/* VIEW SWITCHER CONTROL PANEL */}
          <div className="flex bg-gray-50 dark:bg-zinc-900 p-1 rounded-xl border dark:border-zinc-850 gap-1 text-[10px] font-bold font-mono">
            <button 
              onClick={() => setViewType('kanban')} 
              className={`p-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${viewType === 'kanban' ? 'bg-[var(--color-primary)] text-white' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <Kanban size={12} /> KANBAN
            </button>
            <button 
              onClick={() => setViewType('list')} 
              className={`p-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${viewType === 'list' ? 'bg-[var(--color-primary)] text-white' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <List size={12} /> LISTA
            </button>
            <button 
              onClick={() => setViewType('calendar')} 
              className={`p-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${viewType === 'calendar' ? 'bg-[var(--color-primary)] text-white' : 'text-gray-400 hover:text-gray-700'}`}
            >
              <Calendar size={12} /> CALENDÁRIO
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
          <div className="p-3 bg-gray-50/70 dark:bg-zinc-900/40 rounded-2xl border dark:border-zinc-850">
            <span className="text-[10px] text-gray-400 block uppercase">Taxa de Conclusão</span>
            <strong className="text-lg text-[var(--color-primary)] font-black">{completionRate}%</strong>
          </div>
          <div className="p-3 bg-gray-50/70 dark:bg-zinc-900/40 rounded-2xl border dark:border-zinc-850">
            <span className="text-[10px] text-gray-400 block uppercase">Minhas demandas</span>
            <strong className="text-lg text-gray-800 dark:text-zinc-200 font-black">{totalTasksCount}</strong>
          </div>
          <div className="p-3 bg-gray-50/70 dark:bg-zinc-900/40 rounded-2xl border dark:border-zinc-850">
            <span className="text-[10px] text-red-500 block uppercase font-bold">Atrasadas / Expiradas</span>
            <strong className="text-lg text-red-500 font-black">{overdueCount}</strong>
          </div>
          <div className="p-3 bg-gray-50/70 dark:bg-zinc-900/40 rounded-2xl border dark:border-zinc-850">
            <span className="text-[10px] text-blue-500 block uppercase">Ativas em Produção</span>
            <strong className="text-lg text-blue-500 font-black">{inProgressTasksCount}</strong>
          </div>
        </div>
      </div>

      {/* SEARCH PANEL */}
      <div className="flex bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-gray-150 dark:border-zinc-850">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Mapeie palavras-chave para encontrar tarefas..."
            className="w-full pl-10 pr-4 py-2 border dark:border-zinc-850 rounded-xl bg-gray-50/50 dark:bg-zinc-900 text-xs focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* TASK CREATION MODAL/DIALOG */}
      {isFormOpen && (
        <form onSubmit={handleCreateTask} className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-850 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans shadow-lg">
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Título da Atividade *</label>
            <input type="text" required placeholder="Ex: Fixar grades de som do palco" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl focus:outline-none" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Data de Entrega / Limite *</label>
            <input type="date" required value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl text-gray-700 focus:outline-none" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nível de Prioridade</label>
            <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as any)} className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl text-xs focus:outline-none">
              <option value="Baixa">Baixa</option>
              <option value="Media font-bold">Média</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente (Interrupção)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Atribuir Operador Técnico *</label>
            <select value={taskRespId} onChange={(e) => setTaskRespId(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl text-xs focus:outline-none">
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.profile})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Área / Setor Técnico</label>
            <input type="text" placeholder="Ex: Produção" value={taskSector} onChange={(e) => setTaskSector(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl focus:outline-none" />
          </div>

          {/* TASK DEPENDENCY CREATOR */}
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 flex items-center gap-1">
              <Lock size={10} className="text-orange-500" />
              <span>Depende de outra tarefa prévia? (Opcional)</span>
            </label>
            <select
              className="w-full p-2.5 bg-gray-50/70 dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl text-xs focus:outline-none"
              value={dependsOnId}
              onChange={e => setDependsOnId(e.target.value)}
            >
              <option value="">Nenhuma. Entrada liberada.</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>{t.title} ({t.status})</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Descrição e Especificação Técnica</label>
            <textarea rows={2} placeholder="Insira orientações detalhadas de operação..." value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl resize-none focus:outline-none" />
          </div>

          <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t dark:border-zinc-900">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-3 py-2 bg-gray-200 dark:bg-zinc-800 rounded-xl font-bold font-mono">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-xs">Gravar Atividade</button>
          </div>
        </form>
      )}

      {/* VIEW TYPES RENDER ENGINES */}
      {viewType === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {["Pendente", "Em Andamento", "Atrasada", "Concluida"].map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col);
            
            return (
              <div key={col} className="bg-gray-50/50 dark:bg-zinc-900/10 p-4 rounded-3xl min-w-[245px] space-y-3 flex-1 flex flex-col border dark:border-zinc-900">
                
                <div className="flex items-center justify-between border-b dark:border-zinc-900 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-zinc-200">
                    <span className={`w-2 h-2 rounded-full ${col === "Pendente" ? "bg-gray-450" : col === "Em Andamento" ? "bg-blue-500" : col === "Atrasada" ? "bg-red-500" : "bg-emerald-500"}`}></span>
                    <span>{col}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white dark:bg-zinc-950 border dark:border-zinc-850 px-2 py-0.5 rounded-full text-gray-400">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-10 border border-dashed dark:border-zinc-850 rounded-2xl text-[10px] text-gray-400">
                      Sem demandas
                    </div>
                  ) : (
                    colTasks.map(t => {
                      const resp = users.find(u => u.id === t.responsibleId);
                      const isBlocked = isTaskBlocked(t);
                      
                      return (
                        <div 
                          key={t.id} 
                          className={`bg-white dark:bg-zinc-950 border p-3 rounded-2xl shadow-3xs space-y-2 relative transition-all duration-200 ${isBlocked ? 'border-red-450 opacity-80 bg-red-50/10' : 'border-gray-150 dark:border-zinc-850 hover:border-orange-500/40'}`}
                        >
                          
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] font-bold font-mono uppercase px-1.5 py-0.2 rounded ${t.priority === "Urgente" ? "bg-red-100 text-red-700" : "bg-gray-100 dark:bg-zinc-900 text-gray-500"}`}>
                              {t.priority}
                            </span>
                            <span className="text-[8px] uppercase font-bold text-gray-400 font-mono">
                              {t.sector}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-xs text-gray-900 dark:text-white leading-tight flex items-center gap-1">
                            {isBlocked && <Lock size={12} className="text-red-500 shrink-0" />}
                            <span>{t.title}</span>
                          </h4>
                          {t.description && <p className="text-[10px] text-gray-400 line-clamp-2">{t.description}</p>}

                          {/* Block alert indicator */}
                          {isBlocked && (
                            <div className="p-1 px-2 bg-red-100/50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg text-[8px] flex items-center gap-1 font-mono font-bold border border-red-200/40">
                              <AlertTriangle size={10} />
                              <span className="truncate">Bloqueio: "Aguardar {getParentTaskText(t)}"</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center text-[9px] text-gray-400 font-mono pt-1">
                            <span>Prazo: {t.dueDate}</span>
                            <span className="font-semibold text-gray-600 dark:text-gray-300">
                              {resp ? resp.name.split(" ")[0] : "Operador"}
                            </span>
                          </div>

                          <div className="flex justify-end gap-1.5 pt-1.5 border-t dark:border-zinc-900">
                            <button
                              onClick={() => handleMoveStatus(t.id, t.status, 'tras')}
                              disabled={isBlocked}
                              className={`p-1 rounded text-gray-400 ${isBlocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-gray-50'}`}
                              title="Recuar status"
                            >
                              <ArrowLeft size={11} />
                            </button>
                            <button
                              onClick={() => handleMoveStatus(t.id, t.status, 'frente')}
                              disabled={isBlocked}
                              className={`p-1 rounded text-gray-400 ${isBlocked ? 'cursor-not-allowed opacity-40' : 'hover:bg-gray-50'}`}
                              title="Avançar status"
                            >
                              <ArrowRight size={11} />
                            </button>
                            
                            <button
                              onClick={() => deleteTask(t.id)}
                              className="p-1 hover:bg-red-50 text-red-500 rounded cursor-pointer ml-1"
                              title="Excluir"
                            >
                              <Trash size={11} />
                            </button>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewType === 'list' && (
        <div className="bg-white dark:bg-zinc-950 border border-gray-150 dark:border-zinc-850 rounded-3xl overflow-hidden shadow-3xs">
          <div className="p-4 bg-gray-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-[10px] uppercase font-black tracking-wide text-gray-400 grid grid-cols-12 gap-2">
            <div className="col-span-4">Atividade / Demanda</div>
            <div className="col-span-2">Setor</div>
            <div className="col-span-2 text-center">Início / Entrega</div>
            <div className="col-span-2 text-center">Responsável</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-center"></div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-zinc-900">
            {filteredTasks.length === 0 ? (
              <p className="text-xs text-gray-400 p-8 text-center font-bold">Nenhuma demanda atende aos filtros de pesquisa.</p>
            ) : (
              filteredTasks.map(t => {
                const resp = users.find(u => u.id === t.responsibleId);
                const isBlocked = isTaskBlocked(t);

                return (
                  <div key={t.id} className={`p-4 grid grid-cols-12 gap-2 items-center text-xs ${isBlocked ? 'bg-red-500/5 select-none opacity-85' : 'hover:bg-gray-50/60 dark:hover:bg-zinc-900/10'}`}>
                    
                    <div className="col-span-4 space-y-1">
                      <strong className={`text-gray-900 dark:text-zinc-100 font-extrabold flex items-center gap-1.5 ${t.status === "Concluida" ? "line-through text-gray-400" : ""}`}>
                        {isBlocked ? <Lock size={12} className="text-red-500 shrink-0" /> : <Unlock size={12} className="text-gray-300" />}
                        <span>{t.title}</span>
                      </strong>
                      <p className="text-[10px] text-gray-400 max-w-sm font-light truncate">{t.description || "Sem descrição adicional"}</p>
                      {isBlocked && (
                        <span className="text-[9px] font-bold text-red-500 block font-mono">🔒 Bloqueado: Depende de "{getParentTaskText(t)}"</span>
                      )}
                    </div>

                    <div className="col-span-2">
                      <span className="bg-gray-100 dark:bg-zinc-900 text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded text-gray-500 font-mono">
                        {t.sector}
                      </span>
                    </div>

                    <div className="col-span-2 text-center text-gray-400 font-mono font-semibold">{t.dueDate}</div>

                    <div className="col-span-2 text-center font-bold text-gray-700 dark:text-zinc-350">{resp ? resp.name : "Integrador"}</div>

                    <div className="col-span-1 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black font-mono scale-90 ${t.status === "Concluida" ? "bg-emerald-100 text-emerald-800" : t.status === "Atrasada" ? "bg-red-100 text-red-800" : t.status === "Em Andamento" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}>
                        {t.status}
                      </span>
                    </div>

                    {/* Quick Move Status Arrows */}
                    <div className="col-span-1 flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleMoveStatus(t.id, t.status, 'tras')}
                        disabled={isBlocked}
                        className={`p-1 text-gray-450 hover:bg-gray-150 rounded ${isBlocked ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        <ArrowLeft size={11} />
                      </button>
                      <button
                        onClick={() => handleMoveStatus(t.id, t.status, 'frente')}
                        disabled={isBlocked}
                        className={`p-1 text-gray-450 hover:bg-gray-150 rounded ${isBlocked ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        <ArrowRight size={11} />
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewType === 'calendar' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-zinc-950 p-4 border border-gray-150 dark:border-zinc-850 rounded-2xl">
            <div className="flex items-center gap-1.5">
              <CalendarRange className="text-[var(--color-primary)]" size={18} />
              <strong className="text-xs uppercase text-gray-500 font-mono">Junção de Eventos & Prazos (Maio 2026)</strong>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Selecione uma data para inspecionar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* MONTH CELL GRID */}
            <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-850 md:col-span-8 space-y-4">
              <span className="text-[11px] font-extrabold uppercase text-gray-400 font-mono block tracking-wider">Maio 2026</span>
              
              <div className="grid grid-cols-7 gap-2.5 text-center font-sans font-bold text-[9px] uppercase text-gray-400">
                <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
              </div>

              <div className="grid grid-cols-7 gap-2.5">
                {/* Simulated padding off days */}
                <div className="p-2 border border-transparent"></div>
                <div className="p-2 border border-transparent"></div>
                <div className="p-2 border border-transparent border-dashed"></div>
                <div className="p-2 border border-transparent border-dashed"></div>
                <div className="p-2 border border-transparent border-dashed"></div>
                
                {/* 1 to 31 Days */}
                {getDaysInMonth().map((dayStr) => {
                  const dayNum = Number(dayStr.split("-")[2]);
                  const hasTasks = filteredTasks.some(t => t.dueDate === dayStr);
                  const isSelected = selectedCalendarDate === dayStr;

                    return (
                      <button
                        key={dayStr}
                        onClick={() => setSelectedCalendarDate(dayStr)}
                        className={`p-1 sm:p-2 border rounded-xl font-sans font-extrabold text-xs relative flex flex-col items-center justify-center transition-all cursor-pointer ${isSelected ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs scale-105' : hasTasks ? 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 text-orange-600 font-black' : 'bg-gray-50/50 dark:bg-zinc-900/30 border-gray-150 dark:border-zinc-850 text-gray-600 dark:text-zinc-400 hover:border-orange-500/40'}`}
                      >
                      <span>{dayNum}</span>
                      {hasTasks && (
                        <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-orange-500'}`}></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DAY INSPECTION CELL COLUMN */}
            <div className="bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-850 p-6 rounded-3xl md:col-span-4 space-y-4">
              <div className="border-b dark:border-zinc-800 pb-2 flex justify-between items-center text-[10px] uppercase font-mono tracking-widest text-gray-400">
                <span>Agenda do Dia</span>
                <strong>{selectedCalendarDate}</strong>
              </div>

              {filteredTasks.filter(t => t.dueDate === selectedCalendarDate).length === 0 ? (
                <div className="py-20 text-center text-gray-400 block border-2 border-dashed dark:border-zinc-850 rounded-2xl">
                  <Clock size={20} className="mx-auto mb-1 opacity-40 text-gray-500" />
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wide">Sem demandas agendadas</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.filter(t => t.dueDate === selectedCalendarDate).map(task => {
                    const isBlocked = isTaskBlocked(task);
                    return (
                      <div key={task.id} className={`p-3 bg-white dark:bg-zinc-950 border rounded-xl space-y-1 ${isBlocked ? 'border-red-400' : 'border-gray-150'}`}>
                        <span className="text-[8px] uppercase tracking-wider font-extrabold text-orange-600 bg-orange-100/50 px-1.5 py-0.2 rounded font-mono">{task.priority}</span>
                        <strong className="text-xs text-gray-800 dark:text-zinc-100 block">{task.title}</strong>
                        <p className="text-[10px] text-gray-400 line-clamp-2">{task.description}</p>
                        {isBlocked && (
                          <span className="text-[8px] font-bold text-red-500 block">🔒 Bloqueado</span>
                        )}
                        <span className={`text-[9px] w-max font-extrabold px-1.5 rounded uppercase mt-2 block font-mono ${task.status === "Concluida" ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{task.status}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default KanbanView;
