const Products = require("../../models/product")

module.exports.createProduct = async function (req,res) {
    if(req.permission.permission.includes("products_create")){
        try {
            if(req.body.price){
                req.body.price = parseInt(req.body.price)
            }
            if(req.body.discountPercentage){
                req.body.discountPercentage = parseInt(req.body.discountPercentage)
            }
    
            if(req.body.stock){
                req.body.stock = parseInt(req.body.stock)
            }
    
            if (req.files && req.files.length > 0) {
                req.body.thumbnails = req.files.map(file => `/uploads/${file.filename}`);
            }
    
            const product = new Products(req.body)
            await product.save()
            res.status(200).json("Create product success")
        } catch (error) {
            res.status(400).json({ message: "Create product fail", error: error.message });
    
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
    
}

module.exports.getAll = async function (req,res) {
    try {
        const allProduct = await Products.find().sort()

        res.status(200).json(allProduct)
    } catch (error) {
        res.status(200).json("Fail")
    }
}

module.exports.Detail = async function (req,res) {
    if(req.permission.permission.includes("product_view")){
        try {
            const detailProduct = await Products.findOne({_id:req.params.id})
    
            res.status(200).json(detailProduct)
        } catch (error) {
            res.status(400).json("Product not find")
            
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
}

module.exports.updateProduct = async function (req,res) {
    if(req.permission.permission.includes("product_edit")){
        try {
            const product = await Products.findById(req.params.id)
            if(!product){
                res.status(400).json("Product not found")
                return
            }
    
            if(req.body.price){
                req.body.price = parseInt(req.body.price)
            }
            if(req.body.discountPercentage){
                req.body.discountPercentage = parseInt(req.body.discountPercentage)
            }
    
            if(req.body.stock){
                req.body.stock = parseInt(req.body.stock)
            }
    
            if (req.files && req.files.length > 0) {
                req.body.thumbnails = req.files.map(file => `/uploads/${file.filename}`);
            }
    
            await product.updateOne(req.body)
            res.status(200).json("Update success")
        } catch (error) {
            res.status(200).json("Update fail")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
    
}

module.exports.deleteProduct = async function (req,res) {
    if(req.permission.permission.includes("product_delete")){
        try {
            const product = await Products.findById(req.params.id)
            if(!product){
                res.status(400).json("Product not found")
                return
            }
    
            await product.deleteOne()
            res.status(200).json("Delete success")
    
        } catch (error) {
            res.status(400).json("Delete fail")
        }
    }else{
        res.status(400).json("Bạn không có quyền này")
    }
    
}