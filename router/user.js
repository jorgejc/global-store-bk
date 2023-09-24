const { Router } = require('express');
const User = require('../models/User');
const Store = require('../models/Store');
const { validationResult, check  } = require('express-validator');
const bycript = require('bcryptjs');
const { validateJWT } = require('../middleware/validar-jwt');
const { validateRoleAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

//create user
router.post('/', [  
    check('name', 'invalid.name').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('password', 'invalid.password').not().isEmpty(),
    // check('role', 'invalid.role').isIn([ 'admin', 'seller']),
    check('storeName', 'invalid.storeName').not().isEmpty(),
    check('storeDescription', 'invalid.storeDescription').not().isEmpty(),
], async function(req, res){

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const existUser = await User.findOne({ email: req.body.email });
        if(existUser) {
            return res.status(400).send('Email exist');
        }

        //crear tiendas o vendedores
        const store = new Store({
        name: req.body.storeName,
        description: req.body.storeDescription,
        });

        const savedStore = await store.save();

        const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        store: savedStore._id,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),

        });

         //Establecer rol por defecto
         if (!req.body.role) {
            req.body.role = 'seller';
        }

        const salt = bycript.genSaltSync()
        const password = bycript.hashSync(req.body.password, salt);
        user.password = password;

        await user.save();
        res.send(user);
        console.log(user);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear user');
    }

});

//List users
router.get('/', [ validateJWT ], async function(req, res){
    
    try{
        const users = await User.find();
        res.send(users); 
    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }

});

// Obtener un usuario por ID
router.get('/:userId', [ validateJWT, validateRoleAdmin ], async (req, res) => {
  try {
   
    let user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).send('Ocurrió un error');
  }
});

module.exports = router;

//update user
router.put('/:userId', [
    check('name', 'invalid.name').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('password', 'invalid.password').not().isEmpty(),
    check('role', 'invalid.role').isIn([ 'admin', 'seller']),
    validateJWT, 
    validateRoleAdmin
], async function(req, res){
   
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }
        
        let user = await User.findById(req.params.userId);
        if(!user) {
            return res.status(400).send('user no existe');
        }

        const existuser = await User.findOne({ email: req.body.email, _id: { $ne: user._id } });
        if (existuser) {
            return res.status(400).send('Email ya existe');
        }

        user.name = req.body.name;
        user.email = req.body.email;

        const salt = bycript.genSaltSync()
        const password = bycript.hashSync(req.body.password, salt);
        user.password = password;

        user.role = req.body.role;
        user.fechaActualizacion = new Date();

        user = await user.save();
        
        res.send(user);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrrio un error al actualizar el user');
    }

});

// Eliminar un usuario por ID
router.delete('/:userId', [ validateJWT, validateRoleAdmin ], async function(req, res) {

    try {

      let deletedUser = await User.findByIdAndDelete(req.params.userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch(error) {
      console.log(error);
      res.status(500).send('Ocurrió un error');
    }
  });

module.exports = router;