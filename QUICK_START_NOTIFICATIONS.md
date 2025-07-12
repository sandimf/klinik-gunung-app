# 🚀 **QUICK START - SISTEM NOTIFIKASI REALTIME**

## ⚡ **INSTALASI CEPAT (5 MENIT)**

### **1. Jalankan Migration**
```bash
php artisan migrate
```

### **2. Test Notifikasi**
```bash
# Buat 1 notifikasi test
php artisan test:notification

# Buat 5 notifikasi test
php artisan test:notification --count=5
```

### **3. Akses Dashboard Paramedis**
- Login sebagai paramedis
- Lihat bell icon di header
- Klik untuk melihat notifikasi

---

## 🎯 **CARA KERJA**

### **Flow Notifikasi**
```
Pasien Submit Screening
        ↓
ScreeningSubmissionService
        ↓
Creates Notification Records
        ↓
Broadcasts NewScreeningEvent
        ↓
Paramedis Receives Realtime Alert
```

### **Metode Delivery**
1. **SSE (Primary)**: Real-time streaming
2. **Polling (Fallback)**: Check setiap 10 detik
3. **Browser Notifications**: Native OS alerts

---

## 🔧 **KONFIGURASI**

### **Environment Variables**
```env
BROADCAST_DRIVER=log
```

### **Untuk Production (Pusher)**
```env
BROADCAST_DRIVER=pusher
PUSHER_APP_KEY=your_key
PUSHER_APP_SECRET=your_secret
PUSHER_APP_ID=your_app_id
PUSHER_APP_CLUSTER=your_cluster
```

---

## 📱 **COMPONENT USAGE**

### **NotificationBell Component**
```jsx
// Sudah terintegrasi di ParamedisSidebarLayout
<NotificationBell />
```

### **Custom Hook**
```jsx
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

const {
    notifications,    // Array of notifications
    unreadCount,      // Number of unread
    isConnected,      // SSE connection status
    markAsRead,       // Mark single as read
    markAllAsRead     // Mark all as read
} = useRealtimeNotifications();
```

---

## 🧪 **TESTING**

### **Manual Testing**
1. Login sebagai paramedis
2. Buka tab baru sebagai pasien
3. Submit screening baru
4. Kembali ke tab paramedis
5. Lihat notifikasi muncul

### **Command Testing**
```bash
# Test single notification
php artisan test:notification

# Test multiple notifications
php artisan test:notification --count=10

# Check database
php artisan tinker
>>> App\Models\Notifications\Notification::count();
```

---

## 🐛 **TROUBLESHOOTING**

### **Notifikasi Tidak Muncul**
```javascript
// Check browser console
console.log('SSE Status:', isConnected);

// Check browser permissions
if (Notification.permission === 'default') {
    Notification.requestPermission();
}
```

### **SSE Connection Error**
- Pastikan menggunakan HTTPS di production
- Check firewall settings
- Verify broadcasting configuration

### **Database Issues**
```bash
# Check migration
php artisan migrate:status

# Reset if needed
php artisan migrate:rollback
php artisan migrate
```

---

## 📊 **MONITORING**

### **Check Notifications**
```bash
# Count total notifications
php artisan tinker
>>> App\Models\Notifications\Notification::count();

# Count unread notifications
>>> App\Models\Notifications\Notification::whereNull('read_at')->count();

# Check by user
>>> App\Models\Notifications\Notification::where('user_id', 1)->get();
```

### **Check Broadcasting**
```bash
# Test broadcasting
php artisan tinker
>>> broadcast(new App\Events\NewScreeningEvent(App\Models\Users\Patients::first()));
```

---

## 🎉 **SUCCESS INDICATORS**

### **✅ Working Properly**
- Bell icon muncul di header paramedis
- Badge counter menunjukkan jumlah notifikasi
- Dropdown menu menampilkan daftar notifikasi
- Browser notifications muncul
- Notifikasi hilang setelah dibaca

### **❌ Issues to Fix**
- Bell icon tidak muncul
- Notifikasi tidak realtime
- Browser notifications tidak muncul
- Database errors

---

## 🔄 **NEXT STEPS**

### **Immediate**
1. Test dengan data real
2. Monitor performance
3. Check mobile responsiveness

### **Future Enhancements**
1. Sound notifications
2. Push notifications (mobile)
3. Notification preferences
4. Email notifications

---

## 📞 **SUPPORT**

### **Common Commands**
```bash
# Clear cache
php artisan cache:clear
php artisan config:clear

# Restart queue workers
php artisan queue:restart

# Check logs
tail -f storage/logs/laravel.log
```

### **Debug Mode**
```javascript
// Enable debug logging
localStorage.setItem('debug', 'notifications:*');
```

---

## 🎯 **SUMMARY**

Sistem notifikasi realtime sudah siap digunakan dengan:

✅ **Realtime updates** via SSE  
✅ **Fallback mechanism** via polling  
✅ **Browser notifications**  
✅ **Modern UI** dengan badge counter  
✅ **Database storage** untuk persistence  
✅ **Test commands** untuk debugging  

**Status**: Ready for Production! 🚀 