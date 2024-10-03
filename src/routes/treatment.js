const express = require('express')
const router = express.Router()
const treatmentController = require("../controllers/admin/treatmentController")
const auth = require("../middleware/authAdmin")

router.get('/',treatmentController.allTreatment)
router.post('/create',auth.requireAuth,treatmentController.Create)
router.get('/detail/:id',treatmentController.Detail)
router.patch('/update/:id',auth.requireAuth,treatmentController.Update)
module.exports = router