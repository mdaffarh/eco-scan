# EcoApp API Routes

Backend API yang terintegrasi dengan Next.js menggunakan App Router.

## 📁 Struktur Folder

```
api/
├── auth/                   # Authentication
│   ├── register/
│   │   └── route.js       # POST - Register user baru
│   └── login/
│       └── route.js       # POST - Login user
│
├── user/                   # User Profile
│   └── [userId]/
│       └── route.js       # GET, PUT - Get/Update profile
│
├── scan/
│   └── route.js           # POST - Submit scan dengan gamification
│
├── waste-logs/
│   └── route.js           # GET - Get user waste logs
│
├── stats/
│   └── stats/
│       └── route.js       # GET - Dashboard statistics
│
├── admin/                  # Admin CRUD Operations
│   ├── users/
│   │   ├── route.js       # GET all, POST create
│   │   └── [id]/
│   │       └── route.js   # GET, PUT, DELETE single user
│   │
│   ├── waste-logs/
│   │   ├── route.js       # GET all with filters, POST
│   │   └── [id]/
│   │       └── route.js   # GET, PUT, DELETE single log
│   │
│   └── bins/
│       ├── route.js       # GET all, POST with image
│       ├── [id]/
│       │   └── route.js   # GET, PUT, DELETE single bin
│       └── by-value/
│           └── [value]/
│               └── route.js  # GET bin by location ID
│
└── upload/
    └── bin-image/
        └── route.js       # POST - Upload bin image
```

## 🔌 Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### User Profile
```
GET  /api/user/[userId]
PUT  /api/user/[userId]
```

### Scan & Logs
```
POST /api/scan
GET  /api/waste-logs?userId=xxx
```

### Statistics
```
GET  /api/stats/stats?timeFilter=today|week|month|all
```

### Admin - Users
```
GET    /api/admin/users?search=xxx
POST   /api/admin/users
GET    /api/admin/users/[id]
PUT    /api/admin/users/[id]
DELETE /api/admin/users/[id]
```

### Admin - Waste Logs
```
GET    /api/admin/waste-logs?search=xxx&waste_type=xxx&fakultas=xxx&user_id=xxx
POST   /api/admin/waste-logs
GET    /api/admin/waste-logs/[id]
PUT    /api/admin/waste-logs/[id]
DELETE /api/admin/waste-logs/[id]
```

### Admin - Bins
```
GET    /api/admin/bins?search=xxx&fakultas=xxx
POST   /api/admin/bins
GET    /api/admin/bins/[id]
PUT    /api/admin/bins/[id]
DELETE /api/admin/bins/[id]
GET    /api/admin/bins/by-value/[value]
```

### Upload
```
POST /api/upload/bin-image
```

## 📖 Documentation

Lihat file dokumentasi lengkap:
- `BACKEND_MIGRATION.md` - Detail teknis migrasi
- `QUICK_START.md` - Quick start guide
- `MIGRATION_SUMMARY.md` - Summary lengkap

## 🔧 Development

Setiap route file menggunakan pattern Next.js App Router:

```javascript
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Model from '@/models/Model';

export async function GET(request) {
  await connectDB();
  // ... logic
  return NextResponse.json({ data });
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  // ... logic
  return NextResponse.json({ data }, { status: 201 });
}
```

## ✅ Best Practices

1. **Always call `connectDB()`** di awal setiap handler
2. **Use try-catch** untuk error handling
3. **Return proper status codes** (200, 201, 400, 404, 500)
4. **Validate input** sebelum database operations
5. **Use NextResponse.json()** untuk responses
6. **Handle errors gracefully** dengan descriptive messages

## 🔒 Security Notes

⚠️ **Production Todos:**
- [ ] Add JWT authentication middleware
- [ ] Hash passwords with bcrypt
- [ ] Add rate limiting
- [ ] Add input sanitization
- [ ] Add CSRF protection
- [ ] Add request validation with Zod

## 📝 Testing

Test endpoints dengan:
- Postman
- Thunder Client (VSCode)
- curl
- Frontend fetch/axios

Example:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
