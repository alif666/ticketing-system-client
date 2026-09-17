## Ticketing system client

React 19 + Vite + TypeScript SPA for the Pridesys ticketing assignment. The client uses feature-oriented folders under `src/features`, shared UI primitives under `src/components/ui`, and a small REST client under `src/lib`.

### Development

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL` when the API is not running at `http://localhost:8080`. The foundation increment provides the branded sign-in flow, JWT persistence, protected routing, sign-out, and a responsive authenticated workspace shell. Issue, project, and Kanban screens are added incrementally against the Spring Boot service contracts.

The projects/modules increment consumes the paginated project and module endpoints, lets users switch between accessible projects, and exposes module creation/deletion only to APP_ADMIN and CLIENT_ADMIN. The Projects workspace uses a responsive project-card grid and a full-width selected-workspace panel; long module descriptions cannot overlap status or action controls. CLIENT_USER receives a read-only project/module view.

The issue workflow consumes the paginated issue, detail, audit, comment, and attachment endpoints. Issue detail supports comments (create/edit/delete according to server permissions), protected attachment download, multipart upload up to 10 MB using the service allowlist, and uploader/APP_ADMIN attachment deletion with a confirmation dialog. ZIP files whose browser MIME is `application/x-zip-compressed` are normalized to `application/zip` before upload. Displayed dates use the shared date-only formatter (`DD Mon YYYY`).

The verification increment adds a role-restricted queue at `/verification`. APP_ADMIN and CLIENT_ADMIN can review pending issues, approve them, or reject them with a required reason; the queue uses the paginated verification API and refreshes after every decision. CLIENT_USER does not see the navigation item and receives a permission message if the route is opened directly.

### Manual checkpoint for this increment

1. Start the backend dependencies and API, then run `npm run dev`.
2. Sign in with a seeded account and open Projects. Confirm projects are shown as responsive cards and select a workspace.
3. Add or edit a module with a long description. Confirm the description remains contained and edit/delete controls stay aligned.
4. Open an issue, add a comment, and upload a PNG/PDF/text/ZIP file. Confirm dates contain no time and download works.
5. Delete an attachment you uploaded, cancel once in the confirmation dialog, then confirm deletion. A client user should not see deletion controls for another user’s attachment.

### Quality checks

```bash
npm run build
npm run lint
```
