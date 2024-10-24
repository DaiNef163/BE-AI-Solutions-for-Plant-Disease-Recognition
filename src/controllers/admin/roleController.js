const Roles = require("../../models/role")


module.exports.createRole = async function (req,res) {
    if(req.permission.permission.includes("role_create")){
        try {
            const role = new Roles(req.body)
            await role.save()
    
            res.status(200).json("Tạo role mới thành công")
        } catch (error) {
            res.status(200).json("Tạo role mới không thành công")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.allRoles = async function (req,res) {
    try {
        const roles = await Roles.find()

        res.status(200).json(roles)
    } catch (error) {
        res.status(400).json("Lỗi")
    }
}

module.exports.detailRole = async function (req,res) {
    if(req.permission.permission.includes("role_view")){
        try {
            const detailRole = await Roles.findById(req.params.id)
    
            res.status(200).json(detailRole)
        } catch (error) {
            res.status(400).json("ID sai")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.editRoles = async function (req,res) {
    if(req.permission.permission.includes("role_edit")){
        try {
            const role = await Roles.findById(req.params.id)
    
            if(!role){
                res.status(400).json("Không tìm thấy role")
                return
            }
    
            await role.updateOne(req.body)
            res.status(200).json("Sủa thành công")
        } catch (error) {
            res.status(400).json("Sủa không thành công")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.permissionPatch = async function (req,res) {
    if(req.permission.permission.includes("roles_permissions")){
        try {
            const permission = req.body
            for (const item of permission) {
                await Roles.updateOne({_id: item.id},{permission:item.permission})
            }
    
            res.status(200).json("Phân quyền thành công")
        } catch (error) {
            res.status(200).json("Phân quyền không thành công")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.deleteRole = async function (req,res) {
    if(req.permission.permission.includes("role_delete")){
        try {
            await Roles.findByIdAndDelete(req.params.id)
    
            res.status(200).json("Xóa role thành công")
        } catch (error) {
            res.status(400).json("Xóa roles không thành công")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}