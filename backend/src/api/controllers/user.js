const { generateSign } = require("../../config/jwt");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const register = async (req, res, next) =>{
  try{
      
     const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,  
     });
      
     const userDuplicated = await User.findOne({
      $or: [{ userName: req.body.userName }, { email: req.body.email }]
    });
      if(userDuplicated){
        return res.status(400).json("Ya existe este usuario");
      }
   
    const userSaved = await newUser.save();


     return res.status(201).json(userSaved);
  }catch(err){
    console.log(err);
      return res.status(400).json(err);
  }
}

//Login User
const login = async (req, res, next) =>{
  try{
    let user;
    if(req.body.userName){
      user = await User.findOne({userName: req.body.userName});
    }else if(req.body.email){
      user = await User.findOne({email: req.body.email});
    }
   
    if(user){

      if(bcrypt.compareSync(req.body.password,user.password)){
        // Lo que pasa cuando te logueas con JWT
          const token = generateSign(user._id);
          return res.status(200).json({user,token});
      }else{
        return res.status(400).json("Email or password are incorrect");
      }

    }else{
      return res.status(400).json("Email or password are incorrect");
    }

  }catch(err){
    console.log(err);
  return res.status(400).json(err);
  }
}

const makePremium = async (req, res, next) => {
  try {

    const userId = req.params.userId;

    // Definir una duración para el plan premium
    const premiumDuration = 30; // días de suscripción premium

    // Calcular la fecha de expiración del plan premium
    const premiumExpiresAt = new Date();
    premiumExpiresAt.setDate(premiumExpiresAt.getDate() + premiumDuration);

    // Actualizar el usuario a premium
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isPremium: true,
        premiumExpiresAt: premiumExpiresAt,
      },
      { new: true } // Devolver el usuario actualizado
    );

    // Verificar si el usuario fue encontrado y actualizado
    if (!updatedUser) {
      return res.status(404).json("User not found");
    }

    // Devolver el usuario actualizado como respuesta
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error making user premium");
  }
};



module.exports = {
  register,
  login,
}