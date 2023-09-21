const { Router } = require('express');
const Category = require('../models/Category');
const { validationResult, check  } = require('express-validator');
const { validateJWT } = require('../middleware/validar-jwt');
const { validateRoleAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

//create category
router.post('/', [
    check('name', 'invalid.name').not().isEmpty(),
    // validateRoleAdmin
], async function(req, res){

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let category = new Category();
        category.name = req.body.name;
        category.fechaCreacion = new Date();
        category.fechaActualizacion = new Date();

        category = await category.save();

        res.send(category);

    } catch(error) {
        console.log(error);
        res.status(500).send('An error occurred while creating Category');
    }

});

//List categorys
router.get('/', async function(req, res){
    
    try{
        const categories = await Category.find();
        res.send(categories); 
    } catch(error) {
        console.log(error);
        res.status(500).send('An error occurred');
    }

});

// Obtener un category por ID
router.get('/:categoryId', async (req, res) => {
  try {
   
    let category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ category });
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;

//update category
router.put('/:categoryId', [
    check('name', 'invalid.name').not().isEmpty(),
    // validateJWT,
    // validateRoleAdmin
], async function(req, res){
   
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }
        
        let category = await Category.findById(req.params.categoryId);
        if(!category) {
            return res.status(400).send('Category not found');
        }

        category.name = req.body.name;
        category.fechaActualizacion = new Date();

        category = await category.save();
        
        res.send(category);

    } catch(error){
        console.log(error);
        res.status(500).send('An error occurred while updating the Category');
    }

});

// Eliminar marca por ID
router.delete('/:categoryId', async function(req, res) {

    try {

      let deletedCategory = await Category.findByIdAndDelete(req.params.categoryId);
      if (!deletedCategory) {
        return res.status(404).json({ message: 'category not found' });
      }
      res.status(200).json({ message: 'Category successfully removed' });
    } catch(error) {
      console.log(error);
      res.status(500).send('An error ocurred');
    }
  });

module.exports = router;