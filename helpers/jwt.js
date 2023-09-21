const jwt = require('jsonwebtoken');

const generarateJWT = (user) => {
    const payload = { _id: user._id, name: user.name, email: user.email, 
        password: user.password, role: user.role };
    const token = jwt.sign(payload, '123456', { expiresIn: '1h' }) 
    return token;
}

module.exports = {
    generarateJWT
}
