// This file starts the app for local development. The main Express app is
// defined in `app.js`, which is imported here. For serverless deployments
// (Vercel), the `api/index.js` function will import `app.js` directly.

const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Chrome Extension Backend running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
    console.log(`📊 Data routes: http://localhost:${PORT}/api/extracted-data`);
    console.log(`🗄️  Database: MongoDB Atlas`);
});