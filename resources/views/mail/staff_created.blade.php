<!DOCTYPE html>
<html>
<head>
    <title>Your Account Details</title>
</head>
<body>
    <h1>Hello, {{ $name }}</h1>
    <p>Your account has been created successfully. Below are your account details:</p>
    <ul>
        <li>Email: {{ $email }}</li>
        <li>Password: {{ $password }}</li>
    </ul>
    <p>Please change your password after your first login.</p>
    <p>Thank you!</p>
</body>
</html>
