import { useState } from "react"
import { InputCheckbox } from "../InputCheckbox"
import { TransactionPaneComponent } from "./types"
import { useTransactionsByEmployee } from "../../hooks/useTransactionsByEmployee"
import { usePaginatedTransactions } from "../../hooks/usePaginatedTransactions"


export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approved, setApproved] = useState(transaction.approved)

  const { setTransactionApprovalByEmployee } = useTransactionsByEmployee()
  const { setTransactionApprovalPaginated } = usePaginatedTransactions()

  const updateApprovalState = async (newValue: boolean) => {
    await consumerSetTransactionApproval({
      transactionId: transaction.id,
      newValue,
    })
  
    transaction.approved = newValue // Persist change in the transaction object
    setApproved(newValue) // Update UI state
  
    // Update the global transaction state
    setTransactionApprovalByEmployee(transaction.id, newValue)
    setTransactionApprovalPaginated(transaction.id, newValue)
  }


  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={async (newValue) => {
          await updateApprovalState(newValue)
        }}
      />
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
