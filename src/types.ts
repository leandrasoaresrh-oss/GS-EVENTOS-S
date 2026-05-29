/**
 * Type definitions for GS Eventos platform
 */

export type UserProfile = 'Admin' | 'Administrativo' | 'DP' | 'Escritorio' | 'Operacional' | 'Freelancer';

export interface Company {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
  sector?: string;
  active: boolean;
  avatar: string; // Emoji avatar or image URL
  profileColor?: string;
  banner?: string;
  statusText?: string;
  companyId?: string; // Multi-company scoping
  password?: string;
  isFirstAccess?: boolean;
}

export interface CompanyConfig {
  name: string;
  logo: string;
  logoRelatorios?: string;
  logoPdf?: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  menuColor: string;
  highlightColor: string;
  description: string;
  phone: string;
  email: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj?: string;
  inscricaoEstadual?: string;
  whatsapp?: string;
  website?: string;
  sobreEmpresa?: string;
  missao?: string;
  observacoesInternas?: string;
  rodapeInstitucional?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  menuLabels?: Record<string, string>;
  menuIcons?: Record<string, string>;
}

export type EventStage = 'visita_tecnica' | 'pre_evento' | 'montagem' | 'execucao' | 'pos_evento' | 'finalizado';

export interface Event {
  id: string;
  name: string;
  date: string;
  address: string;
  coordinates: [number, number]; // [lat, lng] for OpenStreetMap
  stage: EventStage;
  progress: number; // 0 to 100
  checklistIds: string[];
  supplierIds: string[];
  staffIds: string[]; // User IDs (staff allocated)
  companyId?: string; // Multi-company scoping
}

export interface Supplier {
  id: string;
  cnpj: string;
  corporateName: string;
  tradeName: string;
  category: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  status: 'Ativo' | 'Inativo';
  notes?: string;
  ratingPositive: number;
  ratingNegative: number;
  occurrencesCount: number;
  companyId?: string; // Multi-company scoping
}

export type OccurrencePriority = 'Baixa' | 'Media' | 'Alta' | 'Critica';
export type OccurrenceCategory = 'Atraso' | 'Falha Eletrica' | 'Equipe Incompleta' | 'Acidente' | 'Prob. Estrutural' | 'Fornecedor Ausente' | 'Falha Comunicação' | 'Pendência Op.' | 'Outros';

export interface Occurrence {
  id: string;
  title: string;
  priority: OccurrencePriority;
  category: OccurrenceCategory;
  description: string;
  responsible: string; // User Name or ID
  supplierId?: string; // Optional related supplier
  eventId: string; // Related event
  photo?: string; // Base64 or mock URL
  createdAt: string;
  userResponsible: string; // Who resolved or registered
  companyId?: string; // Multi-company scoping
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  responsibleId: string; // User ID
  dueDate: string;
  priority: 'Baixa' | 'Media' | 'Alta' | 'Urgente';
  status: 'Pendente' | 'Em Andamento' | 'Atrasada' | 'Concluida';
  eventId?: string;
  sector?: string;
  completedAt?: string;
  companyId?: string; // Multi-company scoping
  dependsOnTaskId?: string; // Parent task dependency
  estimatedHours?: number;
  actualHours?: number;
}

export interface TechnicalVisit {
  id: string;
  eventId: string;
  officer: string; // GS Employee
  cnpj?: string;
  address: string;
  date: string;
  sections: {
    terrain: {
      type: 'Plano' | 'Irregular';
      hasMudRisk: boolean;
      notes: string;
    };
    bathrooms: {
      isSuitableForChemicals: boolean;
      goodFlooring: boolean;
      easyMaintenanceAccess: boolean;
      notes: string;
    };
    water: {
      hasWater: boolean;
      distance: string;
      pressure: 'Boa' | 'Média' | 'Fraca';
      accessType: 'Torneira' | 'Registro';
      notes: string;
    };
    structure: {
      availableArea: number; // m²
      hasDressingRoomSpace: boolean;
      hasProductionSpace: boolean;
      bestPublicOrientation: boolean;
      hasVisualInterference: boolean;
      notes: string;
    };
    energy: {
      nearPole: boolean;
      poleDistance: string;
      hasEnergyPoint: boolean;
      pointsCount: number;
      voltage: '110V' | '220V' | 'Trifásico';
      accessiblePanel: boolean;
      temporaryConnection: boolean;
      cablePass: 'Livre' | 'Difícil';
      nearStagePoint: boolean;
      notes: string;
    };
    climate: {
      sun: 'Alto' | 'Médio' | 'Baixo';
      wind: 'Forte' | 'Médio' | 'Fraco';
      floodRisk: boolean;
      sunHitsStage: boolean;
      hasEnvironmentalProtection: boolean;
      hasWeatherOrEnvironmentalImpact: boolean;
      notes: string;
    };
    security: {
      definedEntryExit: boolean;
      emergencySpace: boolean;
      hasLicense: boolean;
      pcdAccessibility: boolean;
      hasAccessControl: boolean;
      safeScaffolding: boolean;
      hasCompromisingRisks: boolean;
      notes: string;
    };
  };
  risksAndAdjustments: string;
  generalNotes: string;
  isSuitable: boolean;
  createdAt: string;
}

export interface ReportPreEvento {
  id: string;
  eventId: string;
  date: string;
  reporterName: string;
  role: string;
  // Status do Dia
  activitiesExecuted: 'Sim' | 'Não' | 'Outro';
  activitiesOtherNote?: string;
  activitiesDoneToday: string;
  // Problemas/Ocorrências
  hasProblemToday: boolean;
  problemDescription?: string;
  involvesSupplier?: boolean;
  supplierInvolvedId?: string;
  actionTaken?: string;
  // Pendências
  pendingPreparationItems?: string;
  hasCriticalPending: boolean;
  criticalPendingDescription?: string;
  riskOfNotSolving?: string;
  // Status Geral
  preparationRating: 'Dentro do planejado' | 'Com pequenos ajustes necessários' | 'Em atenção' | 'Crítico';
  isReadyForExecution: 'Sim' | 'Parcialmente' | 'Não';
  // Observações
  additionalInfo?: string;
  createdAt: string;
}

export interface ReportPosEvento {
  id: string;
  eventId: string;
  date: string;
  reporterName: string;
  role: string;
  // Ponto de melhoria
  areaToImprove: string; // Qual função, fornecedor ou estrutura precisa melhorar?
  whyImprove: string; // Por quê?
  hasChallenges: boolean; // Houve algum desafio durante o evento?
  challengeDescription?: string; // Descreva qual desafio ocorreu durante o evento
  areaRelated?: string; // Qual área do evento estava relacionada? (Ex: credenciamento, produção de palco)
  challengeRelatedToSupplier?: boolean; // Esse desafio foi relacionado a algum fornecedor?
  suppliersInvolvedIds?: string[]; // Quais fornecedores estavam envolvidos
  professionalsInvolvedNotes?: string; // Quais profissionais do fornecedor estiveram envolvidos na situação?
  solutionsFound?: string; // Qual(is) alternativa(s) foi(foram) encontrada(s) para lidar com o(s) desafio(s)?
  wasSolutionEffective?: 'Sim' | 'Não' | 'Outro'; // A solução foi eficaz?
  whatToDoDifferent?: string; // O que poderia ter sido feito diferente para evitar ou minimizar o desafio?
  // Feedback
  positives: string; // Quais foram os principais pontos positivos do evento?
  ratingOrganization: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  ratingCommunication: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  ratingSuppliers: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  ratingOverall: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  highlightAdditional?: string; // Você gostaria de destacar algo que não foi mencionado anteriormente?
  createdAt: string;
}

export interface SupplierEvaluation {
  id: string;
  eventId: string;
  supplierId: string;
  evaluatorName: string;
  evaluatorRole: string;
  date: string;
  // Equipe
  isTeamComplete: boolean;
  arrivedOnTime: boolean;
  // Uniforme e apresentação
  fullUniform: boolean;
  uniformGoodCondition: boolean;
  suitableFootwear: boolean;
  cleanAndWellPresented: boolean;
  // Comportamentos
  professionalPosture: boolean;
  proactive: boolean;
  knowsFunction: boolean;
  // Comportamentos negativos checkboxes
  negativeBehaviors: {
    insubordination: boolean;
    excessivePhone: boolean;
    lackOfAttention: boolean;
    excessiveChitchat: boolean;
    rudenessToGuests: boolean;
    unnotifiedAbsence: boolean;
    refusedActivity: boolean;
    inappropriateLanguage: boolean;
    disorganization: boolean;
    lackOfPoliteness: boolean;
    conflicts: boolean;
    disobeyedCoordination: boolean;
    eatingInWrongPlace: boolean;
    alcoholOrDrugs: boolean;
    lackOfAlignment: boolean;
  };
  negativeBehaviorNotes?: string;
  generalNotes?: string;
  status: 'Aprovado' | 'Parcial' | 'Reprovado';
  signatureName: string;
}

export type PointRecordType = 'Entrada' | 'Saida' | 'Ida Almoço' | 'Retorno Almoço' | 'Ida Café' | 'Retorno Café';

export interface TimeRecord {
  id: string;
  employeeId: string;
  date: string;
  timestamp: string;
  type: PointRecordType;
  photo?: string; // Photo as Base64 or mock indicator
  approved: boolean;
  correctedByDp?: boolean;
  notes?: string;
  companyId?: string; // Multi-company scoping
  justification?: string; // Text justification
  justificationStatus?: 'Pendente' | 'Aprovado' | 'Rejeitado';
}

export interface Employee {
  id: string;
  fullName: string;
  cpf: string;
  rg?: string;
  birthDate?: string;
  phone: string;
  email: string;
  address: string;
  role: string; // Cargo definido por Admin ou DP
  department: string; // Setor organizacional
  bankName?: string;
  pixKey?: string;
  notes?: string;
  documents: { id: string; name: string; url: string; size: string; date: string }[];
  active: boolean;
  photo?: string;
  workHoursPerDay: number; // Ex: 8 (carga horária do banco de horas)
  companyId?: string; // Multi-company scoping
}

export interface AppNotification {
  id: string;
  type: 'alert' | 'info' | 'message' | 'task' | 'occurrence';
  title: string;
  description: string;
  date: string;
  read: boolean;
  userId: string; // Targeted user
}

export interface EventPhoto {
  id: string;
  eventId: string;
  category: 'Montagem' | 'Backstage' | 'Ocorrências' | 'Estrutura' | 'Palestras' | 'Público' | 'Fechamento';
  url: string;
  caption?: string;
  responsibleName: string;
  date: string;
}

export interface EventMessage {
  id: string;
  eventId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderProfile: UserProfile;
  message: string;
  timestamp: string;
  attachmentUrl?: string;
}

export interface BudgetItem {
  id: string;
  category: string; // Ex: BUFFET, ARTISTA, TENDA, etc.
  service: string;
  supplierName: string;
  quantity: number;
  unitValue: number;
  dailyValue: number;
  durationDays: number;
  chargesValue: number; // Encargos
  totalValue: number; // Quantidade * (ValUnit + ValDiário * Duração) + Encargos
  status: 'Pendente' | 'Aprovado' | 'Reprovado';
  eventId: string;
  notes?: string;
  companyId?: string; // Multi-company scoping
}

export interface Credential {
  id: string;
  employeeId: string;
  eventId?: string;
  uniqueId: string; // Ex: GS-A9EF78
  printDate?: string;
}

export interface CheckInRecord {
  id: string;
  eventId: string;
  type: string; // 'Fornecedor Chegou', 'Colaborador Chegou', 'Montagem Iniciada', 'Gerador Ligado', etc.
  description: string;
  timestamp: string;
  responsibleName: string;
}

export interface PersonalNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  categories: string[];
  isPinned: boolean;
  isFavorite: boolean;
  companyId?: string; // Multi-company scoping
}

export interface CulturePost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorProfile: string;
  content: string;
  likes: number;
  hearts: number;
  claps: number;
  date: string;
}

export type WellbeingRecordType = 'Ferias' | 'Folga' | 'Aniversario' | 'Atestado' | 'Licenca';

export interface WellbeingRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  type: WellbeingRecordType;
  dateStart: string;
  dateEnd: string;
  notes?: string;
  approved: boolean;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'radio' | 'photo' | 'signature' | 'checkbox';
  required: boolean;
  options?: string[]; // For select, radio, checkbox
}

export interface FormSchema {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  creatorName: string;
  createdAt: string;
}

export interface FormSubmission {
  id: string;
  schemaId: string;
  schemaTitle: string;
  respondentName: string;
  eventId?: string;
  values: { [fieldId: string]: any };
  submittedAt: string;
}

export interface Recognition {
  id: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserName: string;
  toUserId: string;
  badge: 'Aplauso' | 'Destaque' | 'Liderança';
  message: string;
  date: string;
}

export interface MeetingAgenda {
  id: string;
  title: string;
  date: string;
  time: string;
  moderator: string;
  status: 'Agendada' | 'Em Andamento' | 'Concluída';
  topics: { id: string; topic: string; duration: string; speaker: string }[];
  decisions: { id: string; text: string; completed: boolean; owner: string }[];
  companyId?: string; // Multi-company scoping
}

export interface Proposal {
  id: string;
  clientName: string;
  clientEmail: string;
  eventName: string;
  eventDate: string;
  budgetEst: string;
  content: string; // Generated markdown rich text
  status: 'Rascunho' | 'Enviada' | 'Aprovada' | 'Recusada';
  createdAt: string;
  approvalRate?: number;
  companyId?: string; // Multi-company scoping
}

export interface Client {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  status: 'Lead' | 'Negociação' | 'Ativo' | 'Inativo';
  companyId?: string; // Multi-company scoping
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string; // Ex: "Criou colaborador", "Editou evento"
  timestamp: string;
  affectedItem: string; // "Colaborador Ana Santos", "Evento Sâo Pedro"
  companyId?: string; // Multi-company scoping
}

export interface MenuOrder {
  userId: string;
  hiddenTabs: string[];
  tabOrder: string[]; // List of tab keys
}
