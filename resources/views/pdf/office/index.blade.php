<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Pembayaran</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        h2, h3 {
            text-align: center;
        }
    </style>
</head>
<body>
    <h2>Laporan Pembayaran Klinik Gunung</h2>
    <h3>Total Pemasukan: Rp {{ number_format($totalIncome, 0, ',', '.') }}</h3>
    <h3>Total Pemasukan dari Pembelian Obat: Rp {{ number_format($totalMedicineIncome, 0, ',', '.') }}</h3>
    <h4>Jumlah Transaksi Berhasil: {{ $successfulTransactions }}</h4>
    <h4>Tanggal Pembayaran Terbaru: {{ $lastPaymentDate }}</h4>

    <table>
        <thead>
            <tr>
                <th>Nama Pasien</th>
                <th>Obat</th>
                <th>Jumlah Obat</th>
                <th>Pemasukan Obat</th>
                <th>Pembayaran Screening</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($paymentsDetails as $payment)
                <tr>
                    <td>{{ $payment->patient_name }}</td>
                    <td>{{ $payment->medicine_details }}</td>
                    <td>{{ $payment->quantity_details }}</td>
                    <td>Rp {{ number_format($payment->medicine_income, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($payment->amount_paid, 0, ',', '.') }}</td>
                    <td>{{ $payment->formatted_date }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
