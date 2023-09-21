const { Router } = require('express');
const Store = require('../models/Store');
const { validationResult, check  } = require('express-validator');
const { validateJWT } = require('../middleware/validar-jwt');
const { validateRoleAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

//create sotore
router.post('/', [
    check('name', 'invalid.name').not().isEmpty(),
    check('description', 'invalid.description').not().isEmpty(),

    // validateJWT,
    // validateRoleAdmin
], async function(req, res){

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let store = new Store();
        store.name = req.body.name;
        store.description = req.body.description;
        store = await store.save();
        res.send(store);

    } catch(error) {
        console.log(error);
        res.status(500).send('An error occurred while creating store');
    }

});

//List stores
router.get('/', async function(req, res){
    
    try{

        const stores = await Store.find();
        res.send(stores); 

    } catch(error) {
        console.log(error);
        res.status(500).send('An error occurred');
    }

});

// Obtener un store por ID
router.get('/:storeId', async (req, res) => {
  try {
   
    let store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json({ store });
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;

//update store
router.put('/:storeId', [
    check('name', 'invalid.name').not().isEmpty(),
    validateJWT,
    validateRoleAdmin
], async function(req, res){
   
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }
        
        let store = await Store.findById(req.params.storeId);
        if(!store) {
            return res.status(400).send('store not found');
        }

        store.name = req.body.name;
        store.description = req.body.description;
        store.seller = req.body.seller;
        store.fechaActualizacion = new Date();

        store = await store.save();
        
        res.send(store);

    } catch(error){
        console.log(error);
        res.status(500).send('An error occurred while updating the Store');
    }

});

// Eliminar store por ID
router.delete('/:storeId', [ validateJWT, validateRoleAdmin ], async function(req, res) {

    try {

      let deletedStore = await Store.findByIdAndDelete(req.params.storeId);
      if (!deletedStore) {
        return res.status(404).json({ message: 'Store not found' });
      }
      res.status(200).json({ message: 'Store successfully removed' });
    } catch(error) {
      console.log(error);
      res.status(500).send('An error ocurred');
    }
  });

module.exports = router;