//const { isAuth } = require('../../middleware/auth');
const { isAuth } = require('../../middleware/auth');
const { register, login, getCurrencies, getUserProfile, setCurrency} = require('../controllers/user');

const userRoutes = require('express').Router();

userRoutes.get('/currencies',isAuth,getCurrencies);
userRoutes.get('/',isAuth,getUserProfile);
userRoutes.post('/register',register);
userRoutes.post('/login',login);
userRoutes.put('/setCurrency',isAuth,setCurrency);



module.exports = userRoutes;