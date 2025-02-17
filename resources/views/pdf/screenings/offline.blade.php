<!DOCTYPE html>
<html>
<head>
    <title>Screening Detail</title>
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
        .details {
            margin-top: 30px;
        }
        .details th, .details td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        .details th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Screening Detail Pasien</h2>
            @if ($screening->physicalExaminations->isNotEmpty())
                <p>Status: {{ $screening->physicalExaminations->first()->health_status }}</p>
            @else
                <p>Status: Tidak ada data pemeriksaan fisik</p>
            @endif
        </div>
        <div class="details">
            <table>
                <tr>
                    <th>Nama</th>
                    <td>{{ $screening->name }}</td>
                </tr>
                <tr>
                    <th>Usia</th>
                    <td>{{ $screening->age }}</td>
                </tr>
            </table>

            <h3>Pemeriksaan Fisik:</h3>
            @if ($screening->physicalExaminations->isNotEmpty())
                <ul>
                    <li>Tekanan darah: {{ $screening->physicalExaminations->first()->blood_pressure }}</li>
                    <li>Detak Jantung: {{ $screening->physicalExaminations->first()->heart_rate }}</li>
                    <li>Saturasi Oksigen: {{ $screening->physicalExaminations->first()->oxygen_saturation }}</li>
                    <li>Frekuensi Napas: {{ $screening->physicalExaminations->first()->respiratory_rate }}</li>
                    <li>Suhu Tubuh: {{ $screening->physicalExaminations->first()->body_temperature }}</li>
                </ul>
            @else
                <p>Data pemeriksaan fisik tidak tersedia</p>
            @endif

            <h3>Penilaian fisik</h3>
            @if ($screening->physicalExaminations->isNotEmpty())
                <ul>
                    <li>Penilaian Fisik: {{ $screening->physicalExaminations->first()->physical_assessment}}</li>
                    <li>Alasan: {{ $screening->physicalExaminations->first()->reason}}</li>
                    <li>Saran Medis: {{ $screening->physicalExaminations->first()->medical_advice}}</li>
                </ul>
            @else
                <p>Data penilaian fisik tidak tersedia</p>
            @endif

        </div>
    </div>
</body>
</html>
