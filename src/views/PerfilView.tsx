import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { COLOR_PALETTES } from "../data/initialData";
import { Save, Check, User, Shield, Camera, Upload, Trash2, HelpCircle, Palette, Sparkles, AlertCircle, Edit } from "lucide-react";

// Initial Character Avatars Lib
export const PRELOADED_CHARACTERS = [
  { group: "Hora de Aventura", name: "Finn, o Humano", avatar: "🗡️", color: "bg-sky-100 border-sky-300" },
  { group: "Hora de Aventura", name: "Jake, o Cão", avatar: "🐕", color: "bg-amber-100 border-amber-300" },
  { group: "Hora de Aventura", name: "Rei Gelado", avatar: "👑", color: "bg-blue-100 border-blue-300" },
  { group: "Hora de Aventura", name: "Princesa Jujuba", avatar: "🍬", color: "bg-pink-100 border-pink-300" },
  { group: "Hora de Aventura", name: "Marceline", avatar: "🎸", color: "bg-slate-200 border-slate-400" },
  { group: "Hora de Aventura", name: "Princesa de Fogo", avatar: "🔥", color: "bg-orange-100 border-orange-300" },
  { group: "Meninas Superpoderosas", name: "Florzinha", avatar: "🌸", color: "bg-pink-50 border-pink-200" },
  { group: "Meninas Superpoderosas", name: "Lindinha", avatar: "💧", color: "bg-cyan-50 border-cyan-200" },
  { group: "Meninas Superpoderosas", name: "Docinho", avatar: "🟢", color: "bg-emerald-50 border-emerald-200" },
  { group: "Meninas Superpoderosas", name: "Macaco Louco", avatar: "🧠", color: "bg-purple-50 border-purple-200" },
  { group: "Divertida Mente", name: "Alegria", avatar: "☀️", color: "bg-yellow-50 border-yellow-200" },
  { group: "Divertida Mente", name: "Tristeza", avatar: "💙", color: "bg-blue-50 border-blue-200" },
  { group: "Divertida Mente", name: "Raiva", avatar: "🤬", color: "bg-rose-50 border-rose-200" },
  { group: "Divertida Mente", name: "Nojinho", avatar: "🤢", color: "bg-green-50 border-green-200" },
  { group: "Divertida Mente", name: "Medo", avatar: "😨", color: "bg-indigo-50 border-indigo-200" },
  { group: "Outros Clássicos", name: "Barbie", avatar: "🎀", color: "bg-fuchsia-50 border-fuchsia-200" }
];

export const PerfilView: React.FC = () => {
  const { currentUser, setCurrentUser, theme, setTheme, addAuditLog, currentPalette, setPaletteById } = useApp();

  const [activeTab, setActiveTab] = useState<'perfil' | 'visual' | 'seguranca'>('perfil');
  const [name, setName] = useState(currentUser.name || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [sector, setSector] = useState(currentUser.sector || "");
  const [statusText, setStatusText] = useState(currentUser.statusText || "");
  const [customAvatars, setCustomAvatars] = useState<string[]>(() => {
    const saved = localStorage.getItem("gs_custom_avatar_library");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newCustomAvatar, setNewCustomAvatar] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar || "👩‍💼");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedAvatar(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomAvatarToLib = () => {
    if (!newCustomAvatar.trim()) return;
    const updated = [...customAvatars, newCustomAvatar.trim()];
    setCustomAvatars(updated);
    localStorage.setItem("gs_custom_avatar_library", JSON.stringify(updated));
    setNewCustomAvatar("");
  };

  const handleRemoveCustomAvatarFromLib = (idx: number) => {
    const updated = customAvatars.filter((_, i) => i !== idx);
    setCustomAvatars(updated);
    localStorage.setItem("gs_custom_avatar_library", JSON.stringify(updated));
  };

  const isImageAvatar = (val: string): boolean => {
    if (!val) return false;
    return (
      val.startsWith("data:image/") ||
      val.startsWith("http://") ||
      val.startsWith("https://") ||
      val.startsWith("/")
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      name,
      email,
      sector,
      statusText,
      avatar: selectedAvatar,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("gs_current_user", JSON.stringify(updatedUser));
    
    addAuditLog("Perfil de usuário atualizado", `${name} (${currentUser.profile})`);
    
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header section with Glassy Backdrop and Gradient Accent */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-zinc-950 rounded-3xl border border-gray-150 dark:border-zinc-900 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full -z-10 blur-xl"></div>
        
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0 select-none">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-xs opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-3xl font-bold shadow-md overflow-hidden">
              {isImageAvatar(selectedAvatar) ? (
                <img src={selectedAvatar} className="w-full h-full object-cover" alt="Perfil" referrerPolicy="no-referrer" />
              ) : (
                <span>{selectedAvatar}</span>
              )}
            </div>
            
            <label className="absolute -bottom-1 -right-1 p-1 bg-orange-600 dark:bg-orange-500 text-white rounded-lg shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all">
              <Camera size={12} />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarUpload} 
                className="hidden" 
              />
            </label>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-gray-900 dark:text-zinc-50 font-display tracking-tight truncate">
                {currentUser.name}
              </h2>
              <span className="text-[10px] uppercase font-mono bg-orange-500/10 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-md font-bold shrink-0">
                {currentUser.profile}
              </span>
            </div>
            <p className="text-xs text-gray-400 truncate mt-0.5">{currentUser.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-mono uppercase bg-gray-50 dark:bg-zinc-900 px-2 py-0.5 rounded font-extrabold text-gray-500 dark:text-zinc-400">
                Status: {currentUser.statusText || "Ativo em tempo real"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess ? (
            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-md animate-bounce">
              <Check size={14} className="stroke-[3]" />
              <span>Salvo com sucesso!</span>
            </div>
          ) : (
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white text-xs font-black rounded-2xl flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Save size={14} />
              <span>Salvar Alterações</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Form Scoping grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-6">
        
        {/* Navigation Rail left side */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-950 p-4 rounded-3xl border border-gray-150 dark:border-zinc-900 space-y-2.5 shadow-2xs">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2.5 transition-all select-none ${
              activeTab === 'perfil' 
                ? "bg-orange-500/10 text-orange-700 dark:text-orange-400" 
                : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100/50 dark:hover:bg-zinc-900/40"
            }`}
          >
            <User size={16} />
            <span>Perfil e Status</span>
          </button>

          <button
            onClick={() => setActiveTab('visual')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2.5 transition-all select-none ${
              activeTab === 'visual' 
                ? "bg-orange-500/10 text-orange-700 dark:text-orange-400" 
                : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100/50 dark:hover:bg-zinc-900/40"
            }`}
          >
            <Palette size={16} />
            <span>Tema Individual e Avatares</span>
          </button>

          <button
            onClick={() => setActiveTab('seguranca')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2.5 transition-all select-none ${
              activeTab === 'seguranca' 
                ? "bg-orange-500/10 text-orange-700 dark:text-orange-400" 
                : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100/50 dark:hover:bg-zinc-900/40"
            }`}
          >
            <Shield size={16} />
            <span>Administrar Avatares</span>
          </button>
        </div>

        {/* Content Box right side */}
        <div className="lg:col-span-9 bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-900 shadow-2xs">
          
          {/* TAB 1: PERFIL E STATUS */}
          {activeTab === 'perfil' && (
            <div className="space-y-6">
              <div className="border-b dark:border-zinc-900 pb-3">
                <h3 className="text-sm font-black text-gray-950 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                  <User size={16} className="text-orange-500" />
                  <span>Informações de Perfil</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">Configure seus dados corporativos e status em tempo real.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <span className="font-bold text-gray-600 dark:text-zinc-400 block">Nome Completo *</span>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Seu nome completo" 
                    className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500/30" 
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-gray-600 dark:text-zinc-400 block">Email Corporativo *</span>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="seu.email@gseventos.com" 
                    className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500/30" 
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-gray-600 dark:text-zinc-400 block">Setor / Departamento</span>
                  <input 
                    type="text" 
                    value={sector} 
                    onChange={(e) => setSector(e.target.value)} 
                    placeholder="Ex: Eventos, Produção, DP" 
                    className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500/30" 
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-gray-600 dark:text-zinc-400 block">Anotação de Status Rápido</span>
                  <select
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500/30 font-semibold"
                  >
                    <option value="Online">🟢 Online</option>
                    <option value="Ocupado">🔴 Ocupado</option>
                    <option value="Em reunião">📅 Em reunião</option>
                    <option value="Ausente">🟡 Ausente</option>
                    <option value="Almoço">🥪 Almoço</option>
                    <option value="Foco">🎯 Foco absoluto</option>
                    <option value="Offline">⚫ Offline</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-start gap-2.5 text-[11px] text-amber-700 dark:text-amber-400">
                <HelpCircle size={16} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Nota Operacional:</strong> Suas informações de status e foto de perfil serão exibidas imediatamente nos menus, comentários de tarefas, atas de reuniões, checklists de vistorias e demais áreas administrativas do sistema.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: TEMA INDIVIDUAL E AVATARES */}
          {activeTab === 'visual' && (
            <div className="space-y-6">
              <div className="border-b dark:border-zinc-900 pb-3">
                <h3 className="text-sm font-black text-gray-950 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                  <Palette size={16} className="text-orange-500" />
                  <span>Tema Individual & Biblioteca de Avatares</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">Sua preferência individual de exibição, instantânea e exclusiva.</p>
              </div>

              {/* Instant individual light/dark toggler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-zinc-900/35 border border-gray-150 dark:border-zinc-850 p-4 rounded-2xl space-y-2">
                  <span className="font-black text-xs text-gray-700 dark:text-zinc-200 block">Aparência do Software</span>
                  <p className="text-[10px] text-gray-400">Altere instantaneamente o contraste do seu software. Afeta somente a sua conta.</p>
                  
                  <div className="flex gap-2.5 pt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setTheme("light");
                        localStorage.setItem("gs_dark_mode", "false");
                      }}
                      className={`flex-1 p-3 border rounded-xl font-black text-xs text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        theme === "light"
                          ? "bg-white text-gray-900 border-orange-500 shadow-xs"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800"
                      }`}
                    >
                      🌱 Modo Claro
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTheme("dark");
                        localStorage.setItem("gs_dark_mode", "true");
                      }}
                      className={`flex-1 p-3 border rounded-xl font-black text-xs text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        theme === "dark"
                          ? "bg-zinc-905 text-white border-orange-500 bg-zinc-900 shadow-xs"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      🌌 Modo Escuro
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-zinc-900/35 border border-gray-150 dark:border-zinc-850 p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="font-black text-xs text-gray-700 dark:text-zinc-200 block">Carregar Foto Própria</span>
                    <p className="text-[10px] text-gray-400">Envie um arquivo PNG ou JPG para usar como imagem de seu perfil corporativo.</p>
                  </div>

                  <div className="pt-2">
                    <label className="cursor-pointer bg-white hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[10px] font-black py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-gray-200 dark:border-zinc-750 transition-all shadow-3xs">
                      <Upload size={14} className="text-orange-500" />
                      <span>UPLOAD DE IMAGEM</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION: PREDEFINED BRANDING COLOR PALETTES */}
              <div className="space-y-4 pt-4 border-t border-gray-150 dark:border-zinc-900">
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-orange-500" />
                  <span className="font-extrabold text-xs text-gray-800 dark:text-zinc-200 block">
                    Paleta de Cores e Temas do Sistema
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">
                  Selecione uma das paletas de cores institucionais do sistema para atualizar toda a interface imediatamente.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {COLOR_PALETTES.map((palette) => {
                    const active = currentPalette.id === palette.id;
                    return (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => setPaletteById(palette.id)}
                        className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex flex-col justify-between h-28 relative font-display ${
                          active 
                            ? "border-orange-500 bg-orange-500/5 shadow-2xs" 
                            : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-gray-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        {active && (
                          <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                          </span>
                        )}
                        
                        <div>
                          <span className="text-xs font-black text-gray-850 dark:text-zinc-100 block truncate">{palette.name}</span>
                          <span className="text-[8px] font-mono font-bold text-gray-400 dark:text-zinc-500 block uppercase tracking-wider">{palette.id.replace(/_/g, " ")}</span>
                        </div>

                        {/* Color previsualizers */}
                        <div className="flex gap-1 overflow-x-auto w-full pt-1.5 scrollbar-thin">
                          {palette.colors && palette.colors.map((c, i) => (
                            <span 
                              key={i} 
                              className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10 shrink-0 shadow-3xs"
                              style={{ backgroundColor: c }}
                              title={c}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preloaded Character list selector (Animated theme) */}
              <div className="space-y-3">
                <span className="font-extrabold text-xs text-gray-800 dark:text-zinc-200 block">Biblioteca de Personagens Divertidos & Clássicos</span>
                
                {/* Categorized rendering */}
                {["Hora de Aventura", "Meninas Superpoderosas", "Divertida Mente", "Outros Clássicos"].map((category) => (
                  <div key={category} className="space-y-2 pb-2">
                    <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest block">{category}</span>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                      {PRELOADED_CHARACTERS.filter(item => item.group === category).map((item) => {
                        const active = selectedAvatar === item.avatar;
                        return (
                          <button
                            type="button"
                            key={item.name}
                            onClick={() => setSelectedAvatar(item.avatar)}
                            className={`p-3 rounded-2xl flex flex-col justify-center items-center gap-1 border transition-all active:scale-95 text-center cursor-pointer group hover:shadow-2xs min-h-[58px] ${item.color} ${
                              active ? "ring-2 ring-orange-500 scale-105" : "hover:brightness-95"
                            }`}
                            title={item.name}
                          >
                            <span className="text-2xl filter group-hover:scale-110 transition-transform">{item.avatar}</span>
                            <span className="text-[8px] font-extrabold text-gray-500 dark:text-zinc-400 truncate w-full">{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Custom system avatars dynamically registered in visual state */}
                {customAvatars.length > 0 && (
                  <div className="space-y-2 pt-2 border-t dark:border-zinc-900">
                    <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest block">Avatares Customizados da Empresa</span>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                      {customAvatars.map((item, idx) => {
                        const active = selectedAvatar === item;
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setSelectedAvatar(item)}
                            className={`p-2 rounded-2xl flex flex-col justify-center items-center border transition-all active:scale-95 text-center cursor-pointer min-h-[58px] ${
                              active ? "ring-2 ring-orange-500 scale-105 border-orange-505" : "bg-zinc-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border-gray-200 dark:border-zinc-800"
                            }`}
                          >
                            <span className="text-lg truncate max-w-full font-bold">{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ADMINISTRAÇÃO DE AVATARES */}
          {activeTab === 'seguranca' && (
            <div className="space-y-6">
              <div className="border-b dark:border-zinc-900 pb-3">
                <h3 className="text-sm font-black text-gray-950 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                  <Shield size={16} className="text-orange-500" />
                  <span>Configuração e Administração de Avatares do Sistema</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">Permite estender a biblioteca padrão adicionando emojis ou imagens de novos personagens.</p>
              </div>

              <div className="bg-gray-50/50 dark:bg-zinc-900/35 border border-gray-150 dark:border-zinc-850 p-4 rounded-2xl space-y-3">
                <span className="font-extrabold text-xs text-gray-700 dark:text-zinc-200 block">Cadastrar Novo Custom Avatar</span>
                
                <div className="flex gap-2 max-w-md">
                  <input 
                    type="text" 
                    value={newCustomAvatar}
                    onChange={(e) => setNewCustomAvatar(e.target.value)}
                    placeholder="Ex: 👾 (Emoji) ou URL da foto do personagem"
                    className="flex-1 p-2.5 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/30"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAvatarToLib}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-650 text-white font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-3xs"
                  >
                    <span>Cadastrar</span>
                  </button>
                </div>
                <p className="text-[9px] text-gray-400">Pode ser um emoji simples ou qualquer string de caractere decorativo.</p>
              </div>

              {customAvatars.length > 0 ? (
                <div className="space-y-2">
                  <span className="font-extrabold text-xs text-gray-750 dark:text-zinc-300 block">Avatares Livres Adicionados Atualmente</span>
                  <div className="divide-y divide-gray-100 dark:divide-zinc-900 border dark:border-zinc-900 rounded-2xl overflow-hidden">
                    {customAvatars.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-950 text-xs text-gray-800 dark:text-zinc-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item}</span>
                          <span className="font-mono text-[10px] text-gray-400">Index {idx}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomAvatarFromLib(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                          title="Remover Avatar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-gray-200 dark:border-zinc-805 rounded-3xl text-center space-y-1 bg-white/50">
                  <Sparkles className="mx-auto text-orange-400/80 mb-2" size={24} />
                  <span className="text-xs font-black text-gray-700 dark:text-zinc-350 block">Sem Avatares Adicionais</span>
                  <p className="text-[10px] text-gray-400 max-w-xs mx-auto">Adicione novos personagens acima para que outros usuários da corporação também possam usá-los.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
