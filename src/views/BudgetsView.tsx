import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Search, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Trash, Calendar } from "lucide-react";

export const BudgetsView: React.FC = () => {
  const { events, currentUser } = useApp();

  // Simulated Transactions & budget database local storage
  const [transactions, setTransactions] = useState<any[]>(() => {
    const saved = localStorage.getItem("gs_budget_transactions");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "tx_1",
        title: "Repasse Patrocínio Master Itaú",
        event: "Réveillon Copacabana 2027",
        type: "Receita",
        category: "Patrocínio",
        amount: 450000.00,
        date: "2026-05-27",
        responsible: "Carlos Eduardo Silva"
      },
      {
        id: "tx_2",
        title: "Aluguel Central de Geradores Diesel",
        event: "Réveillon Copacabana 2027",
        type: "Despesa",
        category: "Infraestrutura",
        amount: 85200.00,
        date: "2026-05-26",
        responsible: "Leandra Kaisa"
      },
      {
        id: "tx_3",
        title: "Adiantamento Equipes de Brigada Médica",
        event: "All-inclusive Lounge 2026",
        type: "Despesa",
        category: "Segurança",
        amount: 45000.00,
        date: "2026-05-25",
        responsible: "Gustavo Soares"
      },
      {
        id: "tx_4",
        title: "Faturamento Ingressos VIP Área de Lazer",
        event: "All-inclusive Lounge 2026",
        type: "Receita",
        category: "Ingressos",
        amount: 125000.00,
        date: "2026-05-24",
        responsible: "Carlos Eduardo Silva"
      }
    ];
  });

  const saveTxToLocal = (newTx: any[]) => {
    setTransactions(newTx);
    localStorage.setItem("gs_budget_transactions", JSON.stringify(newTx));
  };

  // Form states - pág 22, 28
  const [isCreating, setIsCreating] = useState(false);
  const [txTitle, setTxTitle] = useState("");
  const [txEvent, setTxEvent] = useState("");
  const [txType, setTxType] = useState("Despesa");
  const [txCategory, setTxCategory] = useState("Operação");
  const [txAmount, setTxAmount] = useState("");
  const [txDate, setTxDate] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle || !txAmount || !txDate) return;

    const newTx = {
      id: "tx_" + Date.now(),
      title: txTitle,
      event: txEvent || "Geral",
      type: txType,
      category: txCategory,
      amount: parseFloat(txAmount),
      date: txDate,
      responsible: currentUser.name
    };

    const updated = [newTx, ...transactions];
    saveTxToLocal(updated);

    // Reset Form
    setIsCreating(false);
    setTxTitle("");
    setTxEvent("");
    setTxType("Despesa");
    setTxCategory("Operação");
    setTxAmount("");
    setTxDate("");
  };

  const handleDelete = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    saveTxToLocal(updated);
  };

  // Calculations for dashboard
  const totalReceitas = transactions.filter(t => t.type === "Receita").reduce((acc, current) => acc + current.amount, 0);
  const totalDespesas = transactions.filter(t => t.type === "Despesa").reduce((acc, current) => acc + current.amount, 0);
  const saldoLiquido = totalReceitas - totalDespesas;

  const filteredTransactions = transactions.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Gerenciador de Budgets & Transações</h2>
          <p className="text-xs text-gray-500">Mapeamento e controle total do faturamento bruto e despesas operacionais da empresa.</p>
        </div>
        
        {currentUser.profile === "Admin" && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-[var(--color-primary)] text-white hover:opacity-90 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={16} /> Lançar Movimentação
          </button>
        )}
      </div>

      {/* METRIC DASHBOARD PANEL FOR FINANCE SENSITIVE ACCESSIBILITY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TOTAL REVENUE */}
        <div className="bg-emerald-50/40 dark:bg-emerald-950/10 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">Total Faturamento Bruto</span>
            <strong className="text-2xl text-emerald-650 dark:text-emerald-400 font-black font-mono">
              R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
          </div>
          <span className="p-3 bg-emerald-100/50 dark:bg-emerald-900/35 rounded-2xl text-emerald-650 dark:text-emerald-400">
            <TrendingUp size={22} />
          </span>
        </div>

        {/* TOTAL EXPENSES */}
        <div className="bg-red-50/40 dark:bg-red-950/10 p-5 rounded-3xl border border-red-100 dark:border-red-900/30 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">Total Custos & Operações</span>
            <strong className="text-2xl text-red-650 dark:text-red-400 font-black font-mono">
              R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
          </div>
          <span className="p-3 bg-red-100/50 dark:bg-red-900/35 rounded-2xl text-red-650 dark:text-red-400">
            <TrendingDown size={22} />
          </span>
        </div>

        {/* NET REVENUE SALDO */}
        <div className="bg-purple-50/40 dark:bg-purple-950/10 p-5 rounded-3xl border border-purple-100 dark:border-purple-900/30 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">Saldo Líquido</span>
            <strong className={`text-2xl font-black font-mono ${saldoLiquido >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-red-500'}`}>
              R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
          </div>
          <span className="p-3 bg-purple-100/50 dark:bg-purple-900/35 rounded-2xl text-purple-600 dark:text-purple-400">
            <DollarSign size={22} />
          </span>
        </div>
      </div>

      {/* FILTER SEARCH ROW */}
      <div className="flex bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Pesquise transações por título, categoria ou evento..."
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* TRANSACTION LAUNCHER FORM */}
      {isCreating && (
        <form onSubmit={handleCreateTx} className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans shadow-sm">
          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Título do Lançamento *</label>
            <input type="text" required placeholder="Ex: Diárias Equipe do DP" value={txTitle} onChange={(e) => setTxTitle(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focues:outline-none" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Aporte Valor (R$) *</label>
            <input type="number" step="0.01" required placeholder="5000.00" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Data Lançamento *</label>
            <input type="date" required value={txDate} onChange={(e) => setTxDate(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-gray-700" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Sentido Movimentação</label>
            <select value={txType} onChange={(e) => setTxType(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-gray-700 focus:outline-none">
              <option value="Despesa">Custos / Despesa (-) </option>
              <option value="Receita">Faturamento / Receita (+) </option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Categoria Comercial</label>
            <input type="text" placeholder="Ex: Patrocínio, DP, Gerador" value={txCategory} onChange={(e) => setTxCategory(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl focus:outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Evento Vinculado</label>
            <select value={txEvent} onChange={(e) => setTxEvent(e.target.value)} className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-850 rounded-xl text-gray-750 focus:outline-none">
              <option value="">Geral (Administrativos Corporativos)</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.title}>{ev.title}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t dark:border-gray-900">
            <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-xl font-bold font-mono">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-xs">Adicionar Lançamento</button>
          </div>
        </form>
      )}

      {/* RECENT HISTORICAL FEED LISTING */}
      <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b dark:border-gray-900 text-xs font-bold text-gray-500 bg-gray-50/50 dark:bg-gray-900/10">
          Feed consolidado histórico de despesas e faturamento
        </div>

        <div className="divide-y dark:divide-gray-900">
          {filteredTransactions.map((tx) => {
            const isRevenue = tx.type === "Receita";
            
            return (
              <div key={tx.id} className="p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-sans hover:bg-gray-50/50 dark:hover:bg-gray-900/10">
                
                <div className="flex items-start gap-3.5">
                  <span className={`p-2 rounded-xl flex items-center justify-center font-bold ${isRevenue ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-red-50 text-red-600 dark:bg-red-950/20'}`}>
                    {isRevenue ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </span>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 line-clamp-1">
                      <span className="text-[10px] font-mono uppercase bg-gray-100 dark:bg-gray-900 text-gray-400 px-1.5 py-0.2 rounded font-extrabold tracking-wider">
                        {tx.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold font-mono">
                        Escopo: {tx.event}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-[#1F2937] dark:text-white leading-snug">{tx.title}</h4>
                    <span className="text-[10px] text-gray-400 block font-sans">Lançado por: {tx.responsible}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-end">
                  <span className="text-gray-400 font-mono text-[10px]">{tx.date}</span>
                  
                  <strong className={`font-mono text-sm font-black ${isRevenue ? 'text-emerald-505 text-emerald-600' : 'text-red-505 text-red-600'}`}>
                    {isRevenue ? "+" : "-"} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </strong>

                  {currentUser.profile === "Admin" && (
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="p-1 hover:bg-red-50 text-red-500 rounded"
                    >
                      <Trash size={14} />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
