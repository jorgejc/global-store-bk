const { Router } = require('express');
const Product = require('../models/Product');
const { validationResult, check  } = require('express-validator');
const { validateJWT } = require('../middleware/validar-jwt');
const { validateRoleAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

//create product
router.post('/', [
    check('name', 'invalid.name').not().isEmpty(),
    check('description', 'invalid.name').not().isEmpty().isLength({ min: 6 }),
    check('price', 'invalid.price').not().isEmpty().isFloat({ min: 0 }),
    check('inventory', 'invalid.inventory').not().isEmpty().isInt({ min: 1 }),
    check('image', 'invalid.image').not().isEmpty(),
    check('category', 'invalid.category').not().isEmpty(),
    check('brand', 'invalid.brand').not().isEmpty(),
    // check('seller', 'invalid.seller').not().isEmpty(),
   
], async function(req, res){

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let product = new Product();
        product.name = req.body.name;
        product.description = req.body.description;
        product.price = req.body.price;
        product.inventory = req.body.inventory;
        product.image = req.body.image;
        product.category = req.body.category._id;
        product.brand = req.body.brand._id;
        product.seller = req.body.user._id;
        console.log(product.seller);
        product.fechaCreacion = new Date();
        product.fechaActualizacion = new Date();

        product = await product.save();
        res.send(product);

    } catch(error) {
        console.log(error);
        res.status(500).send('An error occurred while creating product');
    }

});

//List products
router.get('/', async function(req, res){
    
    try{

        const products = await Product.find().populate([
            { 
                path: 'category', select: 'name'
            },
            {
                path: 'brand', select: 'name'
            },
            {
                path: 'seller', select: 'name'
            }
        ]);
        res.send(products); 

    } catch(error) {
        console.log(error);
        res.status(500).send('An error occurred');
    }

});

// Obtener un product por ID
router.get('/:productId', async (req, res) => {
  try {
   
    let product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'product not found' });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;

//update product
router.put('/:productId', [
    check('name', 'invalid.name').not().isEmpty(),
    validateJWT,
    validateRoleAdmin
], async function(req, res){
   
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }
        
        let product = await Product.findById(req.params.productId);
        if(!product) {
            return res.status(400).send('product not found');
        }

        product.name = req.body.name;
        product.description = req.body.description;
        product.price = req.body.price;
        product.inventory = req.body.inventory;
        product.image = req.body.image;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.seller = req.body.user;
        product.fechaActualizacion = new Date();

        product = await product.save();
        
        res.send(product);

    } catch(error){
        console.log(error);
        res.status(500).send('An error occurred while updating the product');
    }

});

// Eliminar product por ID
router.delete('/:productId', async function(req, res) {

    try {

      let deletedProduct = await Product.findByIdAndDelete(req.params.productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'product not found' });
      }
      res.status(200).json({ message: 'product successfully removed' });
    } catch(error) {
      console.log(error);
      res.status(500).send('An error ocurred');
    }
  });

module.exports = router;