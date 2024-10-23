const express = require('express')
const router = express.Router()
const storeController = require("../controllers/admin/storeController")
const auth = require("../middleware/authAdmin")

router.get('/',storeController.allStore)
router.post('/create',auth.requireAuth,storeController.createStore)
router.get('/detail/:id',storeController.Detail)
router.patch('/update/:id',storeController.Update)
router.delete('/delete/:id',storeController.deleteStore)
module.exports = router