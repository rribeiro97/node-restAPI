const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error,conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM orders',
            (error, result, fields) => {
                if (error) { console.error(error); res.status(500).send({ error: error }) }
                const response = {
                    quantity : result.length,
                    orders : result.map( order => {
                        return {
                            order_id : order.order_id,
                            product_id : order.product_id,
                            quantity : order.quantity,
                            request : {
                                "type" : 'GET',
                                "description": 'Returns all orders ',
                                "url": `http://localhost:3000/orders/${order.order_id}`
                            }
                        }
                        
                    })
                }
                return res.status(200).send({
                    response
                });
            })
    }) 
});


router.post('/', (req, res, next) => {
    mysql.getConnection((req,res,next) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM products where product_id = ?'),
            [req.body.product_id],
            (error, result, field) => {
                if (error) { console.error(error); res.status(500).send({ error: error }) }
                if (result.length === 0) {
                    return res.status(404).send({
                        message : `Order with id : ${id} not found.`
                    })
                }
        }
        conn.query(
            'INSERT INTO orders (product_id,quantity) VALUES (?,?)',
            [req.body.product_id, req.body.quantity],
            (error, result, field) => {
                conn.release();
                if (error) { console.error(error); res.status(500).send({ error: error }) }
                
                const response = {
                    message : 'Your order has been created successfully',
                    addedOrder : {
                        order_id: result.order_id,
                        product_id: req.body.product_id,
                        quantity: req.body.quantity,
                        request : {
                            "type" : 'GET',
                            "description": 'Returns all orders',
                            "url": `http://localhost:3000/orders/`
                        }
                    }
                }
                res.status(201).send({
                    response
                });
            }
        )
        
    })
});

router.get('/:order_id', (req, res, next) => {
    const id = req.params.order_id;
    mysql.getConnection((error,conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM orders WHERE order_id = ?;',
            [id],
            (error, result, fields) => {
                if (error) { console.error(error); res.status(500).send({ error: error }) }
                if (result.length === 0) {
                    return res.status(404).send({
                        message : `Order with id : ${id} not found.`
                    })
                }
                const response = {
                    message : 'Returns a specific order, receiving an id as param',
                    order : {
                        order_id: result[0].order_id,
                        product_id: result[0].product_id,
                        quantity: result[0].quantity,
                        request : {
                            "type" : 'GET',
                            "description": 'Returns all orders',
                            "url": `http://localhost:3000/orders/`
                        }
                    }
                }
                res.status(200).send({
                    response
                });
            })
    }) 
})

router.delete('/', (req, res, next) => {
    mysql.getConnection((error,conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query(
            'DELETE FROM orders WHERE order_id = ?',
            [req.body.order_id],
            (error, result, fields) => {
                if (error) { console.error(error); res.status(500).send({ error: error }) }
                const response = {
                    message: 'The order has been deleted successfully',
                    response: {
                        type: "POST",
                        description: " Adds a order",
                        url : "http://localhost:3000/orders",
                        body : {
                            name : 'String',
                            price : 'Float'
                        }
                    }
                }
                return res.status(200).send({
                    response
                });
            })
    }) 
});

module.exports = router