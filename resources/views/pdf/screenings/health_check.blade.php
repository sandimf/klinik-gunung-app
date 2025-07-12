{{-- <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Klinik Gunung - Health Screening Certificate</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        @page {
            size: A4 portrait;
            margin: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }

        body {
            display: flex;
            justify-content: center;
            padding: 0;
            margin: 0;
            font-size: 10pt;
        }

        .container {
            width: 100%;
            max-width: 800px;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #2a4595;
            color: white;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 100%;
            background-image: url('{{ asset("images/mountain-bg.jpg") }}');
background-position: bottom;
background-size: cover;
opacity: 0.3;
mix-blend-mode: overlay;
}

.header h1 {
font-size: 2.5rem;
margin-bottom: 0.5rem;
font-weight: bold;
position: relative;
z-index: 1;
}

.no-field {
background: white;
padding: 0.5rem;
margin: 0.5rem 0;
position: relative;
z-index: 1;
width: 100%;
}

.no-field label {
color: black;
font-weight: normal;
}

.title {
position: relative;
z-index: 1;
margin-top: 1rem;
}

.title h2 {
font-size: 1.5rem;
margin-bottom: 0.25rem;
}

.title h3 {
font-size: 1.25rem;
font-style: italic;
font-weight: normal;
}

.form-content {
padding: 1.5rem;
}

.form-group {
margin-bottom: 1rem;
}

.form-row {
display: flex;
gap: 1rem;
margin-bottom: 1rem;
}

.form-field {
flex: 1;
}

.label-indo {
display: block;
color: #2a4595;
font-weight: bold;
}

.label-eng {
display: block;
color: #666;
font-size: 0.875rem;
font-style: italic;
}

.form-field-line {
width: 100%;
height: 1px;
background-color: #2a4595;
margin-top: 0.5rem;
}

.measurements {
margin-top: 1.5rem;
padding-top: 0.5rem;
border-top: 1px solid #eee;
margin-bottom: 1rem;
}

.measurements h3 {
color: #2a4595;
font-size: 1.25rem;
margin-bottom: 0.25rem;
font-weight: bold;
}

.measurements .sublabel {
margin-bottom: 1rem;
color: #666;
font-style: italic;
}

.final-note {
margin: 1rem 0;
font-style: italic;
color: #666;
font-size: 0.9rem;
}

.signature {
display: flex;
justify-content: flex-end;
margin-top: 2rem;
margin-bottom: 1rem;
}

.signature-content {
text-align: right;
}

.signature-line {
width: 150px;
height: 1px;
background-color: #2a4595;
margin-top: 1.5rem;
}

.footer {
padding: 1rem;
border-top: 1px solid #eee;
display: flex;
justify-content: space-between;
align-items: flex-end;
}

.qr-code {
width: 100px;
height: 100px;
background-color: #f5f5f5;
}

.contact-container {
margin-top: 0.5rem;
}

.contact-info a {
display: block;
color: #2a4595;
text-decoration: none;
position: relative;
padding-left: 1rem;
margin-top: 0.25rem;
font-size: 0.9rem;
}

.contact-info a::before {
content: '●';
position: absolute;
left: 0;
color: #2a4595;
}

.logo {
width: 40px;
height: 40px;
background-color: #2a4595;
color: white;
font-weight: bold;
font-size: 1.5rem;
display: flex;
align-items: center;
justify-content: center;
}
</style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>KLINIK GUNUNG</h1>
            <div class="no-field">
                <label for="no">No.</label>
                <input type="text" style="border: none; width: 50%; background: transparent;">
            </div>
            <div class="title">
                <h2>SURAT PEMERIKSAAN KESEHATAN PENDAKIAN</h2>
                <h3>TREKKING HEALTH SCREENING CERTIFICATE</h3>
            </div>
        </div>

        <div class="form-content">
            <div class="form-group">
                <p>Saya yang bertanda tangan di bawah ini menerangkan bahwa:</p>
                <p style="font-style: italic; color: #666;">I hereby state that:</p>
            </div>

            <div class="form-group">
                <div>
                    <span class="label-indo">Nama</span>
                    @if(isset($screening->name))
                    {{ $screening->name }}
                    @endif
                    <div class="form-field-line"></div>
                    <span class="label-eng">Name</span>
                </div>
            </div>

            <div class="form-row">
                <div class="form-field">
                    <div>
                        <span class="label-indo">Umur</span>
                        @if(isset($screening->age))
                        {{ $screening->age }}
                        @endif
                        <div class="form-field-line"></div>
                        <span class="label-eng">Age</span>
                    </div>
                </div>
                <div class="form-field">
                    <div>
                        <span class="label-indo">Pekerjaan</span>
                        @if(isset($screening->occupation))
                        {{ $screening->occupation }}
                        @endif
                        <div class="form-field-line"></div>
                        <span class="label-eng">Occupation</span>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <div>
                    <span class="label-indo">Alamat</span>
                    @if(isset($screening->address))
                    {{ $screening->address }}
                    @endif
                    <div class="form-field-line"></div>
                    <span class="label-eng">Address</span>
                </div>
            </div>

            <div class="form-field-line" style="margin-top: 1.5rem;"></div>

            <div class="measurements">
                <h3>Direkomendasikan dengan catatan khusus</h3>
                <p class="sublabel">Untuk aktivitas pendakian gunung. / For trekking activity</p>

                <div class="form-row">
                    <div class="form-field">
                        <div>
                            <span class="label-indo">Berat Badan</span>
                            @if(isset($screening->weight))
                            {{ $screening->weight }}
                            @endif
                            <div class="form-field-line"></div>
                            <span class="label-eng">Body Weight</span>
                        </div>
                    </div>
                    <div class="form-field">
                        <div>
                            <span class="label-indo">Tekanan Darah</span>
                            @if(isset($screening->blood_pressure))
                            {{ $screening->blood_pressure }}
                            @endif
                            <div class="form-field-line"></div>
                            <span class="label-eng">Blood Pressure</span>
                        </div>
                    </div>
                    <div class="form-field">
                        <div>
                            <span class="label-indo">Tinggi Badan</span>
                            @if(isset($screening->height))
                            {{ $screening->height }}
                            @endif
                            <div class="form-field-line"></div>
                            <span class="label-eng">Body Height</span>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div>
                        <span class="label-indo">Keterangan</span>
                        @if(isset($screening->notes))
                        {{ $screening->notes }}
                        @endif
                        <div class="form-field-line"></div>
                        <span class="label-eng">Note</span>
                    </div>
                </div>
            </div>

            <div class="final-note">
                <p>Surat keterangan ini dikeluarkan untuk dipergunakan sebagaimana mestinya.</p>
                <p>This letter is for use of specified person only</p>
            </div>

            <div class="signature">
                <div class="signature-content">
                    <p>, 20....</p>
                    <div class="signature-line"></div>
                </div>
            </div>
        </div>

        <div class="footer">
            <div>
                <div class="qr-code">
                    <img src="{{ asset('images/qr-code.png') }}" alt="QR Code" width="100" height="100">
                </div>
                <div class="contact-container">
                    <div class="contact-info">
                        <a href="mailto:contact@klinikgunung.id">contact@klinikgunung.id</a>
                        <a href="http://www.klinikgunung.id">www.klinikgunung.id</a>
                    </div>
                </div>
            </div>
            <div class="logo">K</div>
        </div>
    </div>
</body>

</html> --}}

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
    </style>
</head>

<body>
    <div class="field no">
        1234567
    </div>
    <div class="field name">
        Sandi Maulana Fauzan
    </div>
    <div class="field age">
        18
    </div>
    <div class="field id_no">
        621521
    </div>
    <div class="field gender">
        Laki-laki
    </div>
    <div class="field address">
        Jl Desa Cipadung
    </div>
    <div class="field result_1">
        ✓ </div>
    <div class="field result_2">
        ✓
    </div>
    <div class="field result_3">
        ✓
    </div>
    <div class="field location">

    </div>
    <div class="field sign_line"></div>
</body>

</html>