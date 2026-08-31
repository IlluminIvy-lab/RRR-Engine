import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

const distPath = path.resolve('dist');

app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
