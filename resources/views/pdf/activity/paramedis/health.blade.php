<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Pemeriksaan Kesehatan</title>
</head>
<body>
    <h1>Laporan Pemeriksaan Kesehatan Pasien</h1>

    <p><strong>Nama Pasien:</strong> {{ $screening->name }}</p>
    <p><strong>Nomor Identitas:</strong> {{ $screening->nik }}</p>
    <p><strong>Tanggal Lahir:</strong> {{ $screening->date_of_birth }}</p>
    <p><strong>Jenis Kelamin:</strong> {{ $screening->gender }}</p>

    <h2>Riwayat Pemeriksaan Fisik</h2>
    <table border="1" cellpadding="5">
        <thead>
            <tr>
                <th>ID Pemeriksaan</th>
                <th>Status Kesehatan</th>
                <th>Tekanan Darah</th>
                <th>Denyut Jantung</th>
                <th>Saturasi Oksigen</th>
                <th>Nama Paramedis</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($examinations as $examination)
                <tr>
                    <td>{{ $examination->id }}</td>
                    <td>{{ $examination->health_status }}</td>
                    <td>{{ $examination->blood_pressure }}</td>
                    <td>{{ $examination->heart_rate }}</td>
                    <td>{{ $examination->oxygen_saturation }}</td>
                    <td>{{ $examination->paramedis->name ?? 'Tidak Diketahui' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
