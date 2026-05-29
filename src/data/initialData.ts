import { CompanyConfig, User, Employee, Event, Supplier, Task, Occurrence, PersonalNote, WellbeingRecord, Recognition, MeetingAgenda, Proposal, Client, CulturePost } from "../types";

export const COLOR_PALETTES = [
  {
    id: "gs_eventos",
    name: "GS Eventos (Padrão)",
    primary: "#E85D04",
    secondary: "#FFEAD4",
    accent: "#E85D04",
    bg: "#FFFFFF",
    colors: ["#E85D04", "#FFEAD4", "#1F2937", "#92400E", "#FEF3C7"]
  },
  {
    id: "palacio_rubi",
    name: "Palácio Rubi",
    primary: "#FF102D",
    secondary: "#DFB1B5",
    accent: "#AB0F14",
    bg: "#E1E4D2",
    colors: ["#E1E4D2", "#DFB1B5", "#FF102D", "#AB0F14", "#890707", "#15464C"]
  },
  {
    id: "noite_imperial",
    name: "Noite Imperial",
    primary: "#DD0140",
    secondary: "#F696B3",
    accent: "#84062A",
    bg: "#241929",
    colors: ["#241929", "#5A1846", "#E5E6D1", "#F696B3", "#DD0140", "#84062A"]
  },
  {
    id: "salao_vintage",
    name: "Salão Vintage",
    primary: "#A67542",
    secondary: "#D4B8A2",
    accent: "#3F242D",
    bg: "#150A00",
    colors: ["#150A00", "#3F242D", "#523344", "#A67542", "#D1967C", "#D4B8A2"]
  },
  {
    id: "por_do_sol_tropical",
    name: "Pôr do Sol Tropical",
    primary: "#F15636",
    secondary: "#F5C166",
    accent: "#F78F60",
    bg: "#012351",
    colors: ["#F5C166", "#F78F60", "#F15636", "#005575", "#012351", "#010608"]
  },
  {
    id: "jardim_esmeralda",
    name: "Jardim Esmeralda",
    primary: "#1A4D2E",
    secondary: "#E0AD52",
    accent: "#2E8B57",
    bg: "#1A1A1A",
    colors: ["#E0AD52", "#1A1A1A", "#1A4D2E", "#5F9EA0", "#2E8B57", "#E0115F", "#990000"]
  },
  {
    id: "brisa_oceanica",
    name: "Brisa Oceânica",
    primary: "#003153",
    secondary: "#5C8A94",
    accent: "#C25953",
    bg: "#D2C9A5",
    colors: ["#5C8A94", "#003153", "#D2C9A5", "#C25953", "#3D2314"]
  },
  {
    id: "cassino_real",
    name: "Cassino Real",
    primary: "#BF9D5E",
    secondary: "#DF1359",
    accent: "#5F2F45",
    bg: "#3C1414",
    colors: ["#3C1414", "#BF9D5E", "#553E35", "#5F2F45", "#DF1359", "#F9A602", "#392A35"]
  },
  {
    id: "outono_dourado",
    name: "Outono Dourado",
    primary: "#FF8C00",
    secondary: "#E7B510",
    accent: "#734C38",
    bg: "#3B3A30",
    colors: ["#FF8C00", "#734C38", "#E7B510", "#3B3A30", "#483C32"]
  },
  {
    id: "reino_encantado",
    name: "Reino Encantado",
    primary: "#873FB2",
    secondary: "#FFB7C5",
    accent: "#146BBB",
    bg: "#244190",
    colors: ["#FFB7C5", "#00AFCB", "#244190", "#146BBB", "#873FB2", "#9A0C5C"]
  },
  {
    id: "romance_parisiense",
    name: "Romance Parisiense",
    primary: "#A72A2A",
    secondary: "#FFC0CB",
    accent: "#FF8C00",
    bg: "#F3E5AB",
    colors: ["#FFC0CB", "#A72A2A", "#F3E5AB", "#FF8C00", "#808000"]
  },
  {
    id: "aurora_costeira",
    name: "Aurora Costeira",
    primary: "#FF6B7E",
    secondary: "#2CAD9D",
    accent: "#F26F95",
    bg: "#FFDDAF",
    colors: ["#2CAD9D", "#3C777D", "#FFDDAF", "#FF6B7E", "#F26F95", "#AB0024"]
  },
  {
    id: "champagne_rose",
    name: "Champagne Rosé",
    primary: "#C00C14",
    secondary: "#F9C7BE",
    accent: "#857250",
    bg: "#EAE6DF",
    colors: ["#EAE6DF", "#F9C7BE", "#890707", "#C00C14", "#F2BDCD", "#857250", "#6F5926"]
  }
];

export const INITIAL_COMPANY_CONFIG: CompanyConfig = {
  name: "GS Eventos & Produções",
  logo: "⚡",
  logoRelatorios: "⚡ GS Eventos",
  logoPdf: "⚡ GS Eventos",
  favicon: "⚡",
  primaryColor: "#E85D04",
  secondaryColor: "#FEF3C7",
  buttonColor: "#E85D04",
  menuColor: "#1F2937",
  highlightColor: "#92400E",
  description: "Especialistas em produção operacional em grande escala, shows corporativos de destaque e soluções integradas sob medida.",
  phone: "(11) 98765-4321",
  email: "contato@gseventos.com.br",
  razaoSocial: "GS Eventos e Produções Ltda",
  nomeFantasia: "GS Eventos",
  cnpj: "12.345.678/0001-90",
  inscricaoEstadual: "111.222.333.444",
  whatsapp: "(11) 98765-4321",
  website: "www.gseventos.com.br",
  sobreEmpresa: "A GS Eventos atua há mais de 10 anos oferecendo inteligência de campo, equipes integradas e logística impecável para shows e feiras.",
  missao: "Entregar eventos impecáveis com segurança total, precisão cronológica e fornecedores integrados com alta transparência.",
  observacoesInternas: "Sistema de monitoramento e compliance interno para equipes operacionais e departamento pessoal.",
  rodapeInstitucional: "GS Eventos e Produções Ltda - CNPJ: 12.345.678/0001-90 - © 2026 Todos os Direitos Reservados",
  address: {
    street: "Av. Paulista",
    number: "1000",
    complement: "Salas 104 e 105",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310-100"
  }
};

export const INITIAL_USERS: User[] = [
  {
    id: "usr1",
    name: "Leandra Soares",
    email: "leandrasoares.rh@gmail.com",
    profile: "Admin",
    sector: "Diretoria Geral",
    active: true,
    avatar: "👩‍💼",
    statusText: "Em reunião estratégica",
    profileColor: "gs_eventos"
  },
  {
    id: "usr2",
    name: "Leandra Kaisa",
    email: "leandrakaisa@gmail.com",
    profile: "Administrativo",
    sector: "Controladoria",
    active: true,
    avatar: "👩‍💻",
    statusText: "Analisando contratos"
  },
  {
    id: "usr3",
    name: "Leandra Vitoria",
    email: "leandravitoria2002@gmail.com",
    profile: "DP",
    sector: "Departamento Pessoal",
    active: true,
    avatar: "👩‍💼",
    statusText: "Ajustando folhas de ponto"
  },
  {
    id: "usr4",
    name: "Carlos Eduardo Silva",
    email: "carlos.prod@gseventos.com",
    profile: "Operacional",
    sector: "Produção Executiva",
    active: true,
    avatar: "👨‍🔧",
    statusText: "Em campo - Montagem Réveillon"
  },
  {
    id: "usr5",
    name: "Roberto Lima",
    email: "roberto.aux@gseventos.com",
    profile: "Escritorio",
    sector: "Propostas Comerciais",
    active: true,
    avatar: "👨‍💻",
    statusText: "Disponível"
  },
  {
    id: "usr6",
    name: "Maria Fernanda Santos",
    email: "mafe.photo@gmail.com",
    profile: "Freelancer",
    active: true,
    avatar: "🤝",
    statusText: "Em campo - Cobertura operacional"
  },
  {
    id: "usr7",
    name: "Ana Santos",
    email: "ana.free@gmail.com",
    profile: "Freelancer",
    active: true,
    avatar: "🙋‍♀️",
    statusText: "Alocada no Réveillon"
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "emp1",
    fullName: "Leandra Soares",
    cpf: "123.456.789-00",
    rg: "SP-12.345.678",
    birthDate: "1988-10-14",
    phone: "(11) 98765-4301",
    email: "leandrasoares.rh@gmail.com",
    address: "Rua das Palmeiras, 150 - SP",
    role: "Diretora Geral",
    department: "Diretoria",
    bankName: "Itaú Unibanco",
    pixKey: "123.456.789-00",
    notes: "Fundadora e gestora principal.",
    documents: [
      { id: "doc1", name: "RG_Leandra.pdf", url: "#", size: "1.2 MB", date: "2026-01-10" },
      { id: "doc2", name: "CONTRATO_SOCIAL.pdf", url: "#", size: "3.4 MB", date: "2026-01-15" }
    ],
    active: true,
    photo: "👩‍💼",
    workHoursPerDay: 8
  },
  {
    id: "emp2",
    fullName: "Leandra Vitoria",
    cpf: "234.567.890-11",
    rg: "RJ-23.456.789",
    birthDate: "1994-05-22",
    phone: "(21) 97654-3210",
    email: "leandravitoria2002@gmail.com",
    address: "Av. Atlântica, 1010 - Rio de Janeiro",
    role: "Coordenadora de DP",
    department: "Departamento Pessoal",
    bankName: "Banco do Brasil",
    pixKey: "leandravitoria2002@gmail.com",
    notes: "Responsável por registros de colaboradores e banco de horas.",
    documents: [
      { id: "doc3", name: "Identidade_Vitoria.pdf", url: "#", size: "900 KB", date: "2026-02-05" }
    ],
    active: true,
    photo: "👩‍💼",
    workHoursPerDay: 8
  },
  {
    id: "emp3",
    fullName: "Leandra Kaisa",
    cpf: "345.678.901-22",
    birthDate: "1991-03-30",
    phone: "(11) 96543-2109",
    email: "leandrakaisa@gmail.com",
    address: "Rua Vergueiro, 300 - SP",
    role: "Gerente de Controladoria",
    department: "Administrativo",
    bankName: "Santander",
    pixKey: "345.678.901-22",
    notes: "Supervisiona custos, faturamento de fornecedores e contratos.",
    documents: [],
    active: true,
    photo: "👩‍💻",
    workHoursPerDay: 8
  },
  {
    id: "emp4",
    fullName: "Carlos Eduardo Silva",
    cpf: "456.789.012-33",
    birthDate: "1989-12-05",
    phone: "(11) 95432-1098",
    email: "carlos.prod@gseventos.com",
    address: "Rua Augusta, 1200 - SP",
    role: "Produtor de Campo Executivo",
    department: "Produção",
    bankName: "Bradesco",
    pixKey: "456.789.012-33",
    notes: "Operação total em campo nos dias de montagem e show.",
    documents: [],
    active: true,
    photo: "👨‍🔧",
    workHoursPerDay: 8
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: "evt1",
    name: "Réveillon Copacabana 2027",
    date: "2026-12-31",
    address: "Praia de Copacabana, Rio de Janeiro - RJ",
    coordinates: [-22.9711, -43.1843],
    stage: "planejamento",
    progress: 40,
    checklistIds: ["chk1"],
    supplierIds: ["sup1", "sup2", "sup3", "sup4", "sup5"],
    staffIds: ["usr1", "usr4", "usr6", "usr7"]
  } as any, // Cast support because pág 22 e 24 citam etapas como Planejamento/Execução
  {
    id: "evt2",
    name: "Casamento Silva e Santos",
    date: "2026-07-15",
    address: "Haras Santa Clara, Campinas - SP",
    coordinates: [-22.9056, -47.0608],
    stage: "pre_evento",
    progress: 65,
    checklistIds: ["chk2"],
    supplierIds: ["sup4", "sup5", "sup6"],
    staffIds: ["usr1", "usr2", "usr3"]
  },
  {
    id: "evt3",
    name: "Formatura Medicina USP",
    date: "2028-08-20",
    address: "Centro de Convenções Frei Caneca, São Paulo - SP",
    coordinates: [-23.5539, -46.6521],
    stage: "visita_tecnica",
    progress: 15,
    checklistIds: [],
    supplierIds: ["sup1", "sup4", "sup6"],
    staffIds: ["usr4", "usr5"]
  },
  {
    id: "evt4",
    name: "Festa Corporativa TechCorp",
    date: "2026-05-30",
    address: "Hotel Grand Hyatt, São Paulo - SP",
    coordinates: [-23.6083, -46.6961],
    stage: "pos_evento",
    progress: 90,
    checklistIds: ["chk1"],
    supplierIds: ["sup1", "sup2", "sup5"],
    staffIds: ["usr1", "usr4", "usr6"]
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: "sup1",
    cnpj: "12.345.678/0001-90",
    corporateName: "SOS Emergências Médicas Ltda",
    tradeName: "SOS Ambulâncias",
    category: "Ambulancia",
    contact: "Dra. Patricia",
    phone: "(11) 91111-2222",
    email: "contato@sosambulancias.com",
    city: "São Paulo",
    status: "Ativo",
    notes: "Disponibiliza ambulâncias UTI completas e equipe de médicos.",
    ratingPositive: 12,
    ratingNegative: 1,
    occurrencesCount: 0
  },
  {
    id: "sup2",
    cnpj: "45.678.901/0001-23",
    corporateName: "Mega Geradores de Energia S.A.",
    tradeName: "Mega Geradores",
    category: "Gerador",
    contact: "Eng. Marcos",
    phone: "(11) 92222-3333",
    email: "marcos@megageradores.com",
    city: "Campinas",
    status: "Ativo",
    notes: "Fornecimento de geradores com cabine silenciada e chaves reversoras.",
    ratingPositive: 15,
    ratingNegative: 2,
    occurrencesCount: 1
  },
  {
    id: "sup3",
    cnpj: "23.456.789/0001-11",
    corporateName: "BR Operações de Trânsito",
    tradeName: "Op. Trânsito",
    category: "Segurança",
    contact: "Inspetor Ramos",
    phone: "(11) 93333-4444",
    email: "contato@optransito.com",
    city: "São Paulo",
    status: "Ativo",
    notes: "Profissionais licenciados para bloqueio de vias e controle de acesso veicular.",
    ratingPositive: 8,
    ratingNegative: 0,
    occurrencesCount: 0
  },
  {
    id: "sup4",
    cnpj: "34.567.890/0001-22",
    corporateName: "Brigada de Incêndio Civil Paulista",
    tradeName: "Brigadista",
    category: "Segurança",
    contact: "Sargento Vieira",
    phone: "(11) 94444-5555",
    email: "vieira@brigadistas.com.br",
    city: "São Paulo",
    status: "Ativo",
    notes: "Força operacional de contenção e brigada civil para grandes aglomerações.",
    ratingPositive: 11,
    ratingNegative: 0,
    occurrencesCount: 0
  },
  {
    id: "sup5",
    cnpj: "56.789.012/0001-44",
    corporateName: "Buffet Gourmet Estrela de Prata",
    tradeName: "Lanche",
    category: "Buffet",
    contact: "Chefe Cláudia",
    phone: "(11) 95555-6666",
    email: "claudia@buffetpaulista.com",
    city: "São Paulo",
    status: "Ativo",
    notes: "Lanches executivos, jantares finos e coquetéis para shows.",
    ratingPositive: 19,
    ratingNegative: 3,
    occurrencesCount: 2
  },
  {
    id: "sup6",
    cnpj: "67.890.123/0001-55",
    corporateName: "Express Banheiros e Sanitários Químicos",
    tradeName: "Banheiro Químico",
    category: "Higiene",
    contact: "Fernando",
    phone: "(11) 96666-7777",
    email: "sanitarios@express.com.br",
    city: "Guarulhos",
    status: "Ativo",
    notes: "Fornece cabines de luxo adaptadas, reboque de limpeza e esgotamento rápido.",
    ratingPositive: 9,
    ratingNegative: 1,
    occurrencesCount: 1
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "tsk1",
    title: "Mapeamento elétrico do palco",
    description: "Revisar as distâncias e pontos de aterramento elétrico para a instalação do gerador de energia.",
    responsibleId: "usr4", // Carlos Eduardo
    dueDate: "2026-06-15",
    priority: "Alta",
    status: "Em Andamento",
    eventId: "evt1",
    sector: "Produção"
  },
  {
    id: "tsk2",
    title: "Obter alvará sanitário da prefeitura",
    description: "Reunir o laudo da SOS Ambulâncias e protocolar na vigilância sanitária.",
    responsibleId: "usr2", // Leandra Kaisa
    dueDate: "2026-06-05",
    priority: "Urgente",
    status: "Pendente",
    eventId: "evt1",
    sector: "Administrativo"
  },
  {
    id: "tsk3",
    title: "Coleta do ASO de equipe de montagem",
    description: "Mapeamento de todos os atestados ocupacionais e autorizações de trabalho em altura.",
    responsibleId: "usr3", // Leandra Vitoria
    dueDate: "2026-06-10",
    priority: "Alta",
    status: "Pendente",
    eventId: "evt1",
    sector: "DP"
  },
  {
    id: "tsk4",
    title: "Briefing operacional pós-visita",
    description: "Documentar todos os acessos de caminhão e banheiros mapeados no Haras.",
    responsibleId: "usr4", // Carlos Eduardo
    dueDate: "2026-07-02",
    priority: "Media",
    status: "Concluida",
    eventId: "evt2",
    sector: "Produção",
    completedAt: "2026-05-27"
  }
];

export const INITIAL_OCCURRENCES: Occurrence[] = [
  {
    id: "occ1",
    title: "Oscilação de tensão no gerador 2",
    priority: "Alta",
    category: "Falha Eletrica",
    description: "O gerador de backup oscilou para 200V temporariamente durante o teste de iluminação de palco. O técnico da Mega Geradores foi acionado.",
    responsible: "Carlos Eduardo Silva",
    supplierId: "sup2",
    eventId: "evt1",
    createdAt: "2026-05-25T14:30:00Z",
    userResponsible: "Carlos Eduardo Silva"
  },
  {
    id: "occ2",
    title: "Falta de gelo no camarim A",
    priority: "Baixa",
    category: "Outros",
    description: "O buffet demorou para reabastecer as caixas térmicas, necessitando de remessa emergencial externa.",
    responsible: "Leandra Soares",
    supplierId: "sup5",
    eventId: "evt4",
    createdAt: "2026-05-20T19:00:00Z",
    userResponsible: "Leandra Soares"
  }
];

export const INITIAL_PERSONAL_NOTES: PersonalNote[] = [
  {
    id: "not1",
    userId: "usr1",
    title: "Contatos de Emergência - SP",
    content: "Polícia Militar: 190. SAMU: 192. Corpo de Bombeiros: 193. Mapear postos policiais mais próximos de Frei Caneca.",
    date: "2026-05-27",
    categories: ["Urgente", "Logística"],
    isPinned: true,
    isFavorite: true
  },
  {
    id: "not2",
    userId: "usr1",
    title: "Sugeridos para Backstage",
    content: "Substituir garrafas plásticas por copos retornáveis reforçados no buffet para Réveillon. Diminui custos e lixo.",
    date: "2026-05-26",
    categories: ["Sustentabilidade"],
    isPinned: false,
    isFavorite: false
  }
];

export const INITIAL_WELLBEING: WellbeingRecord[] = [
  {
    id: "wb1",
    employeeName: "Ana Santos",
    employeeId: "emp1",
    type: "Folga",
    dateStart: "2026-06-01",
    dateEnd: "2026-06-02",
    notes: "Folga compensatória por plantão de fim de semana.",
    approved: true
  },
  {
    id: "wb2",
    employeeName: "Carlos Eduardo Silva",
    employeeId: "emp4",
    type: "Ferias",
    dateStart: "2026-09-01",
    dateEnd: "2026-09-30",
    notes: "Férias anuais regulamentares.",
    approved: true
  }
];

export const INITIAL_RECOGNITIONS: Recognition[] = [
  {
    id: "rec1",
    fromUserName: "Leandra Soares",
    fromUserAvatar: "👩‍💼",
    toUserName: "Carlos Eduardo Silva",
    toUserId: "usr4",
    badge: "Liderança",
    message: "Excelente condução das equipes operacionais sob estresse extremo na tempestade do Frei Caneca. Salvou a estrutura!",
    date: "2026-05-20"
  },
  {
    id: "rec2",
    fromUserName: "Carlos Eduardo Silva",
    fromUserAvatar: "👨‍🔧",
    toUserName: "Leandra Vitoria",
    toUserId: "usr3",
    badge: "Aplauso",
    message: "Rapidez fantástica na emissão de crachás e processamento da documentação de 25 freelancers de montagem em tempo recorde.",
    date: "2026-05-22"
  }
];

export const INITIAL_MEETINGS: MeetingAgenda[] = [
  {
    id: "met1",
    title: "Alinhamento Réveillon 2027",
    date: "2026-06-03",
    time: "14:00",
    moderator: "Leandra Soares",
    status: "Agendada",
    topics: [
      { id: "top1", topic: "Revisão dos orçamentos de segurança", duration: "15 min", speaker: "Leandra Kaisa" },
      { id: "top2", topic: "Cronograma de içamento de palco", duration: "20 min", speaker: "Carlos Eduardo" },
      { id: "top3", topic: "Controle de pontos em campo no Rio", duration: "10 min", speaker: "Leandra Vitoria" }
    ],
    decisions: [
      { id: "dec1", text: "Alocar mais 2 ambulâncias de suporte se o público estimado aumentar.", completed: false, owner: "Leandra Soares" },
      { id: "dec2", text: "Enviar checklist preliminar de fornecedores ao fotógrafo.", completed: true, owner: "Carlos Eduardo" }
    ]
  }
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: "prop1",
    clientName: "MegaEventos Corp",
    clientEmail: "comercial@megaeventos.com",
    eventName: "Congresso Internacional de Tecnologia",
    eventDate: "2026-11-10",
    budgetEst: "R$ 150.000,00",
    content: "## Proposta Operacional e Técnica completa\nProposta para fornecimento de equipe de coordenação, ambulâncias SOS e controle de trânsito terceirizado com laudos e aprovações municipais.",
    status: "Rascunho",
    createdAt: "2026-05-25"
  }
];

export const INITIAL_CLIENTS: Client[] = [
  { id: "cli1", name: "Marcos Paulo", company: "InterShows Entretenimento", phone: "(11) 99999-8888", email: "marcos@intershows.com", status: "Ativo" },
  { id: "cli2", name: "Beatriz Oliveira", company: "TechCorp Global", phone: "(11) 98888-7777", email: "beatriz@techcorp.com", status: "Ativo" }
];

export const INITIAL_CULTURE: CulturePost[] = [
  {
    id: "clt1",
    authorName: "Leandra Soares",
    authorAvatar: "👩‍💼",
    authorProfile: "Admin",
    content: "Bem-vindos à nova central principal da GS Eventos! Aqui reunimos operação, escritório, DP, fornecedores e orçamentos em um só local. Nosso foco é zero planilhas dispersas e máxima velocidade operacional em campo usando o celular! Vamos juntos fazer os melhores eventos operacionais do país! 🚀⚡",
    likes: 15,
    hearts: 10,
    claps: 12,
    date: "2026-05-27T08:00:00Z"
  }
];
