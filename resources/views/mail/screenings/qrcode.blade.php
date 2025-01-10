<!DOCTYPE html>
<html>
<head>
    <title>Your QR Code</title>
</head>
<body>
    <h1>Hello, {{ $name }}</h1>
    <p>Thank you for completing your screening. Here is your QR Code:</p>
    
    <!-- Embed QR Code as image -->
    <img src="{{ $qrCodeUrl }}" alt="Your QR Code" style="width: 300px; height: 300px;">

    <p>You can use this QR Code for your next step. If you have any questions, feel free to contact us.</p>
    
    <p>Thank you!</p>
</body>
</html>
