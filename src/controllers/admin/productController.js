const Products = require("../../models/product")

module.exports.createProduct = async function (req,res) {
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

        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`
        }
        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`
        }

        const product = new Products(req.body)
        await product.save()
        res.status(200).json("Create product success")
    } catch (error) {
        res.status(400).json({ message: "Create product fail", error: error.message });

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
    try {
        const detailProduct = await Products.findOne({_id:req.params.id})

        res.status(200).json(detailProduct)
    } catch (error) {
        res.status(400).json("Product not find")
        
    }
}

module.exports.updateProduct = async function (req,res) {
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

        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`
        }

        await product.updateOne(req.body)
        res.status(200).json("Update success")
    } catch (error) {
        res.status(200).json("Update fail")
    }
}

module.exports.deleteProduct = async function (req,res) {
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
}