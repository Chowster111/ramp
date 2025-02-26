import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const fetchAll = useCallback(async () => {
    if (paginatedTransactions?.nextPage === null) {
      return
    }
  
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      { page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage }
    )
  
    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }
  
      return {
        data: [...previousResponse.data, ...response.data],
        nextPage: response.nextPage,
      }
    })
  }, [fetchWithCache, paginatedTransactions])
  

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  const setTransactionApprovalPaginated = useCallback((transactionId: string, newValue: boolean) => {
    setPaginatedTransactions((prev) =>
      prev
        ? { ...prev, data: prev.data.map((t) => (t.id === transactionId ? { ...t, approved: newValue } : t)) }
        : prev
    )
  }, [])
  
  return { 
    data: paginatedTransactions, 
    loading, 
    fetchAll, 
    invalidateData, 
    setTransactionApprovalPaginated 
  } as PaginatedTransactionsResult
  
}
