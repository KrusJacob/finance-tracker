"use client"

import { useCallback, useEffect, useState } from "react"
import type { Transaction } from "./types"

const STORAGE_KEY = "finance-tracker:transactions:v1"

function loadFromStorage(): Transaction[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Transaction[]
  } catch {
    return []
  }
}

function saveToStorage(transactions: Transaction[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  } catch {
    // ignore write errors (e.g. private mode / quota)
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load once on mount (client only) so the app works fully offline.
  useEffect(() => {
    setTransactions(loadFromStorage())
    setHydrated(true)
  }, [])

  // Persist on every change after hydration.
  useEffect(() => {
    if (hydrated) saveToStorage(transactions)
  }, [transactions, hydrated])

  // Keep multiple open tabs in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setTransactions(loadFromStorage())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const addTransaction = useCallback((t: Omit<Transaction, "id" | "createdAt">) => {
    const newTransaction: Transaction = {
      ...t,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setTransactions((prev) =>
      [newTransaction, ...prev].sort((a, b) => b.date.localeCompare(a.date)),
    )
  }, [])

  const removeTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearAll = useCallback(() => setTransactions([]), [])

  return { transactions, hydrated, addTransaction, removeTransaction, clearAll }
}
