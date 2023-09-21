const { Router } = require('express');
const User = require('../models/User');
const { validationResult, check } = require('express-validator');
const bycript = require('bcryptjs');
const { generarateJWT } = require('../helpers/jwt');

const router = Router();

router.post('/', [
    check('email', 'email.requerido').isEmail(),
    check('password', 'password.requerdio').not().isEmpty(),
], async function (req, res) {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) { //validamos si existe user por email
            return res.status(400).json({ mensaje: 'User not found' });
        }

        //validacion contrasena
        const esIgual = bycript.compareSync(req.body.password, user.password);
        if (!esIgual) {
            return res.status(400).json({ mensaje: 'User not found' });
        }

        //generar token
        const token = generarateJWT(user);
        res.cookie('token', token);
        res.json({
            _id: user._id, nombre: user.name,
            rol: user.role, email: user.email, acces_token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mesnaje: 'Internal server error' });
    }

});

module.exports = router;