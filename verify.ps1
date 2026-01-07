$baseUrl = "http://localhost:8000"
$apiKey = "key_test_abc123"
$apiSecret = "secret_test_xyz789"

function Test-Endpoint {
    param($Method, $Uri, $Body, $Headers)
    Write-Host "Testing $Method $Uri" -ForegroundColor Cyan
    try {
        $params = @{
            Method = $Method
            Uri = "$baseUrl$Uri"
            ContentType = "application/json"
        }
        if ($Body) { $params.Body = $Body }
        if ($Headers) { $params.Headers = $Headers }

        $response = Invoke-RestMethod @params
        Write-Host "Success" -ForegroundColor Green
        return $response
    } catch {
        Write-Host "Failed: $_" -ForegroundColor Red
        if ($_.Exception.Response) {
             # Read stream
             $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
             $reader.ReadToEnd()
        }
    }
}

# 1. Health
Test-Endpoint -Method GET -Uri "/health"

# 2. Test Merchant
$merchant = Test-Endpoint -Method GET -Uri "/api/v1/test/merchant"
Write-Host "Merchant: $($merchant.email)"

# 3. Create Order
$headers = @{
    "X-Api-Key" = $apiKey
    "X-Api-Secret" = $apiSecret
}
$orderBody = @{
    amount = 50000
    currency = "INR"
    receipt = "rec_123"
} | ConvertTo-Json

$order = Test-Endpoint -Method POST -Uri "/api/v1/orders" -Body $orderBody -Headers $headers
Write-Host "Order Created: $($order.id)"

# 4. Get Order
Test-Endpoint -Method GET -Uri "/api/v1/orders/$($order.id)" -Headers $headers

# 5. Public Order
Test-Endpoint -Method GET -Uri "/api/v1/orders/$($order.id)/public"

# 6. List Payments (Should be empty initially)
Test-Endpoint -Method GET -Uri "/api/v1/payments" -Headers $headers

# 7. Create Payment (Processing)
# Note: This will wait 5-10s
$paymentBody = @{
    order_id = $order.id
    method = "upi"
    vpa = "user@upi"
} | ConvertTo-Json

Write-Host "Creating Payment (Waiting for simulation)..."
$payment = Test-Endpoint -Method POST -Uri "/api/v1/payments" -Body $paymentBody -Headers $headers
Write-Host "Payment Status: $($payment.status)"

# 8. Stats
Test-Endpoint -Method GET -Uri "/api/v1/stats" -Headers $headers
