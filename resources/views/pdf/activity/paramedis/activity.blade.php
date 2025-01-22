<!DOCTYPE html>
<html>
<head>
    <title>Activity Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .summary {
            margin-top: 30px;
            margin-bottom: 20px;
        }
        .summary th, .summary td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        .summary th {
            background-color: #f2f2f2;
        }
        .patients-table {
            margin-top: 30px;
            width: 100%;
            border-collapse: collapse;
        }
        .patients-table th, .patients-table td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        .patients-table th {
            background-color: #f2f2f2;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Activity Report</h2>
        </div>

        <div class="summary">
            <table>
                <tr>
                    <th>Total Patients Examined</th>
                    <td>{{ $totalPatients }}</td>
                </tr>
                <tr>
                    <th>Patients Requiring Doctor</th>
                    <td>{{ $sickPatientsCount }}</td>
                </tr>
                <tr>
                    <th>Total Paramedics Involved</th>
                    <td>{{ $totalParamedis }}</td>
                </tr>
            </table>
        </div>

        <h3>Patient Details</h3>
        @if ($patients->isNotEmpty())
            <table class="patients-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Health Status</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                        <th>Examined By</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($patients as $patient)
                        <tr>
                            <td>{{ $patient['id'] }}</td>
                            <td>{{ $patient['name'] }}</td>
                            <td>{{ $patient['health_status'] }}</td>
                            <td>{{ $patient['date_of_birth'] }}</td>
                            <td>{{ $patient['gender'] }}</td>
                            <td>{{ $patient['examined_by'] }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No patient data available.</p>
        @endif
    </div>
</body>
</html>
