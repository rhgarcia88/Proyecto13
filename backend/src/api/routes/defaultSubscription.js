
const { getDefaultSubscriptions,postDefaultSubscriptions} = require('../controllers/defaultSubscription');
const defSubsRouter = require('express').Router();

defSubsRouter.get('/', getDefaultSubscriptions);
defSubsRouter.post('/', postDefaultSubscriptions);

module.exports = defSubsRouter;