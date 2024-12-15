const DefaultSubscription = require('../models/defaultSubscription');

const getDefaultSubscriptions = async(req,res) => { 

    try {
        const allDefSubs = await DefaultSubscription.find();
        return res.status(200).json(allDefSubs);
    } catch (error) {
      console.log(error);
      return res.status(400).json("Error en la petición");
    }

}

const postDefaultSubscriptions = async(req,res) => { 

    try {
        const newSub = new DefaultSubscription(req.body);
        const subSaved = await newSub.save();
        return res.status(201).json(subSaved);
    
      } catch (error) {
        console.log(error);
        return res.status(400).json("Error en la petición");
      }
}

module.exports = {
    getDefaultSubscriptions,
    postDefaultSubscriptions,
};



