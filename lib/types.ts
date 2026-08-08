import {
  Baby,
  Bus,
  Car,
  Cat,
  Clapperboard,
  Coffee,
  Coins,
  CreditCard,
  Gift,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Home,
  type LucideIcon,
  PiggyBank,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  Shapes,
  Smartphone,
  UserRound,
  Users,
  Wallet,
} from "lucide-react"

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
  /** chart token color, e.g. var(--chart-1) */
  color: string
  icon: LucideIcon
}

const CHART_TOKENS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
]

function withColors(items: Omit<Category, "color">[]): Category[] {
  return items.map((item, i) => ({
    ...item,
    color: CHART_TOKENS[i % CHART_TOKENS.length],
  }))
}

export const EXPENSE_CATEGORIES: Category[] = withColors([
  { id: "mom", label: "Мама", icon: UserRound },
  { id: "family", label: "Семья", icon: Users },
  { id: "food", label: "Продукты", icon: ShoppingCart },
  { id: "public_transport", label: "Обществ. транспорт", icon: Bus },
  { id: "personal_transport", label: "Личн. транспорт", icon: Car },
  { id: "cat", label: "Кот", icon: Cat },
  { id: "health", label: "Здоровье", icon: HeartPulse },
  { id: "bills", label: "Счета", icon: Receipt },
  { id: "cafe", label: "Кафе", icon: Coffee },
  { id: "phone", label: "Телефон", icon: Smartphone },
  { id: "education", label: "Обучение", icon: GraduationCap },
  { id: "home", label: "Дом", icon: Home },
  { id: "shopping", label: "Покупки", icon: ShoppingBag },
  { id: "children", label: "Дети", icon: Baby },
  { id: "gifts", label: "Подарки", icon: Gift },
  { id: "charity", label: "Благотвор.", icon: HandHeart },
  { id: "credit", label: "Кредит", icon: CreditCard },
  { id: "entertainment", label: "Развлечение", icon: Clapperboard },
  { id: "savings", label: "Сбережения", icon: PiggyBank },
  { id: "other_expense", label: "Другое", icon: Shapes },
])

export const INCOME_CATEGORIES: Category[] = withColors([
  { id: "salary", label: "Зарплата", icon: Wallet },
  { id: "other_income", label: "Прочее", icon: Coins },
])

export function getCategories(type: TransactionType): Category[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

export function getCategory(type: TransactionType, id: string): Category | undefined {
  return getCategories(type).find((c) => c.id === id)
}
