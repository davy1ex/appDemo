# Architecture - Feature-Sliced Design (FSD)

## 1. Goals
- Clear separation of concerns
- Vertical feature ownership
- Scalable state management with Zustand

## 2. Layers
- app: application shell (providers, global styles, routing entry)
- pages: route-level compositions of widgets/features
- widgets: composite UI blocks that combine features and entities
- features: user-facing capabilities (actions/flows)
- entities: core business data and state (stores, api)
- shared: cross-cutting utilities, UI kit, types

```
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

## 3. Data Flow
- UI event (widget/feature)
- -> feature hook
- -> entity store action / API service
- -> store updates state
- -> UI re-renders via Zustand subscriptions

## 4. State Management (Zustand)
- Each entity owns a store (single source of truth for that entity)
- Thin feature hooks orchestrate async flows
- Pages assemble widgets and connect feature hooks

## 5. API Layer
- shared/api provides typed fetch helper + auth wrapper
- entities/*/api contains service classes
- mock services available for dev/stub

## 6. Slices & Responsibilities

### entities/locker
- model/store.ts: Zustand state for lockers
  - lockers, userLocker, loading, error, selectedSex
  - actions: setLockers, setUserLocker, setLoading, setError, setSelectedSex, updateLocker
- model/hooks.ts: async orchestration
  - loadLockers(token, userName)
  - reserveLocker(token, lockerId, userName)
  - releaseLocker(token, lockerId, userName)
  - finishTraining(token)
- api/lockerApi.ts: real API (Flask)
- api/lockerMockApi.ts: dev mock with single-locker-per-user rule
- Why: locker is core domain; owning store keeps UI consistent across pages/widgets.

### entities/user
- model/store.ts: auth state (token, profile)
- model/hooks.ts: auth flows
  - authenticateWithTelegram()
  - registerFromTelegram(token, sex)
  - logout()
- api/authApi.ts: Telegram auth endpoints
- Why: auth is global, isolated for clarity and reuse.

### entities/client
- model/store.ts: client search results + selection
- model/hooks.ts: searchClients(query), selectClient(client)
- Why: client concept may be reused across flows; separation enables caching/reuse.

### features/client-search
- ClientSearch.tsx: search input + dropdown; uses client entity actions
- Why: distinct user capability, reusable in different pages.

### features/qr-scan
- QRScanner.tsx: encapsulates qr scanning
- Why: isolates external lib and side-effects; reusable.

### widgets/locker-toolbar
- Combines gender selector + ClientSearch feature
- Why: composite UI for page toolbar; no business logic inside.

### widgets/locker-grid
- Composes LockerCard components and interactions (reserve/release)
- Why: visual composition of entity state; stateless beyond props.

### pages/lockers
- LockersPage.tsx: page assembly
  - reads auth/entity stores
  - triggers locker actions
  - passes state to widgets
- Why: route-level composition and navigation.

### pages/qr-scan
- QRScanPage.tsx: integrates QRScanner and navigation

### pages/training
- TrainingPage.tsx: finish training action UI

## 7. Cross-Cutting
- shared/ui: Card, Button (simple primitives)
- shared/types: domain and DTO types
- shared/api: fetch helpers and auth wrapper
- Vite alias: @ -> src

## 8. Constraints & Rules
- One locker per user at a time
- Release required before new reservation
- Errors bubble to page layer and displayed in UI

## 9. Future Extensibility
- Add `entities/session` for richer training session lifecycle
- Real API integration by swapping LockerMockApiService with LockerApiService
- SSR/Preload can be added in app layer if needed

