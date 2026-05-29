import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ShieldAlert, ArrowRight, Mail, Lock, Eye, EyeOff, UserCheck, HelpCircle } from "lucide-react";

export const LoginView: React.FC = () => {
  const { setIsLoggedIn, users, companyConfig, setCurrentUser, updateUser } = useApp();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password Redefinition State
  const [isRedefining, setIsRedefining] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor, digite seu e-mail corporativo.");
      return;
    }
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      // Find user by email (strict validation, no auto-register in login)
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!matched) {
        setError("Erro de autenticação: E-mail não cadastrado pelo DP.");
        setIsLoading(false);
        return;
      }

      // Check if password match
      const expectedPassword = matched.password || "123456";
      if (password !== expectedPassword) {
        setError("Erro de autenticação: E-mail ou senha de operador inválidos.");
        setIsLoading(false);
        return;
      }

      // Check first access status
      if (matched.isFirstAccess) {
        setUserToUpdate(matched);
        setIsRedefining(true);
        setIsLoading(false);
        setError("");
        return;
      }

      // Successful standard login
      setCurrentUser(matched);
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 800);
  };

  const handleRedefinePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setError("A nova senha definitiva deve ter pelo menos 4 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As senhas digitadas não coincidem. Verifique a digitação.");
      return;
    }
    if (newPassword === "123456") {
      setError("Por motivos de segurança, escolha uma senha diferente da senha temporária padrão.");
      return;
    }

    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (userToUpdate) {
        // Redefining the user password dynamically in AppContext (which persists automatically to localStorage)
        updateUser(userToUpdate.id, {
          password: newPassword,
          isFirstAccess: false
        });

        setSuccessMsg("Senha redefinida com sucesso! Redirecionando...");
        
        setTimeout(() => {
          const updatedUser = {
            ...userToUpdate,
            password: newPassword,
            isFirstAccess: false
          };
          setCurrentUser(updatedUser);
          setIsLoggedIn(true);
          setIsLoading(false);
        }, 1200);
      } else {
        setIsLoading(false);
      }
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
            <span style={{ color: companyConfig.primaryColor }} className="shrink-0">{companyConfig.logo}</span>
            <span>{companyConfig.name}</span>
          </span>
          <span className="text-[10px] bg-orange-100 text-orange-850 dark:bg-orange-950/40 dark:text-orange-300 px-3 py-1 rounded-full uppercase tracking-widest font-black">
            NATIVE v2.6
          </span>
        </div>

        {/* Content Promo */}
        <div className="my-auto max-w-xl space-y-6 pt-12 md:pt-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-850 shadow-3xs text-[10px] font-bold text-orange-605 dark:text-orange-400 font-mono" style={{ color: companyConfig.primaryColor }}>
            <span className="text-orange-500">✦</span>
            <span>EXCLUSIVO PARA DIREÇÃO E EQUIPES TÉCNICAS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-gray-900 dark:text-zinc-50 leading-[1.1]">
            O cockpit operacional de <span style={{ color: companyConfig.primaryColor }} className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">{companyConfig.nomeFantasia || companyConfig.name}</span> está pronto.
          </h1>
          <p className="text-sm text-gray-450 dark:text-zinc-400 leading-relaxed max-w-lg font-light">
            {companyConfig.description || "Monitore check-ins, coordene prestadores através de checklists interativos de conformidade, gerencie pontos do DP e controle o fluxo financeiro de forma eficiente."}
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
              <strong className="text-xl text-orange-500 font-black" style={{ color: companyConfig.primaryColor || '#E85D04' }}>100%</strong>
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
          
          {!isRedefining ? (
            <>
              {/* Header instructions */}
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white font-display">Acesse sua conta</h2>
                <p className="text-xs text-gray-450 dark:text-zinc-400 mt-1">
                  Insira suas credenciais corporativas registradas para acessar o painel administrativo.
                </p>
              </div>

              {/* Guidelines Notice Card */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 text-xs space-y-2.5">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                  <span>ℹ️ INSTRUÇÕES DE PRIMEIRO ACESSO</span>
                </div>
                <div className="space-y-2 text-gray-600 dark:text-zinc-400 text-[11px] leading-normal font-sans">
                  <p>
                    Se este é o seu primeiro acesso à plataforma GS Eventos, certifique-se de que seus dados já foram cadastrados pelo setor de Departamento Pessoal (DP).
                  </p>
                  <p className="font-semibold pt-1">
                    1. Utilize o e-mail corporativo informado ao DP.<br />
                    2. Insira a senha temporária que você recebeu.<br />
                    3. Após clicar em entrar, o sistema solicitará obrigatoriamente a redefinição de senha para criar sua credencial definitiva e segura.
                  </p>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950/25 text-red-700 dark:text-red-400 p-3 rounded-2xl text-xs flex items-center gap-2 border border-red-100 dark:border-red-900/30">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* SECURE FORM LOGIN */}
              <form onSubmit={handleFormLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-gray-450 dark:text-zinc-500 font-mono">E-mail Corporativo</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      required
                      disabled={isLoading}
                      placeholder="Ex: seu.nome@empresa.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 placeholder-gray-400 dark:placeholder-zinc-650 border border-slate-200/80 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/60 rounded-2xl text-xs focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-950 transition-all font-sans text-slate-900 dark:text-zinc-100 shadow-3xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] uppercase font-bold text-gray-450 dark:text-zinc-500 font-mono">Senha de Operador</label>
                    <button 
                      type="button" 
                      onClick={() => setError("Por favor, utilize a senha temporária de primeiro acesso (123456) caso ainda não tenha a alterado.")} 
                      className="text-[9px] text-orange-600 dark:text-orange-400 hover:underline font-mono font-bold"
                      style={{ color: companyConfig.primaryColor }}
                    >
                      Dúvidas de senha?
                    </button>
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
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-650"
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
                      <span>Verificando credenciais...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar no Cockpit Corporativo</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* HEADER FOR PASSWORD REDEFINITION */}
              <div>
                <span className="text-[10px] bg-amber-105 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 px-3 py-1 rounded-full uppercase tracking-widest font-black inline-block mb-2">
                  🔒 Registro de Primeiro Acesso
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white font-display">Defina sua nova senha</h2>
                <p className="text-xs text-gray-450 dark:text-zinc-400 mt-1">
                  Por segurança das operações de <span className="font-bold">{userToUpdate?.name}</span>, substitua sua senha provisória por uma credencial definitiva e confiável.
                </p>
              </div>

              {/* Guidelines Redefinition Notice */}
              <div className="p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-950/10 border border-orange-200/50 dark:border-orange-900/30 text-xs">
                <p className="text-[11px] leading-relaxed text-orange-850 dark:text-orange-300">
                  ⚠️ <strong>Atenção:</strong> Escolha uma senha forte que você lembrará facilmente. O sistema solicitará esta nova senha em todos os acessos futuros a partir de agora. Do contrário, o DP terá de redefinir seu cadastro.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950/25 text-red-700 dark:text-red-400 p-3 rounded-2xl text-xs flex items-center gap-2 border border-red-100 dark:border-red-900/30">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Banner */}
              {successMsg && (
                <div className="bg-emerald-50 dark:bg-emerald-950/25 text-emerald-700 dark:text-emerald-400 p-3 rounded-2xl text-xs flex items-center gap-2 border border-emerald-100 dark:border-emerald-900/30">
                  <span className="shrink-0 font-bold">✓</span>
                  <span>{successMsg}</span>
                </div>
              )}

              {/* PASSWORD REDEFINITION FORM */}
              <form onSubmit={handleRedefinePassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-gray-450 dark:text-zinc-500 font-mono">Nova Senha Definitiva</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      placeholder="Mínimo de 4 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 placeholder-gray-400 dark:placeholder-zinc-650 border border-slate-200/80 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/60 rounded-2xl text-xs focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-950 transition-all font-sans text-slate-900 dark:text-zinc-100 shadow-3xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-gray-450 dark:text-zinc-500 font-mono">Confirmar Nova Senha</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      placeholder="Repita sua nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 placeholder-gray-400 dark:placeholder-zinc-650 border border-slate-200/80 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/60 rounded-2xl text-xs focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-950 transition-all font-sans text-slate-900 dark:text-zinc-100 shadow-3xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                      <span>Salvando nova senha...</span>
                    </>
                  ) : (
                    <>
                      <span>Redefinir Senha & Entrar</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRedefining(false);
                    setUserToUpdate(null);
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  className="w-full text-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 text-[10px] font-mono mt-2"
                >
                  ← Voltar para login normal
                </button>
              </form>
            </>
          )}

        </div>
      </div>

    </div>
  );
};
