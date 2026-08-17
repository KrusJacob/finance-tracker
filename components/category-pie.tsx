"use client"

import { useMemo, useState  } from "react"
import { Cell, Label, Pie, PieChart } from "recharts"
import { PieChart as PieIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { Transaction } from "@/lib/types"
import { categoryBreakdown, formatMoney } from "@/lib/finance"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Period = "week" | "month" | "year"

function getPeriodStart(period: Period) {
  const date = new Date()

  if (period === "week") {
    date.setDate(date.getDate() - 7)
  }

  if (period === "month") {
    date.setDate(date.getDate() - 30)
  }

  if (period === "year") {
    date.setDate(date.getDate() - 365)
  }

  date.setHours(0, 0, 0, 0)

  return date
}

export function CategoryPie({
  transactions,
}: {
  transactions: Transaction[]
}) {
  const [period, setPeriod] = useState<Period>("month")

  const filteredTransactions = useMemo(() => {
    const periodStart = getPeriodStart(period)

    return transactions.filter((transaction) => {
      // Если у тебя поле называется createdAt, замени transaction.date
      const transactionDate = new Date(transaction.date)

      return transactionDate >= periodStart
    })
  }, [transactions, period])

  const data = useMemo(
    () => categoryBreakdown(filteredTransactions, "expense"),
    [filteredTransactions],
  )

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data],
  )

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      value: {
        label: "Сумма",
      },
    }

    for (const item of data) {
      config[item.categoryId] = {
        label: item.label,
        color: item.color,
      }
    }

    return config
  }, [data])

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle>Расходы по категориям</CardTitle>

          <CardDescription>
            {period === "week" && "Последние 7 дней"}
            {period === "month" && "Последние 30 дней"}
            {period === "year" && "Последние 365 дней"}
          </CardDescription>
        </div>

        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as Period)}
        >
          <TabsList>
            <TabsTrigger value="week">Неделя</TabsTrigger>
            <TabsTrigger value="month">Месяц</TabsTrigger>
            <TabsTrigger value="year">Год</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <PieIcon className="size-8 opacity-40" />

            <p className="text-sm">
              За выбранный период расходов нет.
              <br />
              Добавьте первую трату.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[240px] w-full max-w-[240px]"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name) => (
                        <div className="flex w-full items-center justify-between gap-4">
                          <span className="text-muted-foreground">
                            {chartConfig[name as string]?.label ?? name}
                          </span>

                          <span className="font-mono font-medium tabular-nums">
                            {formatMoney(Number(value))}
                          </span>
                        </div>
                      )}
                    />
                  }
                />

                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="categoryId"
                  innerRadius={64}
                  outerRadius={100}
                  strokeWidth={2}
                  paddingAngle={2}
                >
                  {data.map((item) => (
                    <Cell
                      key={item.categoryId}
                      fill={item.color}
                      stroke="var(--card)"
                    />
                  ))}

                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !("cx" in viewBox)) {
                        return null
                      }

                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) - 8}
                            className="fill-muted-foreground text-xs"
                          >
                            Всего
                          </tspan>

                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 12}
                            className="fill-foreground text-base font-semibold"
                          >
                            {formatMoney(total)}
                          </tspan>
                        </text>
                      )
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            <ul className="flex flex-1 flex-col gap-2.5">
              {data.map((item) => {
                const percentage =
                  total > 0
                    ? Math.round((item.value / total) * 100)
                    : 0

                return (
                  <li
                    key={item.categoryId}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span
                      className="size-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />

                    <span className="flex-1 truncate text-foreground">
                      {item.label}
                    </span>

                    <span className="text-muted-foreground tabular-nums">
                      {percentage}%
                    </span>

                    <span className="w-24 text-right font-medium tabular-nums">
                      {formatMoney(item.value)}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// export function CategoryPie({ transactions }: { transactions: Transaction[] }) {
//   const data = useMemo(() => categoryBreakdown(transactions, "expense"), [transactions])

//   const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data])

//   const chartConfig = useMemo(() => {
//     const config: ChartConfig = { value: { label: "Сумма" } }
//     for (const d of data) {
//       config[d.categoryId] = { label: d.label, color: d.color }
//     }
//     return config
//   }, [data])

//   return (
//     <Card className="h-full">
//       <CardHeader className="flex flex-col gap-1">
//         <CardTitle>Расходы по категориям</CardTitle>
//         <CardDescription>На что уходят деньги</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {data.length === 0 ? (
//           <div className="flex h-[300px] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
//             <PieIcon className="size-8 opacity-40" />
//             <p className="text-sm">Пока нет расходов.<br />Добавьте первую трату.</p>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
//             <ChartContainer
//               config={chartConfig}
//               className="mx-auto aspect-square h-[240px] w-full max-w-[240px]"
//             >
//               <PieChart>
//                 <ChartTooltip
//                   content={
//                     <ChartTooltipContent
//                       hideLabel
//                       formatter={(value, name) => (
//                         <div className="flex w-full items-center justify-between gap-4">
//                           <span className="text-muted-foreground">
//                             {chartConfig[name as string]?.label ?? name}
//                           </span>
//                           <span className="font-mono font-medium tabular-nums">
//                             {formatMoney(Number(value))}
//                           </span>
//                         </div>
//                       )}
//                     />
//                   }
//                 />
//                 <Pie
//                   data={data}
//                   dataKey="value"
//                   nameKey="categoryId"
//                   innerRadius={64}
//                   outerRadius={100}
//                   strokeWidth={2}
//                   paddingAngle={2}
//                 >
//                   {data.map((d) => (
//                     <Cell key={d.categoryId} fill={d.color} stroke="var(--card)" />
//                   ))}
//                   <Label
//                     content={({ viewBox }) => {
//                       if (!viewBox || !("cx" in viewBox)) return null
//                       return (
//                         <text
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           textAnchor="middle"
//                           dominantBaseline="middle"
//                         >
//                           <tspan
//                             x={viewBox.cx}
//                             y={(viewBox.cy ?? 0) - 8}
//                             className="fill-muted-foreground text-xs"
//                           >
//                             Всего
//                           </tspan>
//                           <tspan
//                             x={viewBox.cx}
//                             y={(viewBox.cy ?? 0) + 12}
//                             className="fill-foreground text-base font-semibold"
//                           >
//                             {formatMoney(total)}
//                           </tspan>
//                         </text>
//                       )
//                     }}
//                   />
//                 </Pie>
//               </PieChart>
//             </ChartContainer>

//             <ul className="flex flex-1 flex-col gap-2.5">
//               {data.map((d) => {
//                 const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
//                 return (
//                   <li key={d.categoryId} className="flex items-center gap-3 text-sm">
//                     <span
//                       className="size-3 shrink-0 rounded-sm"
//                       style={{ backgroundColor: d.color }}
//                     />
//                     <span className="flex-1 truncate text-foreground">{d.label}</span>
//                     <span className="text-muted-foreground tabular-nums">{pct}%</span>
//                     <span className="w-24 text-right font-medium tabular-nums">
//                       {formatMoney(d.value)}
//                     </span>
//                   </li>
//                 )
//               })}
//             </ul>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }
