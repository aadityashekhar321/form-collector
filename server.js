// Beginner-friendly Node.js + Express server
const express = require('express');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve frontend files

// Data file path
const dataFile = path.join(__dirname, 'submissions.txt');

// Helper: Check if Instagram ID already exists
function isDuplicate(instaId) {
  if (!fs.existsSync(dataFile)) return false;
  const content = fs.readFileSync(dataFile, 'utf8');
  return content.includes(`Instagram: ${instaId}`);
}

// Helper: Get total submissions
function getTotalSubmissions() {
  if (!fs.existsSync(dataFile)) return 0;
  const content = fs.readFileSync(dataFile, 'utf8');
  return (content.match(/-------------------------/g) || []).length;
}

// Helper: Get latest entries (max 10)
function getLatestEntries() {
  if (!fs.existsSync(dataFile)) return [];
  const content = fs.readFileSync(dataFile, 'utf8');
  const entries = content.split('-------------------------').filter(e => e.trim());
  return entries.slice(-10).map(entry => entry.trim()).reverse();
}

// POST /submit - Save form data
app.post('/submit', (req, res) => {
  const { name, instagram } = req.body;
  const now = new Date();
  const date = now.toLocaleDateString('en-GB'); // 03 Jan 2026
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // 04:00 PM

  // Validation
  if (isDuplicate(instagram)) {
    return res.json({ success: false, error: 'Instagram ID already exists!' });
  }

  // Format data
  const entry = `-------------------------
Name: ${name}
Instagram: ${instagram}
Date: ${date}
Time: ${time}
-------------------------`;

  // Append to file
  fs.appendFileSync(dataFile, entry + '\n');
  res.json({ success: true, message: 'Thank you, your response has been recorded.' });
});

// GET /admin-data - Admin API
app.get('/admin-data', (req, res) => {
  const password = req.query.pw;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password!' });
  }
  res.json({
    total: getTotalSubmissions(),
    latest: getLatestEntries()
  });
});

// Download file route
app.get('/download', (req, res) => {
  if (!fs.existsSync(dataFile)) {
    return res.status(404).send('No data yet!');
  }
  res.download(dataFile);
});

// Hidden admin route
app.get('/admin-secret', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Form: http://localhost:${PORT}`);
  console.log(`🔐 Admin: http://localhost:${PORT}/admin-secret`);
});
