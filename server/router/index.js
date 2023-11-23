const express = require('express')
const UserController = require('../controllers/UserController')
const errorHandler = require('../middlewares/errorHandler')
const router = express.Router()

router.post(`/register`, UserController.createUser)
router.post(`/login`, UserController.loginUser)
router.post(`/google-login`, UserController.loginGoogle)

router.use(errorHandler)


module.exports = router
