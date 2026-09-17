## Ticketing system client

React 19 + Vite + TypeScript SPA for the Pridesys ticketing assignment. The client uses feature-oriented folders under `src/features`, shared UI primitives under `src/components/ui`, and a small REST client under `src/lib`.

## Architecture decisions

- React 19 with Vite and TypeScript provides a browser-only SPA that can be deployed independently from the Spring Boot service.
- Feature folders isolate authentication, projects/modules, issues/collaboration, verification, and user management; shared dialogs, pagination, navigation, and UI primitives remain under `src/components`.
- `src/lib/api.ts` is the single authenticated REST boundary: it attaches the JWT, handles JSON/FormData requests, and surfaces API errors to feature hooks.
- Server-side authorization remains authoritative. The client hides unavailable navigation/actions for usability, but treats `401`/`403` responses as permission states rather than relying on UI hiding for security.
- The client consumes the service's paginated response envelope and does not duplicate credentials, domain persistence, or attachment storage locally.

### Development

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL` when the API is not running at `http://localhost:8080`. The foundation increment provides the branded sign-in flow, JWT persistence, protected routing, sign-out, and a responsive authenticated workspace shell. Issue, project, and Kanban screens are added incrementally against the Spring Boot service contracts.

The projects/modules increment consumes the paginated project and module endpoints, lets users switch between accessible projects, and exposes module creation/deletion only to APP_ADMIN and CLIENT_ADMIN. The Projects workspace uses a responsive project-card grid and a full-width selected-workspace panel; long module descriptions cannot overlap status or action controls. CLIENT_USER receives a read-only project/module view.

The issue workflow consumes the paginated issue, detail, audit, comment, and attachment endpoints. Issue detail supports comments (create/edit/delete according to server permissions), protected attachment download, multipart upload up to 10 MB using the service allowlist, and uploader/APP_ADMIN attachment deletion with a confirmation dialog. ZIP files whose browser MIME is `application/x-zip-compressed` are normalized to `application/zip` before upload. Displayed dates use the shared date-only formatter (`DD Mon YYYY`).

The verification increment adds a role-restricted queue at `/verification`. APP_ADMIN and CLIENT_ADMIN can review pending issues, approve them, or reject them with a required reason; the queue uses the paginated verification API and refreshes after every decision. CLIENT_USER does not see the navigation item and receives a permission message if the route is opened directly.

Pagination controls now include a Records per page selector for projects, modules, issues, and the verification queue. The Kanban board uses a bounded viewport with independently scrollable stage columns, so large issue sets do not make the entire page excessively tall.

The user-management increment adds `/users` for APP_ADMIN and CLIENT_ADMIN. It supports server-side name/email search and pagination, role-aware user creation, profile editing, active-status updates, and deactivation with confirmation. CLIENT_USER cannot access this workspace.

The project-membership increment adds an APP_ADMIN-only Manage members dialog to the Projects workspace. It consumes the paginated project-member endpoint and the existing membership add/remove endpoints. Client administrators and client users can be assigned to projects, while project membership administration remains unavailable to client roles.

### Manual checkpoint for project membership

1. Sign in as `app.admin@example.com` and open Projects.
2. Select a project and choose **Manage members**.
3. Assign an active `CLIENT_USER` or `CLIENT_ADMIN`; confirm it appears under Current members.
4. Remove the member and confirm the user returns to Available client users.
5. Sign in as that member and verify the project is now visible; after removal, it is no longer visible.
6. Sign in as `client.admin@example.com` and confirm Manage members is not available.

### Manual checkpoint for user management

1. Sign in as `app.admin@example.com` or `client.admin@example.com` and open User management.
2. Search by a user name or email and confirm the results reload from the server.
3. Change Records per page and verify pagination metadata and controls update.
4. Create a client user from the modal, then edit its profile fields and active status.
5. Deactivate a test account, cancel once in the confirmation dialog, then confirm deactivation.
6. Sign in as `client.user@example.com`; User management must be absent from navigation and direct access must show a permission state.

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

### Final submission checkpoint

1. Start the backend with `docker compose up --build`, then start this SPA with `npm run dev`.
2. Verify the three seeded roles: APP_ADMIN sees project and membership administration; CLIENT_ADMIN sees only permitted user/module/verification actions; CLIENT_USER sees only permitted project and issue workflows.
3. As APP_ADMIN, assign a client account to a project through **Manage members**, then verify that account can see the project; remove the membership and verify access is gone.
4. Run through issue creation, module filtering, Kanban transitions, comments, attachment upload/download/delete, verification approval/rejection, and audit history.
5. Check responsive navigation, pagination/Records per page controls, empty/error states, and sign-out/session restoration.

The client does not contain credentials or database data. Configure `VITE_API_BASE_URL` only when the API is not running at its default `http://localhost:8080`.
