<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Klinik Gunung - Health Screening Certificate</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }

        body {
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            padding: 2rem;
        }

        .container {
            width: 100%;
            max-width: 800px;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        .header {
            background-color: #2a4595;
            color: white;
            padding: 2rem;
            position: relative;
            overflow: hidden;
        }

        .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
            background-image: url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/01_KG_SPKP-B9hLQgxdysSU0uyft5onRzVJKqxAd5.png');
            background-position: bottom;
            background-size: cover;
            opacity: 0.1;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            font-weight: bold;
        }

        .no-field {
            background: white;
            padding: 0.5rem;
            margin: 1rem 0;
        }

        .no-field input {
            width: 100%;
            border: none;
            padding: 0.25rem;
            font-size: 1rem;
        }

        .title {
            color: white;
            margin-top: 2rem;
        }

        .title h2 {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
        }

        .title h3 {
            font-size: 1.1rem;
            font-style: italic;
            font-weight: normal;
        }

        .form-content {
            padding: 2rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-row {
            display: flex;
            gap: 2rem;
            margin-bottom: 1.5rem;
        }

        .form-field {
            flex: 1;
        }

        .label-group {
            margin-bottom: 0.25rem;
        }

        .label-indo {
            display: block;
            color: #2a4595;
            font-weight: bold;
        }

        .label-separator {
            display: block;
            width: 100%;
            height: 1px;
            background-color: #2a4595;
            margin: 2px 0;
        }

        .label-eng {
            display: block;
            color: #666;
            font-size: 0.875rem;
            font-style: italic;
        }

        input, textarea {
            width: 100%;
            padding: 0.5rem 0;
            border: none;
            border-bottom: 1px solid #2a4595;
            font-size: 1rem;
            outline: none;
            margin-top: 0.5rem;
        }

        .measurements {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid;
        }

        .measurements h3 {
            color: #2a4595;
            margin-bottom: 0.5rem;
        }

        .measurements .sublabel {
            margin-bottom: 2rem;

            
        }

        .footer {
            padding: 2rem;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .qr-code {
            width: 120px;
            height: 120px;
        }

        .qr-code img {
            width: 100%;
            height: 100%;
        }

        .contact-info {
            text-align: left;
            color: #666;
            margin-left: 1rem;
        }

        .contact-info a {
            color: #2a4595;
            text-decoration: none;
            display: block;
            margin-top: 0.25rem;
            font-size: 0.9rem;
        }

        .signature-date {
            text-align: right;
            margin-top: 2rem;
            padding-right: 2rem;
        }

        .final-note {
            margin: 2rem 0;
            font-style: italic;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>KLINIK GUNUNG</h1>
            <div class="no-field">
            <label for="no" style="color: black;">No.</label>
            </div>
            <div class="title">
                <h2>SURAT PEMERIKSAAN KESEHATAN PENDAKIAN</h2>
                <h3>TREKKING HEALTH SCREENING CERTIFICATE</h3>
            </div>
        </div>

        <div class="form-content">
            <div class="form-group">
                <p>Saya yang bertanda tangan di bawah ini menerangkan bahwa:</p>
                <p class="sublabel">I hereby state that:</p>
            </div>

            <div class="form-group">
                <div class="label-group">
                    <span class="label-indo">Nama</span> Sandi Maulana Fauzan
                    <span class="label-separator"></span>
                    <span class="label-eng">Name</span>
                </div>
            </div>

            <div class="form-row">
                <div class="form-field">
                    <div class="label-group">
                        <span class="label-indo">Umur</span>
                        <span class="label-separator"></span>
                        <span class="label-eng">Age</span>
                    </div>
                </div>
                <div class="form-field">
                    <div class="label-group">
                        <span class="label-indo">Pekerjaan</span>
                        <span class="label-separator"></span>
                        <span class="label-eng">Occupation</span>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <div class="label-group">
                    <span class="label-indo">Alamat</span>
                    <span class="label-separator"></span>
                    <span class="label-eng">Address</span>
                </div>

            </div>

            <div class="measurements">
                <h3>Direkomendasi dengan catatan khusus</h3>
                <p class="sublabel">Untuk aktivitas pendakian gunung. / For trekking activity</p>

                <div class="form-row">
                    <div class="form-field">
                        <div class="label-group">
                            <span class="label-indo">Berat Badan</span>
                            <span class="label-separator"></span>
                            <span class="label-eng">Body Weight</span>
                        </div>
                    </div>
                    <div class="form-field">
                        <div class="label-group">
                            <span class="label-indo">Tekanan Darah</span>
                            <span class="label-separator"></span>
                            <span class="label-eng">Blood Pressure</span>
                        </div>
                    </div>
                    <div class="form-field">
                        <div class="label-group">
                            <span class="label-indo">Tinggi Badan</span>
                            <span class="label-separator"></span>
                            <span class="label-eng">Body Height</span>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="label-group">
                        <span class="label-indo">Keterangan</span>
                        <span class="label-separator"></span>
                        <span class="label-eng">Note</span>
                    </div>
                </div>
            </div>

            <div class="final-note">
                Surat keterangan ini dikeluarkan untuk dipergunakan sebagaimana mestinya.<br>
                This letter is for use of specified person only
            </div>

            <div class="signature-date">
                <p>, 20....</p>
            </div>
        </div>

        <div class="footer">
            <div class="qr-code">
                <img src="{{ asset('storage/pdf/qr.png') }}" alt="QR Code">
            </div>
            <div class="contact-info">
                <a href="mailto:contact@klinikgunung.id">contact@klinikgunung.id</a>
                <a href="http://www.klinikgunung.id">www.klinikgunung.id</a>
            </div>
        </div>
    </div>
</body>
</html>

