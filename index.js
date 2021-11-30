import express from 'express';
import cors from 'cors';

import formRoutes from './routes/form.routes.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded());

app.use('/api/form', formRoutes);

const port = process.env.PORT || 8080;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is listening on port ${port}`);
});

export default app;
