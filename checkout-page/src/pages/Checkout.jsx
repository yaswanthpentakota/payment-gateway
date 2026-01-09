import { useState, useEffect } from 'react'
import '../styles/Checkout.css'

export default function Checkout({ onSuccess, onFailure }) {
  const [orderId, setOrderId] = useState(null)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [processing, setProcessing] = useState(false)

  // UPI Form State
  const [vpa, setVpa] = useState('')

  // Card Form State
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [holderName, setHolderName] = useState('')

  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const oid = params.get('order_id')
    if (oid) {
      setOrderId(oid)
      fetchOrder(oid)
    } else {
      setError('No order ID provided')
    }
  }, [])

  const fetchOrder = async (oid) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/orders/${oid}/public`)
      const data = await res.json()
      setOrder(data)
    } catch (err) {
      setError('Failed to fetch order: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setError('')

    try {
      let payload = {
        order_id: orderId,
        method: selectedMethod
      }

      if (selectedMethod === 'upi') {
        if (!vpa.trim()) {
          setError('Please enter VPA')
          setProcessing(false)
          return
        }
        payload.vpa = vpa
      } else {
        if (!cardNumber.trim() || !expiry.trim() || !cvv.trim() || !holderName.trim()) {
          setError('Please fill all card details')
          setProcessing(false)
          return
        }
        const [month, year] = expiry.split('/')
        payload.card = {
          number: cardNumber.replace(/\s/g, ''),
          expiry_month: month,
          expiry_year: year,
          cvv: cvv,
          holder_name: holderName
        }
      }

      const res = await fetch('http://localhost:8000/api/v1/payments/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const payment = await res.json()

      // Poll for payment status
      let attempts = 0
      const maxAttempts = 30
      const interval = setInterval(async () => {
        attempts++
        const statusRes = await fetch(`http://localhost:8000/api/v1/payments/${payment.id}/public`)
        const statusData = await statusRes.json()

        if (statusData.status === 'success' || statusData.status === 'failed' || attempts >= maxAttempts) {
          clearInterval(interval)
          setProcessing(false)
          if (statusData.status === 'success') {
            onSuccess(statusData)
          } else {
            onFailure(statusData)
          }
        }
      }, 1000)
    } catch (err) {
      setError('Payment failed: ' + err.message)
      setProcessing(false)
    }
  }

  if (loading) return <div className="loading">Loading checkout...</div>

  return (
    <div data-test-id="checkout-container" className="checkout-wrapper">
      <div className="checkout-card">
        
        {/* Order Summary */}
        <div data-test-id="order-summary" className="order-section">
          <h1>💳 Complete Payment</h1>
          <div className="order-details">
            <div>
              <span>Amount:</span>
              <span data-test-id="order-amount" className="amount">
                ₹{order ? (order.amount / 100).toFixed(2) : '0.00'}
              </span>
            </div>
            <div>
              <span>Order ID:</span>
              <span data-test-id="order-id" className="mono">{orderId}</span>
            </div>
            <div>
              <span>Status:</span>
              <span>{order?.status || 'unknown'}</span>
            </div>
          </div>
        </div>

        {/* Method Selection */}
        <div data-test-id="payment-methods" className="methods-section">
          <h2>Select Payment Method</h2>
          <div className="method-buttons">
            <button
              data-test-id="method-upi"
              data-method="upi"
              onClick={() => setSelectedMethod('upi')}
              className={`method-btn ${selectedMethod === 'upi' ? 'active' : ''}`}
            >
              📱 UPI
            </button>
            <button
              data-test-id="method-card"
              data-method="card"
              onClick={() => setSelectedMethod('card')}
              className={`method-btn ${selectedMethod === 'card' ? 'active' : ''}`}
            >
              💳 Card
            </button>
          </div>
        </div>

        {!processing ? (
          <>
            {/* UPI Form */}
            {selectedMethod === 'upi' && (
              <form data-test-id="upi-form" onSubmit={handlePayment} className="payment-form">
                <h2>UPI Payment</h2>
                <div className="form-group">
                  <label htmlFor="vpa">UPI ID</label>
                  <input
                    id="vpa"
                    data-test-id="vpa-input"
                    type="text"
                    placeholder="username@bank"
                    value={vpa}
                    onChange={(e) => setVpa(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="error">{error}</div>}
                <button
                  type="submit"
                  data-test-id="pay-button"
                  className="btn-pay"
                >
                  Pay ₹{order ? (order.amount / 100).toFixed(2) : '0.00'}
                </button>
              </form>
            )}

            {/* Card Form */}
            {selectedMethod === 'card' && (
              <form data-test-id="card-form" onSubmit={handlePayment} className="payment-form">
                <h2>Card Payment</h2>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    id="cardNumber"
                    data-test-id="card-number-input"
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                    maxLength="19"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiry">Expiry</label>
                    <input
                      id="expiry"
                      data-test-id="expiry-input"
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      id="cvv"
                      data-test-id="cvv-input"
                      type="text"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="holderName">Name on Card</label>
                  <input
                    id="holderName"
                    data-test-id="cardholder-name-input"
                    type="text"
                    placeholder="Name on Card"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="error">{error}</div>}
                <button
                  type="submit"
                  data-test-id="pay-button"
                  className="btn-pay"
                >
                  Pay ₹{order ? (order.amount / 100).toFixed(2) : '0.00'}
                </button>
              </form>
            )}
          </>
        ) : (
          <div data-test-id="processing-state" className="processing">
            <div className="spinner"></div>
            <span data-test-id="processing-message">Processing payment...</span>
          </div>
        )}
      </div>
    </div>
  )
}
