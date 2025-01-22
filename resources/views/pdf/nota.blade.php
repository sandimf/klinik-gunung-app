<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nota Pembayaran</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: auto;
            border: 1px solid #ccc;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h1 {
            margin: 0;
        }

        .details {
            margin-bottom: 20px;
        }

        .details th,
        .details td {
            padding: 8px;
            text-align: left;
        }

        .details th {
            width: 150px;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .table th,
        .table td {
            padding: 8px;
            border: 1px solid #ccc;
            text-align: left;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
        }

        .footer p {
            margin: 5px 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Nota Pembayaran</h1>
            <p>No Transaksi: {{ $payment->no_transaction }}</p>
        </div>

        <div class="details">
            <table>
                <tr>
                    <th>Nama Pasien</th>
                    <td>{{ $patient->name }}</td>
                </tr>
                <tr>
                    <th>Kasir</th>
                    <td>{{ $cashier->name }}</td>
                </tr>
                <tr>
                    <th>Tanggal Pembayaran</th>
                    <td>{{ $payment->created_at->format('d-m-Y H:i') }}</td>
                </tr>
                <tr>
                    <th>Status Pembayaran</th>
                    <td>
                        @if ($payment->payment_status == 1)
                        Selesai
                        @else
                        {{ ucfirst($payment->payment_status) }}
                        @endif
                    </td>
                </tr>

            </table>
        </div>

        @if($product)
        <div class="product">
            <h3>Produk yang Dibeli:</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Nama Produk</th>
                        <th>Harga</th>
                        <th>Jumlah</th>
                        <th>Total Harga</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ $product->medicine->name }}</td>
                        <td>{{ number_format($product->price_product, 2, ',', '.') }}</td>
                        <td>{{ $payment->quantity_product }}</td>
                        <td>{{ number_format($payment->price_product * $payment->quantity_product, 2, ',', '.') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        @endif

        <div class="summary">
            <table>
                <tr>
                    <th>Total Pembayaran</th>
                    <td>{{ number_format($payment->amount_paid, 2, ',', '.') }}</td>
                </tr>
                <tr>
                    <th>Metode Pembayaran</th>
                    <td>{{ ucfirst($payment->payment_method) }}</td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p>Terima kasih atas pembayaran Anda.</p>
            <p>Harap simpan nota ini sebagai bukti transaksi.</p>
        </div>
    </div>
</body>

</html>