
const express = require('express')

// Import login-controller
const groupRoutes = require('./../controllers/group-controller.js')

// Create router
const router = express.Router()

// Add route for GET request to retrieve all book
// In server.js, books route is specified as '/books'
// this means that '/all' translates to '/books/all'
//router.get('/all', loginRoutes.loginAll)

// Add route for POST request to create new account
// In server.js, login route is specified as '/login'
// this means that '/create' translates to '/login/create'
router.get('/all', groupRoutes.groupAll)
//router.post('/create', groupRoutes.groupCreate)

// Export router
module.exports = router