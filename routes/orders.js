const express = require('express');
const { isLoggedIn, permit } = require('../middleware');
const orderController = require('../controllers/orders');

const router = express.Router();

// get all orders associated with the user
router.get('/users/:uid',
    isLoggedIn,
    orderController.getUserOrders
);

// create new order
router.post('/',
    isLoggedIn,
    permit('user'),
    orderController.createOrder
);

// edit order
router.put("/:oid",
    isLoggedIn,
    orderController.editOrder
);

// delete order
router.delete('/:oid',
    isLoggedIn,
    permit('user'),
    orderController.deleteOrder
);

// get monthly sales
router.get('/sales',
    isLoggedIn,
    permit('admin'),
    orderController.getMonthlySales
);

module.exports = router;
