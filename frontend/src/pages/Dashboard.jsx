import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total_transactions: 0,
    total_amount: 0,
    success_rate: 0
  })
  const [merchant, setMerchant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const merchantRes = await fetch('http://localhost:8000/api/v1/test/merchant')
      const merchantData = await merchantRes.json()
      setMerchant(merchantData)

      const statsRes = await fetch('http://localhost:8000/api/v1/stats', {
        headers: {
          'X-Api-Key': merchantData.api_key,
          'X-Api-Secret': merchantData.api_secret
        }
      })
      const statsData = await statsRes.json()
      setStats(statsData)
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  if (loading) return <div className="loading">Loading dashboard...</div>

  return (
    <div className="dashboard-wrapper">
      <nav className="navbar">
        <div className="nav-left">
          <h1>💳 Payment Gateway</h1>
        </div>
        <div className="nav-right">
          <span className="user-email">{merchant?.email}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div data-test-id="dashboard" className="dashboard-inner">
          
          {/* API Credentials Section */}
          <section className="card">
            <h2>🔑 API Credentials</h2>
            <div data-test-id="api-credentials" className="credentials-grid">
              <div className="credential-item">
                <label>API Key</label>
                <div className="cred-display">
                  <span data-test-id="api-key" className="cred-value">{merchant?.api_key}</span>
                  <button 
                    onClick={() => copyToClipboard(merchant?.api_key)}
                    className="btn-copy"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
              <div className="credential-item">
                <label>API Secret</label>
                <div className="cred-display">
                  <span data-test-id="api-secret" className="cred-value">{merchant?.api_secret}</span>
                  <button 
                    onClick={() => copyToClipboard(merchant?.api_secret)}
                    className="btn-copy"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="card">
            <h2>📊 Dashboard Statistics</h2>
            <div data-test-id="stats-container" className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <label>Total Transactions</label>
                <div data-test-id="total-transactions" className="stat-value">
                  {stats.total_transactions}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <label>Total Amount</label>
                <div data-test-id="total-amount" className="stat-value">
                  ₹{(stats.total_amount / 100).toFixed(2)}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <label>Success Rate</label>
                <div data-test-id="success-rate" className="stat-value">
                  {stats.success_rate}%
                </div>
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <section className="card">
            <h2>🔗 Quick Navigation</h2>
            <div className="links">
              <Link to="/dashboard/transactions" className="btn-secondary">
                View All Transactions →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
