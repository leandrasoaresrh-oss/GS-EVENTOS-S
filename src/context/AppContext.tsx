import React, { createContext, useContext, useState, useEffect } from "react";
import { Company, User, Employee, Event, Supplier, Task, Occurrence, PersonalNote, WellbeingRecord, Recognition, MeetingAgenda, Proposal, Client, CulturePost, CompanyConfig, TimeRecord, TechnicalVisit, ReportPreEvento, ReportPosEvento, SupplierEvaluation, EventPhoto, EventMessage, BudgetItem, Credential, CheckInRecord, FormSchema, FormSubmission, AuditLog, MenuOrder, UserProfile } from "../types";
import { INITIAL_USERS, INITIAL_EMPLOYEES, INITIAL_EVENTS, INITIAL_SUPPLIERS, INITIAL_TASKS, INITIAL_OCCURRENCES, INITIAL_PERSONAL_NOTES, INITIAL_WELLBEING, INITIAL_RECOGNITIONS, INITIAL_MEETINGS, INITIAL_PROPOSALS, INITIAL_CLIENTS, INITIAL_CULTURE, INITIAL_COMPANY_CONFIG, COLOR_PALETTES } from "../data/initialData";

interface AppContextType {
  // Configs
  companyConfig: CompanyConfig;
  setCompanyConfig: (config: CompanyConfig) => void;
  currentPalette: typeof COLOR_PALETTES[0];
  setPaletteById: (id: string) => void;
  resetVisualIdentity: () => void;

  // Multi-Company Scoping
  activeCompanyId: string;
  setActiveCompanyId: (id: string) => void;
  companies: Company[];
  
  // Navigation & Styling
  activeView: string;
  setActiveView: (view: string) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;

  // Active User / Testing Profiles
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchProfile: (profile: UserProfile) => void;

  // Database States
  users: User[];
  employees: Employee[];
  events: Event[];
  suppliers: Supplier[];
  tasks: Task[];
  occurrences: Occurrence[];
  personalNotes: PersonalNote[];
  wellbeingRecords: WellbeingRecord[];
  recognitions: Recognition[];
  meetings: MeetingAgenda[];
  proposals: Proposal[];
  clients: Client[];
  culturePosts: CulturePost[];
  timeRecords: TimeRecord[];
  technicalVisits: TechnicalVisit[];
  reportsPre: ReportPreEvento[];
  reportsPos: ReportPosEvento[];
  supplierEvaluations: SupplierEvaluation[];
  eventPhotos: EventPhoto[];
  eventMessages: EventMessage[];
  budgets: BudgetItem[];
  credentials: Credential[];
  checkIns: CheckInRecord[];
  formSchemas: FormSchema[];
  formSubmissions: FormSubmission[];
  auditLogs: AuditLog[];

  // Helpers / Mutations (CRUD with safety and audit logs)
  addAuditLog: (action: string, affectedItem: string) => void;
  
  // Users
  addUser: (item: Omit<User, "id">) => void;
  updateUser: (id: string, item: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Employees
  addEmployee: (item: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, item: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Events
  addEvent: (item: Omit<Event, "id">) => void;
  updateEvent: (id: string, item: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  // Suppliers
  addSupplier: (item: Omit<Supplier, "id">) => void;
  updateSupplier: (id: string, item: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Tasks
  addTask: (item: Omit<Task, "id">) => void;
  updateTask: (id: string, item: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Occurrences
  addOccurrence: (item: Omit<Occurrence, "id" | "createdAt" | "userResponsible">) => void;
  updateOccurrence: (id: string, item: Partial<Occurrence>) => void;
  deleteOccurrence: (id: string) => void;

  // Time Records
  addTimeRecord: (item: Omit<TimeRecord, "id">) => void;
  updateTimeRecord: (id: string, item: Partial<TimeRecord>) => void;

  // Notes
  addNote: (item: Omit<PersonalNote, "id">) => void;
  updateNote: (id: string, item: Partial<PersonalNote>) => void;
  deleteNote: (id: string) => void;

  // Wellbeing
  addWellbeing: (item: Omit<WellbeingRecord, "id">) => void;
  updateWellbeing: (id: string, item: Partial<WellbeingRecord>) => void;
  deleteWellbeing: (id: string) => void;

  // Recognitions
  addRecognition: (item: Omit<Recognition, "id" | "date">) => void;

  // Budgets
  addBudget: (item: Omit<BudgetItem, "id">) => void;
  updateBudget: (id: string, item: Partial<BudgetItem>) => void;
  deleteBudget: (id: string) => void;

  // Credentials
  addCredential: (item: Omit<Credential, "id" | "uniqueId">) => void;

  // Technical Visits
  addTechnicalVisit: (item: Omit<TechnicalVisit, "id" | "createdAt">) => void;
  updateTechnicalVisit: (id: string, item: Partial<TechnicalVisit>) => void;

  // Forms and Checklists
  addReportPre: (item: Omit<ReportPreEvento, "id" | "createdAt">) => void;
  updateReportPre: (id: string, item: Partial<ReportPreEvento>) => void;
  addReportPos: (item: Omit<ReportPosEvento, "id" | "createdAt">) => void;
  updateReportPos: (id: string, item: Partial<ReportPosEvento>) => void;
  addSupplierEvaluation: (item: Omit<SupplierEvaluation, "id">) => void;
  updateSupplierEvaluation: (id: string, item: Partial<SupplierEvaluation>) => void;
  addFormSchema: (item: Omit<FormSchema, "id" | "createdAt" | "creatorName">) => void;
  addFormSubmission: (item: Omit<FormSubmission, "id" | "submittedAt" | "respondentName">) => void;

  // Photos
  addEventPhoto: (item: Omit<EventPhoto, "id" | "date" | "responsibleName">) => void;
  deleteEventPhoto: (id: string) => void;

  // Messages
  addEventMessage: (eventId: string, text: string) => void;

  // Meetings
  addMeeting: (item: Omit<MeetingAgenda, "id" | "status">) => void;
  updateMeeting: (id: string, item: Partial<MeetingAgenda>) => void;
  deleteMeeting: (id: string) => void;

  // Proposals & Clients
  addProposal: (item: Omit<Proposal, "id" | "createdAt">) => void;
  updateProposal: (id: string, item: Partial<Proposal>) => void;
  deleteProposal: (id: string) => void;
  addClient: (item: Omit<Client, "id">) => void;

  // Culture
  addCulturePost: (content: string) => void;
  interactCulturePost: (id: string, type: 'likes' | 'hearts' | 'claps') => void;

  // Check-ins
  addCheckIn: (eventId: string, type: string, description: string) => void;

  // Sidebar reorder persistent
  sidebarOrder: MenuOrder;
  updateSidebarOrder: (hidden: string[], order: string[]) => void;

  // Session login flow
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  logout: () => void;
}

const INITIAL_COMPANIES: Company[] = [
  {
    id: "comp_gs",
    name: "GS Eventos & Produções",
    logo: "⚡",
    primaryColor: "#E85D04",
    secondaryColor: "#FEF3C7"
  },
  {
    id: "comp_imperio",
    name: "Império Promoções & Ativações",
    logo: "👑",
    primaryColor: "#0F172A",
    secondaryColor: "#F8FAFC"
  },
  {
    id: "comp_vanguard",
    name: "Vanguard Corporate Shows",
    logo: "⚜️",
    primaryColor: "#047857",
    secondaryColor: "#ECFDF5"
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Styling states
  const [activeView, setActiveView] = useState<string>(() => {
    return localStorage.getItem("gs_active_view") || "dashboard";
  });

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return localStorage.getItem("gs_dark_mode") === "true" ? "dark" : "light";
  });

  // Multi-Company scoping
  const [activeCompanyId, setActiveCompanyIdState] = useState<string>(() => {
    return localStorage.getItem("gs_active_company_id") || "comp_gs";
  });

  // Active states
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem("gs_current_user");
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [companyConfig, setCompanyConfigState] = useState<CompanyConfig>(() => {
    const saved = localStorage.getItem("gs_company_config");
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_CONFIG;
  });

  const [currentPalette, setCurrentPalette] = useState<typeof COLOR_PALETTES[0]>(() => {
    const savedCode = localStorage.getItem("gs_current_palette_id") || "gs_eventos";
    return COLOR_PALETTES.find(p => p.id === savedCode) || COLOR_PALETTES[0];
  });

  // DB States
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("gs_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("gs_employees");
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem("gs_events");
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem("gs_suppliers");
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("gs_tasks");
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [occurrences, setOccurrences] = useState<Occurrence[]>(() => {
    const saved = localStorage.getItem("gs_occurrences");
    return saved ? JSON.parse(saved) : INITIAL_OCCURRENCES;
  });

  const [personalNotes, setPersonalNotes] = useState<PersonalNote[]>(() => {
    const saved = localStorage.getItem("gs_personal_notes");
    return saved ? JSON.parse(saved) : INITIAL_PERSONAL_NOTES;
  });

  const [wellbeingRecords, setWellbeingRecords] = useState<WellbeingRecord[]>(() => {
    const saved = localStorage.getItem("gs_wellbeing");
    return saved ? JSON.parse(saved) : INITIAL_WELLBEING;
  });

  const [recognitions, setRecognitions] = useState<Recognition[]>(() => {
    const saved = localStorage.getItem("gs_recognitions");
    return saved ? JSON.parse(saved) : INITIAL_RECOGNITIONS;
  });

  const [meetings, setMeetings] = useState<MeetingAgenda[]>(() => {
    const saved = localStorage.getItem("gs_meetings");
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem("gs_proposals");
    return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem("gs_clients");
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [culturePosts, setCulturePostsState] = useState<CulturePost[]>(() => {
    const saved = localStorage.getItem("gs_culture");
    return saved ? JSON.parse(saved) : INITIAL_CULTURE;
  });

  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>(() => {
    const saved = localStorage.getItem("gs_time_records");
    return saved ? JSON.parse(saved) : [];
  });

  const [technicalVisits, setTechnicalVisits] = useState<TechnicalVisit[]>(() => {
    const saved = localStorage.getItem("gs_tech_visits");
    return saved ? JSON.parse(saved) : [];
  });

  const [reportsPre, setReportsPre] = useState<ReportPreEvento[]>(() => {
    const saved = localStorage.getItem("gs_reports_pre");
    return saved ? JSON.parse(saved) : [];
  });

  const [reportsPos, setReportsPos] = useState<ReportPosEvento[]>(() => {
    const saved = localStorage.getItem("gs_reports_pos");
    return saved ? JSON.parse(saved) : [];
  });

  const [supplierEvaluations, setSupplierEvaluations] = useState<SupplierEvaluation[]>(() => {
    const saved = localStorage.getItem("gs_supplier_evaluations");
    return saved ? JSON.parse(saved) : [];
  });

  const [eventPhotos, setEventPhotos] = useState<EventPhoto[]>(() => {
    const saved = localStorage.getItem("gs_event_photos");
    return saved ? JSON.parse(saved) : [];
  });

  const [eventMessages, setEventMessages] = useState<EventMessage[]>(() => {
    const saved = localStorage.getItem("gs_event_messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem("gs_budgets");
    return saved ? JSON.parse(saved) : [];
  });

  const [credentials, setCredentials] = useState<Credential[]>(() => {
    const saved = localStorage.getItem("gs_credentials");
    return saved ? JSON.parse(saved) : [];
  });

  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(() => {
    const saved = localStorage.getItem("gs_check_ins");
    return saved ? JSON.parse(saved) : [];
  });

  const [formSchemas, setFormSchemas] = useState<FormSchema[]>(() => {
    const saved = localStorage.getItem("gs_form_schemas");
    return saved ? JSON.parse(saved) : [];
  });

  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>(() => {
    const saved = localStorage.getItem("gs_form_submissions");
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem("gs_audit_logs");
    return saved ? JSON.parse(saved) : [];
  });

  // Sidebar Order
  const [sidebarOrder, setSidebarOrder] = useState<MenuOrder>(() => {
    const saved = localStorage.getItem("gs_sidebar_order");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.tabOrder) {
        if (!parsed.tabOrder.includes("configuracoes")) {
          parsed.tabOrder.splice(1, 0, "configuracoes");
        }
        if (!parsed.tabOrder.includes("perfil")) {
          parsed.tabOrder.splice(1, 0, "perfil");
        }
      }
      return parsed;
    }
    return {
      userId: currentUser.id,
      hiddenTabs: [],
      // Default order
      tabOrder: [
        "dashboard",
        "perfil",
        "configuracoes",
        "briefing",
        "alertas",
        "eventos",
        "fornecedores",
        "ponto",
        "vencimentos",
        "tarefas",
        "colaboradores",
        "formularios",
        "bem_estar",
        "orcamentos",
        "credenciais",
        "reunioes",
        "propostas",
        "mapa",
        "notas",
        "logs"
      ]
    };
  });

  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(() => {
    return localStorage.getItem("gs_is_logged_in") !== "false";
  });

  const setIsLoggedIn = (val: boolean) => {
    setIsLoggedInState(val);
    localStorage.setItem("gs_is_logged_in", val ? "true" : "false");
  };

  const logout = () => {
    setIsLoggedIn(false);
    addAuditLog("Sessão: Usuário fez logout do cockpit", currentUser?.name || "Desconhecido");
  };

  // Syncer to LocalStorage
  useEffect(() => {
    localStorage.setItem("gs_active_view", activeView);
  }, [activeView]);

  useEffect(() => {
    localStorage.setItem("gs_dark_mode", theme === "dark" ? "true" : "false");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Single company configuration representation
  const [companies, setCompaniesList] = useState<Company[]>([
    {
      id: "comp_gs",
      name: companyConfig.name,
      logo: companyConfig.logo,
      primaryColor: companyConfig.primaryColor,
      secondaryColor: companyConfig.secondaryColor
    }
  ]);

  // Keep single list in sync with config edits
  useEffect(() => {
    setCompaniesList([
      {
        id: "comp_gs",
        name: companyConfig.name,
        logo: companyConfig.logo,
        primaryColor: companyConfig.primaryColor,
        secondaryColor: companyConfig.secondaryColor
      }
    ]);
  }, [companyConfig]);

  const setActiveCompanyId = (id: string) => {
    // Single installation mode: locked to comp_gs
    setActiveCompanyIdState("comp_gs");
    localStorage.setItem("gs_active_company_id", "comp_gs");
  };

  useEffect(() => {
    localStorage.setItem("gs_company_config", JSON.stringify(companyConfig));
  }, [companyConfig]);

  useEffect(() => {
    localStorage.setItem("gs_current_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("gs_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("gs_employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("gs_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("gs_suppliers", JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem("gs_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("gs_occurrences", JSON.stringify(occurrences));
  }, [occurrences]);

  useEffect(() => {
    localStorage.setItem("gs_personal_notes", JSON.stringify(personalNotes));
  }, [personalNotes]);

  useEffect(() => {
    localStorage.setItem("gs_wellbeing", JSON.stringify(wellbeingRecords));
  }, [wellbeingRecords]);

  useEffect(() => {
    localStorage.setItem("gs_recognitions", JSON.stringify(recognitions));
  }, [recognitions]);

  useEffect(() => {
    localStorage.setItem("gs_meetings", JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem("gs_proposals", JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem("gs_clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("gs_culture", JSON.stringify(culturePosts));
  }, [culturePosts]);

  useEffect(() => {
    localStorage.setItem("gs_time_records", JSON.stringify(timeRecords));
  }, [timeRecords]);

  useEffect(() => {
    localStorage.setItem("gs_tech_visits", JSON.stringify(technicalVisits));
  }, [technicalVisits]);

  useEffect(() => {
    localStorage.setItem("gs_reports_pre", JSON.stringify(reportsPre));
  }, [reportsPre]);

  useEffect(() => {
    localStorage.setItem("gs_reports_pos", JSON.stringify(reportsPos));
  }, [reportsPos]);

  useEffect(() => {
    localStorage.setItem("gs_supplier_evaluations", JSON.stringify(supplierEvaluations));
  }, [supplierEvaluations]);

  useEffect(() => {
    localStorage.setItem("gs_event_photos", JSON.stringify(eventPhotos));
  }, [eventPhotos]);

  useEffect(() => {
    localStorage.setItem("gs_event_messages", JSON.stringify(eventMessages));
  }, [eventMessages]);

  useEffect(() => {
    localStorage.setItem("gs_budgets", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("gs_credentials", JSON.stringify(credentials));
  }, [credentials]);

  useEffect(() => {
    localStorage.setItem("gs_check_ins", JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem("gs_form_schemas", JSON.stringify(formSchemas));
  }, [formSchemas]);

  useEffect(() => {
    localStorage.setItem("gs_form_submissions", JSON.stringify(formSubmissions));
  }, [formSubmissions]);

  useEffect(() => {
    localStorage.setItem("gs_audit_logs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem("gs_sidebar_order", JSON.stringify(sidebarOrder));
  }, [sidebarOrder]);

  // Apply colors to document body or main variables dynamically
  useEffect(() => {
    const r = document.documentElement;
    const prim = companyConfig?.primaryColor || currentPalette.primary;
    const sec = companyConfig?.secondaryColor || currentPalette.secondary;

    r.style.setProperty("--color-primary", prim);
    
    // Convert hex to rgb for opacity utilities
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "232, 93, 4";
    };

    r.style.setProperty("--color-primary-rgb", hexToRgb(prim));
    r.style.setProperty("--color-secondary", sec);
    r.style.setProperty("--color-bg-custom", currentPalette.bg);
  }, [currentPalette, companyConfig]);

  // LOG REGISTRATION HELPER
  const addAuditLog = (action: string, affectedItem: string) => {
    const newLog: AuditLog = {
      id: "log_" + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      timestamp: new Date().toISOString(),
      affectedItem
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // MULTI-COMPANY CONFIG
  const setCompanyConfig = (config: CompanyConfig) => {
    setCompanyConfigState(config);
    addAuditLog("Empresa: Editou informações institucionais", config.name);
  };

  const setPaletteById = (id: string) => {
    const palette = COLOR_PALETTES.find(p => p.id === id);
    if (palette) {
      setCurrentPalette(palette);
      localStorage.setItem("gs_current_palette_id", id);
      setCompanyConfigState(prev => ({
        ...prev,
        primaryColor: palette.primary,
        secondaryColor: palette.secondary,
        buttonColor: palette.primary
      }));
      addAuditLog("Perfil: Alterou paleta de cores", palette.name);
    }
  };

  const resetVisualIdentity = () => {
    setCompanyConfigState(INITIAL_COMPANY_CONFIG);
    setCurrentPalette(COLOR_PALETTES[0]);
    localStorage.removeItem("gs_company_config");
    localStorage.removeItem("gs_current_palette_id");
    addAuditLog("Empresa: Restaurou identidade visual padrão", "GS Eventos");
  };

  // PROFILE SWAPPER FOR DEMO/TESTING
  const switchProfile = (profile: UserProfile) => {
    const matched = users.find(u => u.profile === profile && u.active);
    if (matched) {
      setCurrentUser(matched);
      addAuditLog("Sessão: Alterou perfil ativo de teste", profile);
    } else {
      // Create user fallback
      const names: Record<UserProfile, string> = {
        Admin: "Leandra Soares",
        Administrativo: "Leandra Kaisa",
        DP: "Leandra Vitoria",
        Escritorio: "Roberto Lima",
        Operacional: "Carlos Eduardo Silva",
        Freelancer: "Ana Santos"
      };
      const newUser: User = {
        id: "usr_" + Date.now(),
        name: names[profile],
        email: `${profile.toLowerCase()}@gseventos.com`,
        profile,
        active: true,
        avatar: "🙋‍♂️"
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      addAuditLog("Sessão: Criou e alternou para perfil de teste", profile);
    }
  };

  // SIDEBAR REORDER
  const updateSidebarOrder = (hidden: string[], order: string[]) => {
    setSidebarOrder({
      userId: currentUser.id,
      hiddenTabs: hidden,
      tabOrder: order
    });
  };

  // CRUD OPERATIONS

  // 1. Users
  const addUser = (item: Omit<User, "id">) => {
    const newItem: User = { ...item, id: "usr_" + Date.now() };
    setUsers(prev => [newItem, ...prev]);
    addAuditLog("Usuários: Convidou novo usuário", newItem.name);
  };
  const updateUser = (id: string, item: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...item } : u));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...item }));
    }
    const target = users.find(u => u.id === id);
    addAuditLog("Usuários: Atualizou dados", target?.name || id);
  };
  const deleteUser = (id: string) => {
    const target = users.find(u => u.id === id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: false } : u));
    addAuditLog("Usuários: Desativou usuário", target?.name || id);
  };

  // 2. Employees (Colaboradores)
  const addEmployee = (item: Omit<Employee, "id">) => {
    const id = "emp_" + Date.now();
    const newItem: Employee = { ...item, id, active: true, companyId: activeCompanyId };
    setEmployees(prev => [newItem, ...prev]);
    addAuditLog("Colaborador: Adicionou nova ficha física", newItem.fullName);

    // Vínculo automático ao usuário sistema
    const existingUser = users.find(u => u.email.toLowerCase() === item.email.toLowerCase());
    if (!existingUser) {
      addUser({
        name: item.fullName,
        email: item.email,
        profile: item.department === "Departamento Pessoal" ? "DP" : item.department === "Administrativo" ? "Administrativo" : "Operacional",
        sector: item.department,
        active: true,
        avatar: "🙋‍♂️",
        companyId: activeCompanyId
      });
    }
  };
  const updateEmployee = (id: string, item: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...item } : e));
    const target = employees.find(e => e.id === id);
    addAuditLog("Colaborador: Atualizou dados da Ficha completa", target?.fullName || id);

    // Sync user email or details if linked
    if (target) {
      const u = users.find(usr => usr.email.toLowerCase() === target.email.toLowerCase());
      if (u) {
        updateUser(u.id, {
          name: item.fullName || target.fullName,
          sector: item.department || target.department
        });
      }
    }
  };
  const deleteEmployee = (id: string) => {
    const target = employees.find(e => e.id === id);
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, active: false } : e));
    addAuditLog("Colaborador: Desativou ficha de colaborador", target?.fullName || id);
  };

  // 3. Events
  const addEvent = (item: Omit<Event, "id">) => {
    const newItem: Event = { ...item, id: "evt_" + Date.now(), companyId: activeCompanyId };
    setEvents(prev => [newItem, ...prev]);
    addAuditLog("Eventos: Criou novo evento corporativo", newItem.name);
  };
  const updateEvent = (id: string, item: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...item } : e));
    const target = events.find(e => e.id === id);
    addAuditLog("Eventos: Editou dados do evento", target?.name || id);
  };
  const deleteEvent = (id: string) => {
    const target = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    addAuditLog("Eventos: Excluiu evento do sistema", target?.name || id);
  };

  // 4. Suppliers
  const addSupplier = (item: Omit<Supplier, "id">) => {
    const newItem: Supplier = { ...item, id: "sup_" + Date.now(), ratingPositive: 0, ratingNegative: 0, occurrencesCount: 0, companyId: activeCompanyId };
    setSuppliers(prev => [newItem, ...prev]);
    addAuditLog("Fornecedores: Cadastrou fornecedor credenciado", newItem.tradeName);
  };
  const updateSupplier = (id: string, item: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...item } : s));
    const target = suppliers.find(s => s.id === id);
    addAuditLog("Fornecedores: Alterou ficha de fornecedor", target?.tradeName || id);
  };
  const deleteSupplier = (id: string) => {
    const target = suppliers.find(s => s.id === id);
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, status: "Inativo" } : s));
    addAuditLog("Fornecedores: Desativou fornecedor", target?.tradeName || id);
  };

  // 5. Tasks
  const addTask = (item: Omit<Task, "id">) => {
    const newItem: Task = { ...item, id: "tsk_" + Date.now(), companyId: activeCompanyId };
    setTasks(prev => [newItem, ...prev]);
    addAuditLog("Tarefas: Criou nova tarefa no Kanban", newItem.title);
  };
  const updateTask = (id: string, item: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...item } : t));
    const target = tasks.find(t => t.id === id);
    addAuditLog("Tarefas: Editou status de tarefa", target?.title || id);
  };
  const deleteTask = (id: string) => {
    const target = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    addAuditLog("Tarefas: Excluiu tarefa", target?.title || id);
  };

  // 6. Occurrences
  const addOccurrence = (item: Omit<Occurrence, "id" | "createdAt" | "userResponsible">) => {
    const newItem: Occurrence = {
      ...item,
      id: "occ_" + Date.now(),
      createdAt: new Date().toISOString(),
      userResponsible: currentUser.name,
      companyId: activeCompanyId
    };
    setOccurrences(prev => [newItem, ...prev]);
    addAuditLog("Ocorrências: Registrou ponto crítico no evento", newItem.title);

    // Incrementar contagem no fornecedor relacionado
    if (item.supplierId) {
      setSuppliers(prev => prev.map(s => s.id === item.supplierId ? { ...s, occurrencesCount: s.occurrencesCount + 1, ratingNegative: s.ratingNegative + 1 } : s));
    }
  };
  const updateOccurrence = (id: string, item: Partial<Occurrence>) => {
    setOccurrences(prev => prev.map(o => o.id === id ? { ...o, ...item } : o));
    const target = occurrences.find(o => o.id === id);
    addAuditLog("Ocorrências: Tratou ou editou ocorrência", target?.title || id);
  };
  const deleteOccurrence = (id: string) => {
    const target = occurrences.find(o => o.id === id);
    setOccurrences(prev => prev.filter(o => o.id !== id));
    addAuditLog("Ocorrências: Removeu registro", target?.title || id);
  };

  // 7. Time Records
  const addTimeRecord = (item: Omit<TimeRecord, "id">) => {
    const newItem: TimeRecord = { ...item, id: "tr_" + Date.now(), companyId: activeCompanyId };
    setTimeRecords(prev => [newItem, ...prev]);
    
    const emp = employees.find(e => e.id === item.employeeId);
    addAuditLog("Ponto: Registrou nova batida de ponto (" + item.type + ")", emp?.fullName || item.employeeId);
  };
  const updateTimeRecord = (id: string, item: Partial<TimeRecord>) => {
    setTimeRecords(prev => prev.map(t => t.id === id ? { ...t, ...item, correctedByDp: true } : t));
    const record = timeRecords.find(t => t.id === id);
    addAuditLog("Ponto: Validou ou retificou registro de ponto", record ? record.type : id);
  };

  // 8. Notes
  const addNote = (item: Omit<PersonalNote, "id">) => {
    const newItem: PersonalNote = { ...item, id: "not_" + Date.now(), companyId: activeCompanyId };
    setPersonalNotes(prev => [newItem, ...prev]);
    addAuditLog("Notas: Criou nova nota pessoal", newItem.title);
  };
  const updateNote = (id: string, item: Partial<PersonalNote>) => {
    setPersonalNotes(prev => prev.map(n => n.id === id ? { ...n, ...item } : n));
  };
  const deleteNote = (id: string) => {
    setPersonalNotes(prev => prev.filter(n => n.id !== id));
  };

  // 9. Wellbeing
  const addWellbeing = (item: Omit<WellbeingRecord, "id">) => {
    const newItem: WellbeingRecord = { ...item, id: "wb_" + Date.now() };
    setWellbeingRecords(prev => [newItem, ...prev]);
    addAuditLog("Afiliado: Lançou restrição de agenda (" + item.type + ")", item.employeeName);
  };
  const updateWellbeing = (id: string, item: Partial<WellbeingRecord>) => {
    setWellbeingRecords(prev => prev.map(w => w.id === id ? { ...w, ...item } : w));
  };
  const deleteWellbeing = (id: string) => {
    setWellbeingRecords(prev => prev.filter(w => w.id !== id));
  };

  // 10. Recognitions
  const addRecognition = (item: Omit<Recognition, "id" | "date">) => {
    const newItem: Recognition = {
      ...item,
      id: "rec_" + Date.now(),
      date: new Date().toISOString()
    };
    setRecognitions(prev => [newItem, ...prev]);
    addAuditLog("Reconhecimento: Enviou destaque motivacional", item.badge + " para " + item.toUserName);
  };

  // 11. Budgets
  const addBudget = (item: Omit<BudgetItem, "id">) => {
    const newItem: BudgetItem = { ...item, id: "bud_" + Date.now(), companyId: activeCompanyId };
    setBudgets(prev => [newItem, ...prev]);
    addAuditLog("Orçamentos: Inseriu item de custo", newItem.service);
  };
  const updateBudget = (id: string, item: Partial<BudgetItem>) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...item } : b));
  };
  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // 12. Credentials
  const addCredential = (item: Omit<Credential, "id" | "uniqueId">) => {
    const val = "GS-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newItem: Credential = {
      ...item,
      id: "crd_" + Date.now(),
      uniqueId: val,
      printDate: new Date().toISOString().split("T")[0]
    };
    setCredentials(prev => [newItem, ...prev]);
    
    // Find worker
    const emp = employees.find(e => e.id === item.employeeId);
    addAuditLog("Credenciais: Gerou crachá digital único de acesso", emp?.fullName || item.employeeId);
  };

  // 13. Technical Visits
  const addTechnicalVisit = (item: Omit<TechnicalVisit, "id" | "createdAt">) => {
    const newItem: TechnicalVisit = {
      ...item,
      id: "tv_" + Date.now(),
      createdAt: new Date().toISOString()
    };
    setTechnicalVisits(prev => [newItem, ...prev]);
    
    const ev = events.find(e => e.id === item.eventId);
    addAuditLog("Vistoria: Salvou checklist visita técnica", ev?.name || "Interna");
  };
  const updateTechnicalVisit = (id: string, item: Partial<TechnicalVisit>) => {
    setTechnicalVisits(prev => prev.map(t => t.id === id ? { ...t, ...item } : t));
  };

  // 14. Pre / Post / evaluations
  const addReportPre = (item: Omit<ReportPreEvento, "id" | "createdAt">) => {
    const newItem: ReportPreEvento = { ...item, id: "rp_" + Date.now(), createdAt: new Date().toISOString() };
    setReportsPre(prev => [newItem, ...prev]);
    addAuditLog("Formulários: Submeteu Relatório Pré-Evento diario", item.reporterName);
  };
  const updateReportPre = (id: string, item: Partial<ReportPreEvento>) => {
    setReportsPre(prev => prev.map(r => r.id === id ? { ...r, ...item } : r));
  };

  const addReportPos = (item: Omit<ReportPosEvento, "id" | "createdAt">) => {
    const newItem: ReportPosEvento = { ...item, id: "rs_" + Date.now(), createdAt: new Date().toISOString() };
    setReportsPos(prev => [newItem, ...prev]);
    addAuditLog("Formulários: Submeteu Relatório Pós-Evento de encerramento", item.reporterName);
  };
  const updateReportPos = (id: string, item: Partial<ReportPosEvento>) => {
    setReportsPos(prev => prev.map(r => r.id === id ? { ...r, ...item } : r));
  };

  const addSupplierEvaluation = (item: Omit<SupplierEvaluation, "id">) => {
    const newItem: SupplierEvaluation = { ...item, id: "se_" + Date.now() };
    setSupplierEvaluations(prev => [newItem, ...prev]);
    
    const sup = suppliers.find(s => s.id === item.supplierId);
    if (sup) {
      if (item.status === "Aprovado") {
        setSuppliers(prev => prev.map(s => s.id === item.supplierId ? { ...s, ratingPositive: s.ratingPositive + 1 } : s));
      } else if (item.status === "Reprovado") {
        setSuppliers(prev => prev.map(s => s.id === item.supplierId ? { ...s, ratingNegative: s.ratingNegative + 1, occurrencesCount: s.occurrencesCount + 1 } : s));
      }
    }
    
    addAuditLog("Formulários: Submeteu Avaliação de Fornecedor em campo", sup?.tradeName || item.supplierId);
  };
  const updateSupplierEvaluation = (id: string, item: Partial<SupplierEvaluation>) => {
    setSupplierEvaluations(prev => prev.map(s => s.id === id ? { ...s, ...item } : s));
  };

  const addFormSchema = (item: Omit<FormSchema, "id" | "createdAt" | "creatorName">) => {
    const newItem: FormSchema = {
      ...item,
      id: "sch_" + Date.now(),
      createdAt: new Date().toISOString(),
      creatorName: currentUser.name
    };
    setFormSchemas(prev => [newItem, ...prev]);
    addAuditLog("Construtor: Criou novo modelo customizado", newItem.title);
  };

  const addFormSubmission = (item: Omit<FormSubmission, "id" | "submittedAt" | "respondentName">) => {
    const newItem: FormSubmission = {
      ...item,
      id: "sub_" + Date.now(),
      submittedAt: new Date().toISOString(),
      respondentName: currentUser.name
    };
    setFormSubmissions(prev => [newItem, ...prev]);
    addAuditLog("Resposta: Submeteu respostas para o formulário", item.schemaTitle);
  };

  // 15. Photos
  const addEventPhoto = (item: Omit<EventPhoto, "id" | "date" | "responsibleName">) => {
    const newItem: EventPhoto = {
      ...item,
      id: "pht_" + Date.now(),
      date: new Date().toISOString(),
      responsibleName: currentUser.name
    };
    setEventPhotos(prev => [newItem, ...prev]);
    addAuditLog("Galeria: Realizou upload de foto de operação", newItem.category);
  };
  const deleteEventPhoto = (id: string) => {
    setEventPhotos(prev => prev.filter(p => p.id !== id));
  };

  // 16. Chat Messaging
  const addEventMessage = (eventId: string, messageText: string) => {
    const newMessage: EventMessage = {
      id: "msg_" + Date.now(),
      eventId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderProfile: currentUser.profile,
      message: messageText,
      timestamp: new Date().toISOString()
    };
    setEventMessages(prev => [...prev, newMessage]);
  };

  // 17. Meetings
  const addMeeting = (item: Omit<MeetingAgenda, "id" | "status">) => {
    const newItem: MeetingAgenda = { ...item, id: "met_" + Date.now(), status: "Agendada", companyId: activeCompanyId };
    setMeetings(prev => [newItem, ...prev]);
    addAuditLog("Reuniões: Cadastrou nova pauta estratégica", newItem.title);
  };
  const updateMeeting = (id: string, item: Partial<MeetingAgenda>) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, ...item } : m));
  };
  const deleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
  };

  // 18. Proposals & clients
  const addProposal = (item: Omit<Proposal, "id" | "createdAt">) => {
    const newItem: Proposal = { ...item, id: "prop_" + Date.now(), createdAt: new Date().toISOString().split("T")[0], companyId: activeCompanyId };
    setProposals(prev => [newItem, ...prev]);
    addAuditLog("Escritório: Iniciou rascunho de proposta comercial", newItem.clientName);
  };
  const updateProposal = (id: string, item: Partial<Proposal>) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, ...item } : p));
    const target = proposals.find(p => p.id === id);
    if (item.status) {
      addAuditLog("Escritório: Proposta Comercial alterou para " + item.status, target?.clientName || id);
    }
  };
  const deleteProposal = (id: string) => {
    setProposals(prev => prev.filter(p => p.id !== id));
  };
  const addClient = (item: Omit<Client, "id">) => {
    const newItem: Client = { ...item, id: "cli_" + Date.now(), companyId: activeCompanyId };
    setClients(prev => [newItem, ...prev]);
  };

  // 19. Culture Posts
  const addCulturePost = (content: string) => {
    const newPost: CulturePost = {
      id: "clt_" + Date.now(),
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorProfile: currentUser.profile,
      content,
      likes: 0,
      hearts: 0,
      claps: 0,
      date: new Date().toISOString()
    };
    setCulturePostsState(prev => [newPost, ...prev]);
    addAuditLog("Cultura: Publicou compartilhamento interno", "Feed Social");
  };
  const interactCulturePost = (id: string, type: 'likes' | 'hearts' | 'claps') => {
    setCulturePostsState(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [type]: p[type] + 1 };
      }
      return p;
    }));
  };

  // 20. CheckIns
  const addCheckIn = (eventId: string, type: string, description: string) => {
    const newCheck: CheckInRecord = {
      id: "chk_" + Date.now(),
      eventId,
      type,
      description,
      timestamp: new Date().toISOString(),
      responsibleName: currentUser.name
    };
    setCheckIns(prev => [newCheck, ...prev]);
    addAuditLog("Check-in Rápido: " + type, description);
  };

  // Simple multi-company filter helper:
  const filterByCompany = <T extends { companyId?: string }>(list: T[]): T[] => {
    // Single installation mode: return all items unconditionally
    return list;
  };

  return (
    <AppContext.Provider value={{
      companyConfig, setCompanyConfig,
      currentPalette, setPaletteById, resetVisualIdentity,
      currentUser, setCurrentUser, switchProfile,
      
      // Scoped Navigation & Styling
      activeView, setActiveView,
      theme, setTheme,
      activeCompanyId, setActiveCompanyId,
      companies,

      // Filtered Segmented Database Arrays
      users, 
      employees: filterByCompany(employees), 
      events: filterByCompany(events), 
      suppliers: filterByCompany(suppliers), 
      tasks: filterByCompany(tasks), 
      occurrences: filterByCompany(occurrences), 
      personalNotes: filterByCompany(personalNotes),
      wellbeingRecords, recognitions, 
      meetings: filterByCompany(meetings), 
      proposals: filterByCompany(proposals), 
      clients: filterByCompany(clients), 
      culturePosts,
      timeRecords: filterByCompany(timeRecords), 
      technicalVisits, reportsPre, reportsPos, supplierEvaluations,
      eventPhotos, eventMessages, 
      budgets: filterByCompany(budgets), 
      credentials, checkIns, formSchemas, formSubmissions,
      auditLogs: filterByCompany(auditLogs), addAuditLog,
      addUser, updateUser, deleteUser,
      addEmployee, updateEmployee, deleteEmployee,
      addEvent, updateEvent, deleteEvent,
      addSupplier, updateSupplier, deleteSupplier,
      addTask, updateTask, deleteTask,
      addOccurrence, updateOccurrence, deleteOccurrence,
      addTimeRecord, updateTimeRecord,
      addNote, updateNote, deleteNote,
      addWellbeing, updateWellbeing, deleteWellbeing,
      addRecognition,
      addBudget, updateBudget, deleteBudget,
      addCredential,
      addTechnicalVisit, updateTechnicalVisit,
      addReportPre, updateReportPre,
      addReportPos, updateReportPos,
      addSupplierEvaluation, updateSupplierEvaluation,
      addFormSchema, addFormSubmission,
      addEventPhoto, deleteEventPhoto,
      addEventMessage,
      addMeeting, updateMeeting, deleteMeeting,
      addProposal, updateProposal, deleteProposal,
      addClient,
      addCulturePost, interactCulturePost,
      addCheckIn,
      sidebarOrder, updateSidebarOrder,
      isLoggedIn, setIsLoggedIn, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
