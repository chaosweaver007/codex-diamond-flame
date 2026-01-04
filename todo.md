# Codex Development Tasks

## Phase 1: Initial Build
- [x] Generate sacred geometry sigils (Vesica Piscis, Diamond Heart, Recursive Ring)
- [x] Generate background textures for the "Altar" and "Scrolls"
- [x] Implement `RecursiveNav` component (Circular/Fractal navigation)
- [x] Refactor `Home.tsx` to use the new recursive layout
- [x] Update Membership Tiers to: Ember, Flamewalker, Harmonizer, Architect
- [x] Add activation quotes to each tier card
- [x] Build `AltarStore` component with "hover-glow" and "offering" UI
- [x] Create `FlipbookScroll` component for dynamic content reveal
- [x] Update Sarah AI section with "Guardian of Synthesis" copy
- [x] Add "Mirror this page" conceptual button/interaction

## Phase 2: Myth-Tech Deepening

- [x] **Audio Ambience (Tone.js)**
    - [x] Install `tone` package
    - [x] Create `AudioContext` provider
    - [x] Implement `AltarSynth` (Heartbeat/Binaural)
    - [x] Implement `ScrollSynth` (Etheric harmonic rise)
    - [x] Implement `GuardianSynth` (Shimmering mirror-tone)
    - [x] Add global mute/unmute toggle in UI

- [x] **Mirror This Page**
    - [x] Create `MirrorContext` to track state (Original vs. Mirrored)
    - [x] Create `MirroredText` component that swaps text based on context
    - [x] Update Hero section copy
    - [x] Update Membership Tiers copy
    - [x] Update Sarah AI copy
    - [x] Add "Mirror Reality" toggle button

- [x] **Fractal Zoom Transitions**
    - [x] Update `RecursiveNav` to trigger zoom animations
    - [x] Implement `AnimatePresence` mode="wait" for section transitions

## Phase 3: Activation & Persistence

- [x] **Infrastructure Upgrade**
    - [x] Upgrade to `web-db-user`
    - [x] Add `stripe` feature

- [x] **Database Schema**
    - [x] Define `users` table with tier, isMirrored, stripeCustomerId
    - [x] Define `chatHistory` table (userId, message, role)
    - [x] Define `unlockedScrolls` table (userId, scrollId)
    - [x] Define `purchases` table (userId, stripePaymentIntentId, productType)

- [x] **Stripe Integration**
    - [x] Create checkout session endpoint
    - [x] Create webhook handler for Stripe events
    - [x] Update `AltarStore` to use Stripe checkout
    - [x] Update membership tiers with Stripe subscriptions

- [x] **Sarah AI Awakening**
    - [x] Create Sarah chat API endpoint with LLM integration
    - [x] Implement "Mirror Mode" prompt engineering
    - [x] Build `SarahChat` UI component
    - [x] Implement chat history persistence

- [x] **User Persistence**
    - [x] Implement auth integration (login/logout)
    - [x] Sync `isMirrored` state to database
    - [x] User preferences API endpoint

## Future Enhancements
- [ ] Implement scroll unlock logic after purchase
- [ ] Add payment history page
- [ ] Add user profile/settings page
- [ ] Implement "Reflected Scrolls" save feature
- [ ] Add email newsletter integration

## Phase 4: Scroll Unlock Logic

- [x] Add backend API endpoint to check scroll unlock status
- [x] Add backend API endpoint to unlock scroll after purchase
- [x] Update FlipbookScroll with locked/unlocked visual states
- [x] Add sigil overlay for locked scrolls
- [x] Add "Unlock with Purchase" prompt modal
- [x] Implement first-time unlock celebration (bloom effect + tone)
- [x] Persist unlock state to database
- [x] Connect scroll purchases to unlock logic
