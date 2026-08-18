"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Transaction } from "@/lib/types";
import { dailySeries, formatMoney, monthlySeries } from "@/lib/finance";

const chartConfig = {
  salary: { label: "Зарплата", color: "var(--chart-1)" },
  expense: { label: "Расходы", color: "var(--chart-2)" },
  earnings: { label: "Подработка", color: "var(--chart-3)" },
  other_income: { label: "Прочее", color: "var(--chart-4)" },
} as const satisfies ChartConfig;

function compactMoney(value: number) {
  return new Intl.NumberFormat("ru-BY", {
    // notation: "compact",
    maximumFractionDigits: 0,
    style: "currency",
    currency: "BYN",
  })
    .format(value)
    .replace("Br", "");
}

export function TrendChart({ transactions }: { transactions: Transaction[] }) {
  const [range, setRange] = useState<"days" | "months">("days");

  const data = useMemo(
    () => (range === "days" ? dailySeries(transactions, 7) : monthlySeries(transactions, 6)),
    [transactions, range]
  );

  return (
    <Card className="h-full">
      <CardHeader className="flex sm:flex-row flex-col items-start justify-between gap-4 space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle>Доходы и расходы</CardTitle>
          <CardDescription>{range === "days" ? "Последние 7 дней" : "Последние 6 месяцев"}</CardDescription>
        </div>
        <Tabs value={range} onValueChange={(v) => setRange(v as "days" | "months")}>
          <TabsList>
            <TabsTrigger value="days">Неделя</TabsTrigger>
            <TabsTrigger value="months">Месяцы</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={8} />
            <YAxis tickLine={false} axisLine={false} width={52} tickFormatter={(v) => compactMoney(Number(v))} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label}
                      </span>
                      <span className="font-mono font-medium tabular-nums">{formatMoney(Number(value))}</span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {/* Доходы — stacked */}
            <Bar dataKey="salary" fill="var(--chart-1)" stackId="income" />
            <Bar dataKey="earnings" fill="var(--chart-3)" stackId="income" />
            <Bar dataKey="other_income" fill="var(--chart-4)" stackId="income" />

            {/* Расходы — обычный столбец */}
            <Bar dataKey="expense" fill="var(--chart-2)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
