"use client"

import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Transaction } from "@/lib/types"
import { formatMoney, startOfMonth, startOfWeek, totalsForRange } from "@/lib/finance"

function StatBlock({
  title,
  transactions,
  from,
}: {
  title: string
  transactions: Transaction[]
  from?: Date
}) {
  const { income, expense, balance } = totalsForRange(transactions, from)
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              balance >= 0
                ? "bg-income/10 text-income"
                : "bg-expense/10 text-expense",
            )}
          >
            <Wallet className="size-3" />
            {formatMoney(balance)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUpRight className="size-3.5 text-income" />
              Доходы
            </span>
            <span className="text-lg font-semibold text-income tabular-nums">
              {formatMoney(income)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowDownRight className="size-3.5 text-expense" />
              Расходы
            </span>
            <span className="text-lg font-semibold text-expense tabular-nums">
              {formatMoney(expense)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsSection({ transactions }: { transactions: Transaction[] }) {
  return (
    <section aria-label="Статистика" className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatBlock title="За неделю" transactions={transactions} from={startOfWeek()} />
      <StatBlock title="За месяц" transactions={transactions} from={startOfMonth()} />
      <StatBlock title="За всё время" transactions={transactions} />
    </section>
  )
}
