## Ticketing system client

React 19 + Vite + TypeScript SPA for the Pridesys ticketing assignment. The client uses feature-oriented folders under `src/features`, shared UI primitives under `src/components/ui`, and a small REST client under `src/lib`.

### Development

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL` when the API is not running at `http://localhost:8080`. The foundation increment provides the branded sign-in flow, JWT persistence, protected routing, sign-out, and a responsive authenticated workspace shell. Issue, project, and Kanban screens are added incrementally against the Spring Boot service contracts.

### Quality checks

```bash
npm run build
npm run lint
```
