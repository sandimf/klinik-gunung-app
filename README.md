# 🏥 Klinik Gunung - Medical Clinic Management System

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=for-the-badge&logo=inertia)](https://inertiajs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

A comprehensive medical clinic management system designed for mountain clinics, providing digital health services including patient management, appointments, screenings, and medical records.

## ✨ Features

### 🏥 Core Medical Services
- **Patient Management** - Complete patient registration and profile management
- **Appointment Scheduling** - Advanced booking system with doctor availability
- **Medical Records** - Digital EMR system with comprehensive patient history
- **Health Screenings** - Both offline and online screening capabilities
- **Physical Examinations** - Digital examination forms and documentation

### 👥 Multi-Role Dashboard
- **Admin Panel** - Complete system administration and user management
- **Doctor Dashboard** - Patient consultations, medical records, and appointments
- **Paramedic Interface** - Health checks and screening management
- **Cashier System** - Payment processing and transaction management
- **Manager Reports** - Comprehensive analytics and reporting
- **Patient Portal** - Self-service portal for patients

### 🔧 Advanced Features
- **AI Integration** - Google Gemini AI for medical assistance and analysis
- **QR Code System** - Digital identification and quick access
- **PDF Generation** - Medical reports and documentation
- **Email Notifications** - Automated alerts and confirmations
- **Screening Result PDF to Email** - Screening results are now automatically sent to the patient's email as a PDF attachment (using the health_check template)
- **Inventory Management** - Medicine and equipment tracking
- **Community Platform** - Patient community and health information sharing

### 🌐 Online Services
- **Remote Screenings** - Online health assessments
- **Telemedicine** - Digital consultations and follow-ups
- **Online Payments** - Secure payment processing
- **Digital Reports** - Downloadable medical certificates and reports

## 🛠️ Technology Stack

### Backend
- **Laravel 12.x** - PHP framework for robust backend development
- **MySQL/SQLite** - Reliable database management
- **Sanctum** - API authentication and security
- **Queue System** - Background job processing
- **PDF Generation** - DomPDF for document creation

### Frontend
- **React 18.x** - Modern JavaScript library for UI
- **Inertia.js 2.x** - Server-side rendering with SPA experience
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Shadcn/UI** - Beautiful and accessible component library
- **React Hook Form** - Efficient form handling
- **Radix UI** - Accessible UI primitives

### Additional Tools
- **Vite** - Fast build tool and development server
- **Google Gemini AI** - AI-powered medical assistance
- **Simple QR Code** - QR code generation
- **Maatwebsite Excel** - Excel import/export functionality
- **Laravel Socialite** - OAuth authentication

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP >= 8.2** with required extensions
- **Composer** - Dependency manager for PHP
- **Node.js >= 18.x** and **npm** - JavaScript runtime and package manager
- **MySQL 8.x** or **SQLite** - Database system
- **Git** - Version control system

### Required PHP Extensions
```bash
php-curl
php-dom
php-fileinfo
php-filter
php-hash
php-mbstring
php-openssl
php-pcre
php-pdo
php-session
php-tokenizer
php-xml
php-zip
php-gd
```

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/klinik-gunung.git
cd klinik-gunung
```

### 2. Install PHP Dependencies
```bash
composer install
```

### 3. Install Node.js Dependencies
```bash
npm install
```

### 4. Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Database Setup
```bash
# Create database (MySQL)
mysql -u root -p
CREATE DATABASE klinik_gunung;
exit

# Or for SQLite
touch database/database.sqlite
```

### 6. Configure Environment Variables
Edit your `.env` file with the following configurations:

```env
# Application
APP_NAME="Klinik Gunung"
APP_ENV=local
APP_KEY=base64:your-generated-key
APP_DEBUG=true
APP_URL=http://localhost

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=klinik_gunung
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=your-mail-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@klinikgunung.com
MAIL_FROM_NAME="${APP_NAME}"

# Google AI Configuration
GOOGLE_AI_API_KEY=your-gemini-api-key

# Queue Configuration
QUEUE_CONNECTION=database

# File Storage
FILESYSTEM_DISK=local
```

### 7. Database Migration and Seeding
```bash
# Run migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed
```

### 8. Storage Setup
```bash
# Create symbolic link for storage
php artisan storage:link

# Set proper permissions
chmod -R 775 storage bootstrap/cache
```

### 9. Build Frontend Assets
```bash
# For development
npm run dev

# For production
npm run build
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start all services (recommended)
composer run dev

# Or start services individually:
# Backend server
php artisan serve

# Frontend development server
npm run dev

# Queue worker
php artisan queue:work

# Log viewer
php artisan pail
```

### Production Mode
```bash
# Build assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start queue worker with supervisor
php artisan queue:work --daemon
```

Access the application at: `http://localhost:8000`

## 👤 Default User Accounts

After seeding, you can use these default accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@klinikgunung.com | password | Full system access |
| Doctor | doctor@klinikgunung.com | password | Medical services |
| Paramedic | paramedic@klinikgunung.com | password | Health screenings |
| Cashier | cashier@klinikgunung.com | password | Payments & transactions |
| Manager | manager@klinikgunung.com | password | Reports & analytics |

## 📊 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   React         │◄──►│   Laravel       │◄──►│   MySQL         │
│   Inertia.js    │    │   API Routes    │    │   Migrations    │
│   Tailwind CSS  │    │   Controllers   │    │   Models        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   Services      │    │   External APIs │
│   Forms         │    │   Jobs/Queues   │    │   Google AI     │
│   Layouts       │    │   Mail System   │    │   File Storage  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔐 Security Features

- **Authentication** - Laravel Sanctum with multi-factor support
- **Authorization** - Role-based access control (RBAC)
- **Data Encryption** - Sensitive medical data encryption
- **CSRF Protection** - Cross-site request forgery prevention
- **SQL Injection Prevention** - Eloquent ORM protection
- **Input Validation** - Comprehensive form validation
- **File Upload Security** - Secure file handling and validation

## 📈 Performance Optimizations

- **Database Indexing** - Optimized query performance
- **Caching Strategy** - Redis/Database caching
- **Asset Optimization** - Vite bundling and minification
- **Image Optimization** - Automated image compression
- **Lazy Loading** - On-demand resource loading
- **Queue Processing** - Background job handling

## 🧪 Testing

```bash
# Run PHP tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Generate test coverage
php artisan test --coverage
```

## 📦 Deployment

### Production Deployment Checklist

1. **Environment Setup**
   ```bash
   APP_ENV=production
   APP_DEBUG=false
   ```

2. **Security Configuration**
   ```bash
   # Generate new app key
   php artisan key:generate --force
   
   # Set secure session settings
   SESSION_SECURE_COOKIE=true
   SESSION_SAME_SITE=strict
   ```

3. **Performance Optimization**
   ```bash
   # Cache configuration
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   
   # Build production assets
   npm run build
   ```

4. **Database Migration**
   ```bash
   php artisan migrate --force
   ```

5. **Queue Management**
   Set up supervisor for queue workers:
   ```ini
   [program:klinik-gunung-worker]
   process_name=%(program_name)s_%(process_num)02d
   command=php /path/to/artisan queue:work --sleep=3 --tries=3
   autostart=true
   autorestart=true
   user=www-data
   numprocs=2
   redirect_stderr=true
   stdout_logfile=/var/log/klinik-gunung-worker.log
   ```

## 🔧 Configuration

### Mail Configuration
Configure SMTP settings in `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
```

### AI Configuration
Set up Google Gemini AI:
```env
GOOGLE_AI_API_KEY=your-gemini-api-key
```

### Queue Configuration
For production, use Redis:
```env
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m "feat: add new feature"`
5. Push to your branch: `git push origin feature/new-feature`
6. Create a Pull Request

### Code Style
- **PHP**: Follow PSR-12 coding standards
- **JavaScript**: Use ESLint with React configuration
- **CSS**: Follow Tailwind CSS best practices

## 📝 API Documentation

### Authentication
```bash
# Login
POST /api/login
{
  "email": "user@example.com",
  "password": "password"
}

# Get user profile
GET /api/user
Authorization: Bearer {token}
```

### Patients
```bash
# List patients
GET /api/patients?page=1&limit=10

# Create patient
POST /api/patients
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "08123456789"
}
```

## 🐛 Troubleshooting

### Common Issues

**1. Permission Errors**
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

**2. Node.js Version Issues**
```bash
# Use Node Version Manager
nvm install 18
nvm use 18
```

**3. Database Connection Issues**
- Check database credentials in `.env`
- Ensure database server is running
- Verify firewall settings

**4. Queue Jobs Not Processing**
```bash
# Check queue status
php artisan queue:work --verbose

# Clear failed jobs
php artisan queue:clear
```

## 📞 Support

- **Documentation**: [Wiki](https://github.com/your-username/klinik-gunung/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/klinik-gunung/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/klinik-gunung/discussions)
- **Email**: support@klinikgunung.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Laravel Team** - For the amazing PHP framework
- **React Team** - For the powerful JavaScript library
- **Inertia.js** - For bridging server-side and client-side
- **Tailwind CSS** - For the utility-first CSS framework
- **Shadcn/UI** - For beautiful UI components
- **Medical Community** - For valuable feedback and requirements

---

**Built with ❤️ for healthcare professionals and mountain communities**

> For more detailed documentation, please visit our [Wiki](https://github.com/your-username/klinik-gunung/wiki)
