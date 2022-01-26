import express from 'express';
import cors from 'cors';

import formRoutes from './routes/supplyForm.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/form', formRoutes);
app.use('/api/form', teacherRoutes); // TODO: update route on frontend
app.use('/api/form', transactionRoutes); // TODO: update route on frontend

const port = process.env.PORT || 8080;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is listening on port ${port}`);
});

export default app;
