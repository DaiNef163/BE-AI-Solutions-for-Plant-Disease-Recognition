const express = require('express')
const router = express.Router()
const rolesController=require('../controllers/admin/roleController')

router.get('/', rolesController.allRoles)
router.get('/detail/:id',rolesController.detailRole)
router.post('/create',rolesController.createRole)
//router.get('/edit/:id',rolesController.edit)
router.patch('/edit/:id',rolesController.editRoles)
//router.get('/permissions',rolesController.permission)
router.patch('/permissions',rolesController.permissionPatch)
router.delete('/delete/:id',rolesController.deleteRole)



module.exports=router