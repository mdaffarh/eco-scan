# EcoScan - Migration to Next.js Progress

## ✅ Completed Phases (1-4)

### Phase 1: Setup Next.js Structure ✅
- ✅ Created `package.json` with Next.js 15, React 19, TensorFlow.js
- ✅ Created `next.config.js` with TensorFlow.js webpack config
- ✅ Created `.gitignore`, `jsconfig.json`, `.eslintrc.json`
- ✅ Created `app/layout.jsx` (Root Layout with LocationProvider)
- ✅ Created `app/page.jsx` (Redirect to /welcome)
- ✅ Created `app/globals.css`
- ✅ Created `README.md`

### Phase 2: Utils & Config Files ✅
- ✅ Migrated `utils/locationConfig.js` (376 lines) - No changes needed
- ✅ Migrated `utils/modelUtils.js` (248 lines) - No changes needed
- ✅ Migrated `utils/modelUtils.teachablemachine.js` (189 lines) - No changes needed

### Phase 3: Context ✅
- ✅ Migrated `context/LocationContext.jsx` with 'use client' directive
- ✅ Integrated LocationProvider into root layout

### Phase 4: Components ✅
- ✅ Migrated `components/Navbar.jsx` with Next.js Link and usePathname
- ✅ Migrated `components/Navbar.css`

### Phase 5: Pages (IN PROGRESS) 🚧
- ✅ **Welcome Page** - Migrated to `app/welcome/page.jsx`
- ⏳ **Home Page** - TO DO
- ⏳ **Scan Page** - TO DO
- ⏳ **Result Page** - TO DO
- ⏳ **About Page** - TO DO

---

## 📝 Next Steps

### Remaining Pages to Migrate:

#### 1. Home Page (`app/home/`)
**Source:** `src/pages/HomePage/Home.jsx` & `Home.css`
**Changes needed:**
- Replace `useNavigate()` with `useRouter()`
- Replace `<Link to="">` with `<Link href="">`
- Import Navbar from `@/components/Navbar`
- Add 'use client' directive

#### 2. Scan Page (`app/scan/`)
**Source:** `src/pages/ScanPage/Scan.jsx` & `Scan.css`
**Changes needed:**
- Replace `useNavigate()` with `useRouter()`
- Import modelUtils from `@/utils/modelUtils`
- Import Navbar from `@/components/Navbar`
- Add 'use client' directive

#### 3. Result Page (`app/result/`)
**Source:** `src/pages/ResultPage/Result.jsx` & `Result.css`
**Changes needed:**
- Replace `useNavigate()` with `useRouter()`
- Replace `useLocation().state` with `useSearchParams()` or state management
- Import utilities from `@/utils/`
- Import Navbar from `@/components/Navbar`
- Add 'use client' directive

#### 4. About Page (`app/about/`)
**Source:** `src/pages/AboutPage/About.jsx` & `About.css`
**Changes needed:**
- Import Navbar from `@/components/Navbar`
- Add 'use client' directive
- Minimal changes (mostly static content)

---

## 🎯 Phase 6: Public Assets

Copy files from `Project/public/` to `frontend/public/`:
- `model.json`
- `labels.txt`
- `metadata.json`
- Any `.bin` files for TensorFlow model
- Assets dari `src/assets/` (jika ada)

---

## 🧪 Phase 7: Testing

After all migrations:
1. Install dependencies: `cd frontend && npm install`
2. Run dev server: `npm run dev`
3. Test each page:
   - `/welcome` - Welcome screens
   - `/home` - Faculty selection
   - `/scan` - Image upload & AI prediction
   - `/result` - Results display with location recommendations
   - `/about` - About page
4. Test TensorFlow.js model loading
5. Test LocationContext state management
6. Test navigation between pages

---

## 📦 Installation Commands

```bash
# Navigate to frontend folder
cd Project/frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🔧 Environment Setup

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📁 Current Structure

```
frontend/
├── app/
│   ├── layout.jsx          ✅ Root layout with LocationProvider
│   ├── page.jsx            ✅ Redirect to /welcome
│   ├── globals.css         ✅ Global styles
│   ├── welcome/
│   │   ├── page.jsx        ✅ Welcome page
│   │   └── Welcome.css     ✅ Welcome styles
│   ├── home/               ⏳ TO DO
│   ├── scan/               ⏳ TO DO
│   ├── result/             ⏳ TO DO
│   └── about/              ⏳ TO DO
├── components/
│   ├── Navbar.jsx          ✅ Migrated
│   └── Navbar.css          ✅ Migrated
├── context/
│   └── LocationContext.jsx ✅ Migrated
├── utils/
│   ├── locationConfig.js   ✅ Migrated
│   ├── modelUtils.js       ✅ Migrated
│   └── modelUtils.teachablemachine.js ✅ Migrated
├── public/                 ⏳ TO DO (copy model files)
├── package.json            ✅
├── next.config.js          ✅
├── jsconfig.json           ✅
└── README.md               ✅
```

---

## ⚡ Key Changes Summary

### React Router → Next.js Router
```jsx
// OLD (React Router)
import { useNavigate, Link } from 'react-router-dom';
const navigate = useNavigate();
navigate('/path');
<Link to="/path">Text</Link>

// NEW (Next.js)
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const router = useRouter();
router.push('/path');
<Link href="/path">Text</Link>
```

### Passing Data Between Pages
```jsx
// OLD (React Router)
navigate('/result', { state: { data } });
const { state } = useLocation();

// NEW (Next.js) - Option 1: URL params
router.push('/result?wasteType=Organik&confidence=95');
const searchParams = useSearchParams();

// NEW (Next.js) - Option 2: Context
// Use LocationContext or create ResultContext
```

### Client Components
```jsx
// All interactive components need:
'use client';

// at the top of the file
```

---

## 🚨 Important Notes

1. **TensorFlow.js**: Model files must be in `public/` folder
2. **Client Components**: Any component using hooks (useState, useEffect, useContext, useRouter) needs `'use client'`
3. **Import Paths**: Use `@/` alias for cleaner imports (configured in jsconfig.json)
4. **CSS**: Can import CSS directly in components (Next.js supports CSS modules)
5. **Backend**: Remains separate in `Project/backend/` - no changes needed

---

## 📞 Migration Support

If you encounter issues:
1. Check console for errors
2. Verify all imports use correct paths
3. Ensure 'use client' directive is present in interactive components
4. Check TensorFlow.js model files are in public/ folder
5. Verify LocationContext is wrapped in root layout

---

**Status:** Phase 5 in progress (1/5 pages migrated)
**Next Task:** Migrate Home, Scan, Result, and About pages
