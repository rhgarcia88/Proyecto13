require("dotenv").config();
const express = require('express');
const {connectDB} = require('./src/config/db');
const cors = require("cors");
const initializeCronJobs = require("./src/utils/cronjobs");
const userRoutes = require("./src/api/routes/user");
const defSubsRouter = require("./src/api/routes/defaultSubscription");
const subRouter = require("./src/api/routes/subscription");

const app = express();
connectDB();
initializeCronJobs();

const corsOptions = {
  origin:'*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json()); 

//Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/defaultSubs', defSubsRouter);
app.use('/api/v1/subscriptions', subRouter);

app.use("*",  (req,res,next) => {
  return res.status(404).json("Route not found");
 });

 const port = process.env.PORT || 3000; 
 app.listen(port, () => {
   console.log(`Server running on port ${port}`);
 });