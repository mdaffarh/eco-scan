# 📘 EcoScan Migration Guide - Step by Step

## ✅ Progress Saat Ini

### Completed:
- ✅ Setup Next.js structure (Phase 1)
- ✅ Migrated utils & config files (Phase 2)
- ✅ Migrated LocationContext (Phase 3)
- ✅ Migrated Navbar component (Phase 4)
- ✅ **Welcome Page** - Fully migrated
- ✅ **Home Page** - Fully migrated

### Remaining:
- ⏳ **Scan Page** - Needs manual migration
- ⏳ **Result Page** - Needs manual migration
- ⏳ **About Page** - Needs simple changes
- ⏳ Copy public assets
- ⏳ Testing

---

## 🚀 Quick Start - Run Migration Script

```powershell
# 1. Navigate to frontend folder
cd "d:\Kuliah\Semester 5\No SQL\Tubes\EcoApp---NoSQL\Project\frontend"

# 2. Run helper script to copy files
.\copy-files.ps1

# 3. Install dependencies
npm install

# 4. Continue with manual edits below
```

---

## 📝 Manual Migration Steps

### Step 1: Update Scan Page (`app/scan/page.jsx`)

**Changes needed:**

```jsx
// ADD at top:
'use client';

// CHANGE imports:
import { useRouter } from 'next/navigation';  // Instead of useNavigate
import { useLocation } from '@/context/LocationContext';  // Use @ alias
import { loadModel, predictImage } from '@/utils/modelUtils';  // Use @ alias
import Navbar from '@/components/Navbar';  // Add Navbar

// CHANGE navigation:
const router = useRouter();
router.push('/result');  // Instead of navigate('/result')

// PASS data to Result page:
// Option 1: Use LocationContext to store prediction data
// Option 2: Use URL params: router.push(`/result?wasteType=${label}&confidence=${confidence}`)

// ADD Navbar in return:
return (
  <>
    <Navbar />
    {/* ... rest of code */}
  </>
);
```

### Step 2: Update Result Page (`app/result/page.jsx`)

**Changes needed:**

```jsx
// ADD at top:
'use client';

// CHANGE imports:
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';  // For URL params
import { useLocation } from '@/context/LocationContext';  // Use @ alias
import Navbar from '@/components/Navbar';
import {
  findLocationsWithFallback,
  findLocationsWithBin,
  mapWasteTypeToBin
} from '@/utils/locationConfig';

// GET data from URL params or Context:
const searchParams = useSearchParams();
const wasteType = searchParams.get('wasteType');
const confidence = searchParams.get('confidence');
// OR from LocationContext if you store it there

// CHANGE navigation:
const router = useRouter();
router.push('/home');  // Instead of navigate
```

### Step 3: Update About Page (`app/about/page.jsx`)

**Simple changes:**

```jsx
// ADD at top:
'use client';

// ADD imports:
import Navbar from '@/components/Navbar';

// ADD Navbar in return:
export default function About() {
  return (
    <>
      <Navbar />
      {/* ... rest of code */}
    </>
  );
}
```

---

## 🔧 Detailed Migration Examples

### Example: Scan Page Full Migration

```jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import { loadModel, predictImage } from '@/utils/modelUtils';
import Navbar from '@/components/Navbar';
import './Scan.css';

export default function Scan() {
  const router = useRouter();
  const { selectedFakultas, isLocationSet } = useLocation();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // Check if fakultas is selected
    if (!isLocationSet()) {
      alert('Silakan pilih fakultas terlebih dahulu!');
      router.push('/home');
      return;
    }

    // Load AI model
    const initModel = async () => {
      const result = await loadModel();
      if (result.success) {
        setModelLoaded(true);
      } else {
        setError('Gagal memuat model AI: ' + result.error);
      }
    };

    initModel();
  }, [router, isLocationSet]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleScan = async () => {
    if (!image) {
      setError('Silakan pilih gambar terlebih dahulu!');
      return;
    }

    if (!modelLoaded) {
      setError('Model AI belum siap. Mohon tunggu...');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Wait for image to load
      await new Promise((resolve) => {
        if (imageRef.current.complete) {
          resolve();
        } else {
          imageRef.current.onload = resolve;
        }
      });

      // Run prediction
      const result = await predictImage(imageRef.current);
      
      // Navigate to result page with data
      router.push(`/result?wasteType=${encodeURIComponent(result.label)}&confidence=${result.confidence}`);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Gagal mengidentifikasi sampah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="scan-container">
        {/* ... rest of your scan page code ... */}
      </div>
    </>
  );
}
```

### Example: Result Page with URL Params

```jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import {
  findLocationsWithFallback,
  findLocationsWithBin,
  mapWasteTypeToBin,
  getWasteInfo
} from '@/utils/locationConfig';
import Navbar from '@/components/Navbar';
import './Result.css';

export default function Result() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedFakultas, selectedLokasi, setLocation } = useLocation();
  
  // Get data from URL params
  const wasteType = searchParams.get('wasteType');
  const confidence = parseFloat(searchParams.get('confidence') || '0');
  
  const [selectedLokasiLocal, setSelectedLokasiLocal] = useState(selectedLokasi);
  const wasteInfo = getWasteInfo(wasteType);
  
  // ... rest of your result page logic ...
  
  return (
    <>
      <Navbar />
      <div className="result-container">
        {/* ... rest of your result page code ... */}
      </div>
    </>
  );
}
```

---

## 📦 Install Dependencies

```powershell
cd "d:\Kuliah\Semester 5\No SQL\Tubes\EcoApp---NoSQL\Project\frontend"
npm install
```

This will install:
- next@^15.1.3
- react@^19.0.0
- react-dom@^19.0.0
- @tensorflow/tfjs@^4.22.0
- eslint@^9.17.0
- eslint-config-next@^15.1.3

---

## 🧪 Testing Steps

After completing migrations:

```powershell
# 1. Start development server
npm run dev

# 2. Open browser to http://localhost:3000

# 3. Test each page:
# - / (should redirect to /welcome)
# - /welcome (Welcome screens - 3 slides)
# - /home (Faculty selection)
# - /scan (Image upload & AI prediction)
# - /result (Results with location recommendations)
# - /about (About page)

# 4. Test functionality:
# - Select fakultas on home page
# - Upload image on scan page
# - Check if AI model loads (check console)
# - Verify result page shows correct recommendations
# - Test navigation between pages
# - Test LocationContext state
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Module not found" errors
**Solution:** Check import paths use `@/` alias correctly
```jsx
// ✅ Correct:
import { useLocation } from '@/context/LocationContext';

// ❌ Wrong:
import { useLocation } from '../../context/LocationContext';
```

### Issue 2: "You're importing a component that needs 'use client'"
**Solution:** Add `'use client';` at the top of the component file

### Issue 3: TensorFlow.js model not loading
**Solution:** 
1. Check `public/model.json` exists
2. Check webpack config in `next.config.js`
3. Open browser console for detailed errors

### Issue 4: LocationContext not working
**Solution:** Verify `app/layout.jsx` wraps children with `<LocationProvider>`

### Issue 5: Navigation not working
**Solution:** Use Next.js router methods:
```jsx
const router = useRouter();
router.push('/path');  // Not navigate('/path')
```

---

## 📊 Migration Checklist

- [x] Phase 1: Setup Next.js structure
- [x] Phase 2: Migrate utils & config files
- [x] Phase 3: Migrate LocationContext
- [x] Phase 4: Migrate Navbar component
- [x] Phase 5.1: Migrate Welcome page
- [x] Phase 5.2: Migrate Home page
- [ ] Phase 5.3: Migrate Scan page (MANUAL EDIT NEEDED)
- [ ] Phase 5.4: Migrate Result page (MANUAL EDIT NEEDED)
- [ ] Phase 5.5: Migrate About page (SIMPLE EDIT)
- [ ] Phase 6: Copy public assets (RUN SCRIPT)
- [ ] Phase 7: Testing & verification

---

## 🎯 Next Actions

**Option A: Run Script (Recommended)**
```powershell
cd "d:\Kuliah\Semester 5\No SQL\Tubes\EcoApp---NoSQL\Project\frontend"
.\copy-files.ps1
npm install
# Then manually edit scan, result, about pages
npm run dev
```

**Option B: Manual Step-by-Step**
1. Copy CSS files manually
2. Create scan/page.jsx with changes above
3. Create result/page.jsx with changes above
4. Create about/page.jsx with changes above
5. Copy public assets
6. npm install
7. npm run dev

---

## 📞 Need Help?

If stuck, check:
1. `MIGRATION_PROGRESS.md` - Current status
2. Next.js documentation - https://nextjs.org/docs
3. Console errors in browser
4. Terminal errors when running `npm run dev`

---

**Good luck with your migration! 🚀**
