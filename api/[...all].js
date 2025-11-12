const serverless = require('serverless-http');
const app = require('../app');

// Vercel routes /api/* to this catch-all function when filename is [...all].js
module.exports = serverless(app);
