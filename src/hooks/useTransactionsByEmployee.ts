import { useCallback, useState } from "react"
import { RequestByEmployeeParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  const fetchById = useCallback(
    async (employeeId: string) => {
      if (!employeeId) {
        console.warn("Invalid employeeId, skipping request")
        return
      }
  
      const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
        "transactionsByEmployee",
        { employeeId }
      )
  
      setTransactionsByEmployee(data)
    },
    [fetchWithCache]
  )
  

  const setTransactionApprovalByEmployee = useCallback((transactionId: string, newValue: boolean) => {
    setTransactionsByEmployee((prev) =>
      prev ? prev.map((t) => (t.id === transactionId ? { ...t, approved: newValue } : t)) : prev
    )
  }, [])

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
  }, [])

  return { 
    data: transactionsByEmployee, 
    loading, 
    fetchById, 
    invalidateData, 
    setTransactionApprovalByEmployee
  } as TransactionsByEmployeeResult
  
}
