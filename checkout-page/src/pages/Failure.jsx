import '../styles/Failure.css'

export default function Failure({ paymentData, onRetry }) {
  return (
    <div data-test-id="error-state" className="failure-wrapper">
      <div className="failure-card">
        <div className="failure-icon">❌</div>
        <h1>Payment Failed</h1>
        <span data-test-id="error-message">
          {paymentData?.error_description || 'Payment could not be processed'}
        </span>
        
        <div className="error-details">
          <div>
            <label>Error Code</label>
            <span>{paymentData?.error_code}</span>
          </div>
          <div>
            <label>Order ID</label>
            <span className="mono">{paymentData?.order_id}</span>
          </div>
        </div>

        <button onClick={onRetry} data-test-id="retry-button" className="btn-retry">
          Try Again
        </button>
      </div>
    </div>
  )
}
