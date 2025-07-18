

<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Surat Pemeriksaan Kesehatan Pendakian</title>
    <link href="https://fonts.cdnfonts.com/css/aller" rel="stylesheet">
    
    <style>
        @import url('https://fonts.cdnfonts.com/css/aller');

        @page {
            margin: 0;
            size: A5 portrait;
        }

        body {
            margin: 0;
            padding: 0;
            width: 148mm;
            height: 210mm;
            position: relative;
            background: url("{{ public_path('images/klinik_gunung.jpg') }}") no-repeat;
            background-size: 148mm 210mm;
            font-family: 'Aller', sans-serif
        }

        @font-face {
            font-family: 'Aller', sans-serif;
            font-weight: 400;
            src: url("https://fonts.cdnfonts.com/css/aller") format('truetype');
        }

        @font-face {
            font-family: 'Aller', sans-serif;
            font-weight: 600;
            src: url("https://fonts.cdnfonts.com/css/aller") format('truetype');
        }

        .field {
            position: absolute;
            color: #003366;
            font-size: 9pt;
            line-height: 1;
            white-space: nowrap;
            /* DEBUG: outline boxes while aligning */
            /* outline:1px dashed red; */
        }

        /* --- re-calibrated positions --- */
        .no {
            top: 22mm;
            left: 16mm;
            width: 80mm;
        }

        /* No. */
        .name {
            top: 55.2mm;
            left: 28mm;
            width: 120mm;
        }

        /* Nama */
        .age {
            top: 55.2mm;
            left: 95mm;
            width: 20mm;
        }

        /* Umur */
        .id_no {
            top: 67.3mm;
            left: 30mm;
            width: 120mm;
        }

        /* No. Identitas */
        .gender {
            top: 67.5mm;
            left: 110mm;
            width: 30mm;
        }

        /* Jenis Kelamin */
        .address {
            top: 80mm;
            left: 30mm;
            width: 160mm;
        }

        /* Alamat */
        .result_1 {
            top: 98mm;
            left: 9mm;
            font-size: 14pt;
        }

        /* ✓ Medically Fit */
        .result_2 {
            top: 102mm;
            left: 9mm;
            font-size: 14pt;
        }

        /* ✓ Fit with supervision */
        .result_3 {
            top: 106mm;
            left: 9mm;
            font-size: 14pt;
        }

        /* ✓ Not medically fit */
        .location {
            top: 218mm;
            left: 130mm;
            width: 60mm;
        }

        /* Ranupani */
        .year {
            top: 218mm;
            left: 185mm;
            width: 20mm;
        }

        /* 2025 */
        .sign_line {
            top: 226mm;
            left: 120mm;
            width: 70mm;
            border-top: 1px solid #003366;
        }
        .signature {
            position: absolute;
            top: 135mm;
            left: 73mm;
        }

        .pemeriksa {
            top: 164mm;
            left: 94mm;
            width: 30mm;
        }

        .qrcode {
            top: 144.5mm;
            left: 8.9mm;
            /* width: 40mm;
            height: 40mm; */
            text-align: center;
        }

        
        .qrcode img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>

<body>
    <div class="field no">
        {{ $medical_record_number ?? '-' }}/SKP/KGS/KUN/{{ $bulan_romawi ?? '-' }}/2025
    </div>
    <div class="field name">
        {{ ucwords(strtolower($screening->name ?? '-')) }}
    </div>
    <div class="field age">
        {{ $screening->age ?? '-' }}
    </div>
    <div class="field id_no">
        {{ $screening->nik ?? '-' }}
    </div>
    <div class="field gender">
        {{ ucwords(strtolower($screening->gender ?? '-')) }}
    </div>
    <div class="field address">
        {{ ucwords(strtolower($screening->address ?? '-')) }}
    </div>
    {{-- layak untuk mendaki / medically fit --}}
    <div class="field result_1">
        @if($screening->health_status === 'sehat')
            <span style="font-family: 'DejaVu Sans', Arial, sans-serif;">&#10003;</span>
        @endif
    </div>
    {{-- Layak dengan pendampingan medis / Fit with medical supervision --}}
    <div class="field result_2">
        @if(
        $screening->health_status === 'tidak_sehat' &&
        in_array(
            $screening->pendampingan ?? '',
            ['pendampingan_perawat', 'pendampingan_paramedis', 'pendampingan_dokter']
        )
    )
        <span style="font-family: 'DejaVu Sans', Arial, sans-serif;">&#10003;</span>
    @endif
    </div>
    {{-- Tidak layak untuk mendaki / Not medically fit --}}
    {{-- Tidak layak untuk mendaki / Not medically fit --}}
    <div class="field result_3">
        @if($screening->health_status === 'tidak_sehat' && empty($screening->pendampingan))
            <span style="font-family: 'DejaVu Sans', Arial, sans-serif;">&#10003;</span>
        @endif
    </div>

    <!-- QR Code Section -->
<div class="field qrcode">
    @if(!empty($screening->qr_code_path))
        <img src="{{ public_path($screening->qr_code_path) }}" alt="QR Code Verifikasi" style="width: 21.5mm; height: 21.5mm;" />
    @endif
</div>

    <div class="field pemeriksa">
    @if(isset($examiner_name))
        <span>{{ $examiner_name }}</span>
    @endif
    </div>


    @if(isset($examiner_signature_path) && $examiner_signature_path)
        <div class="field signature">
            <img src="{{ $examiner_signature_path }}" style="width: 90mm; height: auto;">
        </div>
    @endif
</body>

</html>