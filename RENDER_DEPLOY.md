# Deploying chrome-extension-backend to Render

This file shows the minimal steps to deploy this Express backend to Render.

Prerequisites
- Repository pushed to GitHub (or Git provider supported by Render)
- A Render account (https://render.com)

Quick checklist
- `package.json` contains a `start` script (`npm start` -> `node server.js`).
- `server.js` listens on `process.env.PORT` (already implemented).
- `render.yaml` included (optional); you can configure the service in the Render UI instead.
- Add required environment variables in the Render dashboard (do not commit secrets).

Required environment variables (set these in the Render service settings):
- MONGODB_URI — MongoDB Atlas connection string
- JWT_SECRET — JWT secret used by the app
- NODE_ENV — optional (e.g. `production`)
- PORT — optional; Render provides this automatically

Deploy steps (GUI)
1. Push your branch (e.g. `main`) to GitHub.
2. In Render, click New -> Web Service.
3. Connect the repository and choose the branch (e.g. `main`).
4. Set:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Under Environment, add the keys listed above and their values.
6. Create the service and wait for the initial deploy to finish.

Deploy steps (CLI / quick local push)
1. From your repo root:

```powershell
git add .
git commit -m "Prepare for Render: add render.yaml and engines"
git push origin main
```

2. Create the Render web service via the UI or `render.yaml` (if you use Render git-based deployments, Render will detect `render.yaml` automatically).

Testing after deployment
- Visit the service URL provided by Render and check `/health` (e.g. `https://<your-service>.onrender.com/health`).
- Verify the app reports `database: Connected` once `MONGODB_URI` is set correctly.

Notes and troubleshooting
- If the app fails to start due to MongoDB connection errors, confirm `MONGODB_URI` is correct and the Atlas IP whitelist allows Render's outgoing IPs (or use `0.0.0.0/0` temporarily).
- Check Render deploy logs for build and runtime errors.

Security & exposed credentials
--------------------------------
You pasted environment variables into the chat. Treat those values as compromised because they can be copied from chat transcripts and logs. Actions you should take now:

1. Rotate your MongoDB credentials immediately:
   - In MongoDB Atlas, create a new database user with a strong password and update the connection string value used by the app (the `MONGODB_URI` value).
   - Remove or disable the old user/password that was leaked.
   - Update the `MONGODB_URI` value in the Render service Environment settings.

2. Rotate your `JWT_SECRET`:
   - Generate a new strong secret and update the `JWT_SECRET` value in Render's Environment settings.
   - Note: rotating the JWT secret will invalidate existing tokens (users will need to re-authenticate).

3. Remove any leaked `.env` files from the repo and local history:
   - Ensure `.env` is in `.gitignore` (this repo already contains `.env` in `.gitignore`).
   - If credentials were committed to Git history, rotate secrets and consider removing them from history using tools like the BFG Repo-Cleaner or `git filter-repo`. (Caution: rewriting history affects collaborators.)

How to set env vars on Render (quick):
1. Open your service in Render dashboard → Environment.
2. Add/edit the variables `MONGODB_URI`, `JWT_SECRET`, and `NODE_ENV`.
3. Deploy (or trigger a manual deploy) so new values take effect.

If you'd like, I can:
- Add a `.env.example` file to the repo with placeholders so the real secrets aren't committed (I'm adding that now).
- Help you craft safe rotation steps for MongoDB Atlas (I can list the exact Atlas steps and commands).
- Help you remove secrets from git history (I'll explain the trade-offs and provide exact commands, but I won't execute them here).

If you want, I can:
- Add the same instructions into `README.md` (I attempted to update it but kept the change small to avoid editing accidental formatting). If you'd like, I'll replace or append to `README.md` instead of creating this separate file.
- Add a minimal `Procfile` or small health-check test.
