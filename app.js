const express = require('express');
const app = express();
const productsRoute = require('./routes/products')
const morgan = require('morgan');
const ordersRoute = require('./routes/orders');
const bodyParser = require('body-parser');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use( (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    //Acceptable headers
    res.header('Access-Control-Allow-Header', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    //Acceptable methods
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE ,GET');
        return res.status(200).send({})
    }

    next()
 
})
app.use('/products', productsRoute);
app.use('/orders', ordersRoute);

app.use( (req, res, next) => {
    const erro = new Error('Page not found');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)

    return res.send({
        error: {
            message: error.message
        }
    })
});


module.exports = app;