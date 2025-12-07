# Copilot Instructions for daiostea.ro (Next.js)

## Project Overview

**daiostea.ro** is a Romanian transport service review platform built with Next.js 16, React 19, TypeScript, and Firebase.

## Tech Stack

- **Framework**: Next.js 16 with App Router and Turbopack
- **UI**: React 19, Tailwind CSS v4
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google, Facebook, Apple, Email/Password)
- **Language**: TypeScript
- **Package Manager**: Yarn

## Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/recenzie/       # API routes for reviews
│   ├── profil/[id]/        # Dynamic provider profile pages
│   ├── politica-*/         # Static policy pages
│   └── layout.tsx          # Root layout with providers
├── components/             # React components
├── contexts/               # React contexts (Auth, Theme)
├── lib/
│   ├── firebase/           # Firebase config (client & admin)
│   └── utils/              # Utility functions (rating colors)
└── types/                  # TypeScript interfaces
```

### Data Model (Firestore)
```
furnizori (collection)
├── nume, telefon, email, companie, creat_la, claimed
└── recenzii (subcollection)
    ├── mesaj, rating (1-5), data, timestamp
```

## Key Patterns

### Firebase Initialization
- Client SDK: `src/lib/firebase/client.ts` - uses `getApps()` check
- Admin SDK: `src/lib/firebase/admin.ts` - for API routes only

### Rating System
Colors by rating (1-5): Red → Orange → Yellow → Emerald → Turquoise
```typescript
import { getRatingColor, getRatingIconName } from '@/lib/utils/rating';
```

### Context Providers
Wrap app in `ThemeProvider` and `AuthProvider` (see `layout.tsx`)

### Components
All components exported from `@/components`:
- `Header` - Navigation with auth state
- `AuthModal` - Login/register modal
- `ReviewCard` - Displays single review with colored stars
- `ReviewForm` - Submit new reviews
- `SearchAutocomplete` - Provider search
- `RecentReviews` - Latest reviews list
- `StarRatingInput` - Interactive star selection

## Development Commands

```bash
yarn dev        # Start dev server with Turbopack
yarn build      # Production build
yarn start      # Start production server
yarn lint       # Run ESLint
```

## Conventions

- **Language**: Romanian for UI text, alerts, labels
- **Phone format**: International with country code (+40...)
- **Date locale**: `ro-RO` for formatting
- **Paths**: Use `@/` alias for imports from `src/`

## Environment Variables

Copy `.env.example` to `.env.local` and configure:
- `NEXT_PUBLIC_FIREBASE_*` - Client-side Firebase config
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Server-side admin credentials

## Migration Notes

This is a React/Next.js rewrite of the original vanilla JS app:
- Original: `../daiostea.ro/` (Express + vanilla JS)
- Icons and assets copied from original `public/` folder
