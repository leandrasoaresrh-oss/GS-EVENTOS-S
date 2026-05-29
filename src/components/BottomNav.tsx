import React from "react";
import { useApp } from "../context/AppContext";
import { BarChart2, Calendar, Clock, Clipboard, Menu } from "lucide-react";
import { getMenuIcon } from "./IconsRegistry";

interface BottomNavProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onMenuClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab: propActiveTab, setActiveTab: propSetActiveTab, onMenuClick }) => {
  const { activeView, setActiveView, companyConfig } = useApp();

  const activeTab = propActiveTab || activeView;
  const setActiveTab = propSetActiveTab || setActiveView;

  // Atributos de atalhos rápidos para mobile conforme perfil + Botão de Menu para acessar o resto
  const items = [
    { id: "dashboard", defaultLabel: "Dashboard", icon: BarChart2 },
    { id: "eventos", defaultLabel: "Eventos", icon: Calendar },
    { id: "ponto", defaultLabel: "Ponto", icon: Clock },
    { id: "notas", defaultLabel: "Notas", icon: Clipboard },
    { id: "menu", defaultLabel: "Menu", icon: Menu }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-zinc-950 border-t dark:border-zinc-900 flex items-center justify-around px-2 pb-safe z-50 transition-colors duration-300 shadow-lg">
      {items.map((item) => {
        const isMenu = item.id === "menu";
        const Icon = isMenu ? Menu : getMenuIcon(item.id, companyConfig?.menuIcons?.[item.id], item.icon);
        const active = !isMenu && activeTab === item.id;
        const label = companyConfig?.menuLabels?.[item.id] || item.defaultLabel;
        
        return (
          <button
            key={item.id}
            onClick={() => {
              if (isMenu) {
                onMenuClick?.();
              } else {
                setActiveTab(item.id);
              }
            }}
            className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-150 cursor-pointer ${
              active 
                ? "text-[var(--color-primary)] font-bold scale-105" 
                : "text-gray-500 dark:text-zinc-400 hover:text-gray-700"
            }`}
          >
            <Icon 
              size={18} 
              className={`${active ? "text-[var(--color-primary)] animate-pulse" : isMenu ? "text-orange-500" : "text-gray-400 dark:text-zinc-500"} mb-1 transition-transform`}
            />
            <span className="text-[10px] font-bold truncate max-w-full tracking-tight">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

