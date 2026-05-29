import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ShieldAlert, ArrowRight, Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";

export const LoginView: React.FC = () => {
  const { switchProfile, setIsLoggedIn, users, currentPalette, companyConfig } = useApp();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Preset profiles for super fast switching & testing
  const presets = [
    { name: "Leandra Soares", role: "Diretora Comercial (Admin)", profile: "Admin", avatar: "👩‍💼", desc: "Acesso total" },
    { name: "Leandra Kaisa", role: "Gerente Administrativa", profile: "Administrativo", avatar: "👩‍💻", desc: "Cote, faturamento e contas" },
    { name: "Leandra Vitoria", role: "Coord. de DP", profile: "DP", avatar: "👩‍⚖️", desc: "Escalas, ponto e credenciamento" },
    { name: "Carlos Eduardo Silva", role: "Coord. Operacional", profile: "Operacional", avatar: "👨‍🔧", desc: "Gestão técnica de arena" },
    { name: "Ana Santos", role: "Fotojornalista", profile: "Freelancer", avatar: "📸", desc: "Upload e checklists em campo" },
  ];

  const handlePresetLogin = (profile: any) => {
    setIsLoading(true);
    setTimeout(() => {
      switchProfile(profile);
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 600);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor, digite seu e-mail corporativo.");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      // Find user by email or fallback dynamically
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        switchProfile(matched.profile);
      } else {
        // Log in as standard administrator if not explicitly matched, maintaining user's custom name
        switchProfile("Admin");
      }
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col md:flex-row relative overflow-hidden transition-colors duration-300 font-sans">
      
      {/* Decorative Whimsical Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200/40 dark:bg-orange-950/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-200/30 dark:bg-amber-950/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Brand & Left Info Panel */}
      <div className="flex-1 flex flex-col justify-between p-8 md:p-16 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 dark:from-zinc-900/40 dark:to-zinc-950/90 border-r border-slate-100 dark:border-zinc-900/50">
        
        {/* Header Branding */}
        <div className="flex items-center gap-3">
          <span className="text-3xl font-black text-orange-600 dark:text-orange-500 font-display flex items-center gap-2">
            <span style={{ color: companyConfig.primaryColor }}>{companyConfig.logo}</span>
            <span>{companyConfig.name}</span>
          </span>
          <span className="text-[10px] bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300 px-3 py-1 rounded-full uppercase tracking-widest font-black">
            NATIVE v2.6
          </span>
        </div>

        {/* Content Promo */}
        <div className="my-auto max-w-xl space-y-6 pt-12 md:pt-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-850 shadow-3xs text-[10px] font-bold text-orange-600 dark:text-orange-400 font-mono">
            <Sparkles size={12} />
            <span>EXCLUSIVO PARA DIREÇÃO E EQUIPES TÉCNICAS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-gray-900 dark:text-zinc-50 leading-[1.1]">
            O cockpit operacional do seu <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">megashow</span> está pronto.
          </h1>
          <p className="text-sm text-gray-450 dark:text-zinc-400 leading-relaxed max-w-lg font-light">
            Monitore check-ins de palco, coordene prestadores via checklists interativos de conformidade, retifique pontos do DP corporativo e controle fluxo financeiro sem esforço.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-zinc-900 font-mono">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">Eventos Ativos</span>
              <strong className="text-xl text-gray-800 dark:text-zinc-200 font-black">12</strong>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">Escala DP</span>
              <strong className="text-xl text-gray-800 dark:text-zinc-200 font-black">148+</strong>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">Nível Operação</span>
              <strong className="text-xl text-orange-500 font-black">100%</strong>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="text-[10px] text-gray-400 dark:text-zinc-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Ambiente de monitoramento criptografado (SSL/TLS 1.3)</span>
        </div>
      </div>

      {/* Forms & Login Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-16 bg-white dark:bg-zinc-950">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header instructions */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white font-display">Acesse sua conta</h2>
            <p className="text-xs text-gray-450 dark:text-zinc-400 mt-1">
              Escolha uma credencial rápida para simulação rápida ou faça login estruturado abaixo.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/25 text-red-700 dark:text-red-400 p-3 rounded-2xl text-xs flex items-center gap-2 border border-red-100 dark:border-red-900/30">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. PRESET TESTING CHANNELS */}
          <div className="space-y-3">
            <h3 className="text-[10px] uppercase font-black text-gray-400 font-mono tracking-wider">Acesso Rápido de Teste (1 Clique)</h3>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.profile}
                  onClick={() => handlePresetLogin(preset.profile)}
                  disabled={isLoading}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-orange-50/20 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 border border-slate-100 dark:border-zinc-900/60 hover:border-orange-500/20 rounded-2xl transition-all duration-200 cursor-pointer text-left select-none outline-none group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{preset.avatar}</span>
                    <div>
                      <strong className="text-xs text-slate-800 dark:text-zinc-200 font-extrabold block group-hover:text-orange-600 transition-colors">
                        {preset.name}
                      </strong>
                      <span className="text-[10px] text-gray-400 font-medium block">
                        {preset.role} • <span className="italic text-[9px] text-gray-400">{preset.desc}</span>
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-350 dark:text-zinc-650 group-hover:text-orange-500 transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-2 items-center select-none font-mono">
            <div className="flex-grow border-t border-slate-100 dark:border-zinc-900"></div>
            <span className="flex-shrink mx-4 text-[9px] text-gray-450 dark:text-zinc-500 font-bold uppercase tracking-widest">Ou login com senha</span>
            <div className="flex-grow border-t border-slate-100 dark:border-zinc-900"></div>
          </div>

          {/* 2. SECURE FORM SIMULATION */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-450 dark:text-zinc-500 font-mono">E-mail Corporativo</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="email"
                  disabled={isLoading}
                  placeholder="Ex: leandrasoares@gseventos.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 placeholder-gray-400 dark:placeholder-zinc-650 border border-slate-200/80 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/60 rounded-2xl text-xs focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-950 transition-all font-sans text-slate-900 dark:text-zinc-100 shadow-3xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] uppercase font-bold text-gray-450 dark:text-zinc-500 font-mono">Senha de Operador</label>
                <a href="#reset" onClick={(e) => { e.preventDefault(); alert("Acesso rápido disponível pelos botões superiores!"); }} className="text-[9px] text-orange-600 dark:text-orange-400 hover:underline font-mono font-bold">Esqueceu?</a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 placeholder-gray-400 dark:placeholder-zinc-650 border border-slate-200/80 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/60 rounded-2xl text-xs focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-950 transition-all font-sans text-slate-900 dark:text-zinc-100 shadow-3xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-primary)] text-white hover:opacity-95 font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-3xs select-none relative overflow-hidden"
              style={{ backgroundColor: companyConfig.primaryColor }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processando acesso...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Cockpit Corporativo</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};
