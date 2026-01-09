import '../styles/Success.css'

export default function Success({ paymentData, onRetry }) {
  return (
    <div data-test-id="success-state" className="success-wrapper">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1>Payment Successful!</h1>
        <p data-test-id="success-message">Your payment has been processed successfully</p>
        
        <div className="payment-details">
          <div>
            <label>Payment ID</label>
            <span data-test-id="payment-id" className="mono">{paymentData?.id}</span>
          </div>
          <div>
            <label>Order ID</label>
            <span className="mono">{paymentData?.order_id}</span>
          </div>
          <div>
            <label>Amount</label>
            <span>₹{(paymentData?.amount / 100).toFixed(2)}</span>
          </div>
          <div>
            <label>Method</label>
            <span>{paymentData?.method?.toUpperCase()}</span>
          </div>
          <div>
            <label>Status</label>
            <span className="status-badge">{paymentData?.status?.toUpperCase()}</span>
          </div>
        </div>

        <button onClick={onRetry} className="btn-new-payment">
          Make Another Payment
        </button>
      </div>
    </div>
  )
}
