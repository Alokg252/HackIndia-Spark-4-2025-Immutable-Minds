import express from 'express';
import apiServer from './api';

const app = express();
const port = 3000;

// Use the API routes
app.use(apiServer);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 