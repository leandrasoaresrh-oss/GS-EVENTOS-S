import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Trash2, Calculator, Save, AlertCircle, FileSpreadsheet, Check } from "lucide-react";

interface EventBudgetProps {
  eventId: string;
}

export interface BudgetItem {
  id: string;
  serviceName: string; // "Serviço"
  supplierName: string; // "Fornecedor"
  itemName: string; // "Item"
  quantity: number; // "Quantidade"
  quantityPerDay: number; // "Quantidade por dia"
  quantityDays: number; // "Quantidade de dias"
  encargosPercent: number; // "Encargos %"
  unitValue: number; // "Valor unitário"
  totalValue: number; // "Valor total"
}

export const EventBudget: React.FC<EventBudgetProps> = ({ eventId }) => {
  const { suppliers, addSupplier, events, addAuditLog } = useApp();
  const currentEvent = events.find(e => e.id === eventId);

  // Load from LocalStorage
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem(`gs_budget_items_${eventId}`);
    if (saved) return JSON.parse(saved);

    // Initial mockup rows for clean spreadsheet feel
    return [
      {
        id: "bi_1",
        serviceName: "Som e Iluminação",
        supplierName: suppliers[0]?.tradeName || "SOS Ambulâncias",
        itemName: "Gerador de Energia 150kva",
        quantity: 1,
        quantityPerDay: 1,
        quantityDays: 2,
        encargosPercent: 10,
        unitValue: 1200,
        totalValue: 2640
      },
      {
        id: "bi_2",
        serviceName: "Higiene / Banheiros",
        supplierName: "Sul Geradores Ltda",
        itemName: "Cabine Química Luxo Vip",
        quantity: 4,
        quantityPerDay: 1,
        quantityDays: 2,
        encargosPercent: 5,
        unitValue: 250,
        totalValue: 2100
      }
    ];
  });

  const [savingMsg, setSavingMsg] = useState("");

  // Sync spreadsheet changes
  const updateBudgetItemRow = (rowId: string, updatedFields: Partial<BudgetItem>) => {
    setBudgetItems(prev => {
      const items = prev.map(item => {
        if (item.id !== rowId) return item;

        // Calculate automatic total based on the equation
        // (Qty * QtyPerDay * QtyDays * UnitValue) * (1 + EncargosPercent/100)
        const merged = { ...item, ...updatedFields };
        const base = merged.quantity * merged.quantityPerDay * merged.quantityDays * merged.unitValue;
        const total = base * (1 + merged.encargosPercent / 100);

        return { ...merged, totalValue: Number(total.toFixed(2)) };
      });

      localStorage.setItem(`gs_budget_items_${eventId}`, JSON.stringify(items));
      return items;
    });
  };

  const addRow = () => {
    const newId = "bi_" + Date.now();
    const newItem: BudgetItem = {
      id: newId,
      serviceName: "Novo Serviço",
      supplierName: suppliers[0]?.tradeName || "Tipo Fornecedor",
      itemName: "Novo Item de Infraestrutura",
      quantity: 1,
      quantityPerDay: 1,
      quantityDays: 1,
      encargosPercent: 0,
      unitValue: 0,
      totalValue: 0
    };
    const items = [...budgetItems, newItem];
    setBudgetItems(items);
    localStorage.setItem(`gs_budget_items_${eventId}`, JSON.stringify(items));
  };

  const removeRow = (rowId: string) => {
    const items = budgetItems.filter(i => i.id !== rowId);
    setBudgetItems(items);
    localStorage.setItem(`gs_budget_items_${eventId}`, JSON.stringify(items));
  };

  const handleSaveAll = () => {
    localStorage.setItem(`gs_budget_items_${eventId}`, JSON.stringify(budgetItems));
    addAuditLog("Orçamentos: Salvou planilha de custos de orçamento do evento", currentEvent?.name || eventId);
    setSavingMsg("Planilha salva com sucesso!");
    setTimeout(() => setSavingMsg(""), 3000);
  };

  // Calculations for summarized indicators
  const subtotalBeforeCharges = budgetItems.reduce((acc, item) => {
    return acc + (item.quantity * item.quantityPerDay * item.quantityDays * item.unitValue);
  }, 0);

  const totalCharges = budgetItems.reduce((acc, item) => {
    const base = item.quantity * item.quantityPerDay * item.quantityDays * item.unitValue;
    return acc + (base * (item.encargosPercent / 100));
  }, 0);

  const totalEventValue = budgetItems.reduce((acc, item) => acc + item.totalValue, 0);

  // Grouped by Supplier Calculations
  const groupCostsBySupplier = () => {
    const groups: Record<string, number> = {};
    budgetItems.forEach(i => {
      const name = i.supplierName || "Não Especificado";
      groups[name] = (groups[name] || 0) + i.totalValue;
    });
    return Object.entries(groups).map(([name, total]) => ({ name, total }));
  };

  const supplierTotals = groupCostsBySupplier();

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b dark:border-zinc-900 pb-3">
        <div>
          <h3 className="text-sm font-black text-gray-950 dark:text-zinc-50 flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-orange-500" />
            <span>Matriz de Custos / Planilha de Orçamento</span>
          </h3>
          <p className="text-[11px] text-gray-400">Insira, controle quantidades, encargos tributários e calcule custos por fornecedor em tempo real.</p>
        </div>

        <div className="flex items-center gap-2">
          {savingMsg && (
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-lg">
              {savingMsg}
            </span>
          )}
          <button
            onClick={addRow}
            className="bg-gray-100 dark:bg-zinc-900 border dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-orange-500 hover:text-white font-bold px-3 py-1.5 rounded-xl text-[10px] uppercase font-mono flex items-center gap-1 cursor-pointer transition-all"
          >
            <Plus size={12} /> Adicionar Linha
          </button>
          <button
            onClick={handleSaveAll}
            className="bg-[var(--color-primary)] text-white hover:opacity-90 font-bold px-3 py-1.5 rounded-xl text-[10px] uppercase font-mono flex items-center gap-1 cursor-pointer transition-all shadow-3xs"
          >
            <Save size={12} /> Salvar Planilha
          </button>
        </div>
      </div>

      {/* METRIC SUMMARIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50/50 dark:bg-zinc-900/40 border dark:border-zinc-900 p-4 rounded-2xl">
          <span className="text-[9px] font-black uppercase text-gray-400 block font-mono">Subtotal de Custos</span>
          <strong className="text-lg text-gray-800 dark:text-zinc-200 block mt-1">
            {subtotalBeforeCharges.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </strong>
        </div>

        <div className="bg-gray-50/50 dark:bg-zinc-900/40 border dark:border-zinc-900 p-4 rounded-2xl">
          <span className="text-[9px] font-black uppercase text-gray-400 block font-mono">Total de Encargos / Impostos</span>
          <strong className="text-lg text-[var(--color-primary)] block mt-1">
            {totalCharges.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </strong>
        </div>

        <div className="bg-orange-50/50 dark:bg-orange-950/10 border border-orange-500/10 p-4 rounded-2xl">
          <span className="text-[9px] font-black uppercase text-[var(--color-primary)] block font-mono">Valor Total do Evento</span>
          <strong className="text-lg text-[var(--color-primary)] block mt-1">
            {totalEventValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </strong>
        </div>
      </div>

      {/* SPREADSHEET SCROLL BOX */}
      <div className="border border-gray-150 dark:border-zinc-850 rounded-2xl overflow-x-auto shadow-2xs">
        <table className="w-full text-left border-collapse text-xs table-auto">
          <thead>
            <tr className="bg-gray-50 dark:bg-zinc-900 border-b dark:border-zinc-800 text-[10px] uppercase font-black text-gray-500 tracking-wider">
              <th className="p-3">Serviço</th>
              <th className="p-3">Fornecedor</th>
              <th className="p-3">Item contratado</th>
              <th className="p-3 w-16 text-center">Qtd</th>
              <th className="p-3 w-16 text-center">Qtd p/ dia</th>
              <th className="p-3 w-16 text-center">Dias</th>
              <th className="p-3 w-20 text-center">Encargo %</th>
              <th className="p-3 w-28 text-right">Unitário R$</th>
              <th className="p-3 w-32 text-right">Valor Total</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-850">
            {budgetItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50/40 dark:hover:bg-zinc-900/10 transition-colors">
                {/* SERVIÇO */}
                <td className="p-1 px-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 bg-transparent border-0 font-bold focus:bg-white dark:focus:bg-zinc-950 focus:ring-1 focus:ring-orange-500 rounded text-xs"
                    value={item.serviceName}
                    onChange={e => updateBudgetItemRow(item.id, { serviceName: e.target.value })}
                  />
                </td>

                {/* FORNECEDOR */}
                <td className="p-1 px-2">
                  <select
                    className="w-full px-2 py-1.5 bg-transparent border-0 focus:bg-white dark:focus:bg-zinc-950 focus:ring-1 focus:ring-orange-500 rounded text-xs text-gray-650"
                    value={item.supplierName}
                    onChange={e => updateBudgetItemRow(item.id, { supplierName: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.tradeName}>{s.tradeName}</option>
                    ))}
                    {/* Permite livre digitação ou novidades mantendo a consistência */}
                    {!suppliers.some(s => s.tradeName === item.supplierName) && item.supplierName && (
                      <option value={item.supplierName}>{item.supplierName}</option>
                    )}
                  </select>
                </td>

                {/* ITEM */}
                <td className="p-1 px-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1.5 bg-transparent border-0 focus:bg-white dark:focus:bg-zinc-950 focus:ring-1 focus:ring-orange-500 rounded text-xs"
                    value={item.itemName}
                    onChange={e => updateBudgetItemRow(item.id, { itemName: e.target.value })}
                  />
                </td>

                {/* QUANTIDADE */}
                <td className="p-1 text-center">
                  <input
                    type="number"
                    min={0}
                    className="w-12 text-center p-1 px-1 bg-transparent border-0 focus:bg-white dark:focus:bg-zinc-950 focus:ring-1 focus:ring-orange-500 rounded"
                    value={item.quantity}
                    onChange={e => updateBudgetItemRow(item.id, { quantity: Number(e.target.value) })}
                  />
                </td>

                {/* QTD DIÁRIA */}
                <td className="p-1 text-center">
                  <input
                    type="number"
                    min={0}
                    className="w-12 text-center p-1 px-1 bg-transparent border-0 focus:bg-white dark:focus:bg-zinc-950 focus:ring-1 focus:ring-orange-500 rounded"
                    value={item.quantityPerDay}
                    onChange={e => updateBudgetItemRow(item.id, { quantityPerDay: Number(e.target.value) })}
                  />
                </td>

                {/* DIAS */}
                <td className="p-1 text-center">
                  <input
                    type="number"
                    min={0}
                    className="w-11 text-center p-1 px-1 bg-transparent border-0 focus:bg-white dark:focus:bg-zinc-950 focus:ring-1 focus:ring-orange-500 rounded"
                    value={item.quantityDays}
                    onChange={e => updateBudgetItemRow(item.id, { quantityDays: Number(e.target.value) })}
                  />
                </td>

                {/* ENCARGOS */}
                <td className="p-1 text-center">
                  <input
                    type="number"
                    min={0}
                    className="w-14 text-center p-1 px-1 bg-transparent border-0 focus:bg-white dark:focus:bg-zinc-950 focus:ring-1 focus:ring-orange-500 rounded"
                    value={item.encargosPercent}
                    onChange={e => updateBudgetItemRow(item.id, { encargosPercent: Number(e.target.value) })}
                  />
                </td>

                {/* UNITÁRIO */}
                <td className="p-1 text-right">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className="w-24 text-right p-1 px-1 bg-transparent border-0 focus:bg-white dark:focus:bg-zinc-950 focus:ring-1 focus:ring-orange-500 rounded font-bold"
                    value={item.unitValue}
                    onChange={e => updateBudgetItemRow(item.id, { unitValue: Number(e.target.value) })}
                  />
                </td>

                {/* VALOR TOTAL */}
                <td className="p-3 text-right font-black text-gray-900 dark:text-zinc-100 font-mono">
                  {item.totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>

                {/* TRASH */}
                <td className="p-1 text-center">
                  <button
                    onClick={() => removeRow(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer"
                    title="Excluir item da planilha"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GROUPED BY SUPPLIER COST SUMMARY */}
      <div className="bg-gray-50/40 dark:bg-zinc-900/10 p-4 border dark:border-zinc-900 rounded-2xl space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-mono flex items-center gap-1">
          <Calculator size={14} className="text-orange-500" />
          <span>Custos Totais consolidados por Fornecedor parceiro</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {supplierTotals.map((s, index) => (
            <div key={index} className="bg-white dark:bg-zinc-950 p-3 rounded-xl border dark:border-zinc-900 flex justify-between items-center">
              <div>
                <strong className="text-xs text-gray-800 dark:text-zinc-200 block truncate max-w-[120px]">{s.name}</strong>
                <span className="text-[9px] text-gray-400">Total de Custos</span>
              </div>
              <strong className="text-xs text-[var(--color-primary)] font-mono">
                {s.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </strong>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
