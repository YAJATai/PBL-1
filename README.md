# GreenPoints — Turn Waste into Rewards

Gamified Smart Waste Management System prototype for **HackADT 2026** (MIT ADT University) by **Char Yaar Ek Kaam**.

A demo web app connecting three roles on one shared, persistent state:

- **Student** — scan a bin QR code, log a disposal, earn GreenPoints, climb the leaderboard, redeem rewards.
- **Admin** — monitor bin fill levels on a campus map, run a live fill simulation, acknowledge/resolve alerts, inspect analytics.
- **Driver** — start a shift, follow an assigned pickup route, mark arrival and complete collections that sync back to the admin dashboards.

IoT fill levels, vehicle GPS and QR decoding are **simulated**; the UI labels every demo/simulated surface accordingly.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · Recharts · Lucide icons. State is shared via React Context + reducer and persisted to `localStorage`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build & checks

```bash
npm run typecheck
npm run lint
npm run build      # outputs to dist/
```

## Demo flow (recommended)

1. Student dashboard → **Scan & Earn** → *Simulate QR scan* → confirm → balance increases.
2. Redeem a reward (points deducted once).
3. Admin → *Run simulation* → threshold crossing raises a critical alert.
4. Driver → start shift → arrive → collect the critical bin.
5. Admin → alert resolved, bin collected, activity feed updated.

Every role operates on the same data; **Reset demo data** restores the seed state.

## Limitations

- No real hardware, backend, or auth — fully frontend prototype.
- Camera preview uses browser media APIs, but QR decoding is simulated.
- CO₂ savings use documented demo factors (0.30 / 0.08 / 0.05 kg CO₂e per kg by category).