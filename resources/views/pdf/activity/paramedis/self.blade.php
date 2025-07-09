<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paramedis Report</title>
</head>

<body>
    <h1>Laporan Pemeriksaan Paramedis</h1>

    <p>Total Pasien yang Diperiksa: {{ $totalPatients }}</p>
    <p>Total Pasien yang Sehat: {{ $healthyPatientsCount }}</p>
    <p>Total Pasien Membutuhkan Dokter: {{ $sickPatientsCount }}</p>
    <p>Total Pasien Membutuhkan pendamping: {{ $needPatientsCount }}</p>

    <h2>Daftar Pasien yang Diperiksa</h2>
    <table border="1" cellpadding="5">
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Pasien</th>
                <th>Status Kesehatan</th>
                <th>Tanggal Lahir</th>
                <th>Jenis Kelamin</th>
            </tr>
        </thead>
        <tbody>
    @foreach ($patients as $patient)
    <tr>
        <td>{{ $loop->iteration }}</td> <!-- Tambahkan Nomor Urut -->
        <td>{{ $patient['name'] }}</td>
        <td>
            @if ($patient['health_status'] === 'healthy')
                Sehat
            @elseif ($patient['health_status'] === 'butuh_dokter')
                Membutuhkan Dokter
            @elseif ($patient['health_status'] === 'butuh_pendamping')
                Membutuhkan pendamping
            @else
                Status Tidak Diketahui
            @endif
        </td>
        <td>{{ $patient['date_of_birth'] }}</td>
        <td>{{ $patient['gender'] }}</td>
    </tr>
    @endforeach
</tbody>

    </table>
</body>

</html>