const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const formRoutes = require('./routes/supplyForm.routes.js');
const teacherRoutes = require('./routes/teacher.routes.js');
const transactionRoutes = require('./routes/transaction.routes.js');
const schedulerRoutes = require('./routes/scheduler.routes.js');
const masterInventoryRoutes = require('./routes/masterInventory.routes.js');
const locationRoutes = require('./routes/location.routes.js');
const reportRoutes = require('./routes/reports.routes.js');
const schoolRoutes = require('./routes/school.routes.js');
const dashboardRoutes = require('./routes/dashboard.routes.js');
const locationController = require('./controllers/location.controller.js');
const authController = require('./controllers/auth.controller.js');

const { sequelize } = require('./models');

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());

app.use('/static', express.static('public'));
app.use('/report-downloads', express.static('downloads'));

app.use('/api', authController.requireLogin);

app.param('location', locationController.locationByID);
app.use('/api/:location/form', formRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/:location/transaction', transactionRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/schedule', schedulerRoutes);
app.use('/api/:location/reports', reportRoutes);
app.use('/api/masterInventory', masterInventoryRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/:location/dashboard', dashboardRoutes);

const port = process.env.PORT || 8080;

app.listen(port, async () => {
  try {
    console.log(`listening on port ${port}`);

    await sequelize.authenticate();
    console.log('db connected');
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
