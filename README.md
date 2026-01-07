# EcoScan Frontend - Next.js

Frontend aplikasi EcoScan menggunakan Next.js 15 dengan App Router.

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Struktur Folder

```
frontend/
├── app/                 # Next.js App Router
│   ├── layout.jsx      # Root layout
│   ├── page.jsx        # Home page (redirect)
│   ├── globals.css     # Global styles
│   ├── welcome/        # Welcome page
│   ├── home/           # Faculty selection page
│   ├── scan/           # Scan page
│   ├── result/         # Result page
│   └── about/          # About page
├── components/         # Reusable components
├── context/           # Context providers
├── utils/             # Utility functions
├── public/            # Static assets & AI model
└── package.json
```

## Tech Stack

- **Next.js 15** - React Framework
- **React 19** - UI Library
- **TensorFlow.js** - AI/ML Library
- **CSS Modules** - Styling

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Notes

- Backend API berjalan terpisah di `../backend`
- Model AI tersimpan di `/public` folder
- Menggunakan App Router dengan client components untuk interaktivitas
