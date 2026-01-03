// Vercel-friendly Node.js + Express server
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Data file (⚠️ serverless: temp storage only)
const dataFile = path.join('/tmp', 'submissions.txt');

// Helper: Check duplicate Instagram ID
function isDuplicate(instaId) {
  if (!fs.existsSync(dataFile)) return false;
  const content = fs.readFileSync(dataFile, 'utf8');
  return content.includes(`Instagram: ${instaId}`);
}

// Helper: Total submissions
function getTotalSubmissions() {
  if (!fs.existsSync(dataFile)) return 0;
  const content = fs.readFileSync(dataFile, 'utf8');
  return (content.match(/-------------------------/g) || []).length;
}

// Helper: Latest 10 entries
function getLatestEntries() {
  if (!fs.existsSync(dataFile)) return [];
  const content = fs.readFileSync(dataFile, 'utf8');
  const entries = content
    .split('-------------------------')
    .filter(e => e.trim());
  return entries.slice(-10).map(e => e.trim()).reverse();
}

// POST: Submit form
app.post('/submit', (req, res) => {
  const { name, instagram } = req.body;

  if (!name || !instagram) {
    return res.json({ success: false, error: 'Missing fields' });
  }

  if (isDuplicate(instagram)) {
    return res.json({ success: false, error: 'Instagram ID already exists!' });
  }

  const now = new Date();
  const entry = `
-------------------------
Name: ${name}
Instagram: ${instagram}
Date: ${now.toLocaleDateString('en-GB')}
Time: ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
-------------------------
`;

  fs.appendFileSync(dataFile, entry);
  res.json({ success: true, message: 'Response saved' });
});

// GET: Admin data
app.get('/admin-data', (req, res) => {
  const password = req.query.pw;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' });
  }

  res.json({
    total: getTotalSubmissions(),
    latest: getLatestEntries()
  });
});

// Download data
app.get('/download', (req, res) => {
  if (!fs.existsSync(dataFile)) {
    return res.status(404).send('No data yet');
  }
  res.download(dataFile);
});

// Hidden admin page
app.get('/admin-secret', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// 🚀 IMPORTANT FOR VERCEL
module.exports = app;
