"use client"

import { useState } from "react"
import { Plus, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { getCategories, type Transaction, type TransactionType } from "@/lib/types"

interface TransactionFormProps {
  onAdd: (t: Omit<Transaction, "id" | "createdAt">) => void
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function TransactionForm({ onAdd }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>("expense")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<string>(getCategories("expense")[0].id)
  const [note, setNote] = useState("")
  const [date, setDate] = useState(today())
  const [error, setError] = useState("")

  const categories = getCategories(type)

  function switchType(next: TransactionType) {
    setType(next)
    setCategory(getCategories(next)[0].id)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const numeric = Number.parseFloat(amount.replace(",", "."))
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setError("Введите сумму больше нуля")
      return
    }
    setError("")
    onAdd({
      type,
      amount: Math.round(numeric * 100) / 100,
      category,
      note: note.trim() || undefined,
      date,
    })
    setAmount("")
    setNote("")
    setDate(today())
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Type toggle */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
        <button
          type="button"
          onClick={() => switchType("expense")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            type === "expense"
              ? "bg-card text-expense shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-pressed={type === "expense"}
        >
          <TrendingDown className="size-4" />
          Расход
        </button>
        <button
          type="button"
          onClick={() => switchType("income")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            type === "income"
              ? "bg-card text-income shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-pressed={type === "income"}
        >
          <TrendingUp className="size-4" />
          Доход
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="amount">Сумма</Label>
        <div className="relative">
          <Input
            id="amount"
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pr-9 text-lg font-semibold"
            autoComplete="off"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="category">Категория</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Выберите категорию">
              {(value: string) => {
                const c = categories.find((item) => item.id === value)
                if (!c) return "Выберите категорию"
                return (
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.label}
                  </span>
                )
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                <span className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="date">Дата</Label>
          <Input
            id="date"
            type="date"
            value={date}
            max={today()}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="note">Заметка</Label>
          <Input
            id="note"
            placeholder="Необязательно"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full gap-2">
        <Plus className="size-4" />
        Добавить {type === "income" ? "доход" : "расход"}
      </Button>
    </form>
  )
}
