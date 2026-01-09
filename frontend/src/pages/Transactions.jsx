import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Transactions.css'

export default function Transactions() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [merchant, setMerchant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login')
      return
    }
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const merchantRes = await fetch('http://localhost:8000/api/v1/test/merchant')
      const merchantData = await merchantRes.json()
      setMerchant(merchantData)

      const paymentsRes = await fetch('http://localhost:8000/api/v1/payments', {
        headers: {
          'X-Api-Key': merchantData.api_key,
          'X-Api-Secret': merchantData.api_secret
        }
      })
      const paymentsData = await paymentsRes.json()
      setTransactions(paymentsData || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getStatusBadge = (status) => {
    const badges = {
      'success': '✅ Success',
      'failed': '❌ Failed',
      'processing': '⏳ Processing'
    }
    return badges[status] || status
  }

  if (loading) return <div className="loading">Loading transactions...</div>

  return (
    <div className="transactions-wrapper">
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/dashboard" className="btn-back">← Dashboard</Link>
          <h1>📊 Transactions</h1>
        </div>
        <div className="nav-right">
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="transactions-content">
        <div className="transactions-inner">
          {transactions.length === 0 ? (
            <div className="empty-state">
              <p>📭 No transactions yet</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table data-test-id="transactions-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} data-test-id="transaction-row" data-payment-id={tx.id}>
                      <td data-test-id="payment-id" className="mono">{tx.id}</td>
                      <td data-test-id="order-id" className="mono">{tx.order_id}</td>
                      <td data-test-id="amount">₹{(tx.amount / 100).toFixed(2)}</td>
                      <td data-test-id="method" className="uppercase">{tx.method}</td>
                      <td data-test-id="status">
                        <span className={`badge badge-${tx.status}`}>
                          {getStatusBadge(tx.status)}
                        </span>
                      </td>
                      <td data-test-id="created-at">{formatDate(tx.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}