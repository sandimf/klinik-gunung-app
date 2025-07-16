# QR Code System Documentation

## Overview

This system automatically generates QR codes for patients after their physical examination is completed. Each QR code contains a unique URL that provides access to the patient's medical data.

## How It Works

### 1. Physical Examination Process

When a paramedis completes a physical examination using `PhysicalExaminationController::store()`:

1. **Physical examination data is saved**
2. **Medical record is created**
3. **Patient status is updated**
4. **QR Code is automatically generated** (NEW)
5. **Print screening is executed**
6. **Notifications are sent**

### 2. QR Code Generation

The `QrCodeService` handles QR code generation:

-   **Unique Link**: A 64-character random string is generated for enhanced security
-   **Verification Token**: SHA256 hash for security
-   **Patient URL**: `{APP_URL}/api/patient-data/{unique_link}`
-   **QR Code**: Generated via external API (Node.js service) and **saved to Laravel storage**
-   **Filename**: `qr_patient_{id}_{name}_{timestamp}.png`
-   **Storage Location**: `storage/app/public/qr-codes/`
-   **Web Access**: `/storage/qr-codes/{filename}`

### 3. Database Storage

Three new columns are added to the `patients` table:

-   `qr_code_path`: Path to the generated QR code image
-   `unique_link`: Unique identifier for the patient data URL
-   `verification_token`: Security token for verification

### 4. API Endpoints

#### Patient Data Access (via QR Code)

```
GET /api/patient-data/{uniqueLink}
```

Returns complete patient data including:

-   Basic patient information
-   Physical examination results
-   Health status
-   Medical advice

#### QR Code Verification

```
GET /api/patient-data/verify/{uniqueLink}
```

Verifies if a QR code is valid without returning full data.

#### QR Code Image Access

```
GET /storage/qr-codes/{filename}
```

Direct access to the QR code image file stored in Laravel.

#### Test Endpoints (Development)

```
GET /api/test-qr/generate?patient_id=1
GET /api/test-qr/data/{uniqueLink}
```

## Configuration

### Environment Variables

Add to your `.env` file:

```
QR_API_URL=http://localhost:3001/api/qr
```

### External QR Code API

The system uses an external Node.js API for QR code generation with custom styling:

-   **URL**: `http://localhost:3001/api/qr`
-   **Method**: POST
-   **Payload**: `{"url": "patient_url", "filename": "custom_filename"}`

## Usage Example

### 1. Complete Physical Examination

When a paramedis submits a physical examination form, the system automatically:

-   Generates a unique URL like: `https://your-app.com/api/patient-data/abc123def456...`
-   Creates a QR code containing this URL
-   Saves the QR code image to storage
-   Updates the patient record with QR code information

### 2. Scan QR Code

Anyone scanning the QR code will be directed to the unique URL, which returns:

```json
{
    "success": true,
    "message": "Patient data retrieved successfully",
    "data": {
        "patient_id": 1,
        "name": "John Doe",
        "nik": "1234567890123456",
        "age": 30,
        "gender": "male",
        "health_status": "sehat",
        "physical_examinations": [
            {
                "examination_date": "2025-01-15T10:30:00Z",
                "paramedis_name": "Dr. Smith",
                "blood_pressure": "120/80",
                "heart_rate": 72,
                "health_status": "sehat"
            }
        ]
    }
}
```

## Security Features

1. **Unique Links**: Each patient has a unique 64-character identifier for enhanced security
2. **Verification Tokens**: Additional security layer with SHA256 hashing
3. **No Sensitive Data in QR**: QR code only contains the access URL, not actual patient data
4. **API-based Access**: Data is retrieved via secure API endpoints

## File Structure

```
app/
├── Services/
│   └── QrCodeService.php              # Main QR code generation service
├── Http/Controllers/
│   ├── Api/
│   │   └── PatientDataController.php  # API endpoints for patient data
│   ├── Roles/Paramedis/PhysicalExaminations/
│   │   └── PhysicalExaminationController.php  # Integrated QR generation
│   └── TestQrController.php           # Test endpoints
└── Models/Users/
    └── Patients.php                   # Updated with QR code fields

storage/app/public/
└── qr-codes/                         # QR code images stored here
    └── qr_patient_{id}_{name}_{timestamp}.png

database/migrations/
└── 2025_07_15_112329_add_qr_code_columns_to_patients_table.php

routes/
└── api.php                           # API routes for patient data access

config/
└── app.php                           # QR API URL configuration
```

## Testing

### Test QR Code Generation

```bash
curl "http://your-app.com/api/test-qr/generate?patient_id=5"
```

**Expected Response:**

```json
{
    "success": true,
    "qr_code_path": "/storage/qr-codes/qr_patient_5_mira-setiawan_20250715_182630.png",
    "unique_link": "wna5bX950hy71DldfM6XyNKjhEfePQk3Ejf6BS35bhwokQR7xFffxsbtYzNDovo6",
    "patient_url": "http://localhost:8000/api/patient-data/wna5bX950hy71DldfM6XyNKjhEfePQk3Ejf6BS35bhwokQR7xFffxsbtYzNDovo6",
    "filename": "qr_patient_5_mira-setiawan_20250715_182630.png",
    "full_local_path": "/path/to/storage/app/public/qr-codes/qr_patient_5_mira-setiawan_20250715_182630.png"
}
```

### Test Patient Data Retrieval

```bash
curl "http://your-app.com/api/patient-data/wna5bX950hy71DldfM6XyNKjhEfePQk3Ejf6BS35bhwokQR7xFffxsbtYzNDovo6"
```

### Test QR Code Image Access

```bash
curl -I "http://your-app.com/storage/qr-codes/qr_patient_5_mira-setiawan_20250715_182630.png"
```

### Test QR Code Verification

```bash
curl "http://your-app.com/api/patient-data/verify/wna5bX950hy71DldfM6XyNKjhEfePQk3Ejf6BS35bhwokQR7xFffxsbtYzNDovo6"
```

## Error Handling

The system includes comprehensive error handling:

-   **QR Generation Failures**: Logged but don't stop the examination process
-   **Invalid QR Codes**: Return 404 with appropriate error messages
-   **API Timeouts**: 30-second timeout for QR generation API calls
-   **Database Errors**: Proper exception handling and logging

## Integration Points

1. **Physical Examination Controller**: Automatic QR generation after examination
2. **Print Service**: QR code can be included in printed screening results
3. **External QR API**: Node.js service for custom QR code styling
4. **Patient Model**: Extended with QR code fields and relationships

## Future Enhancements

1. **QR Code Expiration**: Add expiration dates for security
2. **Access Logging**: Track when QR codes are scanned
3. **Custom QR Styling**: More customization options for QR appearance
4. **Batch QR Generation**: Generate QR codes for multiple patients
5. **QR Code Analytics**: Track usage statistics
