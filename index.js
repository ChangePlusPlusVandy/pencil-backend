import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';

import formRoutes from './routes/supplyForm.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import schedulerRoutes from './routes/scheduler.routes.js';
import masterInventoryRoutes from './routes/masterInventory.routes.js';

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/form', formRoutes);
app.use('/api/teacher', teacherRoutes); // TODO: update route on frontend
app.use('/api/transaction', transactionRoutes); // TODO: update route on frontend
app.use('/api/schedule', schedulerRoutes);
app.use('/api/masterInventory', masterInventoryRoutes);

const port = process.env.PORT || 8080;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is listening on port ${port}`);
});

export default app;
