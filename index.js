const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const admin = require('firebase-admin');
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

const { sequelize } = require('./models');

dotenv.config();
const app = express();
// admin.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
// });

app.use(cors());

app.use(express.json());

app.use('/static', express.static('public'));

app.param('location', locationController.locationByID);

app.use('/api/:location/form', formRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/:location/transaction', transactionRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/schedule', schedulerRoutes);
app.use('/api/:location/reports', reportRoutes);
app.use('/api/masterInventory', masterInventoryRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/dashboard', dashboardRoutes);

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
