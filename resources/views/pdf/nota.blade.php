
<style>
    body {
        font-family: monospace;
        font-size: 10px;
        width: 58mm;
        margin: 0 auto;
        padding: 5px;
        background: white;
        color: red;
    }
        @page {
        margin: 0;
        size: 58mm auto;
    }

    .invoice-container {
        width: 100%;
    }

    .header,
    .footer,
    .total {
        text-align: center;
        margin-bottom: 8px;
    }

    .header h1,
    .header h2 {
        margin: 0;
        font-size: 12px;
    }

    .header p,
    .footer p {
        margin: 2px 0;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px;
    }

    th,
    td {
        text-align: left;
        padding: 2px 0;
        border-bottom: 1px dashed red;
    }

    th {
        font-weight: bold;
        font-size: 9px;
    }

    td {
        font-size: 9px;
    }

    .total p {
        /* text-align: right; */
        /* margin: 2px 0; */
    }

    .thank-you {
        font-weight: bold;
        margin-top: 4px;
    }

    @media print {
        body {
            margin: 0;
        }
    }
</style>

<div class="invoice-container">
    <div class="header">
        <h1>KLINIK GUNUNG</h1>
        <h2>INVOICE</h2>
        <p>{{ $payment->id }}-{{ $payment->created_at->format('m') }}-{{ $payment->created_at->format('Y') }}</p>
        <p>Pelanggan: {{ $patient->name }}</p>
        <p>Telephone: {{ $patient->contact }}</p>
    </div>

    <table>
         @php $no = 1; @endphp
            @if(!empty($groupedItems['services']))
                @foreach($groupedItems['services'] as $service)
                <tr>
                    <td >{{ $service['quantity'] }}</td>
                    <td>{{ $service['item_name'] }}</td>
                    <td >Rp {{ number_format($service['price'], 0, ',', '.') }}</td>
                    {{-- <td >Rp {{ number_format($service['total'], 0, ',', '.') }}</td> --}}
                </tr>
                @endforeach
            @endif

    @if(!empty($groupedItems['medicines']))
                @foreach($groupedItems['medicines'] as $medicine)
                <tr>
                    <td>{{ $medicine['quantity'] }}</td>
                    <td>{{ $medicine['item_name'] }}</td>
                    <td class="text-right">Rp {{ number_format($medicine['price'], 0, ',', '.') }}</td>
                    {{-- <td>Rp {{ number_format($medicine['total'], 0, ',', '.') }}</td> --}}
                </tr>
                @endforeach
            @endif
    @if(!empty($groupedItems['products']))
        @foreach($groupedItems['products'] as $product)
        <tr>
            <td>{{ $product['quantity'] }}</td>
            <td>{{ $product['item_name'] }}</td>
            <td class="text-right">Rp {{ number_format($product['price'], 0, ',', '.') }}</td>
        </tr>
        @endforeach
    @endif
    </table>

    <div class="total">
        <p>Subtotal: Rp. {{ number_format($totals['grand_total'], 0, ',', '.') }}</p>
        {{-- <p>Diskon: Rp. 26.000</p> --}}
        <p><strong>Total: Rp. {{ number_format($totals['grand_total'], 0, ',', '.') }}</strong></p>
    </div>

    <div class="footer">
        <p>Terima kasih</p>
        <p class="thank-you">YOUR ADVENTURE PARTNER</p>
    </div>
</div>
