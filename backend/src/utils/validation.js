export const validateVPA = (vpa) => {
  if (!vpa) return false
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/
  return regex.test(vpa)
}

export const validateLuhn = (cardNumber) => {
  if (!cardNumber) return false
  const cleaned = cardNumber.replace(/[\s-]/g, '')
  if (!/^\d{13,19}$/.test(cleaned)) return false

  let sum = 0
  let shouldDouble = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10)
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }

  return (sum % 10) === 0
}

export const getCardNetwork = (cardNumber) => {
  if (!cardNumber) return 'unknown'
  const cleaned = cardNumber.replace(/[\s-]/g, '')

  if (/^4/.test(cleaned)) return 'visa'

  const mcPrefix = parseInt(cleaned.substring(0, 2), 10)
  if (mcPrefix >= 51 && mcPrefix <= 55) return 'mastercard'

  if (/^3[47]/.test(cleaned)) return 'amex'

  const rupayPrefix = parseInt(cleaned.substring(0, 2), 10)
  if (rupayPrefix === 60 || rupayPrefix === 65 || (rupayPrefix >= 81 && rupayPrefix <= 89)) return 'rupay'

  return 'unknown'
}

export const validateExpiry = (month, year) => {
  if (!month || !year) return false

  const m = parseInt(month, 10)
  let y = parseInt(year, 10)

  if (isNaN(m) || m < 1 || m > 12) return false

  if (y < 100) {
    y += 2000
  }

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  if (y < currentYear) return false
  if (y === currentYear && m < currentMonth) return false

  return true
}
export const validateAmount = (amount) => {
  return Number.isInteger(amount) && amount >= 100
}   
export const validateCurrency = (currency) => {
  const validCurrencies = ['USD', 'INR', 'EUR', 'GBP', 'JPY']
  return validCurrencies.includes(currency)
}
export const validatePaymentMethod = (method) => {
  const validMethods = ['vpa', 'card']
  return validMethods.includes(method)
}
export const validateCardDetails = (card) => {
  if (!card) return false   
    const { number, expiry_month, expiry_year, cvv, holder_name } = card
    if (!number || !expiry_month || !expiry_year || !cvv || !holder_name) {
      return false
    }  
    if (!validateLuhn(number)) {
      return false
    }
    if (!validateExpiry(expiry_month, expiry_year)) {
      return false
    }  
    return true                                 
}