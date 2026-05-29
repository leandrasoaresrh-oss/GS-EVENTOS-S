import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { CompanyConfig } from "../types";
import { Save, Check, Building, ShieldCheck, Palette, HelpCircle, Phone, Globe, Mail, MapPin, Menu, Upload, X } from "lucide-react";
import { AVAILABLE_ICONS, getMenuIcon } from "../components/IconsRegistry";

export const ConfiguracoesView: React.FC = () => {
  const { currentUser, companyConfig, setCompanyConfig, addAuditLog } = useApp();

  // ACCESS CHECK: Only "Admin" profile is allowed
  if (currentUser.profile !== "Admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 bg-white dark:bg-zinc-950 rounded-3xl border border-red-100 dark:border-red-950/35">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4 select-none animate-bounce">
          ⚠️
        </div>
        <h3 className="text-lg font-black text-gray-950 dark:text-zinc-50 uppercase tracking-wide">Acesso Restrito</h3>
        <p className="text-xs text-gray-500 max-w-md mt-2 leading-relaxed">
          Esta área contém informações confidenciais de compliance corporativo e configurações sistêmicas.
          Apenas usuários com perfil de <strong className="text-gray-700 dark:text-zinc-350">Administrador Geral</strong> podem acessar e editar estes parâmetros.
        </p>
      </div>
    );
  }

  // Active form sections
  const [activeTab, setActiveTab] = useState<'dados' | 'visual' | 'institucional' | 'menus'>('dados');
  
  // State variables for form fields
  const [name, setName] = useState(companyConfig.name || "");
  const [razaoSocial, setRazaoSocial] = useState(companyConfig.razaoSocial || "");
  const [nomeFantasia, setNomeFantasia] = useState(companyConfig.nomeFantasia || "");
  const [cnpj, setCnpj] = useState(companyConfig.cnpj || "");
  const [inscricaoEstadual, setInscricaoEstadual] = useState(companyConfig.inscricaoEstadual || "");
  const [phone, setPhone] = useState(companyConfig.phone || "");
  const [whatsapp, setWhatsapp] = useState(companyConfig.whatsapp || "");
  const [email, setEmail] = useState(companyConfig.email || "");
  const [website, setWebsite] = useState(companyConfig.website || "");

  // Address subfields
  const [street, setStreet] = useState(companyConfig.address?.street || "");
  const [number, setNumber] = useState(companyConfig.address?.number || "");
  const [complement, setComplement] = useState(companyConfig.address?.complement || "");
  const [neighborhood, setNeighborhood] = useState(companyConfig.address?.neighborhood || "");
  const [city, setCity] = useState(companyConfig.address?.city || "");
  const [state, setState] = useState(companyConfig.address?.state || "");
  const [zipCode, setZipCode] = useState(companyConfig.address?.zipCode || "");

  // Identity Visual
  const [logo, setLogo] = useState(companyConfig.logo || "");
  const [logoRelatorios, setLogoRelatorios] = useState(companyConfig.logoRelatorios || "");
  const [logoPdf, setLogoPdf] = useState(companyConfig.logoPdf || "");
  const [primaryColor, setPrimaryColor] = useState(companyConfig.primaryColor || "");
  const [secondaryColor, setSecondaryColor] = useState(companyConfig.secondaryColor || "");
  const [highlightColor, setHighlightColor] = useState(companyConfig.highlightColor || "");

  // Institutional Info
  const [sobreEmpresa, setSobreEmpresa] = useState(companyConfig.sobreEmpresa || "");
  const [missao, setMissao] = useState(companyConfig.missao || "");
  const [observacoesInternas, setObservacoesInternas] = useState(companyConfig.observacoesInternas || "");
  const [rodapeInstitucional, setRodapeInstitucional] = useState(companyConfig.rodapeInstitucional || "");

  // Custom tab/menu renaming labels
  const [menuLabels, setMenuLabels] = useState<Record<string, string>>(() => {
    return companyConfig.menuLabels || {};
  });

  // Custom tab/menu icons
  const [menuIcons, setMenuIcons] = useState<Record<string, string>>(() => {
    return companyConfig.menuIcons || {};
  });

  const [activePickerTabKey, setActivePickerTabKey] = useState<string | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if companyConfig changes in context
  useEffect(() => {
    setName(companyConfig.name || "");
    setRazaoSocial(companyConfig.razaoSocial || "");
    setNomeFantasia(companyConfig.nomeFantasia || "");
    setCnpj(companyConfig.cnpj || "");
    setInscricaoEstadual(companyConfig.inscricaoEstadual || "");
    setPhone(companyConfig.phone || "");
    setWhatsapp(companyConfig.whatsapp || "");
    setEmail(companyConfig.email || "");
    setWebsite(companyConfig.website || "");
    
    setStreet(companyConfig.address?.street || "");
    setNumber(companyConfig.address?.number || "");
    setComplement(companyConfig.address?.complement || "");
    setNeighborhood(companyConfig.address?.neighborhood || "");
    setCity(companyConfig.address?.city || "");
    setState(companyConfig.address?.state || "");
    setZipCode(companyConfig.address?.zipCode || "");

    setLogo(companyConfig.logo || "");
    setLogoRelatorios(companyConfig.logoRelatorios || "");
    setLogoPdf(companyConfig.logoPdf || "");
    setPrimaryColor(companyConfig.primaryColor || "");
    setSecondaryColor(companyConfig.secondaryColor || "");
    setHighlightColor(companyConfig.highlightColor || "");

    setSobreEmpresa(companyConfig.sobreEmpresa || "");
    setMissao(companyConfig.missao || "");
    setObservacoesInternas(companyConfig.observacoesInternas || "");
    setRodapeInstitucional(companyConfig.rodapeInstitucional || "");

    setMenuLabels(companyConfig.menuLabels || {});
    setMenuIcons(companyConfig.menuIcons || {});
  }, [companyConfig]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'relatorios' | 'pdf') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (target === 'logo') setLogo(base64String);
        else if (target === 'relatorios') setLogoRelatorios(base64String);
        else if (target === 'pdf') setLogoPdf(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedConfig: CompanyConfig = {
      name,
      logo,
      logoRelatorios,
      logoPdf,
      favicon: logo || "⚡",
      primaryColor,
      secondaryColor,
      buttonColor: primaryColor,
      menuColor: "#1F2937",
      highlightColor,
      description: sobreEmpresa || "Especialistas em eventos",
      phone,
      email,
      razaoSocial,
      nomeFantasia,
      cnpj,
      inscricaoEstadual,
      whatsapp,
      website,
      sobreEmpresa,
      missao,
      observacoesInternas,
      rodapeInstitucional,
      menuLabels,
      menuIcons,
      address: {
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode
      }
    };

    setCompanyConfig(updatedConfig);
    addAuditLog("Configurações: Alterou dados institucionais e identidade visual da empresa única", name);

    // Apply color registers dynamically to document root style
    const r = document.documentElement;
    r.style.setProperty("--color-primary", primaryColor);
    
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "232, 93, 4";
    };

    r.style.setProperty("--color-primary-rgb", hexToRgb(primaryColor));
    r.style.setProperty("--color-secondary", secondaryColor);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">COSMIC INSTALATION • Configurações Corporativas</h2>
          <p className="text-xs text-gray-500 font-sans">
            Personalize as informações de compliance, dados cadastrais oficiais e identidade visual aplicadas em todo o sistema.
          </p>
        </div>

        <button 
          onClick={handleSaveConfigs}
          className="bg-orange-600 text-white hover:bg-orange-700 font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shrink-0 self-start sm:self-auto cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <Check size={14} className="animate-ping" />
              <span>Configurações Salvas!</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>Salvar Alterações</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-400 rounded-2xl flex items-center gap-2.5 text-xs font-bold font-sans">
          <Check size={16} />
          <span>Configurações aplicadas com sucesso! Toda a corporação, relatórios, PDFs e menu lateral refletem a alteração agora mesmo.</span>
        </div>
      )}

      {/* CORE CONFIG CONTAINER GRID */}
      <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-gray-100 dark:border-zinc-900 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[500px]">
        
        {/* VIEW NAVIGATION TABS SIDEBAR (3 cols) */}
        <div className="lg:col-span-3 border-r border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/10 p-4 space-y-1.5 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible">
          <button
            onClick={() => setActiveTab('dados')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2.5 transition-all shrink-0 select-none ${
              activeTab === 'dados' 
                ? "bg-orange-500/10 text-orange-700 dark:text-orange-400" 
                : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100/50 dark:hover:bg-zinc-900/40"
            }`}
          >
            <Building size={16} />
            <span>Dados da Empresa</span>
          </button>

          <button
            onClick={() => setActiveTab('visual')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2.5 transition-all shrink-0 select-none ${
              activeTab === 'visual' 
                ? "bg-orange-500/10 text-orange-700 dark:text-orange-400" 
                : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100/50 dark:hover:bg-zinc-900/40"
            }`}
          >
            <Palette size={16} />
            <span>Identidade Visual</span>
          </button>

          <button
            onClick={() => setActiveTab('institucional')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2.5 transition-all shrink-0 select-none ${
              activeTab === 'institucional' 
                ? "bg-orange-500/10 text-orange-700 dark:text-orange-400" 
                : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100/50 dark:hover:bg-zinc-900/40"
            }`}
          >
            <ShieldCheck size={16} />
            <span>Informações Institucionais</span>
          </button>

          <button
            onClick={() => setActiveTab('menus')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2.5 transition-all shrink-0 select-none ${
              activeTab === 'menus' 
                ? "bg-orange-500/10 text-orange-700 dark:text-orange-400" 
                : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100/50 dark:hover:bg-zinc-900/40"
            }`}
          >
            <Menu size={16} />
            <span>Renomear Abas & Menu</span>
          </button>
        </div>

        {/* CORE FORM CONTENTS (9 cols) */}
        <form onSubmit={handleSaveConfigs} className="lg:col-span-9 p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: DADOS CADASTRAS COMPILANCE */}
          {activeTab === 'dados' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b dark:border-zinc-900 pb-3">
                <h3 className="text-sm font-black text-gray-950 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                  <Building size={16} className="text-orange-500" />
                  <span>Dados Cadastrais Oficiais</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">Insira os dados de registro comercial, CNPJ e canais de atendimento oficiais.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">Nome da Empresa (Visual)*</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Ex: GS Eventos & Produções" 
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">Razão Social</label>
                  <input 
                    type="text" 
                    value={razaoSocial} 
                    onChange={(e) => setRazaoSocial(e.target.value)} 
                    placeholder="Ex: GS Eventos e Produções Ltda" 
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">Nome Fantasia</label>
                  <input 
                    type="text" 
                    value={nomeFantasia} 
                    onChange={(e) => setNomeFantasia(e.target.value)} 
                    placeholder="Ex: GS Eventos" 
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">CNPJ</label>
                  <input 
                    type="text" 
                    value={cnpj} 
                    onChange={(e) => setCnpj(e.target.value)} 
                    placeholder="00.000.000/0000-00" 
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">Inscrição Estadual</label>
                  <input 
                    type="text" 
                    value={inscricaoEstadual} 
                    onChange={(e) => setInscricaoEstadual(e.target.value)} 
                    placeholder="Ex: 111.222.333.444" 
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">Site (Website)</label>
                  <input 
                    type="text" 
                    value={website} 
                    onChange={(e) => setWebsite(e.target.value)} 
                    placeholder="www.gseventos.com.br" 
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">Telefone de Contato</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="(11) 98765-4321" 
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">WhatsApp Corporativo</label>
                  <input 
                    type="text" 
                    value={whatsapp} 
                    onChange={(e) => setWhatsapp(e.target.value)} 
                    placeholder="(11) 98765-4321" 
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">E-mail Comercial Oficial</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="contato@gseventos.com.br" 
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" 
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-zinc-900 pt-5 space-y-4">
                <span className="block text-xs font-black text-gray-950 dark:text-zinc-50 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                  <MapPin size={14} className="text-orange-500" /> Endereço Físico Institucional
                </span>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Logradouro / Rua</label>
                    <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Av. Paulista" className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Número</label>
                    <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="1000" className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Complemento</label>
                    <input type="text" value={complement} onChange={(e) => setComplement(e.target.value)} placeholder="Salas 104 e 105" className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Bairro</label>
                    <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Bela Vista" className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Cidade</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="São Paulo" className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">Estado (UF)</label>
                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="SP" className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5">CEP</label>
                    <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="01310-100" className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IDENTIDADE VISUAL E CORES */}
          {activeTab === 'visual' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b dark:border-zinc-900 pb-3">
                <h3 className="text-sm font-black text-gray-950 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                  <Palette size={16} className="text-orange-500" />
                  <span>Configurações Estéticas & Identidade Visual</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">
                  Gerencie logos institucionais e códigos de cores em formato hexadecimal para estilização em tempo real das abas e emissões.
                </p>
              </div>

              {/* LOGOS UPLOAD PORTLET */}
              <div className="bg-gray-50/50 dark:bg-zinc-900/30 rounded-2xl p-4 border border-gray-150/50 dark:border-zinc-800 space-y-4">
                <h4 className="text-[10px] uppercase font-extrabold text-gray-400 font-mono tracking-wider">Módulos de Logotipo (Suporte a Texto, Emojis ou Upload de Imagens PNG/JPG)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-650 dark:text-zinc-300 mb-1">Logo Principal (Menu Lateral / Topo)</label>
                    <input 
                      type="text" 
                      value={logo} 
                      onChange={(e) => setLogo(e.target.value)} 
                      placeholder="Ex: ⚡ ou URL da imagem" 
                      className="w-full p-2.5 bg-white dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl text-xs focus:outline-none" 
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <label className="cursor-pointer bg-white hover:bg-gray-50 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-[10px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 select-none transition-all border border-gray-200 dark:border-zinc-805">
                        <Upload size={12} className="text-gray-500" />
                        <span>Carregar PNG/JPG</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleLogoUpload(e, 'logo')} 
                          className="hidden" 
                        />
                      </label>
                      {logo && (logo.startsWith("data:") || logo.startsWith("http")) && (
                        <img src={logo} className="h-6 w-auto object-contain rounded border border-gray-100 dark:border-zinc-800" alt="Preview" />
                      )}
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1">Caractere principal, emoji ou imagem de destaque no menu lateral.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-650 dark:text-zinc-300 mb-1">Logo para Relatórios</label>
                    <input 
                      type="text" 
                      value={logoRelatorios} 
                      onChange={(e) => setLogoRelatorios(e.target.value)} 
                      placeholder="Ex: ⚡ GS Eventos" 
                      className="w-full p-2.5 bg-white dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl text-xs focus:outline-none" 
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <label className="cursor-pointer bg-white hover:bg-gray-50 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-[10px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 select-none transition-all border border-gray-200 dark:border-zinc-805">
                        <Upload size={12} className="text-gray-500" />
                        <span>Carregar PNG/JPG</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleLogoUpload(e, 'relatorios')} 
                          className="hidden" 
                        />
                      </label>
                      {logoRelatorios && (logoRelatorios.startsWith("data:") || logoRelatorios.startsWith("http")) && (
                        <img src={logoRelatorios} className="h-6 w-auto object-contain rounded border border-gray-100 dark:border-zinc-800" alt="Preview" />
                      )}
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1">Marca d'água de compliance nas vistorias e planilhas.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-650 dark:text-zinc-300 mb-1">Logo para PDFs / Exportações</label>
                    <input 
                      type="text" 
                      value={logoPdf} 
                      onChange={(e) => setLogoPdf(e.target.value)} 
                      placeholder="Ex: ⚡ GS Eventos Premium" 
                      className="w-full p-2.5 bg-white dark:bg-zinc-900 border dark:border-zinc-850 rounded-xl text-xs focus:outline-none" 
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <label className="cursor-pointer bg-white hover:bg-gray-50 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-[10px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 select-none transition-all border border-gray-200 dark:border-zinc-805">
                        <Upload size={12} className="text-gray-500" />
                        <span>Carregar PNG/JPG</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleLogoUpload(e, 'pdf')} 
                          className="hidden" 
                        />
                      </label>
                      {logoPdf && (logoPdf.startsWith("data:") || logoPdf.startsWith("http")) && (
                        <img src={logoPdf} className="h-6 w-auto object-contain rounded border border-gray-100 dark:border-zinc-800" alt="Preview" />
                      )}
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1">Utilizada nos cabeçalhos de propostas e cronogramas.</p>
                  </div>
                </div>
              </div>

              {/* PALETTE COLOR INPUTS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
                
                <div className="bg-white dark:bg-zinc-950 p-4 border rounded-2xl border-gray-150/50 dark:border-zinc-850 transition-all hover:shadow-2xs">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] uppercase font-black text-gray-400 font-mono">Cor Primária *</label>
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: primaryColor }} />
                  </div>
                  <div className="flex gap-1.5">
                    <input 
                      type="color" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)} 
                      className="w-8 h-8 rounded shrink-0 cursor-pointer border-0 p-0" 
                    />
                    <input 
                      type="text" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)} 
                      placeholder="#E85D04" 
                      className="w-full px-2 py-1 bg-gray-50 dark:bg-zinc-900 border rounded-lg focus:outline-none text-xs font-mono font-bold" 
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 mt-2">Dita o tema principal dos botões, barras e links de destaque ativo.</p>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-4 border rounded-2xl border-gray-150/50 dark:border-zinc-850 transition-all hover:shadow-2xs">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] uppercase font-black text-gray-400 font-mono">Cor Secundária *</label>
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: secondaryColor }} />
                  </div>
                  <div className="flex gap-1.5">
                    <input 
                      type="color" 
                      value={secondaryColor} 
                      onChange={(e) => setSecondaryColor(e.target.value)} 
                      className="w-8 h-8 rounded shrink-0 cursor-pointer border-0 p-0" 
                    />
                    <input 
                      type="text" 
                      value={secondaryColor} 
                      onChange={(e) => setSecondaryColor(e.target.value)} 
                      placeholder="#FEF3C7" 
                      className="w-full px-2 py-1 bg-gray-50 dark:bg-zinc-900 border rounded-lg focus:outline-none text-xs font-mono font-bold" 
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 mt-2">Cor suave de fundo e cápsulas de badges de informação operacional.</p>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-4 border rounded-2xl border-gray-150/50 dark:border-zinc-850 transition-all hover:shadow-2xs">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] uppercase font-black text-gray-400 font-mono">Cor de Destaque *</label>
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: highlightColor }} />
                  </div>
                  <div className="flex gap-1.5">
                    <input 
                      type="color" 
                      value={highlightColor} 
                      onChange={(e) => setHighlightColor(e.target.value)} 
                      className="w-8 h-8 rounded shrink-0 cursor-pointer border-0 p-0" 
                    />
                    <input 
                      type="text" 
                      value={highlightColor} 
                      onChange={(e) => setHighlightColor(e.target.value)} 
                      placeholder="#92400E" 
                      className="w-full px-2 py-1 bg-gray-50 dark:bg-zinc-900 border rounded-lg focus:outline-none text-xs font-mono font-bold" 
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 mt-2">Utilizada para realce de bordas, alertas específicos ou indicadores.</p>
                </div>

              </div>

              {/* DEMO CARD PREVIEW */}
              <div className="border border-dashed dark:border-zinc-800 rounded-3xl p-6 space-y-3.5 select-none">
                <span className="text-[10px] font-mono font-black uppercase text-gray-400 block tracking-wider leading-none">Pré-Visualização em Tempo Real do Tema</span>
                
                <div className="flex items-center gap-4">
                  <button 
                    type="button" 
                    className="px-4 py-2 font-bold rounded-xl text-xs text-white shadow-xs" 
                    style={{ backgroundColor: primaryColor }}
                  >
                    Botão Customizado
                  </button>

                  <div className="px-3 py-1.5 rounded-full text-xs font-black border flex items-center gap-1" style={{ backgroundColor: secondaryColor + "40", borderColor: primaryColor + "30", color: primaryColor }}>
                    <span>⚡ Badge Corporativa</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: INFORMACOES INSTITUCIONAIS */}
          {activeTab === 'institucional' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b dark:border-zinc-900 pb-3">
                <h3 className="text-sm font-black text-gray-950 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                  <ShieldCheck size={16} className="text-orange-500" />
                  <span>Informações Institucionais & Compliance</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">Dite premissas corporativas utilizadas nos rodapés, propostas e manuais do sistema.</p>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">Sobre a Empresa (Descrição Geral)</label>
                  <textarea 
                    rows={3} 
                    value={sobreEmpresa} 
                    onChange={(e) => setSobreEmpresa(e.target.value)} 
                    placeholder="Contate-nos para mais dados institucionas..." 
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none text-xs leading-relaxed" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">Missão Corporativa</label>
                  <textarea 
                    rows={2} 
                    value={missao} 
                    onChange={(e) => setMissao(e.target.value)} 
                    placeholder="Compromisso operacional..." 
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none text-xs leading-relaxed" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">Observações Internas (Somente Visível para Admin / DP)</label>
                  <textarea 
                    rows={2} 
                    value={observacoesInternas} 
                    onChange={(e) => setObservacoesInternas(e.target.value)} 
                    placeholder="Notas internas restritas ao corpo diretivo..." 
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none text-xs leading-relaxed" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">Rodapé Institucional Padrão (Utilizado nos Relatórios emitidos)</label>
                  <input 
                    type="text" 
                    value={rodapeInstitucional} 
                    onChange={(e) => setRodapeInstitucional(e.target.value)} 
                    placeholder="GS Eventos Ltda - CNPJ: 12.345.678/0001-90" 
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-900/30 border dark:border-zinc-800 rounded-xl focus:outline-none text-xs" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RENOMEAR ABAS E MENU */}
          {activeTab === 'menus' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b dark:border-zinc-900 pb-3">
                <h3 className="text-sm font-black text-gray-950 dark:text-zinc-50 tracking-tight flex items-center gap-2">
                  <Menu size={16} className="text-orange-500" />
                  <span>Personalização & Renomeação de Abas do Menu</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">
                  Renomeie as funções, abas e escolha ícones personalizados para o menu lateral e inferior de acordo com as preferências da sua corporação.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                {[
                  { key: "dashboard", defaultLabel: "Dashboard" },
                  { key: "briefing", defaultLabel: "Briefing do Dia" },
                  { key: "alertas", defaultLabel: "Saúde Operacional" },
                  { key: "eventos", defaultLabel: "Eventos" },
                  { key: "fornecedores", defaultLabel: "Fornecedores" },
                  { key: "ponto", defaultLabel: "Ponto Eletrônico" },
                  { key: "vencimentos", defaultLabel: "Vencimentos" },
                  { key: "tarefas", defaultLabel: "Quadro Kanban" },
                  { key: "colaboradores", defaultLabel: "Fichas & Equipes" },
                  { key: "formularios", defaultLabel: "Construtor de Formulários" },
                  { key: "bem_estar", defaultLabel: "Cultura & Bem-Estar" },
                  { key: "orcamentos", defaultLabel: "Orçamentos" },
                  { key: "credenciais", defaultLabel: "Credenciais Visuais" },
                  { key: "reunioes", defaultLabel: "Pautas & Atas" },
                  { key: "propostas", defaultLabel: "Gerador de Propostas" },
                  { key: "mapa", defaultLabel: "Mapa de Eventos" },
                  { key: "notas", defaultLabel: "Bloco de Notas" },
                  { key: "logs", defaultLabel: "Logs de Auditoria" }
                ].map((v) => {
                  const CurrentIcon = getMenuIcon(v.key, menuIcons[v.key]);

                  return (
                    <div key={v.key} className="p-3.5 bg-gray-50 dark:bg-zinc-900/30 border border-gray-150 dark:border-zinc-850 rounded-2xl flex flex-col gap-3 relative">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="block text-[9px] font-mono text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">PADRÃO: {v.defaultLabel}</span>
                          <span className="font-bold text-gray-700 dark:text-zinc-200 truncate block">Personalizar Nome & Ícone</span>
                        </div>

                        {/* Icon Selection Button */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActivePickerTabKey(activePickerTabKey === v.key ? null : v.key)}
                            className="w-9 h-9 bg-white dark:bg-zinc-900 hover:bg-orange-50 dark:hover:bg-orange-950/20 border border-slate-200 dark:border-zinc-800 hover:border-orange-500/30 rounded-xl flex items-center justify-center text-gray-700 dark:text-zinc-200 transition-all shadow-3xs cursor-pointer group shrink-0"
                            title="Escolher Ícone"
                          >
                            <CurrentIcon size={16} className="text-orange-500 group-hover:scale-110 transition-transform" />
                          </button>

                          {/* Dropdown Floating Popover */}
                          {activePickerTabKey === v.key && (
                            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 p-3 animate-fadeIn">
                              <div className="flex items-center justify-between border-b dark:border-zinc-900 pb-2 mb-2">
                                <span className="text-[10px] font-black uppercase text-gray-500 dark:text-zinc-400 font-mono">Escolha um Ícone</span>
                                <button
                                  type="button"
                                  onClick={() => setActivePickerTabKey(null)}
                                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 cursor-pointer"
                                >
                                  <X size={12} className="stroke-[2.5]" />
                                </button>
                              </div>
                              <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto p-1 scrollbar-none">
                                {Object.entries(AVAILABLE_ICONS).map(([iconName, iconData]) => {
                                  const OptionIcon = iconData.icon;
                                  const isSelected = menuIcons[v.key] === iconName;
                                  return (
                                    <button
                                      key={iconName}
                                      type="button"
                                      onClick={() => {
                                        setMenuIcons({ ...menuIcons, [v.key]: iconName });
                                        setActivePickerTabKey(null);
                                      }}
                                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all scale-100 active:scale-95 cursor-pointer ${
                                        isSelected
                                          ? "bg-orange-500 text-white shadow-xs"
                                          : "bg-slate-50 hover:bg-orange-50 dark:bg-zinc-900 dark:hover:bg-orange-950/30 text-gray-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400"
                                      }`}
                                      title={iconData.label}
                                    >
                                      <OptionIcon size={14} />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Input value & Clear filter option */}
                      <div className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={menuLabels[v.key] ?? ""} 
                          onChange={(e) => setMenuLabels({ ...menuLabels, [v.key]: e.target.value })} 
                          placeholder={v.defaultLabel} 
                          className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/20 focus:border-orange-500 shadow-3xs" 
                        />
                        {(menuLabels[v.key] || menuIcons[v.key]) && (
                          <button
                            type="button"
                            onClick={() => {
                              const updatedLabels = { ...menuLabels };
                              delete updatedLabels[v.key];
                              setMenuLabels(updatedLabels);

                              const updatedIcons = { ...menuIcons };
                              delete updatedIcons[v.key];
                              setMenuIcons(updatedIcons);
                            }}
                            className="px-2.5 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-[10px] text-red-500 hover:text-red-600 border border-transparent hover:border-red-500/10 rounded-xl cursor-pointer font-bold shrink-0 font-mono uppercase"
                            title="Restaurar padrão desta aba"
                          >
                            Limpar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-start gap-2.5 text-[11px] text-amber-700 dark:text-amber-400">
                <HelpCircle size={16} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Nota sobre Persistência:</strong> Ao alterar as abas acima, clique no botão "Salvar Alterações" no topo direito para registrar e propagar as novas nomenclaturas em todo o sistema.
                </span>
              </div>
            </div>
          )}

        </form>

      </div>

    </div>
  );
};
