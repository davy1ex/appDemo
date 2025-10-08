# Product Requirements Document (PRD)

## 1. Overview
- Name: Gym Lockers Mini App
- Purpose: Manage gym locker reservations by staff via Telegram Mini App.
- Platforms: Telegram Mini App (Web), Backend API (Flask).

## 2. Users & Roles
- Staff (Front Desk): Search clients, reserve lockers, release lockers, scan QR.
- Client (implicitly): Identified by name/phone; not a direct user in the app UI.

## 3. Core Use Cases
1) Reserve a locker for a client
- Staff selects gender room
- Staff searches client by name or phone
- Staff reserves an available locker
- Constraint: one locker per client at a time

2) Release a client’s locker
- Staff can release client’s current locker from the list
- Or finish training to release all lockers for client (safety net)

3) Navigate via QR code
- Staff scans a QR code printed on lockers
- App highlights specific locker in the list

4) Authenticate via Telegram
- App bootstraps using Telegram WebApp initData
- Backend validates and issues app token

## 4. Functional Requirements
- Gender filter for lockers (male/female)
- Real-time-ish updates (on user actions; polling optional)
- Client search (by name or phone)
- Reserve locker: only if free and user has none
- Release locker: only for the user who holds it
- Finish training: releases all lockers for the user
- Error reporting: meaningful error messages

## 5. Non-Functional Requirements
- Performance: Instant UI feedback, API latency tolerant
- Reliability: In-memory mock API for dev, real API ready
- Security: Token-based auth; CORS limited by deployment
- Maintainability: Feature-Sliced Design, Zustand stores
- Scalability: Separate FE/BE, dockerized deployment

## 6. Success Metrics
- Time to reserve locker < 5s
- Error rate < 1% in normal usage
- First-load time acceptable for Mini App (~<2s on modern phones)

## 7. Out of Scope (v1)
- Payments, membership management
- Push notifications
- Offline support

## 8. Assumptions
- Telegram auth is available in production environment
- Client dataset is manageable by search (server-side in prod)

## 9. Open Questions
- Should we enforce client identity strictly (phone verification)?
- Do we need audit logs for reservations/releases?

