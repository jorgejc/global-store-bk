const express = require('express');
const { getConnection } = require('./db/db-connect-mongo');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT; 

app.use(cors());

getConnection();

app.use(express.json());

app.use('/api/auth', require('./router/auth'));
app.use('/api/user', require('./router/user'));
app.use('/api/brand', require('./router/brand'));
app.use('/api/category', require('./router/category'));
app.use('/api/store', require('./router/store'));
app.use('/api/product', require('./router/product'));

app.listen(port, () => { //empieza a escuchar peticiones http a través de un recurso o una url
    console.log(`Example app listening on port ${port}`)
});