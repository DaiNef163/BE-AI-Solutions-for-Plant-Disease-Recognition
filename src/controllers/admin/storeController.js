const Stores = require("../../models/store")

module.exports.allStore = async function (req,res) {
    try {
        const stores = await Stores.find()

        res.status(200).json(stores)
    } catch (error) {
        res.json("Lỗi !!!!")
    }
}

module.exports.createStore = async function (req,res) {
    if(req.permission.permission.includes("store_create")){
        try {
            if(!req.user){
                return res.status(401).json({ message: "Unauthorized" });
            }
            const ownerId = req.user.id
            const registerStore = {owner: ownerId , ...req.body}
            const register = new Stores(registerStore)
            await register.save()
            res.status(200).json({message:"Create success"})
        } catch (error) {
            res.status(400).json({message:"Create fail"})       
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.Detail = async function (req,res) {
    if(req.permission.permission.includes("store_view")){
        try {
            const store = await Stores.findOne({_id:req.params.id}).populate("owner",["fullName"])
            res.status(200).json(store)
        } catch (error) {
            res.status(404).json("Store not found")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.Update = async function (req,res) {
    if(req.permission.permission.includes("store_edit")){
        try {
            const storeId = req.params.id
            await Stores.updateOne({_id:storeId},req.body)
            res.status(200).json("Update success")
        } catch (error) {
            res.status(200).json("Update fail")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.deleteStore = async function (req,res) {
    if(req.permission.permission.includes("store_delete")){
        try {
            const storeId = req.params.id
            await Stores.findByIdAndDelete(storeId)
            res.status(200).json("Xoá thành công")
        } catch (error) {
            res.status(400).json("Không tìm thấy cửa hàng")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}