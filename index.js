const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const formRoutes = require('./routes/supplyForm.routes.js');
const teacherRoutes = require('./routes/teacher.routes.js');
const transactionRoutes = require('./routes/transaction.routes.js');
const schedulerRoutes = require('./routes/scheduler.routes.js');
const masterInventoryRoutes = require('./routes/masterInventory.routes.js');
const locationRoutes = require('./routes/location.routes.js');
const locationController = require('./controllers/location.controller.js');

const { sequelize } = require('./models');

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());

app.param('location', locationController.locationByID);

app.use('/api/:location/form', formRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/:location/transaction', transactionRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/:location/schedule', schedulerRoutes);
app.use('/api/masterInventory', masterInventoryRoutes);

const port = process.env.PORT || 8080;

app.listen(port, async () => {
  try {
    console.log('listening on port 8080');

    await sequelize.authenticate();
    console.log('db connected');
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
