import { useState, useEffect } from 'react'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import Failure from './pages/Failure'
import './App.css'

function App() {
  const [page, setPage] = useState('checkout')
  const [paymentData, setPaymentData] = useState(null)

  const handlePaymentSuccess = (data) => {
    setPaymentData(data)
    setPage('success')
  }

  const handlePaymentFailure = (data) => {
    setPaymentData(data)
    setPage('failure')
  }

  const handleRetry = () => {
    setPage('checkout')
    setPaymentData(null)
  }

  return (
    <div className="app">
      {page === 'checkout' && (
        <Checkout 
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />
      )}
      {page === 'success' && (
        <Success 
          paymentData={paymentData}
          onRetry={handleRetry}
        />
      )}
      {page === 'failure' && (
        <Failure 
          paymentData={paymentData}
          onRetry={handleRetry}
        />
      )}
    </div>
  )
}

export default App
