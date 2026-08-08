import type { Transaction, TransactionType } from "./types"
import { getCategory } from "./types"

export interface Totals {
  income: number
  expense: number
  balance: number
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function startOfDay(d: Date): Date {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

/** Monday-based start of the current week. */
export function startOfWeek(now = new Date()): Date {
  const d = startOfDay(now)
  const day = (d.getDay() + 6) % 7 // 0 = Monday
  d.setDate(d.getDate() - day)
  return d
}

export function startOfMonth(now = new Date()): Date {
  const d = startOfDay(now)
  d.setDate(1)
  return d
}

export function totalsForRange(transactions: Transaction[], from?: Date): Totals {
  const fromTime = from ? from.getTime() : Number.NEGATIVE_INFINITY
  let income = 0
  let expense = 0
  for (const t of transactions) {
    if (new Date(t.date).getTime() < fromTime) continue
    if (t.type === "income") income += t.amount
    else expense += t.amount
  }
  return { income, expense, balance: income - expense }
}

/** Breakdown by category for a given type, sorted descending by amount. */
export function categoryBreakdown(
  transactions: Transaction[],
  type: TransactionType,
  from?: Date,
) {
  const fromTime = from ? from.getTime() : Number.NEGATIVE_INFINITY
  const map = new Map<string, number>()
  for (const t of transactions) {
    if (t.type !== type) continue
    if (new Date(t.date).getTime() < fromTime) continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  return Array.from(map.entries())
    .map(([categoryId, value]) => {
      const cat = getCategory(type, categoryId)
      return {
        categoryId,
        label: cat?.label ?? categoryId,
        color: cat?.color ?? "var(--chart-8)",
        value,
      }
    })
    .sort((a, b) => b.value - a.value)
}

/** Daily income/expense series for the last `days` days (oldest first). */
export function dailySeries(transactions: Transaction[], days = 14) {
  const today = startOfDay(new Date())
  const buckets: { key: string; label: string; income: number; expense: number }[] = []
  const index = new Map<string, number>()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const label = new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
    }).format(d)
    index.set(key, buckets.length)
    buckets.push({ key, label, income: 0, expense: 0 })
  }

  for (const t of transactions) {
    const key = new Date(t.date).toISOString().slice(0, 10)
    const idx = index.get(key)
    if (idx === undefined) continue
    if (t.type === "income") buckets[idx].income += t.amount
    else buckets[idx].expense += t.amount
  }

  return buckets
}

/** Monthly income/expense series for the last `months` months (oldest first). */
export function monthlySeries(transactions: Transaction[], months = 6) {
  const now = new Date()
  const buckets: { key: string; label: string; income: number; expense: number }[] = []
  const index = new Map<string, number>()

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const label = new Intl.DateTimeFormat("ru-RU", {
      month: "short",
      year: "2-digit",
    }).format(d)
    index.set(key, buckets.length)
    buckets.push({ key, label, income: 0, expense: 0 })
  }

  for (const t of transactions) {
    const d = new Date(t.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const idx = index.get(key)
    if (idx === undefined) continue
    if (t.type === "income") buckets[idx].income += t.amount
    else buckets[idx].expense += t.amount
  }

  return buckets
}
