import express from 'express';
import cors from 'cors';

import formRoutes from './routes/supplyForm.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import schedulerRoutes from './routes/scheduler.routes.js';
import masterInventoryRoutes from './routes/masterInventory.routes.js';
import locationRoutes from './routes/location.routes.js';

import locationController from './controllers/location.controller.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/schedule', schedulerRoutes);
app.use('/api/masterInventory', masterInventoryRoutes);
app.param('location', locationController.locationByID);

app.use('/api/:location/form', formRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/:location/transaction', transactionRoutes);
app.use('/api/location', locationRoutes);

const port = process.env.PORT || 8080;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is listening on port ${port}`);
});

export default app;
