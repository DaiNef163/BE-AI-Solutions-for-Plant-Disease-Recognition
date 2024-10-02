const express = require('express')
const router = express.Router()
const storeController = require("../controllers/admin/storeController")
const auth = require("../middleware/authAdmin")

router.get('/',storeController.allStore)
router.post('/register',auth.requireAuth,storeController.Register)
router.get('/detail/:id',storeController.Detail)
router.patch('/update/:id',storeController.Update)
module.exports = router