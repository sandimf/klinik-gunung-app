# 🏗️ Folder Restructure Plan - Klinik Gunung

## 📋 Overview
Rencana restrukturisasi folder untuk meningkatkan maintainability, scalability, dan developer experience pada aplikasi Klinik Gunung.

---

## 🎯 **Tujuan Restrukturisasi**

### Primary Goals
- ✅ **Improved Maintainability**: Struktur yang lebih logis dan mudah dipahami
- ✅ **Better Scalability**: Mudah menambah fitur baru tanpa merusak struktur
- ✅ **Enhanced Developer Experience**: Navigasi dan pencarian file yang lebih mudah
- ✅ **Consistent Naming**: Konvensi penamaan yang konsisten
- ✅ **Separation of Concerns**: Pemisahan yang jelas antara domain

---

## 📁 **1. REORGANISASI CONTROLLERS**

### Current Structure Issues
```
app/Http/Controllers/
├── Admin/
├── Auth/
├── Cashier/
├── Clinic/
├── Community/
├── Consultation/
├── Dashboard/
├── Data/
├── Ecommerce/
├── Medicines/
├── Paramedis/
├── Payments/
├── Pdf/
├── Product/
├── Report/
├── Roles/
├── Screening/
├── Screenings/
├── Transaction/
├── Users/
├── ProfileController.php
├── TestToastController.php
└── Controller.php
```

### Proposed Structure
```
app/Http/Controllers/
├── Auth/
│   ├── LoginController.php
│   ├── RegisterController.php
│   ├── PasswordResetController.php
│   └── SocialLoginController.php
├── Dashboard/
│   ├── AdminDashboardController.php
│   ├── DoctorDashboardController.php
│   ├── ParamedicDashboardController.php
│   ├── CashierDashboardController.php
│   ├── ManagerDashboardController.php
│   └── PatientDashboardController.php
├── Patient/
│   ├── PatientController.php
│   ├── PatientProfileController.php
│   ├── PatientScreeningController.php
│   └── PatientAppointmentController.php
├── Medical/
│   ├── ScreeningController.php
│   ├── PhysicalExaminationController.php
│   ├── MedicalRecordController.php
│   ├── ConsultationController.php
│   └── AppointmentController.php
├── Inventory/
│   ├── MedicineController.php
│   ├── MedicineBatchController.php
│   ├── ProductController.php
│   └── StockController.php
├── Finance/
│   ├── PaymentController.php
│   ├── TransactionController.php
│   ├── InvoiceController.php
│   └── ReportController.php
├── Admin/
│   ├── StaffController.php
│   ├── SystemController.php
│   ├── SettingsController.php
│   └── ApiKeyController.php
├── Community/
│   ├── CommunityController.php
│   ├── PostController.php
│   └── ProfileController.php
├── AI/
│   ├── ChatbotController.php
│   └── AiSuggestionController.php
└── Shared/
    ├── ProfileController.php
    ├── NotificationController.php
    └── FileController.php
```

---

## 📁 **2. REORGANISASI MODELS**

### Current Structure Issues
```
app/Models/
├── User.php
├── Payments.php
├── PatientVisits.php
├── QrCode.php
├── Product.php
├── EmergecyContactModel.php
├── Roles/
├── Community/
├── Users/
├── Transaction/
├── Screenings/
├── Payments/
├── Medicines/
├── Emergency/
├── EMR/
├── Consultation/
├── Clinic/
├── Auth/
├── Ai/
└── Activity/
```

### Proposed Structure
```
app/Models/
├── User/
│   ├── User.php
│   ├── Admin.php
│   ├── Doctor.php
│   ├── Paramedic.php
│   ├── Cashier.php
│   ├── Manager.php
│   └── Patient.php
├── Medical/
│   ├── Patient.php
│   ├── MedicalRecord.php
│   ├── Screening.php
│   ├── PhysicalExamination.php
│   ├── Appointment.php
│   ├── Consultation.php
│   └── BodyPart.php
├── Inventory/
│   ├── Medicine.php
│   ├── MedicineBatch.php
│   ├── MedicinePricing.php
│   ├── Product.php
│   └── Stock.php
├── Finance/
│   ├── Payment.php
│   ├── PaymentOnline.php
│   ├── Transaction.php
│   └── Invoice.php
├── Community/
│   ├── Community.php
│   ├── CommunityPost.php
│   └── CommunityProfile.php
├── System/
│   ├── QrCode.php
│   ├── EmergencyContact.php
│   ├── ApiKey.php
│   └── SystemSetting.php
├── Activity/
│   ├── UserVisit.php
│   ├── ActivityLog.php
│   └── AuditTrail.php
└── Shared/
    ├── BaseModel.php
    └── TimestampModel.php
```

---

## 📁 **3. REORGANISASI SERVICES**

### Current Structure
```
app/Services/
├── AccountDeletionService.php
├── ProfileService.php
├── ScreeningPdfService.php
├── Admin/
├── Appointments/
├── Data/
└── Screening/
```

### Proposed Structure
```
app/Services/
├── Auth/
│   ├── AuthenticationService.php
│   ├── AuthorizationService.php
│   └── SocialLoginService.php
├── Patient/
│   ├── PatientService.php
│   ├── PatientDataService.php
│   └── PatientProfileService.php
├── Medical/
│   ├── ScreeningService.php
│   ├── MedicalRecordService.php
│   ├── AppointmentService.php
│   └── ConsultationService.php
├── Inventory/
│   ├── MedicineService.php
│   ├── StockService.php
│   └── InventoryService.php
├── Finance/
│   ├── PaymentService.php
│   ├── TransactionService.php
│   └── InvoiceService.php
├── Notification/
│   ├── EmailService.php
│   ├── SmsService.php
│   └── NotificationService.php
├── File/
│   ├── FileUploadService.php
│   ├── PdfService.php
│   └── ImageService.php
├── AI/
│   ├── ChatbotService.php
│   └── AiSuggestionService.php
└── System/
    ├── QrCodeService.php
    ├── BackupService.php
    └── LogService.php
```

---

## 📁 **4. REORGANISASI FRONTEND (React)**

### Current Structure Issues
```
resources/js/
├── Pages/
│   ├── Auth/
│   ├── Dashboard/
│   ├── Community/
│   └── Profile/
├── Components/
│   ├── ui/
│   ├── Nav/
│   └── Sidebar/
├── Layouts/
└── hooks/
```

### Proposed Structure
```
resources/js/
├── Pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   ├── Dashboard/
│   │   ├── Admin/
│   │   ├── Doctor/
│   │   ├── Paramedic/
│   │   ├── Cashier/
│   │   ├── Manager/
│   │   └── Patient/
│   ├── Medical/
│   │   ├── Screening/
│   │   ├── Appointment/
│   │   ├── Consultation/
│   │   └── Records/
│   ├── Inventory/
│   │   ├── Medicines/
│   │   ├── Products/
│   │   └── Stock/
│   ├── Finance/
│   │   ├── Payments/
│   │   ├── Transactions/
│   │   └── Reports/
│   ├── Community/
│   │   ├── Posts/
│   │   ├── Profile/
│   │   └── Settings/
│   └── Admin/
│       ├── Staff/
│       ├── Settings/
│       └── System/
├── Components/
│   ├── ui/                    # Shadcn/UI components
│   ├── forms/                 # Form components
│   ├── tables/                # Table components
│   ├── modals/                # Modal components
│   ├── charts/                # Chart components
│   ├── layout/                # Layout components
│   │   ├── Sidebar/
│   │   ├── Navbar/
│   │   └── Footer/
│   └── shared/                # Shared components
│       ├── LoadingSpinner.jsx
│       ├── ErrorBoundary.jsx
│       └── Toast.jsx
├── Layouts/
│   ├── AuthLayout.jsx
│   ├── DashboardLayout.jsx
│   ├── AdminLayout.jsx
│   └── GuestLayout.jsx
├── hooks/
│   ├── useAuth.js
│   ├── usePatient.js
│   ├── useScreening.js
│   ├── usePayment.js
│   └── useNotification.js
├── utils/
│   ├── api.js
│   ├── validation.js
│   ├── formatters.js
│   └── constants.js
├── stores/                    # State management
│   ├── authStore.js
│   ├── patientStore.js
│   └── uiStore.js
└── types/                     # TypeScript types (if using TS)
    ├── auth.types.js
    ├── patient.types.js
    └── medical.types.js
```

---

## 📁 **5. REORGANISASI ROUTES**

### Current Structure Issues
- Semua routes dalam satu file `web.php` (408 lines)
- Tidak ada grouping yang jelas
- Sulit untuk maintenance

### Proposed Structure
```
routes/
├── web.php                    # Main web routes file
├── api.php                    # API routes (if needed)
├── auth.php                   # Authentication routes
├── admin.php                  # Admin routes
├── medical.php                # Medical routes
├── patient.php                # Patient routes
├── finance.php                # Finance routes
├── inventory.php              # Inventory routes
└── community.php              # Community routes
```

### Route Organization Example
```php
// routes/web.php
Route::middleware(['auth'])->group(function () {
    Route::prefix('dashboard')->group(function () {
        require __DIR__ . '/admin.php';
        require __DIR__ . '/medical.php';
        require __DIR__ . '/patient.php';
        require __DIR__ . '/finance.php';
        require __DIR__ . '/inventory.php';
        require __DIR__ . '/community.php';
    });
});
```

---

## 📁 **6. REORGANISASI REQUESTS & RESOURCES**

### Current Structure
```
app/Http/Requests/
├── Admin/
├── Appointments/
├── Auth/
├── GuestScreeningRequest.php
├── Information/
├── Medicines/
├── ProductRequest.php
├── ProfileUpdateRequest.php
└── Screenings/
```

### Proposed Structure
```
app/Http/Requests/
├── Auth/
│   ├── LoginRequest.php
│   ├── RegisterRequest.php
│   └── PasswordResetRequest.php
├── Patient/
│   ├── PatientCreateRequest.php
│   ├── PatientUpdateRequest.php
│   └── PatientScreeningRequest.php
├── Medical/
│   ├── ScreeningRequest.php
│   ├── AppointmentRequest.php
│   └── ConsultationRequest.php
├── Inventory/
│   ├── MedicineRequest.php
│   ├── ProductRequest.php
│   └── StockRequest.php
├── Finance/
│   ├── PaymentRequest.php
│   └── TransactionRequest.php
└── Admin/
    ├── StaffRequest.php
    └── SystemRequest.php
```

---

## 📁 **7. REORGANISASI TESTS**

### Current Structure
```
tests/
├── Feature/
│   ├── Auth/
│   ├── ExampleTest.php
│   └── ProfileTest.php
└── Unit/
    └── ExampleTest.php
```

### Proposed Structure
```
tests/
├── Feature/
│   ├── Auth/
│   │   ├── LoginTest.php
│   │   ├── RegisterTest.php
│   │   └── PasswordResetTest.php
│   ├── Patient/
│   │   ├── PatientRegistrationTest.php
│   │   ├── PatientScreeningTest.php
│   │   └── PatientProfileTest.php
│   ├── Medical/
│   │   ├── ScreeningTest.php
│   │   ├── AppointmentTest.php
│   │   └── ConsultationTest.php
│   ├── Inventory/
│   │   ├── MedicineTest.php
│   │   └── StockTest.php
│   ├── Finance/
│   │   ├── PaymentTest.php
│   │   └── TransactionTest.php
│   └── Admin/
│       ├── StaffTest.php
│       └── SystemTest.php
├── Unit/
│   ├── Services/
│   ├── Models/
│   └── Helpers/
└── Browser/                   # Dusk tests (if needed)
    ├── Auth/
    ├── Patient/
    └── Medical/
```

---

## 📁 **8. REORGANISASI CONFIGURATION**

### Current Structure
```
config/
├── app.php
├── auth.php
├── database.php
├── mail.php
├── services.php
└── ...
```

### Proposed Structure
```
config/
├── app.php
├── auth.php
├── database.php
├── mail.php
├── services.php
├── medical.php              # Medical-specific config
├── payment.php              # Payment gateway config
├── ai.php                   # AI service config
├── notification.php         # Notification config
└── features.php             # Feature flags
```

---

## 📁 **9. REORGANISASI DATABASE**

### Current Structure
```
database/
├── migrations/
├── seeders/
└── factories/
```

### Proposed Structure
```
database/
├── migrations/
│   ├── 2024_01_01_000001_create_users_table.php
│   ├── 2024_01_01_000002_create_patients_table.php
│   ├── 2024_01_01_000003_create_medical_records_table.php
│   ├── 2024_01_01_000004_create_screenings_table.php
│   ├── 2024_01_01_000005_create_medicines_table.php
│   └── 2024_01_01_000006_create_payments_table.php
├── seeders/
│   ├── DatabaseSeeder.php
│   ├── UserSeeder.php
│   ├── PatientSeeder.php
│   ├── MedicineSeeder.php
│   └── SystemSeeder.php
└── factories/
    ├── UserFactory.php
    ├── PatientFactory.php
    ├── MedicineFactory.php
    └── PaymentFactory.php
```

---

## 🚀 **IMPLEMENTATION PLAN**

### Phase 1: Preparation (Week 1)
1. **Create backup** of current codebase
2. **Document current structure** thoroughly
3. **Create migration scripts** for file moves
4. **Update .gitignore** for new structure

### Phase 2: Backend Restructure (Week 2-3)
1. **Reorganize Controllers** by domain
2. **Reorganize Models** with proper namespacing
3. **Reorganize Services** by functionality
4. **Update route files** and grouping
5. **Reorganize Requests & Resources**

### Phase 3: Frontend Restructure (Week 4)
1. **Reorganize React components** by feature
2. **Update import paths** throughout frontend
3. **Reorganize Pages** by user role
4. **Create shared components** library

### Phase 4: Testing & Validation (Week 5)
1. **Update test structure** and paths
2. **Run all tests** to ensure functionality
3. **Manual testing** of all features
4. **Performance testing** after restructure

### Phase 5: Documentation & Cleanup (Week 6)
1. **Update documentation** with new structure
2. **Create architecture diagrams**
3. **Update README** with new folder structure
4. **Team training** on new structure

---

## 📋 **MIGRATION CHECKLIST**

### Pre-Migration
- [ ] Create complete backup
- [ ] Document current file locations
- [ ] Create migration scripts
- [ ] Set up development branch

### During Migration
- [ ] Move files systematically
- [ ] Update namespaces
- [ ] Update import statements
- [ ] Update route references
- [ ] Update test paths

### Post-Migration
- [ ] Run all tests
- [ ] Manual testing
- [ ] Performance testing
- [ ] Update documentation
- [ ] Team review

---

## 🎯 **BENEFITS OF NEW STRUCTURE**

### For Developers
- ✅ **Faster Navigation**: Logical folder structure
- ✅ **Better Code Discovery**: Related files grouped together
- ✅ **Easier Maintenance**: Clear separation of concerns
- ✅ **Reduced Cognitive Load**: Intuitive organization

### For Project Management
- ✅ **Better Scalability**: Easy to add new features
- ✅ **Clearer Ownership**: Domain-based organization
- ✅ **Easier Onboarding**: New developers understand structure quickly
- ✅ **Better Code Reviews**: Related changes grouped together

### For Maintenance
- ✅ **Easier Debugging**: Related code in same location
- ✅ **Better Testing**: Tests organized by feature
- ✅ **Simpler Deployment**: Clear separation of concerns
- ✅ **Reduced Technical Debt**: Consistent patterns

---

## 📝 **NEXT STEPS**

1. **Review this plan** with your team
2. **Prioritize phases** based on current needs
3. **Create migration scripts** for automated file moves
4. **Set up development environment** for testing
5. **Begin Phase 1** implementation

---

**Status**: 📋 Planning Phase  
**Created**: [Current Date]  
**Next Review**: [Date + 1 week] 