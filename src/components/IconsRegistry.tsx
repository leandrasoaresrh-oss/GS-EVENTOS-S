import React from "react";
import { 
  BarChart2, Calendar, Clock, Clipboard, Sliders, Users, FileText, Award, 
  CreditCard, MessageSquare, Map, Settings, AlertTriangle, Briefcase, Key, Eye, Shield, 
  Compass, TrendingUp, Heart, Star, Coffee, Camera, Music, Film, Zap, Globe, DollarSign,
  BriefcaseIcon, Sparkles, Activity, PieChart, Database, Terminal, Phone, Percent, List,
  ListTodo, UserCheck, MessageCircle, BarChart, Flag, Inbox
} from "lucide-react";

// Master list of available icons for the user to pick from
export const AVAILABLE_ICONS = {
  BarChart2: { icon: BarChart2, label: "Gráfico de Barras" },
  Calendar: { icon: Calendar, label: "Calendário / Agenda" },
  Clock: { icon: Clock, label: "Relógio / Ponto" },
  Clipboard: { icon: Clipboard, label: "Prancheta / Vencimentos" },
  Sliders: { icon: Sliders, label: "Ajustes / Sliders" },
  Users: { icon: Users, label: "Usuários / Equipes" },
  FileText: { icon: FileText, label: "Documento / Briefing" },
  Award: { icon: Award, label: "Prêmio / Bem-Estar" },
  CreditCard: { icon: CreditCard, label: "Cartão / Orçamentos" },
  MessageSquare: { icon: MessageSquare, label: "Mensagem / Reunião" },
  Map: { icon: Map, label: "Mapa / Localizações" },
  Settings: { icon: Settings, label: "Engrenagem / Configurações" },
  AlertTriangle: { icon: AlertTriangle, label: "Alerta / Ocorrências" },
  Briefcase: { icon: Briefcase, label: "Maleta / Negócios animate-pulse" },
  Key: { icon: Key, label: "Chave / Acesso" },
  Shield: { icon: Shield, label: "Escudo / Segurança" },
  Compass: { icon: Compass, label: "Bússola / Exploração" },
  TrendingUp: { icon: TrendingUp, label: "Tendência de Alta" },
  Heart: { icon: Heart, label: "Coração / Favorito" },
  Star: { icon: Star, label: "Estrela / Avaliação" },
  Coffee: { icon: Coffee, label: "Café / Intervalo" },
  Camera: { icon: Camera, label: "Câmera / Fotógrafos" },
  Music: { icon: Music, label: "Música / Shows" },
  Film: { icon: Film, label: "Filme / Vídeos" },
  Zap: { icon: Zap, label: "Raio / Energia" },
  Globe: { icon: Globe, label: "Globo / Redes" },
  DollarSign: { icon: DollarSign, label: "Cifrão / Financeiro" },
  Sparkles: { icon: Sparkles, label: "Espetáculo / Brilhos" },
  Activity: { icon: Activity, label: "Atividade / Pulso" },
  PieChart: { icon: PieChart, label: "Gráfico de Pizza" },
  Database: { icon: Database, label: "Servidor / Banco" },
  Terminal: { icon: Terminal, label: "Terminal / Código" },
  Phone: { icon: Phone, label: "Telefone / Contato" },
  Percent: { icon: Percent, label: "Porcentagem / Taxas" },
  List: { icon: List, label: "Lista / Tarefas" },
  ListTodo: { icon: ListTodo, label: "To-Do / Kanban" },
  UserCheck: { icon: UserCheck, label: "Presença / Check-in" },
  MessageCircle: { icon: MessageCircle, label: "Chat / Conversa" },
  Flag: { icon: Flag, label: "Bandeira / Etapas" },
  Inbox: { icon: Inbox, label: "Caixa de Entrada" }
};

export type IconName = keyof typeof AVAILABLE_ICONS;

// Helper to get custom icon component or fall back to default mapping
export function getMenuIcon(tabKey: string, customIconName?: string, defaultFallback: React.ComponentType<any> = FileText): React.ComponentType<any> {
  // If user selected a custom icon from our available list
  if (customIconName && AVAILABLE_ICONS[customIconName as IconName]) {
    return AVAILABLE_ICONS[customIconName as IconName].icon;
  }

  // Fallback to traditional icon map
  const defaultIconMap: Record<string, React.ComponentType<any>> = {
    dashboard: BarChart2,
    configuracoes: Settings,
    briefing: FileText,
    alertas: AlertTriangle,
    eventos: Calendar,
    fornecedores: Sliders,
    ponto: Clock,
    vencimentos: Clipboard,
    tarefas: ListTodo,
    colaboradores: Users,
    formularios: FileText,
    bem_estar: Award,
    orcamentos: CreditCard,
    credenciais: CreditCard,
    reunioes: MessageSquare,
    propostas: FileText,
    mapa: Map,
    notas: FileText,
    logs: Settings
  };

  return defaultIconMap[tabKey] || defaultFallback;
}
