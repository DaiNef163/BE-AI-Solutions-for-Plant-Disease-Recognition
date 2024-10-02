const express = require('express')
const router = express.Router()
const accountController = require("../controllers/admin/accountController")
const auth = require("../middleware/authAdmin")

router.get('/',accountController.allAccount)
router.post('/register',accountController.Register)
router.get('/detail/:id',accountController.Detail)
router.patch('/update/:id',accountController.Update)
router.post('/login',accountController.Login)
module.exports = router