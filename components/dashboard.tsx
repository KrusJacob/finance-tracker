"use client";

import { useMemo } from "react";
import { Wallet } from "lucide-react";
import { useTransactions } from "@/lib/use-transactions";
import { formatMoney, totalsForRange } from "@/lib/finance";
import { cn } from "@/lib/utils";
import { TransactionForm } from "@/components/transaction-form";
import { StatsSection } from "@/components/stats-section";
import { TrendChart } from "@/components/trend-chart";
import { CategoryPie } from "@/components/category-pie";
import { TransactionList } from "@/components/transaction-list";
import { InstallButton } from "@/components/install-button";

export function Dashboard() {
  const { transactions, hydrated, addTransaction, removeTransaction } = useTransactions();

  const balance = useMemo(() => totalsForRange(transactions).balance, [transactions]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <InstallButton />
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="size-6" />
          </span>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold tracking-tight">Финансы</h1>
            <p className="text-sm text-muted-foreground">Учёт доходов и расходов</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start gap-0.5 sm:items-end">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Текущий баланс</span>
            <span className={cn("text-2xl font-bold tabular-nums", balance >= 0 ? "text-income" : "text-expense")}>
              {hydrated ? formatMoney(balance) : "—"}
            </span>
          </div>
        </div>
      </header>

      <StatsSection transactions={transactions} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-6">
          <TrendChart transactions={transactions} />
          <CategoryPie transactions={transactions} />
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold">Новая операция</h2>
            <TransactionForm onAdd={addTransaction} />
          </div>
        </aside>
      </div>

      <TransactionList transactions={transactions} onRemove={removeTransaction} />
    </div>
  );
}
