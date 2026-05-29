import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Employee, User, UserProfile } from "../types";
import { 
  Plus, Search, UserCheck, ShieldAlert, FileText, Download, Edit, 
  Trash, Users, Eye, ArrowUp, ArrowDown, FolderPlus, KeyRound, ChevronRight, ChevronLeft, X,
  Calendar, CheckSquare, Clock, Award, Clipboard, ShieldCheck, Mail, Phone,
  MapPin, Check, Heart, Sparkles, AlertCircle
} from "lucide-react";

export const WorkersView: React.FC = () => {
  const { 
    employees, addEmployee, updateEmployee, deleteEmployee,
    users, addUser, updateUser, deleteUser, currentUser
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'equipe' | 'organograma' | 'usuarios'>('equipe');
  const [searchQuery, setSearchQuery] = useState("");

  // EMPLOYEE FORM STATE (Dados completos)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("Diretoria");
  const [bankName, setBankName] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [notes, setNotes] = useState("");
  const [simulatedDocuments, setSimulatedDocuments] = useState<any[]>([]);

  // Selected Employee Operational Dashboard Modal state
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeDashboardTab, setActiveDashboardTab] = useState<'dados' | 'eventos' | 'tarefas' | 'checklists' | 'ponto' | 'ocorrencias'>('dados');

  // User editable weekly schedule / work scale
  interface WeeklyScheduleItem {
    id: string;
    day: string;
    hours: string;
    location: string;
    isShowEvent?: boolean;
  }

  const [employeeScales, setEmployeeScales] = useState<Record<string, WeeklyScheduleItem[]>>({
    '1': [
      { id: 'sc_1', day: 'Segunda-feira', hours: '09:00 às 18:00', location: 'Plano Sede GS Escritório' },
      { id: 'sc_2', day: 'Terça-feira', hours: '09:00 às 18:00', location: 'Plano Sede GS Escritório' },
      { id: 'sc_3', day: 'Sexta-feira (Show)', hours: '14:05 às 23:05', location: 'Escala de Apoio Técnico Campo', isShowEvent: true }
    ],
    '2': [
      { id: 'sc_4', day: 'Quarta-feira', hours: '10:00 às 19:00', location: 'Plano Sede GS Escritório' },
      { id: 'sc_5', day: 'Quinta-feira', hours: '10:00 às 19:00', location: 'Plano Sede GS Escritório' }
    ]
  });

  // States to add/edit work scales
  const [editingScaleId, setEditingScaleId] = useState<string | null>(null);
  const [scaleDay, setScaleDay] = useState("");
  const [scaleHours, setScaleHours] = useState("");
  const [scaleLocation, setScaleLocation] = useState("");
  const [showAddScaleForm, setShowAddScaleForm] = useState(false);

  // Tab container scroll ref
  const workersTabContainerRef = useRef<HTMLDivElement>(null);

  const scrollWorkersTabs = (direction: 'left' | 'right') => {
    if (workersTabContainerRef.current) {
      const scrollAmount = 240;
      workersTabContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSaveScale = (employeeId: string) => {
    if (!scaleDay || !scaleHours || !scaleLocation) return;
    const currentScales = employeeScales[employeeId] || [];
    if (editingScaleId) {
      const updated = currentScales.map(sc =>
        sc.id === editingScaleId ? { ...sc, day: scaleDay, hours: scaleHours, location: scaleLocation } : sc
      );
      setEmployeeScales({ ...employeeScales, [employeeId]: updated });
      setEditingScaleId(null);
    } else {
      const newItem = {
        id: `sc_${Date.now()}`,
        day: scaleDay,
        hours: scaleHours,
        location: scaleLocation
      };
      setEmployeeScales({
        ...employeeScales,
        [employeeId]: [...currentScales, newItem]
      });
    }
    setScaleDay("");
    setScaleHours("");
    setScaleLocation("");
    setShowAddScaleForm(false);
  };

  const handleStartEditScale = (item: WeeklyScheduleItem) => {
    setEditingScaleId(item.id);
    setScaleDay(item.day);
    setScaleHours(item.hours);
    setScaleLocation(item.location);
    setShowAddScaleForm(true);
  };

  const handleDeleteScale = (employeeId: string, itemId: string) => {
    const filt = (employeeScales[employeeId] || []).filter(sc => sc.id !== itemId);
    setEmployeeScales({ ...employeeScales, [employeeId]: filt });
    if (editingScaleId === itemId) {
      setEditingScaleId(null);
      setScaleDay("");
      setScaleHours("");
      setScaleLocation("");
      setShowAddScaleForm(false);
    }
  };

  // USER INVITE FORM STATE
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteProfile, setInviteProfile] = useState<UserProfile>("Operacional");
  const [inviteName, setInviteName] = useState("");

  // Simulated live metrics, scales, tasks, checklists, reports, timeclocks and administrative logs for the employee cockpit
  interface LiveEmpEvent {
    id: string;
    name: string;
    date: string;
    role: string;
    scale: string;
    status: 'Ativo' | 'Finalizado';
  }

  interface LiveEmpTask {
    id: string;
    title: string;
    dueDate: string;
    status: 'Concluída' | 'Em Andamento' | 'Atrasada' | 'Pendente';
    priority: 'Normal' | 'Urgente' | 'Alta';
  }

  interface LiveEmpChecklist {
    id: string;
    title: string;
    date: string;
    status: 'Respondido' | 'Pendente';
    itemsCount: number;
    filledItems: string[];
  }

  interface LiveEmpReport {
    id: string;
    title: string;
    assignedDate: string;
    status: 'Preenchido' | 'Pendente';
    summary: string;
  }

  interface LiveEmpOccurrence {
    id: string;
    date: string;
    type: 'elogio' | 'advertencia' | 'observacao';
    title: string;
    details: string;
    author: string;
  }

  interface LiveEmpTimeClock {
    id: string;
    date: string;
    entry: string;
    exitLunch: string;
    entryLunch: string;
    exit: string;
    hours: string;
    justification?: string;
  }

  const [simulatedEmpEvents, setSimulatedEmpEvents] = useState<Record<string, LiveEmpEvent[]>>({
    '1': [
      { id: 'ev_1', name: 'Show de Encerramento Corporativo', date: '2026-05-24', role: 'Coordenador Operacional Geral', scale: '14:00 às 22:00', status: 'Ativo' },
      { id: 'ev_2', name: 'Festa de Gala de Outono', date: '2026-05-15', role: 'Planejador de Equipes', scale: '09:00 às 18:00', status: 'Finalizado' },
      { id: 'ev_3', name: 'Congresso Internacional de Inovação', date: '2026-05-02', role: 'Supervisor Técnico Geral', scale: '08:00 às 17:00', status: 'Finalizado' }
    ]
  });

  const [simulatedEmpTasks, setSimulatedEmpTasks] = useState<Record<string, LiveEmpTask[]>>({
    '1': [
      { id: 'tk_1', title: 'Revisar cabeamento de som principal e barramento de antenas', dueDate: '2026-05-24', status: 'Concluída', priority: 'Urgente' },
      { id: 'tk_2', title: 'Confirmar entrega física de crachás adicionais de camarotes', dueDate: '2026-05-25', status: 'Concluída', priority: 'Alta' },
      { id: 'tk_3', title: 'Entregar laudo final acústico do mezanino operacional', dueDate: '2026-05-29', status: 'Em Andamento', priority: 'Normal' },
      { id: 'tk_4', title: 'Emitir checklist técnico de desmobilização e entrega de salas', dueDate: '2026-05-30', status: 'Pendente', priority: 'Normal' }
    ]
  });

  const [simulatedEmpChecklists, setSimulatedEmpChecklists] = useState<Record<string, LiveEmpChecklist[]>>({
    '1': [
      { id: 'chk_1', title: 'Checklist de Segurança Operacional da Arena Principal', date: '2026-05-24', status: 'Respondido', itemsCount: 4, filledItems: ['Alvará de bombeiros verificado', 'Saídas de emergência desimpedidas', 'Equipe de socorro em posto', 'Iluminação sobressalente ligada'] },
      { id: 'chk_2', title: 'Checklist de Visita Técnica Preliminar - Hotel Transamérica', date: '2026-05-15', status: 'Respondido', itemsCount: 2, filledItems: ['Gabarito elétrico verificado', 'Acessibilidade de geradores ok'] }
    ]
  });

  const [simulatedEmpReports, setSimulatedEmpReports] = useState<Record<string, LiveEmpReport[]>>({
    '1': [
      { id: 'rp_1', title: 'Laudo Técnico de Engenharia Civil de Mezanino', assignedDate: '2026-05-23', status: 'Preenchido', summary: 'Laudo de liberação assinado emitido com ART de montagem de passarelas metálicas.' },
      { id: 'rp_2', title: 'Relatório Final de Encerramento de Atividades de Equipe', assignedDate: '2026-05-30', status: 'Pendente', summary: 'Relatório sintetizado de despesas de transportes operacionais terceirizados.' }
    ]
  });

  const [simulatedEmpTimeClock, setSimulatedEmpTimeClock] = useState<Record<string, LiveEmpTimeClock[]>>({
    '1': [
      { id: 'tc_1', date: '2026-05-25', entry: '08:58', exitLunch: '12:02', entryLunch: '13:00', exit: '18:04', hours: '8h 06m' },
      { id: 'tc_2', date: '2026-05-24', entry: '09:03', exitLunch: '12:00', entryLunch: '13:02', exit: '18:00', hours: '7h 55m', justification: 'Leve atraso decorrente de trânsito intenso monitorado na via expressa.' },
      { id: 'tc_3', date: '2026-05-23', entry: '08:55', exitLunch: '12:05', entryLunch: '13:00', exit: '18:10', hours: '8h 10m' }
    ]
  });

  const [simulatedEmpOccurrences, setSimulatedEmpOccurrences] = useState<Record<string, LiveEmpOccurrence[]>>({
    '1': [
      { id: 'oc_1', date: '2026-05-22', type: 'elogio', title: 'Destaque Operacional', details: 'Excelente postura e rapidez de raciocínio na coordenação do mestre de cerimônias durante imprevisto com o telão.', author: 'Admin GESTOR' },
      { id: 'oc_2', date: '2026-05-10', type: 'observacao', title: 'Esquecimento de Crachá Físico', details: 'Esqueceu o crachá físico de identificação da marca GS, solicitou segunda via provisória na portaria.', author: 'Administrativo' }
    ]
  });

  // Checklist popup selection
  const [selectedChecklist, setSelectedChecklist] = useState<LiveEmpChecklist | null>(null);

  // Administrative Occurrence input variables for real-time simulation additions
  const [newOccType, setNewOccType] = useState<'elogio' | 'advertencia' | 'observacao'>('elogio');
  const [newOccTitle, setNewOccTitle] = useState("");
  const [newOccDetails, setNewOccDetails] = useState("");

  const handleCreateOccurrence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !newOccTitle || !newOccDetails) return;

    const newOccItem: LiveEmpOccurrence = {
      id: "live_eoc_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      type: newOccType,
      title: newOccTitle,
      details: newOccDetails,
      author: currentUser.name || "DP Admin"
    };

    setSimulatedEmpOccurrences(prev => ({
      ...prev,
      [selectedEmployee.id]: [newOccItem, ...(prev[selectedEmployee.id] || [])]
    }));

    // Reset inputs
    setNewOccTitle("");
    setNewOccDetails("");
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployeeId(emp.id);
    setFullName(emp.fullName);
    setCpf(emp.cpf);
    setRg(emp.rg || "");
    setBirthDate(emp.birthDate || "");
    setPhone(emp.phone);
    setEmail(emp.email);
    setAddress(emp.address);
    setRole(emp.role);
    setDepartment(emp.department);
    setBankName(emp.bankName || "");
    setPixKey(emp.pixKey || "");
    setNotes(emp.notes || "");
    setSimulatedDocuments(emp.documents || []);
    setIsFormOpen(true);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !cpf || !phone) return;

    const data = {
      fullName,
      cpf,
      rg,
      birthDate,
      phone,
      email,
      address,
      role,
      department,
      bankName,
      pixKey,
      notes,
      documents: simulatedDocuments,
      active: true,
      workHoursPerDay: 8
    };

    if (editingEmployeeId) {
      updateEmployee(editingEmployeeId, data);
    } else {
      addEmployee(data);
    }

    // Reset Employee state
    setIsFormOpen(false);
    setEditingEmployeeId(null);
    setFullName("");
    setCpf("");
    setRg("");
    setBirthDate("");
    setPhone("");
    setEmail("");
    setAddress("");
    setRole("");
    setDepartment("Diretoria");
    setBankName("");
    setPixKey("");
    setNotes("");
    setSimulatedDocuments([]);
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;
    
    addUser({
      name: inviteName,
      email: inviteEmail,
      profile: inviteProfile,
      sector: inviteProfile === "DP" ? "DP" : "Operações",
      active: true,
      avatar: "🙋‍♂️"
    });

    setInviteEmail("");
    setInviteName("");
    setIsInviteOpen(false);
  };

  // Simulated Document upload helpers
  const handleAddMockDocument = () => {
    const docNames = ["RG_VERSO.png", "CERTIFICADO_NR10_ELET.pdf", "CERTIF_NR35_ALTURA.pdf", "ASO_MEDICO_OCUPACIONAL.pdf", "COMPATIBILIDADE_VALES.pdf"];
    const randName = docNames[Math.floor(Math.random() * docNames.length)];
    const newDoc = {
      id: "doc_" + Date.now(),
      name: `ANEXO_${randName}`,
      url: "#",
      size: `${(Math.random() * 1.5 + 0.6).toFixed(1)} MB`,
      date: new Date().toISOString().split("T")[0]
    };
    setSimulatedDocuments(prev => [...prev, newDoc]);
  };

  const handleRemoveMockDocument = (docId: string) => {
    setSimulatedDocuments(prev => prev.filter(d => d.id !== docId));
  };

  // Filters
  const filteredEmployees = employees.filter(e => 
    e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.profile.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Grouped by departments for Organograma Interativo (Pág 24, 61)
  const departments = ["Diretoria", "Administrativo", "Departamento Pessoal", "Produção", "Vendas"];

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Fichas & Equipes Corporativas</h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">Gestão de colaboradores integrados, controle de ponto, visualização de organograma interativo e acessos.</p>
        </div>
        <div className="flex items-center gap-2">
          {currentUser.profile === "Admin" && (
            <button
              onClick={() => setIsInviteOpen(true)}
              className="bg-white hover:bg-gray-50 border border-gray-150 text-gray-700 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-800 dark:text-zinc-300 font-bold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
            >
              <KeyRound size={14} className="text-amber-500" /> Liberar Novo Convite
            </button>
          )}
          {(currentUser.profile === "Admin" || currentUser.profile === "DP") && (
            <button
              onClick={() => {
                setEditingEmployeeId(null);
                setSimulatedDocuments([]);
                setIsFormOpen(true);
              }}
              className="bg-[var(--color-primary)] text-white hover:opacity-90 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
            >
              <Plus size={16} /> Contratar Colaborador (Ficha)
            </button>
          )}
        </div>
      </div>

      {/* FILTER & INTER-SUB-TAB LAYOUT ROW */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-3xs">
        
        {/* Navigation Selector Sub Tabs */}
        <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl self-start font-mono font-bold text-[10px]">
          <button 
            onClick={() => setActiveSubTab('equipe')}
            className={`px-4 py-2 rounded-lg uppercase tracking-wider font-extrabold transition-all ${activeSubTab === 'equipe' ? 'bg-white dark:bg-zinc-950 text-gray-950 dark:text-zinc-100 shadow-2xs' : 'text-gray-400 hover:text-gray-650'}`}
          >
            👥 Fichas Cadastrais ({filteredEmployees.length})
          </button>
          <button 
            onClick={() => setActiveSubTab('organograma')}
            className={`px-4 py-2 rounded-lg uppercase tracking-wider font-extrabold transition-all ${activeSubTab === 'organograma' ? 'bg-white dark:bg-zinc-950 text-gray-950 dark:text-zinc-100 shadow-2xs' : 'text-gray-400 hover:text-gray-650'}`}
          >
            🏢 Organograma Corporativo
          </button>
          <button 
            onClick={() => setActiveSubTab('usuarios')}
            className={`px-4 py-2 rounded-lg uppercase tracking-wider font-extrabold transition-all ${activeSubTab === 'usuarios' ? 'bg-white dark:bg-zinc-950 text-gray-950 dark:text-zinc-100 shadow-2xs' : 'text-gray-400 hover:text-gray-650'}`}
          >
            🎟️ Usuários & Perfis Ativos
          </button>
        </div>

        {/* Searching bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Pesquise por nome, cargo ou departamento do membro..."
            className="w-full pl-9 pr-4 py-2 border dark:border-zinc-850 rounded-xl bg-gray-50/70 dark:bg-gray-900 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* EMPLOYEE MAILING CREATOR / EDITOR FORM CONTAINER CARD */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-105 dark:border-gray-800 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b dark:border-gray-850 pb-2">
            <h3 className="font-extrabold text-sm text-gray-850 dark:text-gray-200 uppercase tracking-widest font-mono flex items-center gap-1">
              <span>{editingEmployeeId ? "📝 Editar Informações Cadastrais da Ficha" : "💼 Contratar Colaborador Administrativo & Operacional"}</span>
            </h3>
            <button onClick={() => setIsFormOpen(false)} className="p-1 text-gray-400 hover:bg-gray-50 rounded">
              ✕
            </button>
          </div>

          <form onSubmit={handleSaveEmployee} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nome Completo *</label>
              <input
                type="text"
                required
                placeholder="Ex: João da Silva Santos"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs focus:outline-none font-bold"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">CPF (Mascarado) *</label>
              <input
                type="text"
                required
                placeholder="000.000.000-00"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs focus:outline-none"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">RG Civil</label>
              <input
                type="text"
                placeholder="00.000.000-0"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs focus:outline-none"
                value={rg}
                onChange={(e) => setRg(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Data de Nascimento</label>
              <input
                type="date"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs focus:outline-none font-mono"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Celular Operacional *</label>
              <input
                type="text"
                required
                placeholder="(11) 99999-9999"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">E-mail Pessoal</label>
              <input
                type="email"
                placeholder="colaborador@gseventos.com"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Endereço Residencial Completo</label>
              <input
                type="text"
                placeholder="Rua, Número, Bairro, Cidade - Estado"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs focus:outline-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Cargo / Função *</label>
              <input
                type="text"
                required
                placeholder="Ex: Coordenador Técnico"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs focus:outline-none font-semibold text-gray-850 dark:text-zinc-100"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Setor / Departamento</label>
              <select
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs focus:outline-none font-bold text-gray-700 dark:text-zinc-250"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>

            {/* Finances Inputs (Restrito pág 3) */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nome do Banco (Financeiro)</label>
              <input
                type="text"
                placeholder="Banco Itaú / Santander"
                className="w-full p-2.5 bg-purple-500/5 dark:bg-purple-950/10 border border-purple-500/10 rounded-xl text-xs focus:outline-none text-purple-700 dark:text-purple-400 font-medium"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Chave PIX Cadastrada</label>
              <input
                type="text"
                placeholder="financeiro@pix.com"
                className="w-full p-2.5 bg-purple-500/5 dark:bg-purple-950/10 border border-purple-500/10 rounded-xl text-xs focus:outline-none text-purple-700 dark:text-purple-400 font-medium"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
              />
            </div>

            {/* Document attachments preview Conforming to pág 3 ("Anexos / Documentos Upload múltiplo") */}
            <div className="md:col-span-4 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-dashed dark:border-zinc-800 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 font-mono tracking-wider">Múltiplos Anexos & Registro de Documentos do DP</span>
                  <p className="text-[9px] text-gray-500">Adicione CNH, CPF, exames ocupacionais (ASO) ou certificados de NR10, NR35.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMockDocument}
                  className="px-3.5 py-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-lg text-[9px] font-mono font-bold uppercase cursor-pointer"
                >
                  🔋 Inserir Anexo/Upload
                </button>
              </div>

              {simulatedDocuments.length === 0 ? (
                <p className="text-[10px] text-gray-400 italic text-center py-2">Sem anexos eletrônicos inseridos de forma voluntária.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[10px]">
                  {simulatedDocuments.map(doc => (
                    <div key={doc.id} className="p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-xl flex justify-between items-center shadow-3xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-emerald-500 font-semibold text-xs shrink-0">📄</span>
                        <div className="truncate">
                          <strong className="block font-bold text-gray-700 dark:text-zinc-300 truncate">{doc.name}</strong>
                          <span className="text-gray-400 text-[8px]">{doc.size} • Enviado em: {doc.date}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMockDocument(doc.id)}
                        className="p-1 bg-red-100 dark:bg-red-950/20 rounded text-red-500 hover:bg-red-200 shrink-0 transition-opacity"
                        title="Remover anexo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t dark:border-zinc-850">
              <button 
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingEmployeeId(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-250 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-xl font-bold font-mono transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-[var(--color-primary)] text-white font-black uppercase text-[10px] tracking-wider rounded-xl shadow-xs cursor-pointer"
              >
                Salvar Ficha Contratual
              </button>
            </div>
          </form>
        </div>
      )}

      {/* USER INVITTER DIALOG POPUP */}
      {isInviteOpen && (
        <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-105 dark:border-gray-800 space-y-4 shadow-sm max-w-lg mx-auto">
          <div className="flex justify-between items-center border-b dark:border-gray-850 pb-2">
            <h3 className="font-extrabold text-sm text-gray-850 dark:text-gray-200 uppercase tracking-widest font-mono">
              🎟️ Emitir Permissões de Acesso de Nova Credencial
            </h3>
            <button onClick={() => setIsInviteOpen(false)} className="text-gray-400 hover:bg-gray-50 rounded p-1">✕</button>
          </div>
          
          <form onSubmit={handleInviteUser} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nome Completo do Usuário</label>
              <input
                type="text"
                required
                placeholder="Ex: Patricia de Moraes"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs focus:outline-none"
                value={inviteName}
                onChange={e => setInviteName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">E-mail Corporativo de Autenticação</label>
              <input
                type="email"
                required
                placeholder="patricia@gseventos.com"
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs focus:outline-none"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Perfil de Permissão de Entrada (Acesso)</label>
              <select
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs focus:outline-none uppercase font-mono font-bold"
                value={inviteProfile}
                onChange={e => setInviteProfile(e.target.value as UserProfile)}
              >
                <option value="Admin">⚡ Admin GESTOR (Acesso Total)</option>
                <option value="Administrativo">👔 Administrativo (Cadastros & Operações)</option>
                <option value="Escritorio">💻 Escritório (Tarefas & Calendários)</option>
                <option value="DP">📊 Departamento Pessoal (Fichas & Financeiros)</option>
                <option value="Operacional">🚧 Operacional (Checklists & Ponto)</option>
                <option value="Freelancer">🤝 Freelancer (Visualizador Limitado)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t dark:border-zinc-850">
              <button type="button" onClick={() => setIsInviteOpen(false)} className="px-3 py-2 bg-gray-100 hover:bg-gray-250 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-xl font-bold font-mono cursor-pointer">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-xs cursor-pointer">Emitir e Enviar Convite</button>
            </div>
          </form>
        </div>
      )}

      {/* ===================== SUB-TABS RENDER ROUTING ===================== */}

      {/* SUB-TAB 1: EQUIPE (COLABORADORES GRID DE FICHAS) */}
      {activeSubTab === 'equipe' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map(emp => (
            <div 
              key={emp.id} 
              onClick={() => {
                setSelectedEmployee(emp);
                setActiveDashboardTab('dados');
              }}
              className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-205 dark:border-zinc-900 p-5 space-y-4 flex flex-col justify-between relative shadow-3xs cursor-pointer hover:border-[var(--color-primary)]/45 transition-all duration-200"
            >
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-slate-100 dark:bg-zinc-900 p-2.5 rounded-2xl flex items-center justify-center shadow-3xs">
                    {emp.photo || "👤"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[8px] uppercase font-black text-gray-400 font-mono tracking-wider bg-gray-100 dark:bg-zinc-900 px-2.5 py-0.5 rounded-full inline-block mb-1">{emp.department || "Operacional"}</span>
                    <h3 className="font-extrabold text-xs text-gray-950 dark:text-zinc-50 leading-tight truncate">{emp.fullName}</h3>
                    <span className="text-[10px] text-[var(--color-primary)] font-bold mt-0.5 inline-block">{emp.role}</span>
                  </div>
                </div>

                {/* Info List */}
                <div className="space-y-1 text-[11px] text-gray-500 font-mono font-medium">
                  <span className="block truncate">📞 Cel: <strong className="text-gray-800 dark:text-zinc-350">{emp.phone}</strong></span>
                  <span className="block truncate">✉️ Email: <strong className="text-gray-800 dark:text-zinc-350 truncate">{emp.email}</strong></span>
                  <span className="block truncate">📁 CPF: <strong className="text-gray-800 dark:text-zinc-350">{emp.cpf}</strong></span>
                </div>

                {/* Finance badge indicator */}
                {(currentUser.profile === "Admin" || currentUser.profile === "DP") && (emp.bankName || emp.pixKey) && (
                  <div className="bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/10 rounded-xl p-2 px-3 text-[10px] space-y-0.5">
                    <span className="text-purple-700 dark:text-purple-400 uppercase font-mono font-extrabold block text-[8px] tracking-wider">PIX CONVENIADO ✔</span>
                    <span className="text-[10px] text-gray-500 truncate block">Banco: {emp.bankName}</span>
                  </div>
                )}
                
                {/* Simulated files list */}
                <div className="text-[9px] text-gray-400 font-mono flex items-center justify-between">
                  <span>Anexos de DP arquivados:</span>
                  <strong className="text-gray-700 dark:text-gray-300 font-black">📁 {emp.documents.length} arquivos</strong>
                </div>
              </div>

              {/* Actions row */}
              <div className="pt-2.5 border-t dark:border-zinc-900 flex justify-between gap-2 items-center text-[10px] font-mono text-gray-400">
                <span className="text-[9px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Ativo em Operação
                </span>
                <span className="text-[9px] font-extrabold text-[var(--color-primary)] uppercase">ABRIR DASHBOARD 👤</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 2: ORGANOGRAMA INTERATIVO DESIGN */}
      {activeSubTab === 'organograma' && (
        <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6">
          <div className="text-xs">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase font-mono tracking-wider">Organograma Corporativo Divisional</h3>
            <p className="text-gray-400 font-sans">Hierarquia física e organizacional estruturada por divisões de cargos ativos.</p>
          </div>

          <div className="space-y-6">
            {departments.map((dep) => {
              const depWorkers = employees.filter(e => e.department === dep && e.active);
              if (depWorkers.length === 0) return null;

              return (
                <div key={dep} className="space-y-3">
                  <div className="flex items-center gap-2 border-b dark:border-gray-900 pb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                    <h4 className="font-extrabold text-[9px] uppercase tracking-widest text-gray-700 dark:text-gray-300 font-mono">
                      Divisão: {dep} ({depWorkers.length} membros credenciados)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {depWorkers.map(emp => (
                      <div 
                        key={emp.id}
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setActiveDashboardTab('dados');
                        }}
                        className="p-4 bg-gray-50/70 dark:bg-zinc-900/50 hover:border-orange-500/30 border border-gray-150 dark:border-zinc-850 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <span className="text-2xl bg-white dark:bg-zinc-950 p-2 rounded-xl shadow-xs leading-none">
                          {emp.photo || "👤"}
                        </span>
                        <div className="min-w-0">
                          <h5 className="font-extrabold text-xs text-gray-900 dark:text-white truncate leading-tight">{emp.fullName}</h5>
                          <span className="text-[10px] text-[var(--color-primary)] font-bold block mt-0.5">{emp.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: USUÁRIOS & PERMISSÕES */}
      {activeSubTab === 'usuarios' && (
        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-150 dark:border-zinc-900 overflow-hidden shadow-3xs">
          <div className="p-4 border-b dark:border-zinc-900 text-[10px] font-bold text-gray-400 bg-gray-50/50 dark:bg-zinc-900/10 font-mono uppercase tracking-widest">
            Mapeamento de Credenciais de Perfis de Entrada no Sistema
          </div>
          
          <div className="divide-y dark:divide-gray-900">
            {filteredUsers.map(user => (
              <div key={user.id} className="p-4 flex items-center justify-between gap-4 text-xs hover:bg-gray-50/60 dark:hover:bg-gray-900/10 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{user.avatar}</span>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-gray-950 dark:text-zinc-50 truncate">{user.name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono truncate block">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] font-black px-2.5 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] uppercase tracking-wider">
                    Privilégio: {user.profile}
                  </span>
                  
                  {/* Status toggle checkbox */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateUser(user.id, { active: !user.active })}
                      className={`text-[8px] uppercase font-mono font-black px-2 py-1 rounded-md border ${user.active ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}
                    >
                      {user.active ? "Verificado" : "Suspenso"}
                    </button>
                    
                    {currentUser.profile === "Admin" && (
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/25 rounded-md transition-all"
                        title="Remover acesso definitivo"
                      >
                        <Trash size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== COMPLETE OPERATIONAL EMPLOYEE DASHBOARD COCKPIT ==================== */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-gray-900/40 dark:bg-zinc-950/75 backdrop-blur-sm z-50 flex items-center justify-center md:p-4 p-0 overflow-y-auto select-none animate-fadeIn">
          <div className="bg-white dark:bg-zinc-950 md:rounded-3xl rounded-none border border-gray-150 dark:border-zinc-850 shadow-2xl max-w-4xl w-full md:max-h-[85vh] h-full md:h-auto overflow-hidden flex flex-col">
            
            {/* Modal TOP HEADER */}
            <div className="p-6 border-b dark:border-zinc-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 dark:bg-zinc-900/20">
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-slate-100 dark:bg-zinc-900 p-2 rounded-2xl flex items-center justify-center shrink-0">
                  {selectedEmployee.photo || "👤"}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-gray-950 dark:text-zinc-50 leading-none">{selectedEmployee.fullName}</h3>
                    <span className="text-[8px] uppercase font-black tracking-widest px-2.5 py-0.5 bg-indigo-500/10 text-indigo-500 rounded-full font-mono">
                      Ficha {selectedEmployee.department || 'DP'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono mt-1">Cargo: <strong className="text-[var(--color-primary)]">{selectedEmployee.role}</strong> | CPF: {selectedEmployee.cpf}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-1.5 px-3 bg-gray-100 hover:bg-gray-250 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-xl font-bold font-mono text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-all border dark:border-zinc-800"
              >
                <X size={12} /> Fechar Central Colaborador
              </button>
            </div>

            {/* AUTOMATIC TOP INDICATORS PANEL FOR EMPLOYEE (DASHBOARD KPI) */}
            <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-5 gap-3 border-b dark:border-zinc-850 bg-white dark:bg-zinc-950">
              
              <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-0.5 text-center">
                <strong className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {selectedEmployee.id === '1' ? '6 eventos' : '3 eventos'}
                </strong>
                <span className="text-[8px] text-gray-400 block font-mono font-extrabold uppercase tracking-wide">Trabalhados</span>
              </div>

              <div className="p-2.5 bg-indigo-500/5 border border-indigo-500/15 rounded-xl space-y-0.5 text-center">
                <strong className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {selectedEmployee.id === '1' ? '14 tarefas' : '5 tarefas'}
                </strong>
                <span className="text-[8px] text-gray-400 block font-mono font-extrabold uppercase tracking-wide">Tarefas Feitas</span>
              </div>

              <div className="p-2.5 bg-orange-500/5 border border-orange-500/15 rounded-xl space-y-0.5 text-center">
                <strong className="text-xs font-black text-orange-600 dark:text-orange-400 font-mono">
                  {selectedEmployee.id === '1' ? '8 respondidos' : '3 respondidos'}
                </strong>
                <span className="text-[8px] text-gray-400 block font-mono font-extrabold uppercase tracking-wide">Checklists Enviados</span>
              </div>

              <div className="p-2.5 bg-purple-500/5 border border-purple-500/15 rounded-xl space-y-0.5 text-center">
                <strong className="text-xs font-black text-purple-600 dark:text-purple-400 font-mono">
                  {selectedEmployee.id === '1' ? '4 preenchidos' : '1 preenchido'}
                </strong>
                <span className="text-[8px] text-gray-400 block font-mono font-extrabold uppercase tracking-wide">Laudos / Relatórios</span>
              </div>

              <div className="p-2.5 bg-blue-500/5 border border-blue-500/15 rounded-xl space-y-0.5 text-center col-span-2 sm:col-span-1">
                <strong className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
                  {selectedEmployee.id === '1' ? '48 horas' : '16 horas'}
                </strong>
                <span className="text-[8px] text-gray-400 block font-mono font-extrabold uppercase tracking-wide">Horas Trabalhadas</span>
              </div>

            </div>

            {/* Modern Unified Flex-Wrap Tabs (No scrolling required) */}
            <div className="p-4 border-b border-slate-150/60 dark:border-zinc-850 bg-gray-50/10 dark:bg-zinc-950/20 select-none">
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveDashboardTab('dados')}
                  className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                    activeDashboardTab === 'dados' 
                      ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                      : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  👤 Cadastro & Documentos
                </button>
                <button 
                  onClick={() => setActiveDashboardTab('eventos')}
                  className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                    activeDashboardTab === 'eventos' 
                      ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                      : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  🕒 Histórico & Escalas
                </button>
                <button 
                  onClick={() => setActiveDashboardTab('tarefas')}
                  className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                    activeDashboardTab === 'tarefas' 
                      ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                      : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  📋 Quadro de Tarefas
                </button>
                <button 
                  onClick={() => setActiveDashboardTab('checklists')}
                  className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                    activeDashboardTab === 'checklists' 
                      ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                      : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  📝 Checklists & Laudos
                </button>
                <button 
                  onClick={() => setActiveDashboardTab('ponto')}
                  className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                    activeDashboardTab === 'ponto' 
                      ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                      : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  ⏱️ Ponto & Justificativas
                </button>
                <button 
                  onClick={() => setActiveDashboardTab('ocorrencias')}
                  className={`px-4 py-2 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs hover:scale-[1.01] active:scale-95 ${
                    activeDashboardTab === 'ocorrencias' 
                      ? 'bg-[var(--color-primary)] text-white font-extrabold' 
                      : 'bg-white hover:bg-gray-50/70 border border-slate-200/50 text-gray-500 hover:text-gray-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:border-zinc-850 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  ⚠️ Elogios & Ocorrências ({(simulatedEmpOccurrences[selectedEmployee.id] || []).length})
                </button>
              </div>
            </div>

            {/* Content Scrollable Area */}
            <div className="p-6 overflow-y-auto flex-1 font-sans text-xs">
              
              {/* TAB 1: DADOS CADASTRAIS */}
              {activeDashboardTab === 'dados' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-zinc-900/30 p-4 rounded-2xl border dark:border-zinc-850 space-y-3">
                    <span className="text-[10px] font-black uppercase text-[var(--color-primary)] font-mono tracking-wider">IDENTIFICAÇÃO CIVIL DO TRABALHADOR</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">Nome Civil Inteiro</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5">{selectedEmployee.fullName}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">Data de Nascimento</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5">{selectedEmployee.birthDate || "14/08/1991"}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">Cadastro de Pessoa Física (CPF)</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5">{selectedEmployee.cpf}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">Registro Geral (RG)</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5">{selectedEmployee.rg || "32.441.512-1"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-900/30 p-4 rounded-2xl border dark:border-zinc-850 space-y-3">
                    <span className="text-[10px] font-black uppercase text-[var(--color-primary)] font-mono tracking-wider">CONTATOS & RESIDÊNCIA</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">Celular Operacional</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5">{selectedEmployee.phone}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">E-mail de Contato</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5">{selectedEmployee.email}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-mono block">Endereço Residencial Cadastrado</span>
                        <strong className="text-gray-850 dark:text-zinc-100 text-xs font-bold block mt-0.5 truncate">{selectedEmployee.address || "Não informado"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Finances panel for Admin / DP */}
                  {(currentUser.profile === "Admin" || currentUser.profile === "DP") && (
                    <div className="bg-purple-500/5 dark:bg-purple-950/10 p-4 rounded-2xl border border-purple-500/10 space-y-3 font-mono">
                      <span className="text-[10px] font-black uppercase text-purple-600 block">DADOS FINANCEIROS & PIX CORPORATIVO (RESTRITO AO DP)</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-400 text-[9px] uppercase block">Instituição Bancária Conveniada</span>
                          <strong className="text-purple-950 dark:text-purple-300 text-xs font-bold block mt-0.5">{selectedEmployee.bankName || "Banco Itaú (Padrão Folha)"}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[9px] uppercase block">Chave de Pagamento Pix</span>
                          <strong className="text-purple-950 dark:text-purple-300 text-xs font-bold block mt-0.5">{selectedEmployee.pixKey || "Chave CPF Cadastrada"}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Documents files list */}
                  <div className="bg-slate-50 dark:bg-zinc-900/30 p-4 rounded-2xl border dark:border-zinc-850 space-y-3">
                    <span className="text-[10px] font-black uppercase text-[var(--color-primary)] font-mono tracking-wider">ARQUIVO DE DOCUMENTOS ELETRÔNICOS DO DP</span>
                    <div className="space-y-2">
                      {selectedEmployee.documents && selectedEmployee.documents.map((doc, dIdx) => (
                        <div key={dIdx} className="p-3 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-xl flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-indigo-500">📄</span>
                            <div>
                              <strong className="block font-bold">{doc.name}</strong>
                              <span className="text-[9px] text-gray-400 font-mono">{doc.size || '1.8 MB'} | Catalogado em: {doc.date || '2026-05-24'}</span>
                            </div>
                          </div>
                          <span className="text-[8px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded uppercase font-mono">ARQUIVADO ✔</span>
                        </div>
                      ))}
                      {(!selectedEmployee.documents || selectedEmployee.documents.length === 0) && (
                        <p className="text-[10px] text-gray-400 italic font-mono py-2 text-center">Nenhum certificado, ASO ou comprovante arquivado nesta ficha.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end p-2 border-t dark:border-zinc-900">
                    <button 
                      onClick={() => {
                        handleOpenEdit(selectedEmployee);
                        setSelectedEmployee(null);
                      }}
                      className="px-4 py-2 bg-gray-150 text-gray-800 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:text-zinc-200 border dark:border-zinc-800 rounded-xl font-bold font-sans flex items-center gap-1 cursor-pointer transition-all hover:bg-gray-250"
                    >
                      <Edit size={12} /> Editar dados desta Ficha
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: HISTÓRICO DE EVENTOS & ESCALAS */}
              {activeDashboardTab === 'eventos' && (
                <div className="space-y-6">
                  
                  {/* WORK SCALES / SHIFTS TABLE (Escalas) */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b dark:border-zinc-850 pb-2">
                      <div className="text-xs">
                        <strong className="text-[10px] font-black uppercase text-orange-500 font-mono tracking-wider">Grade de Escalas de Trabalho Atribuídas</strong>
                        <p className="text-gray-400 text-[11px] font-sans">Gerencie os horários planejados para cobertura nos eventos oficiais do mês.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingScaleId(null);
                          setScaleDay("");
                          setScaleHours("");
                          setScaleLocation("");
                          setShowAddScaleForm(!showAddScaleForm);
                        }}
                        className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold font-sans text-[10px] uppercase flex items-center gap-1 transition-all pointer-events-auto"
                      >
                        {showAddScaleForm ? "Fechar Painel" : "➕ Adicionar Nova Escala"}
                      </button>
                    </div>

                    {/* Scale Edit / Add Form */}
                    {showAddScaleForm && (
                      <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl space-y-3 font-sans">
                        <strong className="text-[10px] font-black text-orange-600 block uppercase font-mono">
                          {editingScaleId ? "Editar Horário de Escala" : "Adicionar Nova Escala Semanal"}
                        </strong>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[9px] uppercase font-mono text-gray-400 block mb-1">Dia da Semana (ex: Quarta-feira)</label>
                            <input
                              type="text"
                              value={scaleDay}
                              onChange={(e) => setScaleDay(e.target.value)}
                              placeholder="Segunda-feira"
                              className="w-full bg-white dark:bg-zinc-950 border dark:border-zinc-850 rounded-xl px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-100 font-semibold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase font-mono text-gray-400 block mb-1">Horário (ex: 09:00 às 18:00)</label>
                            <input
                              type="text"
                              value={scaleHours}
                              onChange={(e) => setScaleHours(e.target.value)}
                              placeholder="09:00 às 18:00"
                              className="w-full bg-white dark:bg-zinc-950 border dark:border-zinc-850 rounded-xl px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-100 font-semibold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase font-mono text-gray-400 block mb-1">Local / Plano (ex: Escritório)</label>
                            <input
                              type="text"
                              value={scaleLocation}
                              onChange={(e) => setScaleLocation(e.target.value)}
                              placeholder="Plano Sede GS Escritório"
                              className="w-full bg-white dark:bg-zinc-950 border dark:border-zinc-850 rounded-xl px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-100 font-semibold focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 text-[10px]">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddScaleForm(false);
                              setEditingScaleId(null);
                            }}
                            className="px-3.5 py-1.5 bg-gray-150 text-gray-800 dark:bg-zinc-900 dark:text-zinc-350 rounded-xl font-bold font-sans"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveScale(selectedEmployee.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl font-bold font-sans"
                            disabled={!scaleDay || !scaleHours || !scaleLocation}
                          >
                            {editingScaleId ? "Salvar Alterações" : "Adicionar na Agenda"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Scale List Display */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[10px]">
                      {(employeeScales[selectedEmployee.id] || [
                        { id: 'sc_std_1', day: 'Segunda-feira', hours: '09:00 às 18:00', location: 'Plano Sede GS Escritório' },
                        { id: 'sc_std_2', day: 'Terça-feira', hours: '09:00 às 18:00', location: 'Plano Sede GS Escritório' },
                        { id: 'sc_std_3', day: 'Sexta-feira (Show)', hours: '14:05 às 23:05', location: 'Escala de Apoio Técnico Campo', isShowEvent: true }
                      ]).map((item) => (
                        <div 
                          key={item.id} 
                          className={`p-3 rounded-xl border relative group/scale transition-all ${
                            item.isShowEvent 
                              ? 'bg-orange-500/5 border-orange-500/10 text-orange-600 dark:text-orange-400' 
                              : 'bg-indigo-500/5 border-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          }`}
                        >
                          {/* Hover Action buttons */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/scale:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleStartEditScale(item)}
                              className="p-1 bg-white dark:bg-zinc-900 border dark:border-zinc-800 text-gray-650 hover:text-emerald-600 dark:text-zinc-300 rounded cursor-pointer pointer-events-auto"
                              title="Editar"
                            >
                              <Edit size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteScale(selectedEmployee.id, item.id)}
                              className="p-1 bg-white dark:bg-zinc-900 border dark:border-zinc-800 text-gray-655 hover:text-red-650 dark:text-zinc-300 rounded cursor-pointer pointer-events-auto"
                              title="Excluir"
                            >
                              <Trash size={10} />
                            </button>
                          </div>

                          <span className="font-black block uppercase">{item.day}</span>
                          <strong className="block text-gray-800 dark:text-zinc-100 font-bold mt-1 text-xs">{item.hours}</strong>
                          <span className="text-[8px] text-gray-400 block mt-0.5">{item.location}</span>
                        </div>
                      ))}
                      {(employeeScales[selectedEmployee.id] || []).length === 0 && (
                        <div className="col-span-3 text-center py-4 bg-gray-50/50 dark:bg-zinc-900/10 border border-dashed rounded-xl text-gray-400 font-sans italic text-[11px]">
                          Nenhuma escala semanal cadastrada para este colaborador.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* EVENTS PARTICIPATED LIST */}
                  <div className="space-y-3">
                    <div className="text-xs pb-1 border-b dark:border-zinc-850">
                      <strong className="text-[10px] font-black uppercase text-orange-500 font-mono tracking-wider">Eventos Atribuídos / Participados</strong>
                    </div>

                    <div className="space-y-3 font-mono">
                      {(simulatedEmpEvents[selectedEmployee.id] || [
                        { id: 'ev_std', name: 'Alinhamento em Festividade Sênior', date: '2026-05-10', role: 'Apoio de Campo de Montagem', scale: '18:00 às 02:00', status: 'Finalizado' }
                      ]).map(ev => (
                        <div key={ev.id} className="p-4 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                          <div>
                            <strong className="text-xs font-black text-gray-850 dark:text-zinc-100 block">{ev.name}</strong>
                            <span className="text-[10px] text-gray-400">Data de Cobertura: {ev.date} | Escala: <strong>{ev.scale}</strong></span>
                          </div>
                          <div className="text-[11px] text-right">
                            <span className="text-[var(--color-primary)] font-black block">Cargo: {ev.role}</span>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${ev.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-150 text-gray-700 dark:bg-zinc-800 dark:text-zinc-350'}`}>
                              {ev.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: TAREFAS */}
              {activeDashboardTab === 'tarefas' && (
                <div className="space-y-4">
                  <div className="text-xs pb-1 border-b dark:border-zinc-850">
                    <strong className="text-[10px] font-black uppercase text-orange-500 font-mono tracking-wider">Rastreamento de Checklist e Quadro Kanban de Tarefas</strong>
                    <p className="text-gray-400 text-[11px] font-sans">Tarefas ativas atreladas à responsabilidade direta deste funcionário com monitoramento de prioridades.</p>
                  </div>

                  <div className="space-y-2.5 font-mono">
                    {(simulatedEmpTasks[selectedEmployee.id] || [
                      { id: 'tk_std', title: 'Auxilio geral na arrumação das louças pós-buffet', dueDate: '2026-05-24', status: 'Concluída', priority: 'Normal' }
                    ]).map(tk => (
                      <div key={tk.id} className="p-3.5 bg-slate-50 dark:bg-zinc-900/40 border dark:border-zinc-900 rounded-2xl flex justify-between items-center gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${tk.status === "Concluída" ? "bg-emerald-500" : tk.status === "Atrasada" ? "bg-red-500" : "bg-amber-500 animate-pulse"}`}></span>
                          <div>
                            <strong className="text-xs font-black text-gray-850 dark:text-zinc-50">{tk.title}</strong>
                            <span className="text-[9px] text-indigo-500 block">Vencimento Planejado: {tk.dueDate} | Prioridade: {tk.priority}</span>
                          </div>
                        </div>
                        <span className={`text-[8px] font-bold uppercase font-mono px-2 py-0.5 rounded-full ${tk.status === "Concluída" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {tk.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CHECKLISTS & LAUDOS */}
              {activeDashboardTab === 'checklists' && (
                <div className="space-y-6">
                  
                  {/* Checklists Section */}
                  <div className="space-y-3">
                    <div className="text-xs border-b dark:border-zinc-850 pb-1">
                      <strong className="text-[10px] font-black uppercase text-orange-500 font-mono tracking-wider">Formulários e Checklists preenchidos no Iframe</strong>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(simulatedEmpChecklists[selectedEmployee.id] || []).map(chk => (
                        <div 
                          key={chk.id}
                          onClick={() => setSelectedChecklist(chk)}
                          className="p-4 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-2xl space-y-3 cursor-pointer hover:border-[var(--color-primary)] transition-all group"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[8px] font-mono uppercase bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full font-bold">
                                Checklist Campo
                              </span>
                              <strong className="block text-xs font-black text-gray-850 dark:text-zinc-100 mt-1.5 group-hover:text-[var(--color-primary)]">{chk.title}</strong>
                            </div>
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-mono font-black px-2 py-0.5 rounded">
                              {chk.status}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between">
                            <span>Preenchido em: {chk.date}</span>
                            <span className="text-blue-500 font-semibold">Visualizar Respostas 🔎</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reports Section */}
                  <div className="space-y-3">
                    <div className="text-xs border-b dark:border-zinc-850 pb-1">
                      <strong className="text-[10px] font-black uppercase text-orange-500 font-mono tracking-wider">Laudos Técnicos e Relatórios Respondidos</strong>
                    </div>

                    <div className="space-y-2.5 font-mono">
                      {(simulatedEmpReports[selectedEmployee.id] || []).map(rp => (
                        <div key={rp.id} className="p-3.5 bg-slate-50 dark:bg-zinc-900/40 border dark:border-zinc-900 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                          <div className="space-y-0.5">
                            <strong className="text-xs font-bold text-gray-850 dark:text-zinc-100">{rp.title}</strong>
                            <p className="text-[11px] text-gray-500 italic font-sans pr-2">"{rp.summary}"</p>
                          </div>
                          <div className="shrink-0 text-right text-[10px]">
                            <span className="text-gray-400 block pb-0.5">Atribuído: {rp.assignedDate}</span>
                            <span className={`text-[8px] uppercase font-bold px-2 py-0.5 rounded ${rp.status === 'Preenchido' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {rp.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: CONTROLE DE PONTO */}
              {activeDashboardTab === 'ponto' && (
                <div className="space-y-4">
                  <div className="text-xs border-b dark:border-zinc-850 pb-1">
                    <strong className="text-[10px] font-black uppercase text-orange-500 font-mono tracking-wider">Registros do Ponto Eletrônico e Horas Trabalhadas</strong>
                    <p className="text-gray-400 text-[11px] mt-0.5">Historicamente catalogados pelo aplicativo do colaborador com as justificativas de atraso autorizadas pelo DP.</p>
                  </div>

                  <div className="space-y-3 font-mono">
                    {(simulatedEmpTimeClock[selectedEmployee.id] || []).map(tc => (
                      <div key={tc.id} className="p-4 bg-slate-50 dark:bg-zinc-900/30 border dark:border-zinc-900 rounded-2xl space-y-2.5">
                        <div className="flex justify-between items-center text-xs">
                          <strong className="text-gray-850 dark:text-zinc-100">🗓️ Data: {tc.date}</strong>
                          <span className="text-indigo-600 dark:text-indigo-400 font-black">Total Computado: {tc.hours}</span>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-gray-600 bg-white dark:bg-zinc-950 p-2 border dark:border-zinc-900 rounded-xl">
                          <div className="p-1 rounded-lg">
                            <span className="text-gray-400 block text-[8px] uppercase">Entrada</span>
                            <strong className="text-xs text-gray-800 dark:text-zinc-50">{tc.entry}</strong>
                          </div>
                          <div className="p-1 rounded-lg">
                            <span className="text-gray-400 block text-[8px] uppercase">Saída Almoço</span>
                            <strong className="text-xs text-gray-800 dark:text-zinc-50">{tc.exitLunch}</strong>
                          </div>
                          <div className="p-1 rounded-lg">
                            <span className="text-gray-400 block text-[8px] uppercase">Volta Almoço</span>
                            <strong className="text-xs text-gray-800 dark:text-zinc-50">{tc.entryLunch}</strong>
                          </div>
                          <div className="p-1 rounded-lg">
                            <span className="text-gray-400 block text-[8px] uppercase">Saída</span>
                            <strong className="text-xs text-gray-800 dark:text-zinc-50">{tc.exit}</strong>
                          </div>
                        </div>

                        {tc.justification && (
                          <div className="p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[10px] space-y-0.5">
                            <span className="text-amber-600 font-black uppercase text-[8px] tracking-wide block">💬 Justificativa de Atraso Registrada</span>
                            <p className="text-slate-600 dark:text-zinc-300 italic">"{tc.justification}"</p>
                            <span className="text-[9px] uppercase font-bold text-emerald-600 block pt-0.5">Aprovado pelo DP ✔</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: OCORRÊNCIAS ADMINISTRATIVAS */}
              {activeDashboardTab === 'ocorrencias' && (
                <div className="space-y-6">
                  
                  {/* Input form to add mock occurrence for employee */}
                  <form onSubmit={handleCreateOccurrence} className="p-4 bg-orange-50/20 dark:bg-zinc-900/50 border border-orange-500/15 rounded-2xl space-y-4 text-xs font-sans">
                    <div className="flex items-center gap-1">
                      <AlertCircle size={14} className="text-orange-500 animate-pulse" />
                      <strong className="text-xs font-extrabold uppercase font-mono text-orange-600 block pl-1">REGISTRAR OCORRÊNCIA / ADVERTÊNCIA NESSA FICHA</strong>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Título Resumido da Ocorrência *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Atraso na entrega do laudo de ART"
                          className="w-full text-xs p-2 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg focus:outline-none"
                          value={newOccTitle}
                          onChange={e => setNewOccTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Tipo de Registro Administrativo</label>
                        <select
                          className="w-full text-xs p-2 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg focus:outline-none uppercase font-mono font-bold text-orange-500"
                          value={newOccType}
                          onChange={e => setNewOccType(e.target.value as any)}
                        >
                          <option value="elogio">⭐ Elogio / Postura Excepcional</option>
                          <option value="advertencia">⚠️ Advertência Formal Operacional</option>
                          <option value="observacao">📝 Observação Pessoal do DP / Ficha</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Detalhes e Justificativa do Registro *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Descreva detalhadamente o fato que será gravado no histórico operacional do colaborador..."
                        className="w-full text-xs p-2 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-lg focus:outline-none"
                        value={newOccDetails}
                        onChange={e => setNewOccDetails(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button 
                        type="submit"
                        className="px-5 py-2 text-[10px] bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider rounded-lg shadow-3xs cursor-pointer"
                      >
                        Registrar e Fixar em Prateleiras
                      </button>
                    </div>
                  </form>

                  {/* Administrative Log lines */}
                  <div className="space-y-3 font-mono">
                    <span className="text-[10px] font-black uppercase text-gray-400 block pl-1">Livro Administrativo da Ficha</span>
                    
                    {(simulatedEmpOccurrences[selectedEmployee.id] || []).length === 0 ? (
                      <p className="text-gray-400 text-center py-4 italic font-sans">Nenhum evento acadêmico ou advertência registrada nesta ficha corporativa. Histórico limpo! 🎉</p>
                    ) : (
                      (simulatedEmpOccurrences[selectedEmployee.id] || []).map(oc => (
                        <div key={oc.id} className="p-4 bg-sky-50/10 dark:bg-zinc-950 border dark:border-zinc-900 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${oc.type === 'elogio' ? 'bg-emerald-500' : oc.type === 'advertencia' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></span>
                              <strong className="text-xs font-black text-gray-850 dark:text-zinc-50 leading-none">{oc.title}</strong>
                            </div>
                            <p className="text-[11px] text-gray-600 dark:text-zinc-350 leading-relaxed font-sans pr-2">"{oc.details}"</p>
                            <span className="text-[9px] text-gray-450 block font-mono">Registrado por: <strong>{oc.author}</strong> | Data de Competência: {oc.date}</span>
                          </div>
                          <span className={`shrink-0 text-[8px] font-bold px-2 py-0.5 rounded font-mono uppercase ${oc.type === 'elogio' ? 'bg-emerald-100 text-emerald-800' : oc.type === 'advertencia' ? 'bg-rose-100 text-rose-800' : 'bg-slate-150 text-slate-700'}`}>
                            {oc.type}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-MODAL VER CHECKLIST DE PERGUNTA RESPOSTA ==================== */}
      {selectedChecklist && (
        <div className="fixed inset-0 bg-gray-900/40 dark:bg-zinc-950/80 backdrop-blur-xs z-55 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border dark:border-zinc-850 p-6 max-w-md w-full space-y-4 shadow-xl select-none">
            <div className="flex justify-between items-center border-b dark:border-zinc-850 pb-2">
              <span className="text-[8px] uppercase font-mono font-black text-orange-500">RESPOSTAS DO CHECKLIST DE CAMPO</span>
              <button 
                className="p-1 text-gray-400 hover:text-gray-900 font-bold"
                onClick={() => setSelectedChecklist(null)}
              >
                ✕
              </button>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-gray-850 dark:text-zinc-100">{selectedChecklist.title}</h4>
              <p className="text-[9px] text-gray-400 font-mono mt-0.5">Respondido em {selectedChecklist.date} | Status: Concluído</p>
            </div>

            <div className="space-y-1.5 pt-2">
              {selectedChecklist.filledItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-zinc-900/50 rounded-lg">
                  <span className="w-4 h-4 bg-emerald-500 rounded flex items-center justify-center text-[10px] text-white font-black shrink-0">✓</span>
                  <span className="text-slate-700 dark:text-zinc-200 font-medium text-xs font-sans leading-tight">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t dark:border-zinc-855">
              <button
                onClick={() => setSelectedChecklist(null)}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-250 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs text-gray-700 dark:text-zinc-300 font-bold rounded-xl font-mono cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
