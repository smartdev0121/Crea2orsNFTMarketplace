import React, { useEffect, useState } from 'react'
import { TRANSACTION_TYPE } from 'src/config/global'

const ItemActivitySection = (props) => {
  const { transactions } = props

  const [transactionHistory, setTransactionHistory] = useState([])

  useEffect(() => {
    const res = transactions?.map((history) => {
      if (
        history.From === '0x0000000000000000000000000000000000000000' &&
        history.TransactionType === 3
      ) {
        return { ...history, Type: 'Minted', From: 'NullAddress' }
      }
      return { ...history, Type: TRANSACTION_TYPE[history.TransactionType] }
    })

    setTransactionHistory(res)
  }, [transactions])

  return (
    <table>
      <thead>
        <tr>
          <th>Event</th>
          <th>Price</th>
          <th>From</th>
          <th>To</th>
        </tr>
      </thead>
      <tbody>
        {transactionHistory?.map((transaction, index) => (
          <tr key={`transaction${index}`}>
            <td>{transaction.Type}</td>
            <td>{transaction.Price}</td>
            <td>{transaction.From}</td>
            <td>{transaction.To}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ItemActivitySection
