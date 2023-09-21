const { Router } = require('express');
const Brand = require('../models/Brand');
const { validationResult, check  } = require('express-validator');
const { validateJWT } = require('../middleware/validar-jwt');
const { validateRoleAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

//create brand
router.post('/', [
    check('name', 'invalid.name').not().isEmpty(),
    // validateRoleAdmin
], async function(req, res){

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let brand = new Brand();
        brand.name = req.body.name;
        brand.fechaCreacion = new Date();
        brand.fechaActualizacion = new Date();

        brand = await brand.save();

        res.send(brand);

    } catch(error) {
        console.log(error);
        res.status(500).send('An error occurred while creating brand');
    }

});

//List brands
router.get('/', async function(req, res){
    
    try{
        const brands = await Brand.find();
        res.send(brands); 
    } catch(error) {
        console.log(error);
        res.status(500).send('An error occurred');
    }

});

// Obtener un brand por ID
router.get('/:branId', async (req, res) => {
  try {
   
    let brand = await Brand.findById(req.params.brandId);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json({ brand });
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;

//update brand
router.put('/:brandId', [
    check('name', 'invalid.name').not().isEmpty(),
    // validateJWT,
    // validateRoleAdmin
], async function(req, res){
   
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }
        
        let brand = await Brand.findById(req.params.brandId);
        if(!brand) {
            return res.status(400).send('brand not found');
        }

        brand.name = req.body.name;
        brand.fechaActualizacion = new Date();

        brand = await brand.save();
        
        res.send(brand);

    } catch(error){
        console.log(error);
        res.status(500).send('An error occurred while updating the brand');
    }

});

// Eliminar marca por ID
router.delete('/:brandId', async function(req, res) {

    try {

      let deletedBrand = await Brand.findByIdAndDelete(req.params.brandId);
      if (!deletedBrand) {
        return res.status(404).json({ message: 'Brand not found' });
      }
      res.status(200).json({ message: 'Brand successfully removed' });
    } catch(error) {
      console.log(error);
      res.status(500).send('An error ocurred');
    }
  });

module.exports = router;