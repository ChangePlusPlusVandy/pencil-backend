import express from 'express';
import cors from 'cors';

import sampleRoutes from './routes/sample.routes';
import formRoutes from './routes/form.routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded());

app.use('/sample', sampleRoutes);

app.use('/api/form', formRoutes);

const port = process.env.PORT || 8080;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is listening on port ${port}`);
});

export default app;
