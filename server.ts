import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Path to static frontend assets
const distPath = path.resolve('dist');

app.use(express.static(distPath));

// Fallback to index.html for all frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
