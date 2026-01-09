import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (email === 'test@example.com') {
        localStorage.setItem('userEmail', email)
        localStorage.setItem('isLoggedIn', 'true')
        navigate('/dashboard')
      } else {
        setError('Please use test@example.com to login')
      }
    } catch (err) {
      setError('Login failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="title">💳 Payment Gateway</h1>
        <p className="subtitle">Merchant Dashboard</p>
        
        <form data-test-id="login-form" onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              data-test-id="email-input"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              data-test-id="password-input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            data-test-id="login-button"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="test-credentials">
          <h4>🧪 Test Credentials</h4>
          <p><strong>Email:</strong> test@example.com</p>
          <p><strong>Password:</strong> any value</p>
        </div>
      </div>
    </div>
  )
}
