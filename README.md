# Plant Disease Detection

Student-friendly production structure for a plant disease detection app.

- `frontend/`: React + Vite app, deployable to Vercel.
- `backend/`: Python FastAPI API, deployable with Docker/Render.
- `legacy/`: old Node/Express/EJS app kept for reference during migration.

The backend prediction flow is intentionally two-step:

1. Reject images that do not look like plant/leaf photos.
2. Run plant disease prediction only after the guardrail passes.
