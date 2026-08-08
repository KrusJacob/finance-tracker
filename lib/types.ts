export type TransactionType = "income" | "expense"

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  note?: string
  date: string // ISO string (YYYY-MM-DD or full ISO)
  createdAt: string
}

export interface Category {
  id: string
  label: string
  /** chart token index 1..8 */
  color: string
}

export const EXPENSE_CATEGORIES: Category[] = [
  { id: "food", label: "Продукты", color: "var(--chart-2)" },
  { id: "cafe", label: "Кафе и рестораны", color: "var(--chart-4)" },
  { id: "transport", label: "Транспорт", color: "var(--chart-3)" },
  { id: "housing", label: "Жильё и счета", color: "var(--chart-6)" },
  { id: "entertainment", label: "Развлечения", color: "var(--chart-5)" },
  { id: "health", label: "Здоровье", color: "var(--chart-7)" },
  { id: "shopping", label: "Покупки", color: "var(--chart-1)" },
  { id: "other_expense", label: "Прочее", color: "var(--chart-8)" },
]

export const INCOME_CATEGORIES: Category[] = [
  { id: "salary", label: "Зарплата", color: "var(--chart-1)" },
  { id: "freelance", label: "Фриланс", color: "var(--chart-3)" },
  { id: "investments", label: "Инвестиции", color: "var(--chart-5)" },
  { id: "gifts", label: "Подарки", color: "var(--chart-4)" },
  { id: "other_income", label: "Прочее", color: "var(--chart-6)" },
]

export function getCategories(type: TransactionType): Category[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

export function getCategory(type: TransactionType, id: string): Category | undefined {
  return getCategories(type).find((c) => c.id === id)
}
