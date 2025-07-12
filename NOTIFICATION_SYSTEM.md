# 🔔 **SISTEM NOTIFIKASI REALTIME KLINIK GUNUNG**

## 📋 **OVERVIEW**

Sistem notifikasi realtime untuk paramedis ketika ada screening baru. Menggunakan **3 metode gratis** untuk memastikan notifikasi selalu sampai:

1. **Server-Sent Events (SSE)** - Real-time, gratis, reliable
2. **Polling** - Fallback method, simple dan reliable  
3. **Browser Notifications** - Native browser notifications

---

## 🚀 **FITUR UTAMA**

### ✅ **Realtime Notifications**
- Notifikasi instan ketika ada screening baru
- Badge counter dengan jumlah notifikasi belum dibaca
- Dropdown menu dengan daftar notifikasi
- Mark as read functionality

### ✅ **Multiple Delivery Methods**
- **SSE**: Real-time streaming (primary)
- **Polling**: Fallback setiap 10 detik
- **Browser Notifications**: Native OS notifications

### ✅ **User Experience**
- Visual indicator (bell icon dengan badge)
- Toast notifications
- Sound alerts (optional)
- Mobile responsive

---

## 🏗️ **ARQUITECTURE**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Patient       │    │   Laravel       │    │   Paramedis     │
│   Submits       │───▶│   Backend       │───▶│   Frontend      │
│   Screening     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Database      │
                       │   Notifications │
                       └─────────────────┘
```

---

## 📁 **FILE STRUCTURE**

```
app/
├── Events/
│   └── NewScreeningEvent.php          # Event untuk broadcasting
├── Http/Controllers/
│   └── NotificationController.php     # API endpoints
├── Models/Notifications/
│   └── Notification.php               # Notification model
└── Services/
    └── ScreeningSubmissionService.php # Updated dengan notifikasi

resources/js/
├── Components/
│   └── NotificationBell.jsx           # UI Component
├── hooks/
│   └── useRealtimeNotifications.jsx   # Custom hook
└── Layouts/Dashboard/
    └── ParamedisSidebarLayout.jsx     # Updated layout

database/migrations/
└── create_notifications_table.php     # Migration

routes/
└── api.php                           # API routes
```

---

## 🔧 **INSTALASI & SETUP**

### **1. Jalankan Migration**
```bash
php artisan migrate
```

### **2. Update Broadcasting Configuration**
```php
// config/broadcasting.php
'default' => env('BROADCAST_DRIVER', 'log'),

'connections' => [
    'pusher' => [
        'driver' => 'pusher',
        'key' => env('PUSHER_APP_KEY'),
        'secret' => env('PUSHER_APP_SECRET'),
        'app_id' => env('PUSHER_APP_ID'),
        'options' => [
            'cluster' => env('PUSHER_APP_CLUSTER'),
            'useTLS' => true
        ],
    ],
    'log' => [
        'driver' => 'log',
    ],
],
```

### **3. Environment Variables**
```env
BROADCAST_DRIVER=log
PUSHER_APP_KEY=your_key
PUSHER_APP_SECRET=your_secret
PUSHER_APP_ID=your_app_id
PUSHER_APP_CLUSTER=your_cluster
```

---

## 🎯 **CARA KERJA**

### **1. Screening Submission Flow**
```php
// Ketika pasien submit screening
Patient submits screening
    ↓
ScreeningSubmissionService::handle()
    ↓
Creates notification records
    ↓
Broadcasts NewScreeningEvent
    ↓
Paramedis receives realtime notification
```

### **2. Realtime Notification Flow**
```javascript
// Frontend hook
useRealtimeNotifications()
    ↓
Connects to SSE endpoint
    ↓
Receives realtime updates
    ↓
Updates UI with new notifications
    ↓
Shows browser notification
```

### **3. Fallback Mechanism**
```javascript
SSE Connection fails
    ↓
Automatic fallback to polling
    ↓
Poll every 10 seconds
    ↓
Resume SSE when available
```

---

## 📱 **COMPONENT USAGE**

### **NotificationBell Component**
```jsx
import { NotificationBell } from '@/Components/NotificationBell';

// Di layout paramedis
<NotificationBell />
```

### **Custom Hook**
```jsx
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead
} = useRealtimeNotifications();
```

---

## 🔌 **API ENDPOINTS**

### **GET /api/notifications**
```json
{
    "notifications": [...],
    "unread_count": 5
}
```

### **POST /api/notifications/mark-read**
```json
{
    "notification_id": 123
}
```

### **POST /api/notifications/mark-all-read**
```json
{
    "success": true
}
```

### **GET /api/notifications/stream**
```
Server-Sent Events stream
```

---

## 🎨 **UI FEATURES**

### **Notification Bell**
- 🔔 Icon dengan badge counter
- Dropdown menu dengan daftar notifikasi
- Mark as read functionality
- Connection status indicator

### **Notification Item**
- Patient name dan queue number
- Timestamp (relative time)
- Read/unread status
- Click to navigate to screening

### **Browser Notifications**
- Native OS notifications
- Permission handling
- Click to open screening detail

---

## 🔒 **SECURITY**

### **Authentication**
- Semua endpoints protected dengan auth middleware
- User-specific notifications
- Role-based access (paramedis only)

### **Data Validation**
- Input validation pada semua endpoints
- SQL injection protection
- XSS protection

---

## 📊 **PERFORMANCE**

### **Optimizations**
- Database indexing pada notifications table
- Efficient queries dengan eager loading
- Connection pooling untuk SSE
- Fallback mechanisms

### **Monitoring**
- Connection status tracking
- Error logging
- Performance metrics

---

## 🛠️ **TROUBLESHOOTING**

### **SSE Connection Issues**
```javascript
// Check connection status
console.log('SSE Status:', isConnected);

// Manual reconnect
const { connectSSE } = useRealtimeNotifications();
connectSSE();
```

### **Browser Notifications**
```javascript
// Check permission
if (Notification.permission === 'default') {
    Notification.requestPermission();
}
```

### **Database Issues**
```bash
# Check notifications table
php artisan tinker
>>> App\Models\Notifications\Notification::count();
```

---

## 🚀 **DEPLOYMENT**

### **Production Setup**
1. **Database**: Ensure notifications table exists
2. **Queue**: Configure queue workers for background jobs
3. **Broadcasting**: Setup Pusher or similar service
4. **SSL**: Required for SSE in production

### **Environment Variables**
```env
BROADCAST_DRIVER=pusher
PUSHER_APP_KEY=your_production_key
PUSHER_APP_SECRET=your_production_secret
PUSHER_APP_ID=your_production_app_id
PUSHER_APP_CLUSTER=your_production_cluster
```

---

## 📈 **FUTURE ENHANCEMENTS**

### **Planned Features**
- [ ] Sound notifications
- [ ] Push notifications (mobile)
- [ ] Notification preferences
- [ ] Bulk actions
- [ ] Notification history
- [ ] Email notifications

### **Scalability**
- [ ] Redis for caching
- [ ] Load balancing
- [ ] Microservices architecture
- [ ] Real-time analytics

---

## 📞 **SUPPORT**

### **Common Issues**
1. **Notifications not showing**: Check browser permissions
2. **SSE not connecting**: Verify SSL in production
3. **Database errors**: Run migrations
4. **Performance issues**: Check database indexes

### **Debug Mode**
```javascript
// Enable debug logging
localStorage.setItem('debug', 'notifications:*');
```

---

## 🎉 **CONCLUSION**

Sistem notifikasi realtime ini memberikan:

✅ **Realtime updates** untuk paramedis  
✅ **Multiple delivery methods** untuk reliability  
✅ **User-friendly interface** dengan modern UI  
✅ **Scalable architecture** untuk future growth  
✅ **Free implementation** tanpa biaya tambahan  

Sistem ini siap untuk production dan dapat diandalkan untuk memberikan notifikasi screening baru secara realtime kepada paramedis. 