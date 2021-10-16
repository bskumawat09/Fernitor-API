const express = require("express")
const { isLoggedIn, permit, isAuthor } = require("../middleware")
const orderController = require("../controllers/orders")

const router = express.Router()

// get all orders associated with the user
router.get("/users/:uid", isLoggedIn, isAuthor, orderController.getUserOrders)

// create new order
router.post("/", isLoggedIn, orderController.createOrder)

// edit order
router.put("/:oid", isLoggedIn, orderController.editOrder)

// delete order
router.delete("/:oid", isLoggedIn, orderController.deleteOrder)

// get monthly sales
router.get(
	"/sales",
	isLoggedIn,
	permit("admin"),
	orderController.getMonthlySales
)

module.exports = router
