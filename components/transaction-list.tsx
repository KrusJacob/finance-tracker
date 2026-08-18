"use client";

import { ArrowDownRight, ArrowUpRight, Receipt, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategory, type Transaction } from "@/lib/types";
import { formatMoney } from "@/lib/finance";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function TransactionList({
  transactions,
  onRemove,
}: {
  transactions: Transaction[];
  onRemove: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1">
        <CardTitle>История операций</CardTitle>
        <CardDescription>
          {transactions.length > 0 ? `Всего операций: ${transactions.length}` : "Операций пока нет"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground">
            <Receipt className="size-8 opacity-40" />
            <p className="text-sm">Добавьте доход или расход, чтобы увидеть историю.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1 max-h-[400px] overflow-auto scrollbar-thin">
            {transactions.map((t) => {
              const cat = getCategory(t.type, t.category);
              const isIncome = t.type === "income";
              return (
                <li
                  key={t.id}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60"
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full",
                      isIncome ? "bg-income/10 text-income" : "bg-expense/10 text-expense"
                    )}
                    aria-hidden
                  >
                    {isIncome ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="flex items-center gap-2 truncate font-medium">
                      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: cat?.color }} />
                      {cat?.label ?? t.category}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {formatDate(t.date)}
                      {t.note ? ` · ${t.note}` : ""}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "shrink-0 font-semibold tabular-nums",
                      isIncome ? "text-income" : "text-expense"
                    )}
                  >
                    {isIncome ? "+" : "−"}
                    {formatMoney(t.amount)}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 text-muted-foreground"
                    onClick={() => onRemove(t.id)}
                    aria-label="Удалить операцию"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
