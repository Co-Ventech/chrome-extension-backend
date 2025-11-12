# Deploying to Vercel

This project is set up to run on Vercel using a Serverless Function. The Express app is in `app.js` and the Vercel function is `api/index.js` which wraps the app using `serverless-http`.

Quick steps:

1. Push your repo to GitHub:

```powershell
git add .
git commit -m "Prepare repo for Vercel deployment"
git push origin main
```

2. Go to https://vercel.com and import the repository (New Project → Import Git Repository).

3. Vercel will detect the `api/` folder and create serverless endpoints for the files inside it. No special build or output directory is required for this setup.

4. In Vercel project settings → Environment Variables, add:
   - `MONGODB_URI` = <your MongoDB connection string>
   - `JWT_SECRET` = <your new JWT secret>
   - `NODE_ENV` = production (optional)

5. Deploy and monitor the deployment logs in the Vercel dashboard.

Verify:
- Visit `https://<your-vercel-app>/api/health` to confirm the app is running.

Notes:
- Do NOT commit `.env` or secrets to Git. Use Vercel Environment Variables.
- If you exposed credentials earlier, rotate them immediately in MongoDB Atlas and update the values in Vercel.
