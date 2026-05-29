import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { FileText, ClipboardList, PenTool, CheckCircle, Clock, Trash2, ShieldAlert, Award, FileSearch, Send, Plus, Calendar, UserCheck } from "lucide-react";

interface EventReportsProps {
  eventId: string;
}

// Structures to store report models inside localStorage
export interface TechnicalVisitReport {
  id: string;
  eventId: string;
  employeeName: string;
  cep: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  // Terrain
  terrainType: string;
  isTerrainLevel: string; // Plano, Irregular
  riskOfMud: boolean;
  terrainObs: string;
  // Chem toilets
  chemToiletsSpace: boolean;
  chemToiletsFloorSuitable: boolean;
  chemToiletsMaintenanceAccess: boolean;
  chemToiletsObs: string;
  // Water
  hasWater: boolean;
  waterDistance: string;
  waterPressure: string; // Boa, Media, Fraca
  waterAccessType: string; // Torneira, Registro
  waterObs: string;
  // Energy
  isPoleNearby: boolean;
  poleDistance: string;
  hasPowerPoint: boolean;
  powerPointsQty: string;
  voltage: string; // 110V, 220V, Trifasico
  isPanelAccessible: boolean;
  isTempConnectionPossible: boolean;
  cablePathing: string; // Livre, Dificil
  powerPointNearStage: boolean;
  energyObs: string;
  // Structure
  stageAreaM2: string;
  hasDressingRoomSpace: boolean;
  hasProductionSpace: boolean;
  visualInterference: string;
  hasProtectionGridSpace: boolean;
  supportsHeavyStructure: boolean;
  stageDimensions: string;
  isResidentialNearby: boolean;
  soundRestrictions: boolean;
  fixingPoints: boolean;
  truckAccess: boolean;
  hasLoadingDock: boolean;
  timeRestrictions: boolean;
  structureObs: string;
  // Climate
  sunExposure: string; // Alto, Medio, Baixo
  windStrength: string; // Forte, Medio, Fraco
  floodRisk: boolean;
  sunHitsStage: boolean;
  ecoRestrictions: boolean;
  weatherRisk: boolean;
  climateObs: string;
  // Security
  definedRoutes: boolean;
  emergencySpace: boolean;
  hasAlvaral: boolean;
  pcdAccess: boolean;
  accessControl: boolean;
  safeLadders: boolean;
  apparentRisks: boolean;
  securityObs: string;
  // Final Result
  riskAdjustments: string;
  generalComments: string;
  isAppropriate: string; // Sim, Nao
}

export interface PreEventReport {
  id: string;
  eventId: string;
  professionalName: string;
  professionalRole: string;
  date: string;
  plannedActivitiesExecuted: string; // Sim, Nao, Outro
  activitiesDoneToday: string;
  anyProblemsToday: string; // Sim, Nao
  problemDescription: string;
  problemInvolvedSupplier: string; // Sim, Nao
  involvedSupplierName: string;
  actionTaken: string;
  pendingIssues: string;
  isPendingIssueCritical: string; // Sim, Nao
  criticalPendingDetail: string;
  riskIfUnresolved: string;
  preparationRating: string; // Dentro do planejado, Com pequenos ajustes, Em atencao, Critico
  isReadyForExecution: string; // Sim, Parcialmente, Nao
  additionalNotes: string;
}

export interface PostEventReport {
  id: string;
  eventId: string;
  professionalName: string;
  professionalRole: string;
  date: string;
  improvementArea: string; // Qual função, fornecedor ou estrutura precisa melhorar
  improvementWhy: string;
  hadChallenges: string; // Sim, Nao
  challengeDescription: string;
  challengeArea: string; // Ex: credenciamento
  challengeInvolvedSupplier: string; // Sim, Nao
  involvedSuppliersList: string;
  involvedProfessionals: string;
  solutionsFound: string;
  solutionsEffective: string; // Sim, Nao, Outro
  whatCouldBeDifferent: string;
  positivePoints: string;
  ratingOrganization: string; // Excelente, Bom, Regular, Ruim
  ratingCommunication: string;
  ratingSuppliers: string;
  ratingOverall: string;
  notesAdditional: string;
}

export const EventReports: React.FC<EventReportsProps> = ({ eventId }) => {
  const { employees, events, updateEvent, addAuditLog } = useApp();
  const currentEvent = events.find(e => e.id === eventId);

  // Loaded historic lists
  const [preReports, setPreReports] = useState<PreEventReport[]>(() => {
    const saved = localStorage.getItem(`gs_report_pre_${eventId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [postReports, setPostReports] = useState<PostEventReport[]>(() => {
    const saved = localStorage.getItem(`gs_report_pos_${eventId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [techVisits, setTechVisits] = useState<TechnicalVisitReport[]>(() => {
    const saved = localStorage.getItem(`gs_report_tech_${eventId}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Current selected template in creation flow
  const [activeFormType, setActiveFormType] = useState<'pre' | 'pos' | 'tech' | null>(null);
  const [assignedStaff, setAssignedStaff] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const pre = localStorage.getItem(`gs_report_pre_${eventId}`);
    setPreReports(pre ? JSON.parse(pre) : []);

    const pos = localStorage.getItem(`gs_report_pos_${eventId}`);
    setPostReports(pos ? JSON.parse(pos) : []);

    const tech = localStorage.getItem(`gs_report_tech_${eventId}`);
    setTechVisits(tech ? JSON.parse(tech) : []);
    
    setActiveFormType(null);
    setSelectedReviewId(null);
  }, [eventId]);

  // Helper syncs to localStorage
  const savePreReports = (items: PreEventReport[]) => {
    setPreReports(items);
    localStorage.setItem(`gs_report_pre_${eventId}`, JSON.stringify(items));
  };
  const savePostReports = (items: PostEventReport[]) => {
    setPostReports(items);
    localStorage.setItem(`gs_report_pos_${eventId}`, JSON.stringify(items));
  };
  const saveTechReports = (items: TechnicalVisitReport[]) => {
    setTechVisits(items);
    localStorage.setItem(`gs_report_tech_${eventId}`, JSON.stringify(items));
  };

  // Pre-Event form states
  const [pre_profName, setPreProfName] = useState("");
  const [pre_profRole, setPreProfRole] = useState("");
  const [pre_date, setPreDate] = useState(new Date().toISOString().split("T")[0]);
  const [pre_executed, setPreExecuted] = useState("Sim");
  const [pre_doneToday, setPreDoneToday] = useState("");
  const [pre_problems, setPreProblems] = useState("Não");
  const [pre_probDesc, setPreProbDesc] = useState("");
  const [pre_probSupplier, setPreProbSupplier] = useState("Não");
  const [pre_supName, setPreSupName] = useState("");
  const [pre_action, setPreAction] = useState("");
  const [pre_pending, setPrePending] = useState("");
  const [pre_crit, setPreCrit] = useState("Não");
  const [pre_critDetail, setPreCritDetail] = useState("");
  const [pre_risk, setPreRisk] = useState("");
  const [pre_rating, setPreRating] = useState("Dentro do planejado");
  const [pre_ready, setPreReady] = useState("Sim");
  const [pre_notes, setPreNotes] = useState("");

  // Post-Event form states
  const [pos_profName, setPosProfName] = useState("");
  const [pos_profRole, setPosProfRole] = useState("");
  const [pos_date, setPosDate] = useState(new Date().toISOString().split("T")[0]);
  const [pos_improveArea, setPosImproveArea] = useState("");
  const [pos_improveWhy, setPosImproveWhy] = useState("");
  const [pos_challenges, setPosChallenges] = useState("Não");
  const [pos_chalDesc, setPosChalDesc] = useState("");
  const [pos_chalArea, setPosChalArea] = useState("");
  const [pos_chalSup, setPosChalSup] = useState("Não");
  const [pos_supList, setPosSupList] = useState("");
  const [pos_profsInvolved, setPosProfsInvolved] = useState("");
  const [pos_solutions, setPosSolutions] = useState("");
  const [pos_effective, setPosEffective] = useState("Sim");
  const [pos_different, setPosDifferent] = useState("");
  const [pos_positives, setPosPositives] = useState("");
  const [pos_org, setPosOrg] = useState("Excelente");
  const [pos_comm, setPosComm] = useState("Excelente");
  const [pos_sups, setPosSups] = useState("Excelente");
  const [pos_overall, setPosOverall] = useState("Excelente");
  const [pos_addNotes, setPosAddNotes] = useState("");

  // Visita Tecnica states
  const [tech_employee, setTechEmployee] = useState("");
  const [tech_cep, setTechCep] = useState("");
  const [tech_address, setTechAddress] = useState("");
  const [tech_contact, setTechContact] = useState("");
  const [tech_phone, setTechPhone] = useState("");
  // Terreno
  const [tech_termType, setTechTermType] = useState("");
  const [tech_termLevel, setTechTermLevel] = useState("Plano");
  const [tech_termMud, setTechTermMud] = useState(false);
  const [tech_termObs, setTechTermObs] = useState("");
  // Banheiros
  const [tech_toiletSpace, setTechToiletSpace] = useState(true);
  const [tech_toiletFloor, setTechToiletFloor] = useState(true);
  const [tech_toiletMaint, setTechToiletMaint] = useState(true);
  const [tech_toiletObs, setTechToiletObs] = useState("");
  // Agua
  const [tech_hasWater, setTechHasWater] = useState(true);
  const [tech_waterDist, setTechWaterDist] = useState("");
  const [tech_waterPress, setTechWaterPress] = useState("Boa");
  const [tech_waterAccess, setTechWaterAccess] = useState("Torneira");
  const [tech_waterObs, setTechWaterObs] = useState("");
  // Energia
  const [tech_pole, setTechPole] = useState(true);
  const [tech_poleDist, setTechPoleDist] = useState("");
  const [tech_powerPoint, setTechPowerPoint] = useState(true);
  const [tech_pointsQty, setTechPointsQty] = useState("");
  const [tech_voltage, setTechVoltage] = useState("220V");
  const [tech_panel, setTechPanel] = useState(true);
  const [tech_tempConn, setTechTempConn] = useState(true);
  const [tech_cable, setTechCable] = useState("Livre");
  const [tech_powerStage, setTechPowerStage] = useState(true);
  const [tech_energyObs, setTechEnergyObs] = useState("");
  // Estrutura
  const [tech_stageM2, setTechStageM2] = useState("");
  const [tech_dressingRoom, setTechDressingRoom] = useState(true);
  const [tech_prodSpace, setTechProdSpace] = useState(true);
  const [tech_visInterf, setTechVisInterf] = useState("");
  const [tech_gridSpace, setTechGridSpace] = useState(true);
  const [tech_heavyStruct, setTechHeavyStruct] = useState(true);
  const [tech_stageDim, setTechStageDim] = useState("");
  const [tech_residential, setTechResidential] = useState(false);
  const [tech_soundRest, setTechSoundRest] = useState(false);
  const [tech_fixingPt, setTechFixingPt] = useState(true);
  const [tech_truck, setTechTruck] = useState(true);
  const [tech_loadingDock, setTechLoadingDock] = useState(true);
  const [tech_timeRest, setTechTimeRest] = useState(false);
  const [tech_structObs, setTechStructObs] = useState("");
  // Clima
  const [tech_sunExpos, setTechSunExpos] = useState("Medio");
  const [tech_wind, setTechWind] = useState("Medio");
  const [tech_flood, setTechFlood] = useState(false);
  const [tech_sunStage, setTechSunStage] = useState(false);
  const [tech_eco, setTechEco] = useState(false);
  const [tech_weather, setTechWeather] = useState(false);
  const [tech_climateObs, setTechClimateObs] = useState("");
  // Seguranca
  const [tech_routes, setTechRoutes] = useState(true);
  const [tech_emergSpace, setTechEmergSpace] = useState(true);
  const [tech_alvara, setTechAlvara] = useState(true);
  const [tech_pcd, setTechPcd] = useState(true);
  const [tech_access, setTechAccess] = useState(true);
  const [tech_ladder, setTechLadder] = useState(true);
  const [tech_apparentRisk, setTechApparentRisk] = useState(false);
  const [tech_secObs, setTechSecObs] = useState("");
  // Final
  const [tech_adjustments, setTechAdjustments] = useState("");
  const [tech_genObs, setTechGenObs] = useState("");
  const [tech_appropriate, setTechAppropriate] = useState("Sim");

  // Handler Submits
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rep: PreEventReport = {
      id: "pre_" + Date.now(),
      eventId,
      professionalName: pre_profName,
      professionalRole: pre_profRole,
      date: pre_date,
      plannedActivitiesExecuted: pre_executed,
      activitiesDoneToday: pre_doneToday,
      anyProblemsToday: pre_problems,
      problemDescription: pre_probDesc,
      problemInvolvedSupplier: pre_probSupplier,
      involvedSupplierName: pre_supName,
      actionTaken: pre_action,
      pendingIssues: pre_pending,
      isPendingIssueCritical: pre_crit,
      criticalPendingDetail: pre_critDetail,
      riskIfUnresolved: pre_risk,
      preparationRating: pre_rating,
      isReadyForExecution: pre_ready,
      additionalNotes: pre_notes
    };
    savePreReports([rep, ...preReports]);
    addAuditLog("Relatórios: Preencheu formulário Pré-Evento", currentEvent?.name || eventId);
    showNotice("Relatório Pré-Evento salvo no histórico!");
    setActiveFormType(null);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rep: PostEventReport = {
      id: "pos_" + Date.now(),
      eventId,
      professionalName: pos_profName,
      professionalRole: pos_profRole,
      date: pos_date,
      improvementArea: pos_improveArea,
      improvementWhy: pos_improveWhy,
      hadChallenges: pos_challenges,
      challengeDescription: pos_chalDesc,
      challengeArea: pos_chalArea,
      challengeInvolvedSupplier: pos_chalSup,
      involvedSuppliersList: pos_supList,
      involvedProfessionals: pos_profsInvolved,
      solutionsFound: pos_solutions,
      solutionsEffective: pos_effective,
      whatCouldBeDifferent: pos_different,
      positivePoints: pos_positives,
      ratingOrganization: pos_org,
      ratingCommunication: pos_comm,
      ratingSuppliers: pos_sups,
      ratingOverall: pos_overall,
      notesAdditional: pos_addNotes
    };
    savePostReports([rep, ...postReports]);
    addAuditLog("Relatórios: Preencheu formulário Pós-Evento", currentEvent?.name || eventId);
    showNotice("Relatório Pós-Evento salvo no histórico!");
    setActiveFormType(null);
  };

  const handleTechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rep: TechnicalVisitReport = {
      id: "tech_" + Date.now(),
      eventId,
      employeeName: tech_employee,
      cep: tech_cep,
      address: tech_address,
      contactPerson: tech_contact,
      contactPhone: tech_phone,
      terrainType: tech_termType,
      isTerrainLevel: tech_termLevel,
      riskOfMud: tech_termMud,
      terrainObs: tech_termObs,
      chemToiletsSpace: tech_toiletSpace,
      chemToiletsFloorSuitable: tech_toiletFloor,
      chemToiletsMaintenanceAccess: tech_toiletMaint,
      chemToiletsObs: tech_toiletObs,
      hasWater: tech_hasWater,
      waterDistance: tech_waterDist,
      waterPressure: tech_waterPress,
      waterAccessType: tech_waterAccess,
      waterObs: tech_waterObs,
      isPoleNearby: tech_pole,
      poleDistance: tech_poleDist,
      hasPowerPoint: tech_powerPoint,
      powerPointsQty: tech_pointsQty,
      voltage: tech_voltage,
      isPanelAccessible: tech_panel,
      isTempConnectionPossible: tech_tempConn,
      cablePathing: tech_cable,
      powerPointNearStage: tech_powerStage,
      energyObs: tech_energyObs,
      stageAreaM2: tech_stageM2,
      hasDressingRoomSpace: tech_dressingRoom,
      hasProductionSpace: tech_prodSpace,
      visualInterference: tech_visInterf,
      hasProtectionGridSpace: tech_gridSpace,
      supportsHeavyStructure: tech_heavyStruct,
      stageDimensions: tech_stageDim,
      isResidentialNearby: tech_residential,
      soundRestrictions: tech_soundRest,
      fixingPoints: tech_fixingPt,
      truckAccess: tech_truck,
      hasLoadingDock: tech_loadingDock,
      timeRestrictions: tech_timeRest,
      structureObs: tech_structObs,
      sunExposure: tech_sunExpos,
      windStrength: tech_wind,
      floodRisk: tech_flood,
      sunHitsStage: tech_sunStage,
      ecoRestrictions: tech_eco,
      weatherRisk: tech_weather,
      climateObs: tech_climateObs,
      definedRoutes: tech_routes,
      emergencySpace: tech_emergSpace,
      hasAlvaral: tech_alvara,
      pcdAccess: tech_pcd,
      accessControl: tech_access,
      safeLadders: tech_ladder,
      apparentRisks: tech_apparentRisk,
      securityObs: tech_secObs,
      riskAdjustments: tech_adjustments,
      generalComments: tech_genObs,
      isAppropriate: tech_appropriate
    };
    saveTechReports([rep, ...techVisits]);
    addAuditLog("Relatórios: Preencheu checklist de Visita Técnica", currentEvent?.name || eventId);
    showNotice("Ficha de Visita Técnica salva!");
    setActiveFormType(null);
  };

  const showNotice = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b dark:border-zinc-900 pb-3">
        <div>
          <h3 className="text-sm font-black text-gray-950 dark:text-zinc-50 flex items-center gap-2">
            <ClipboardList size={18} className="text-orange-500" />
            <span>Formulários Operacionais do Evento</span>
          </h3>
          <p className="text-[11px] text-gray-400">Modelos estruturados pré e pós-evento, além de checklists detalhados de inspeção técnica de campo.</p>
        </div>

        {activeFormType === null && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveFormType('tech')}
              className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-900 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-655 text-gray-700 dark:text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-3xs"
            >
              <Plus size={12} />
              <span>Inspeção Técnica</span>
            </button>
            <button
              onClick={() => setActiveFormType('pre')}
              className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-900 hover:bg-orange-500 hover:text-white text-gray-700 dark:text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-3xs"
            >
              <Plus size={12} />
              <span>Pré-Evento</span>
            </button>
            <button
              onClick={() => setActiveFormType('pos')}
              className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-900 hover:bg-orange-500 hover:text-white text-gray-700 dark:text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-3xs"
            >
              <Plus size={12} />
              <span>Pós-Evento</span>
            </button>
          </div>
        )}
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs animate-pulse text-center">
          {successMsg}
        </div>
      )}

      {/* FORM FILLING CONTAINERS */}
      {activeFormType === 'pre' && (
        <form onSubmit={handlePreSubmit} className="p-6 bg-orange-50/20 dark:bg-zinc-900/40 border border-orange-500/10 rounded-3xl space-y-6 text-xs">
          <div className="flex justify-between items-center border-b pb-2">
            <h4 className="font-extrabold text-sm text-gray-800 dark:text-zinc-200">RELATÓRIO GS PRE-EVENTO</h4>
            <button type="button" onClick={() => setActiveFormType(null)} className="text-gray-400 hover:text-red-500 font-bold uppercase text-[10px]">Cancelar</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nome do Profissional Preenchedor *</label>
              <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_profName} onChange={e => setPreProfName(e.target.value)} required placeholder="Ex: Lucas Goulart" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Função exercida *</label>
              <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_profRole} onChange={e => setPreProfRole(e.target.value)} required placeholder="Ex: Coordenador Técnico" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Data da Preparação *</label>
              <input type="date" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_date} onChange={e => setPreDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">Status do Dia</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">As atividades planejadas para hoje foram executadas? *</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_executed} onChange={e => setPreExecuted(e.target.value)}>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Houve algum problema ou imprevisto hoje? *</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_problems} onChange={e => setPreProblems(e.target.value)}>
                  <option value="Não">Não (Pular para pendências)</option>
                  <option value="Sim">Sim (Descrever abaixo)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold mb-1">O que foi realizado hoje? *</label>
                <textarea rows={2} className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl resize-none" placeholder="Relatar atividades cumpridas..." value={pre_doneToday} onChange={e => setPreDoneToday(e.target.value)} required />
              </div>
            </div>
          </div>

          {pre_problems === "Sim" && (
            <div className="space-y-4 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-red-500 block">Problemas / Ocorrências Identificadas</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-bold mb-1">Descreva o(s) problema(s) ocorrido(s) *</label>
                  <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_probDesc} onChange={e => setPreProbDesc(e.target.value)} />
                </div>
                <div>
                  <label className="block font-bold mb-1">Esse problema envolveu algum fornecedor? *</label>
                  <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_probSupplier} onChange={e => setPreProbSupplier(e.target.value)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Qual fornecedor envolvido?</label>
                  <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_supName} onChange={e => setPreSupName(e.target.value)} placeholder="Ex: Fornecedor de Som" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold mb-1">Qual foi a ação tomada no momento? *</label>
                  <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_action} onChange={e => setPreAction(e.target.value)} placeholder="Relatar ações emergenciais ou preventivas adotadas" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">Pendências & Status Geral</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-bold mb-1">O que ainda falta para finalizar a preparação do evento? *</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_pending} onChange={e => setPrePending(e.target.value)} />
              </div>
              <div>
                <label className="block font-bold mb-1">Existe alguma pendência crítica? *</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_crit} onChange={e => setPreCrit(e.target.value)}>
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </div>
              {pre_crit === "Sim" && (
                <>
                  <div>
                    <label className="block font-bold mb-1">Se sim, qual?</label>
                    <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_critDetail} onChange={e => setPreCritDetail(e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-bold mb-1">Qual o risco caso não seja resolvida?</label>
                    <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_risk} onChange={e => setPreRisk(e.target.value)} />
                  </div>
                </>
              )}
              <div>
                <label className="block font-bold mb-1">Como você avalia o andamento da preparação até agora? *</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_rating} onChange={e => setPreRating(e.target.value)}>
                  <option value="Dentro do planejado">Dentro do planejado</option>
                  <option value="Com pequenos ajustes necessários">Com pequenos ajustes necessários</option>
                  <option value="Em atenção">Em atenção</option>
                  <option value="Crítico">Crítico</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">O evento está pronto para execução? *</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pre_ready} onChange={e => setPreReady(e.target.value)}>
                  <option value="Sim">Sim</option>
                  <option value="Parcialmente">Parcialmente</option>
                  <option value="Não">Não</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold mb-1">Alguma observação final relevante?</label>
                <textarea rows={2} className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl resize-none" value={pre_notes} onChange={e => setPreNotes(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setActiveFormType(null)} className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 font-bold rounded-xl">Cancelar</button>
            <button type="submit" className="px-5 py-2 bg-orange-600 text-white font-bold rounded-xl shadow-xs">Salvar Relatório</button>
          </div>
        </form>
      )}

      {activeFormType === 'pos' && (
        <form onSubmit={handlePostSubmit} className="p-6 bg-purple-50/20 dark:bg-zinc-900/40 border border-purple-500/10 rounded-3xl space-y-6 text-xs">
          <div className="flex justify-between items-center border-b pb-2">
            <h4 className="font-extrabold text-sm text-gray-800 dark:text-zinc-200">RELATÓRIO GS PÓS-EVENTO</h4>
            <button type="button" onClick={() => setActiveFormType(null)} className="text-gray-400 hover:text-red-500 font-bold uppercase text-[10px]">Cancelar</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nome do Profissional Completo *</label>
              <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_profName} onChange={e => setPosProfName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Função que Exerceu *</label>
              <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_profRole} onChange={e => setPosProfRole(e.target.value)} required />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Data de Preenchimento *</label>
              <input type="date" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_date} onChange={e => setPosDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-purple-600 block border-b pb-1">Pontos de Melhoria</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">Qual função, fornecedor ou estrutura precisa melhorar? *</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_improveArea} onChange={e => setPosImproveArea(e.target.value)} required placeholder="Ex: Montagem de Palco" />
              </div>
              <div>
                <label className="block font-bold mb-1">Por quê? *</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_improveWhy} onChange={e => setPosImproveWhy(e.target.value)} required placeholder="Descreva os gargalos..." />
              </div>
              <div>
                <label className="block font-bold mb-1">Houve algum desafio durante o evento? *</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_challenges} onChange={e => setPosChallenges(e.target.value)}>
                  <option value="Não">Não</option>
                  <option value="Sim">Sim (Descrever abaixo)</option>
                </select>
              </div>
            </div>
          </div>

          {pos_challenges === "Sim" && (
            <div className="space-y-4 p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-purple-500 block">Detalhamento do Desafio</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-bold mb-1">Descreva qual desafio ocorreu durante o evento *</label>
                  <textarea rows={2} className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl resize-none" value={pos_chalDesc} onChange={e => setPosChalDesc(e.target.value)} />
                </div>
                <div>
                  <label className="block font-bold mb-1">Qual área do evento estava relacionada? *</label>
                  <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" placeholder="Ex: credenciamento, produção de palco" value={pos_chalArea} onChange={e => setPosChalArea(e.target.value)} />
                </div>
                <div>
                  <label className="block font-bold mb-1">Esse desafio foi relacionado a algum fornecedor? *</label>
                  <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_chalSup} onChange={e => setPosChalSup(e.target.value)}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                {pos_chalSup === "Sim" && (
                  <>
                    <div>
                      <label className="block font-bold mb-1">Quais fornecedores estavam envolvidos? *</label>
                      <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_supList} onChange={e => setPosSupList(e.target.value)} />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Quais profissionais do fornecedor envolvidos na situação?</label>
                      <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_profsInvolved} onChange={e => setPosProfsInvolved(e.target.value)} />
                    </div>
                  </>
                )}
                <div className="md:col-span-2">
                  <label className="block font-bold mb-1">Qual(is) alternativa(s) foi(foram) encontrada(s) para lidar com o(s) desafio(s)? *</label>
                  <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_solutions} onChange={e => setPosSolutions(e.target.value)} />
                </div>
                <div>
                  <label className="block font-bold mb-1">A solução foi eficaz? *</label>
                  <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_effective} onChange={e => setPosEffective(e.target.value)}>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">O que poderia ter sido feito diferente para evitar/minimizar desvios? *</label>
                  <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_different} onChange={e => setPosDifferent(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">Qualificação & Feedback Final</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-bold mb-1">Quais foram os principais pontos positivos do evento? *</label>
                <textarea rows={2} className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl resize-none" value={pos_positives} onChange={e => setPosPositives(e.target.value)} required />
              </div>
              <div>
                <label className="block font-bold mb-1">Nota para Organização *</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_org} onChange={e => setPosOrg(e.target.value)}>
                  <option value="Excelente">Excelente</option>
                  <option value="Bom">Bom</option>
                  <option value="Regular">Regular</option>
                  <option value="Ruim">Ruim</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Nota para Comunicação *</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_comm} onChange={e => setPosComm(e.target.value)}>
                  <option value="Excelente">Excelente</option>
                  <option value="Bom">Bom</option>
                  <option value="Regular">Regular</option>
                  <option value="Ruim">Ruim</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Nota para Fornecedores *</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_sups} onChange={e => setPosSups(e.target.value)}>
                  <option value="Excelente">Excelente</option>
                  <option value="Bom">Bom</option>
                  <option value="Regular">Regular</option>
                  <option value="Ruim">Ruim</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">De forma geral, como você avalia o evento? *</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={pos_overall} onChange={e => setPosOverall(e.target.value)}>
                  <option value="Excelente">Excelente</option>
                  <option value="Bom">Bom</option>
                  <option value="Regular">Regular</option>
                  <option value="Ruim">Ruim</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold mb-1">Você gostaria de destacar algo que não foi mencionado anteriormente?</label>
                <textarea rows={2} className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl resize-none" value={pos_addNotes} onChange={e => setPosAddNotes(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setActiveFormType(null)} className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 font-bold rounded-xl">Cancelar</button>
            <button type="submit" className="px-5 py-2 bg-purple-600 text-white font-bold rounded-xl shadow-xs">Salvar Relatório</button>
          </div>
        </form>
      )}

      {activeFormType === 'tech' && (
        <form onSubmit={handleTechSubmit} className="p-6 bg-blue-50/20 dark:bg-zinc-900/40 border border-blue-500/10 rounded-3xl space-y-6 text-xs max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center border-b pb-2 sticky top-0 bg-white dark:bg-zinc-950 p-2 z-10 rounded-lg">
            <h4 className="font-extrabold text-sm text-gray-800 dark:text-zinc-200">CHECKLIST VISITA TÉCNICA - GS EVENTOS</h4>
            <button type="button" onClick={() => setActiveFormType(null)} className="text-gray-400 hover:text-red-500 font-bold uppercase text-[10px]">Cancelar</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Funcionário GS EVENTOS *</label>
              <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_employee} onChange={e => setTechEmployee(e.target.value)} required />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">CEP do Local</label>
              <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_cep} onChange={e => setTechCep(e.target.value)} placeholder="00000-000" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Endereço Completo</label>
              <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_address} onChange={e => setTechAddress(e.target.value)} />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Responsável pelo Local</label>
              <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_contact} onChange={e => setTechContact(e.target.value)} />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Contato Telefônico</label>
              <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_phone} onChange={e => setTechPhone(e.target.value)} />
            </div>
          </div>

          {/* SECTION 1 TERRENO */}
          <div className="space-y-4 border-l-4 border-blue-500 pl-3">
            <span className="text-[10px] uppercase font-bold text-blue-600 block">1 - Terreno</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold">Tipo de Terreno</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_termType} onChange={e => setTechTermType(e.target.value)} placeholder="Ex: Grama, Asfalto, Areia" />
              </div>
              <div>
                <label className="block font-bold">Alinhamento / Nível</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_termLevel} onChange={e => setTechTermLevel(e.target.value)}>
                  <option value="Plano">Plano</option>
                  <option value="Irregular">Irregular</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="mud" checked={tech_termMud} onChange={e => setTechTermMud(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="mud" className="font-bold">Risco de lama no evento?</label>
              </div>
              <div className="md:col-span-3">
                <label className="block font-bold">Observações de Terreno</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_termObs} onChange={e => setTechTermObs(e.target.value)} />
              </div>
            </div>
          </div>

          {/* SECTION 2 BANHEIROS */}
          <div className="space-y-4 border-l-4 border-blue-500 pl-3">
            <span className="text-[10px] uppercase font-bold text-blue-600 block">2 - Banheiros Químicos</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="bathSpace" checked={tech_toiletSpace} onChange={e => setTechToiletSpace(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="bathSpace" className="font-bold">Área dedicada para instalação?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="bathFloor" checked={tech_toiletFloor} onChange={e => setTechToiletFloor(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="bathFloor" className="font-bold">Piso plano e adequado?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="bathMaint" checked={tech_toiletMaint} onChange={e => setTechToiletMaint(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="bathMaint" className="font-bold">Fácil acesso para manutenção?</label>
              </div>
              <div className="md:col-span-3">
                <label className="block font-bold">Observações Banheiros</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_toiletObs} onChange={e => setTechToiletObs(e.target.value)} />
              </div>
            </div>
          </div>

          {/* SECTION 3 AGUA */}
          <div className="space-y-4 border-l-4 border-blue-500 pl-3">
            <span className="text-[10px] uppercase font-bold text-blue-600 block">3 - Água</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="hasWat" checked={tech_hasWater} onChange={e => setTechHasWater(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="hasWat" className="font-bold">Tem Água no local?</label>
              </div>
              <div>
                <label className="block font-bold">Distância da fonte de captação</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_waterDist} onChange={e => setTechWaterDist(e.target.value)} placeholder="Ex: 20 metros" />
              </div>
              <div>
                <label className="block font-bold">Pressão da Água</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_waterPress} onChange={e => setTechWaterPress(e.target.value)}>
                  <option value="Boa">Boa</option>
                  <option value="Média">Média</option>
                  <option value="Fraca">Fraca</option>
                </select>
              </div>
              <div>
                <label className="block font-bold">Tipo de Acesso</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_waterAccess} onChange={e => setTechWaterAccess(e.target.value)}>
                  <option value="Torneira">Torneira</option>
                  <option value="Registro">Registro</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold">Observações Água</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_waterObs} onChange={e => setTechWaterObs(e.target.value)} />
              </div>
            </div>
          </div>

          {/* SECTION 4 ESTRUTURA */}
          <div className="space-y-4 border-l-4 border-blue-500 pl-3">
            <span className="text-[10px] uppercase font-bold text-blue-600 block">4 - Estrutura</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold">Área disponível para palco (m²)</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_stageM2} onChange={e => setTechStageM2(e.target.value)} />
              </div>
              <div>
                <label className="block font-bold">Dimensão Possível (L x P)</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_stageDim} onChange={e => setTechStageDim(e.target.value)} placeholder="Ex: 8x6m" />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="heavy" checked={tech_heavyStruct} onChange={e => setTechHeavyStruct(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="heavy" className="font-bold">Suporta estrutura pesada?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="camarim" checked={tech_dressingRoom} onChange={e => setTechDressingRoom(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="camarim" className="font-bold">Espaço para camarim?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="prodSpace" checked={tech_prodSpace} onChange={e => setTechProdSpace(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="prodSpace" className="font-bold">Espaço para produção?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="residential" checked={tech_residential} onChange={e => setTechResidential(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="residential" className="font-bold">Área residencial próxima?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="soundRest" checked={tech_soundRest} onChange={e => setTechSoundRest(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="soundRest" className="font-bold">Restrições de volume/som?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="truck" checked={tech_truck} onChange={e => setTechTruck(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="truck" className="font-bold">Caminhão entra no local?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="loadDock" checked={tech_loadingDock} onChange={e => setTechLoadingDock(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="loadDock" className="font-bold font-sans text-xs">Área de carga/descarga desobstruída?</label>
              </div>
              <div className="md:col-span-3">
                <label className="block font-bold">Observações de Estrutura</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_structObs} onChange={e => setTechStructObs(e.target.value)} />
              </div>
            </div>
          </div>

          {/* SECTION 5 ENERGIA */}
          <div className="space-y-4 border-l-4 border-blue-500 pl-3">
            <span className="text-[10px] uppercase font-bold text-blue-600 block">5 - Energia</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="pole" checked={tech_pole} onChange={e => setTechPole(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="pole" className="font-bold">Poste elétrico próximo?</label>
              </div>
              <div>
                <label className="block font-bold">Distância do Poste</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_poleDist} onChange={e => setTechPoleDist(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="pwPt" checked={tech_powerPoint} onChange={e => setTechPowerPoint(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="pwPt" className="font-bold">Tem ponto de energia local?</label>
              </div>
              <div>
                <label className="block font-bold">Quantidade de Pontos</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_pointsQty} onChange={e => setTechPointsQty(e.target.value)} />
              </div>
              <div>
                <label className="block font-bold">Voltagem</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_voltage} onChange={e => setTechVoltage(e.target.value)}>
                  <option value="110V">110V</option>
                  <option value="220V">220V</option>
                  <option value="Trifásico">Trifásico</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="tempConn" checked={tech_tempConn} onChange={e => setTechTempConn(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="tempConn" className="font-bold">Ligação provisória liberada?</label>
              </div>
              <div>
                <label className="block font-bold">Passagem de Cabos</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_cable} onChange={e => setTechCable(e.target.value)}>
                  <option value="Livre">Livre</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block font-bold">Observações Energia</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_energyObs} onChange={e => setTechEnergyObs(e.target.value)} />
              </div>
            </div>
          </div>

          {/* SECTION 7 SEGURANÇA */}
          <div className="space-y-4 border-l-4 border-blue-500 pl-3">
            <span className="text-[10px] uppercase font-bold text-blue-600 block">7 - Segurança</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="routes" checked={tech_routes} onChange={e => setTechRoutes(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="routes" className="font-bold">Rotas de entrada/saída definidas?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="emerg" checked={tech_emergSpace} onChange={e => setTechEmergSpace(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="emerg" className="font-bold">Espaço livre de emergência?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="alvara" checked={tech_alvara} onChange={e => setTechAlvara(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="alvara" className="font-bold">Alvará do local ativo?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pcd" checked={tech_pcd} onChange={e => setTechPcd(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="pcd" className="font-bold">Acessibilidade PCD atendida?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="haz" checked={tech_apparentRisk} onChange={e => setTechApparentRisk(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="haz" className="font-bold">Há riscos aparentes de segurança?</label>
              </div>
              <div className="md:col-span-3">
                <label className="block font-bold">Observações de Segurança</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_secObs} onChange={e => setTechSecObs(e.target.value)} />
              </div>
            </div>
          </div>

          {/* RESULTADO FINAL */}
          <div className="space-y-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-blue-500 block">8 - Conclusão & Resultado de Viabilidade</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-bold mb-1">Riscos e Requisitos de Ajustes</label>
                <input type="text" className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl" value={tech_adjustments} onChange={e => setTechAdjustments(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold mb-1">Observações Gerais de Fechamento</label>
                <textarea rows={2} className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl resize-none" value={tech_genObs} onChange={e => setTechGenObs(e.target.value)} />
              </div>
              <div>
                <label className="block font-bold mb-1">O local é apropriado para realização do evento? *</label>
                <select className="w-full p-2.5 bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl font-bold" value={tech_appropriate} onChange={e => setTechAppropriate(e.target.value)}>
                  <option value="Sim">Sim (Recomendado)</option>
                  <option value="Não">Não (Grave / Inviável)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setActiveFormType(null)} className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 font-bold rounded-xl">Cancelar</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-xs">Salvar Visita Técnica</button>
          </div>
        </form>
      )}

      {/* REVIEWS & HISTORY TAB LISTING */}
      {activeFormType === null && (
        <div className="space-y-4">
          <span className="text-[10px] font-mono uppercase font-black tracking-wider text-gray-400 block">Histórico de Relatórios Enviados</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* PRE EVENTS COL */}
            <div className="bg-gray-50/50 dark:bg-zinc-900/20 p-4 border dark:border-zinc-900 rounded-2xl space-y-3">
              <span className="text-[9px] font-black uppercase text-orange-650 bg-orange-100 dark:bg-orange-950/40 px-2 py-0.5 rounded tracking-wide font-mono block w-max">Pré-Evento ({preReports.length})</span>
              {preReports.length > 0 ? (
                <div className="space-y-2">
                  {preReports.map((r, i) => (
                    <div key={r.id || i} className="p-3 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-xl space-y-1.5 text-[11px] shadow-3xs hover:border-orange-500/30 transition-all cursor-pointer" onClick={() => setSelectedReviewId(r.id)}>
                      <div className="flex justify-between items-center">
                        <strong className="text-gray-800 dark:text-zinc-200">{r.professionalName}</strong>
                        <span className="text-[9px] text-gray-400 font-mono">{r.date}</span>
                      </div>
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-gray-400">Atividades: {r.plannedActivitiesExecuted}</span>
                        <span className={`px-1.5 py-0.2 rounded font-bold uppercase scale-90 ${r.isReadyForExecution === "Sim" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                          Pronto: {r.isReadyForExecution}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-gray-400 block py-4 text-center">Nenhum relatório pré-evento enviado.</span>
              )}
            </div>

            {/* INSPECTIONS COL */}
            <div className="bg-gray-50/50 dark:bg-zinc-900/20 p-4 border dark:border-zinc-900 rounded-2xl space-y-3">
              <span className="text-[9px] font-black uppercase text-blue-650 bg-blue-100 dark:bg-blue-950/40 px-2 py-0.5 rounded tracking-wide font-mono block w-max">Visita Técnica ({techVisits.length})</span>
              {techVisits.length > 0 ? (
                <div className="space-y-2">
                  {techVisits.map((r, i) => (
                    <div key={r.id || i} className="p-3 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-xl space-y-1.5 text-[11px] shadow-3xs hover:border-blue-500/30 transition-all cursor-pointer" onClick={() => setSelectedReviewId(r.id)}>
                      <div className="flex justify-between items-center">
                        <strong className="text-gray-800 dark:text-zinc-200">{r.employeeName}</strong>
                        <span className="text-[9px] text-gray-400 font-mono">Endereço Atendido</span>
                      </div>
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-gray-400 truncate max-w-[140px] block">{r.address}</span>
                        <span className={`px-1.5 py-0.2 rounded font-bold uppercase scale-90 ${r.isAppropriate === "Sim" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                          Viável: {r.isAppropriate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-gray-400 block py-4 text-center">Nenhum laudo técnico enviado.</span>
              )}
            </div>

            {/* POST EVENT COL */}
            <div className="bg-gray-50/50 dark:bg-zinc-900/20 p-4 border dark:border-zinc-900 rounded-2xl space-y-3">
              <span className="text-[9px] font-black uppercase text-purple-650 bg-purple-100 dark:bg-purple-950/40 px-2 py-0.5 rounded tracking-wide font-mono block w-max">Pós-Evento ({postReports.length})</span>
              {postReports.length > 0 ? (
                <div className="space-y-2">
                  {postReports.map((r, i) => (
                    <div key={r.id || i} className="p-3 bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-xl space-y-1.5 text-[11px] shadow-3xs hover:border-purple-500/30 transition-all cursor-pointer" onClick={() => setSelectedReviewId(r.id)}>
                      <div className="flex justify-between items-center">
                        <strong className="text-gray-800 dark:text-zinc-200">{r.professionalName}</strong>
                        <span className="text-[9px] text-gray-400 font-mono">{r.date}</span>
                      </div>
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-gray-400 truncate max-w-[140px] block">Ajustar: {r.improvementArea}</span>
                        <span className="text-[9px] text-purple-655 font-bold">Nota: {r.ratingOverall}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-gray-400 block py-4 text-center">Nenhum relatório pós-evento enviado.</span>
              )}
            </div>

          </div>
        </div>
      )}

      {/* FULL REPORT DETAILED VIEWER MODAL */}
      {selectedReviewId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-xs font-sans">
          <div className="bg-white dark:bg-zinc-950 border dark:border-zinc-900 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-extrabold text-sm text-[var(--color-primary)]">Visualizador Completo de Submissão</h4>
              <button 
                onClick={() => setSelectedReviewId(null)}
                className="p-1 px-3 bg-gray-150 hover:bg-gray-200 dark:bg-zinc-900 rounded-lg text-gray-600 dark:text-zinc-350 font-black uppercase text-[10px]"
              >
                Fechar
              </button>
            </div>

            {/* RENDER DETAILED DATA */}
            {(() => {
              const rPre = preReports.find(x => x.id === selectedReviewId);
              const rPos = postReports.find(x => x.id === selectedReviewId);
              const rTech = techVisits.find(x => x.id === selectedReviewId);

              if (rPre) {
                return (
                  <div className="space-y-4">
                    <span className="text-xs bg-orange-100 text-orange-850 font-bold px-2 py-0.5 rounded uppercase">Laudo Pré-Evento</span>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-zinc-900 p-4 rounded-2xl">
                      <div><strong>Nome do Profissional:</strong> {rPre.professionalName} ({rPre.professionalRole})</div>
                      <div><strong>Data:</strong> {rPre.date}</div>
                      <div><strong>Planejadas Executadas:</strong> {rPre.plannedActivitiesExecuted}</div>
                      <div><strong>Problemas/Ocorrências:</strong> {rPre.anyProblemsToday}</div>
                      {rPre.anyProblemsToday === "Sim" && (
                        <div className="col-span-2 bg-red-500/5 p-2 rounded-xl border dark:border-zinc-800">
                          <strong>Descrição:</strong> {rPre.problemDescription} <br/>
                          <strong>Ação Tomada:</strong> {rPre.actionTaken}
                        </div>
                      )}
                      <div className="col-span-2"><strong>O que foi realizado:</strong> {rPre.activitiesDoneToday}</div>
                      <div><strong>Como avalia preparação:</strong> {rPre.preparationRating}</div>
                      <div><strong>Pronto para execução:</strong> {rPre.isReadyForExecution}</div>
                      {rPre.additionalNotes && <div className="col-span-2"><strong>Observações Adicionais:</strong> {rPre.additionalNotes}</div>}
                    </div>
                  </div>
                );
              }

              if (rPos) {
                return (
                  <div className="space-y-4">
                    <span className="text-xs bg-purple-100 text-purple-850 font-bold px-2 py-0.5 rounded uppercase">Laudo Pós-Evento</span>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-zinc-900 p-4 rounded-2xl">
                      <div><strong>Nome do Profissional:</strong> {rPos.professionalName} ({rPos.professionalRole})</div>
                      <div><strong>Data:</strong> {rPos.date}</div>
                      <div><strong>O que precisa melhorar:</strong> {rPos.improvementArea}</div>
                      <div><strong>Motivo:</strong> {rPos.improvementWhy}</div>
                      <div><strong>Teve Desafios:</strong> {rPos.hadChallenges}</div>
                      {rPos.hadChallenges === "Sim" && (
                        <div className="col-span-2 bg-purple-500/5 p-2 rounded-xl">
                          <strong>Desafio:</strong> {rPos.challengeDescription} <br/>
                          <strong>Soluções:</strong> {rPos.solutionsFound} <br/>
                          <strong>Eficácia:</strong> {rPos.solutionsEffective}
                        </div>
                      )}
                      <div className="col-span-2"><strong>Pontos Positivos:</strong> {rPos.positivePoints}</div>
                      <div><strong>Nota Organização:</strong> {rPos.ratingOrganization}</div>
                      <div><strong>Nota Comunicação:</strong> {rPos.ratingCommunication}</div>
                      <div><strong>Nota Fornecedores:</strong> {rPos.ratingSuppliers}</div>
                      <div><strong>Avaliação Geral:</strong> {rPos.ratingOverall}</div>
                    </div>
                  </div>
                );
              }

              if (rTech) {
                return (
                  <div className="space-y-4">
                    <span className="text-xs bg-blue-100 text-blue-850 font-bold px-2 py-0.5 rounded uppercase">Laudo Visita Técnica de Campo</span>
                    
                    <div className="grid grid-cols-2 gap-2.5 bg-gray-50 dark:bg-zinc-900 p-4 rounded-2xl">
                      <div><strong>Geral:</strong> {rTech.employeeName}</div>
                      <div><strong>CEP / Endereço:</strong> {rTech.cep} - {rTech.address}</div>
                      <div><strong>Responsável:</strong> {rTech.contactPerson} ({rTech.contactPhone})</div>
                      
                      <div className="col-span-2 border-t pt-2 mt-2">
                        <h5 className="font-bold text-[10px] uppercase text-blue-500">1. Terreno</h5>
                        <p>Tipo: {rTech.terrainType} | Nível: {rTech.isTerrainLevel} | Risco Lama: {rTech.riskOfMud ? "Sim" : "Não"}</p>
                      </div>

                      <div className="col-span-2 border-t pt-2">
                        <h5 className="font-bold text-[10px] uppercase text-blue-500">2. Banheiros</h5>
                        <p>Localização Adequada: {rTech.chemToiletsSpace ? "Sim" : "Não"} | Manutenção Acessível: {rTech.chemToiletsMaintenanceAccess ? "Sim" : "Não"}</p>
                      </div>

                      <div className="col-span-2 border-t pt-2">
                        <h5 className="font-bold text-[10px] uppercase text-blue-500">3. Água e Energia</h5>
                        <p>Tem Água: {rTech.hasWater ? "Sim" : "Não"} (Pressão: {rTech.waterPressure})</p>
                        <p>Ponto de Energia: {rTech.hasPowerPoint ? "Sim" : "Não"} (Voltagem: {rTech.voltage} | Qtd: {rTech.powerPointsQty})</p>
                      </div>

                      <div className="col-span-2 border-t pt-2">
                        <h5 className="font-bold text-[10px] uppercase text-blue-500">4. Viabilidade Técnica</h5>
                        <p>Dimensões Palco: {rTech.stageDimensions} ({rTech.stageAreaM2}m²)</p>
                        <p>Apropriado para Evento: <strong>{rTech.isAppropriate}</strong></p>
                        {rTech.generalComments && <p className="mt-1">Comments: {rTech.generalComments}</p>}
                      </div>
                    </div>
                  </div>
                );
              }

              return <p>Carregando...</p>;
            })()}
          </div>
        </div>
      )}

    </div>
  );
};
